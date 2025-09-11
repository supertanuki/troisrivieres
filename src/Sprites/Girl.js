import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "girl";

export default class Girl extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "girl-water-1", 0, 0, true);
    this.spriteId = SPRITE_ID;

    scene.anims
      .create({
        key: "girl-water",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "girl-water-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "girl-water-",
        })
      );

      scene.anims.create({
        key: "girl-sad",
        frames: [
          {
            key: "sprites",
            frame: "girl-sad-1",
          },
          {
            key: "sprites",
            frame: "girl-sad-1",
          },
          {
            key: "sprites",
            frame: "girl-sad-1",
          },
          {
            key: "sprites",
            frame: "girl-sad-2",
          },
        ],
        repeat: -1,
        frameRate: 3,
      });

    this.anims.play("girl-water", true);

    this.sadPosition = { x: 0, y: 0 };
  }

  setSadPosition(x, y) {
    this.sadPosition = { x, y };
  }

  setSad() {
    this.setPosition(this.sadPosition.x, this.sadPosition.y);
    this.anims.play("girl-sad");
  }

  setThirdAct(x, y) {
    this.disabledChatIcon = false;
    this.setPosition(x, y);
    this.body.setSize(this.width, 1);
    this.scaleX = -1;
    this.setOffset(this.width, this.height/2);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Girl(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width + 2, sprite.height + 10);
  sprite.setImmovable(true);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
