import Phaser from "phaser";
import { randomSign } from "../Utils/randomSign";

export default class Butterfly extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "butterfly-1");
    this.scene = scene;
    this.initialPosition = {x, y}
    this.scaleX = randomSign();

    const anims = scene.anims;

    anims
      .create({
        key: "butterfly-anim",
        frames: anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "butterfly-",
        }),
        repeat: -1,
        frameRate: 4,
      })
      
      .addFrame([{
        key: "sprites",
        frame: "butterfly-2",
        duration: 20,
      }]);

    this.anims.play("butterfly-anim");
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.x -= Phaser.Math.Between(-5, 5) / 10;
    this.y -= Phaser.Math.Between(-5, 5) / 10;
  }
}

Phaser.GameObjects.GameObjectFactory.register("butterfly", function (x, y) {
  const sprite = new Butterfly(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
