import Phaser from "phaser";
import { randomSign } from "../Utils/randomSign";

export default class Butterfly extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "butterfly-1");
    this.scene = scene;
    this.initialPosition = {x, y}
    this.scaleX = randomSign();
    this.anims.play("butterfly-anim");
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.x -= Phaser.Math.Between(2, 5) / 10 * randomSign();
    this.y -= Phaser.Math.Between(2, 5) / 10 * randomSign();
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
