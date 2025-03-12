import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "cow";

export default class Cow extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "cow", 0, 0, true);
    this.spriteId = SPRITE_ID;
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Cow(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, 1);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
