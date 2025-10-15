import Phaser from "phaser";
import { randomSign } from "../Utils/randomSign";

const DELTA = 20;

export default class Butterfly extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "butterfly-1");
    this.scene = scene;
    this.initialPosition = {x, y}
    this.scaleX = randomSign();
    this.anims.play("butterfly-anim");

    this.stepX = 0;
    this.stepY = 0;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (Phaser.Math.Between(1, 10) === 1) {
      this.stepX = Phaser.Math.Between(0, 2) / 10 * randomSign();
      this.stepY = Phaser.Math.Between(0, 2) / 10 * randomSign();
    };

    if (this.x - this.stepX > this.initialPosition.x + DELTA ||
      this.x - this.stepX < this.initialPosition.x - DELTA)
      this.stepX = 0;

    if (this.y - this.stepY > this.initialPosition.y + DELTA ||
      this.y - this.stepY < this.initialPosition.y - DELTA)
      this.stepY = 0;

    this.x -= this.stepX;
    this.y -= this.stepY;
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
