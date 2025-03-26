import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Bike extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "bike", 0, 0, true);
  }
}

Phaser.GameObjects.GameObjectFactory.register("bike", function (x, y) {
  const sprite = new Bike(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, 1);
  sprite.setImmovable(true);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
