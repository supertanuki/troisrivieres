import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "dog";

export default class Dog extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "dog", 0, 0, true);
    this.spriteId = SPRITE_ID;
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Dog(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, 1);
  sprite.setImmovable(true);
  sprite.setInteractive();
 // sprite.setOffset(0, 0.)

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
