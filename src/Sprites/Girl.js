import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Girl extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "girl-water-1", 0, 0, true);
    this.scene = scene;

    this.scene.anims
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

    this.anims.play("girl-water", true);
  }

  move() {
    // nothing
  }
}

Phaser.GameObjects.GameObjectFactory.register("girl", function (x, y) {
  const sprite = new Girl(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width + 2, sprite.height + 10);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
