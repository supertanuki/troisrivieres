import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Bino extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "bino-1");
    this.scene = scene;

    this.scene.anims
      .create({
        key: "bino-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 4,
          prefix: "bino-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 3,
          end: 3,
          prefix: "bino-",
        })
      )
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "bino-",
        })
      );
  }

  move() {
    // nothing
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.anims.play("bino-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register("bino", function (x, y) {
  const sprite = new Bino(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width + 2, sprite.height + 2);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
