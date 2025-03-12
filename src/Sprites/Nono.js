import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "nono";

export default class Nono extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "nono", -2, -2);
    this.spriteId = SPRITE_ID;
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Nono(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width + 2, 1);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
