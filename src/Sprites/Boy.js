import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "boy";

export default class Boy extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "boy-water-1", 10, 0, true, true);
    this.spriteId = SPRITE_ID;
    this.delta = 40;
    this.shadowDeltaY = 6;

    scene.anims
      .create({
        key: "boy-water",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "boy-water-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "boy-water-",
        })
      );

    scene.anims.create({
      key: "boy-sad",
      frames: [
        {
          key: "sprites",
          frame: "boy-sad-1",
        },
        {
          key: "sprites",
          frame: "boy-sad-1",
        },
        {
          key: "sprites",
          frame: "boy-sad-2",
        },
      ],
      repeat: -1,
      frameRate: 3,
    });

    this.anims.play("boy-water", true);

    this.sadPosition = { x: 0, y: 0 };
  }

  setSadPosition(x, y) {
    this.sadPosition = { x, y };
  }

  setSad() {
    this.chatIconDeltaX = 0;

    const {x, y} = this.sadPosition;
    this.shadow = this.scene.add.ellipse(x, y, 8, 4, 0x000000, 0.1).setDepth(99);
    this.setPosition(x, y);
    this.anims.play("boy-sad");

    // group boy and girl
    this.body.setSize(this.width + 8, this.height + 18);
    this.body.setOffset(-7, 0);
  }

  setThirdAct(x, y) {
    this.setPosition(x, y);
    this.body.setSize(this.width, 1);
  }

  setFinal(x, y) {
    this.setPosition(x, y);
    this.disableChatIcon();
    this.scaleX = 1;
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Boy(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  // group boy and girl
  sprite.body.setSize(sprite.width + 18, sprite.height + 20);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
