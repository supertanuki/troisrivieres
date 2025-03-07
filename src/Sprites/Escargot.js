import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Escargot extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "escargot", 0, 0, true);
    this.scene = scene;
  }

  move() {
    // nothing
  }
}

Phaser.GameObjects.GameObjectFactory.register("escargot", function (x, y) {
  const sprite = new Escargot(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, sprite.height);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
