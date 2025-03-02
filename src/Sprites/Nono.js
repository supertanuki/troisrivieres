import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Nono extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "nono", -2, -2);
  }

  move() {
    // nothing
  }
}

Phaser.GameObjects.GameObjectFactory.register("nono", function (x, y) {
  const sprite = new Nono(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width + 2, sprite.height);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
