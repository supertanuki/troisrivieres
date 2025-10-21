import Phaser from "phaser";
import Chat from "../UI/Chat";
import { randomSign } from "../Utils/randomSign";

export default class Bike extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "bike", 0, 0, true, true);
    this.scaleX = -1 * randomSign();
  }
}

Phaser.GameObjects.GameObjectFactory.register("bike", function (x, y) {
  const sprite = new Bike(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, 1);
  if (sprite.scaleX === -1) sprite.setOffset(sprite.width, sprite.height/2);
  sprite.setImmovable(true);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
