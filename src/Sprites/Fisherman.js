import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "fisherman";

export default class Fisherman extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "mino-1", -11, -6, false, false, -12, 6);
    this.spriteId = SPRITE_ID;

    scene.anims
      .create({
        key: "mino-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 4,
          prefix: "mino-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 3,
          end: 3,
          prefix: "mino-",
        })
      )
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "mino-",
        })
      );

    scene.anims.create({
      key: "mino-sad",
      frames: this.anims.generateFrameNames("sprites", {
        start: 1,
        end: 4,
        prefix: "mino-sad-",
      }),
      repeat: -1,
      frameRate: 3,
    });

    this.anims.play("mino-idle", true);
  }

  setSad() {
    this.shadowDeltaX = 0;
    this.shadowDeltaY = 8;
    this.anims.play("mino-sad");
    this.body.setSize(this.width, 1);
    this.x -= 12;
    this.chatIconDeltaX = 0;
    this.chatIconDeltaY = -2;
  }

  setOnStrike(x, y) {
    this.setPosition(x, y);
    this.body.setSize(this.width, 1);
    this.scaleX = -1;
    this.setOffset(this.width, this.height/2);
  }

  setFinal(x, y) {
    this.shadowDeltaX = -12;
    this.shadowDeltaY = 6;
    this.scaleX = 1;
    this.setOffset(0, 0);
    this.setPosition(x, y);
    this.disableChatIcon();
    this.anims.play("mino-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Fisherman(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.setOffset(0.5, 0.5);
  sprite.body.setSize(sprite.width, 1);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
