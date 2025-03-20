import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "cow";

export default class Cow extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "cow-1", 0, 0, true);
    this.spriteId = SPRITE_ID;

    scene.anims
      .create({
        key: "cow-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "cow-",
        }),
        repeat: -1,
        frameRate: 2,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "cow-",
        })
      );

    this.anims.play("cow-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Cow(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, 1);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
