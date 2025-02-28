import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Cow extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "cow", 0, 0, true);
    this.scene = scene;
  }

  move() {
    // nothing
  }
}

Phaser.GameObjects.GameObjectFactory.register("cow", function (x, y) {
  const sprite = new Cow(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, sprite.height);
  sprite.setImmovable(true);
  sprite.setInteractive();
  sprite.setOffset(0, 0)

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
