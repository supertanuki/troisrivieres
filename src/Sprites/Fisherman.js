import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Fisherman extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "mino-1", -11, -6);
    this.scene = scene;

    this.scene.anims
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
  }

  move() {
    // nothing
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.anims.play("mino-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register("fisherman", function (x, y) {
  const sprite = new Fisherman(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width - 10, sprite.height -10);
  sprite.setImmovable(true);
  sprite.setInteractive();
  sprite.setOffset(0, 0)

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
