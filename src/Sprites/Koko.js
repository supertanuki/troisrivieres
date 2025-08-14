import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "koko";

export default class Koko extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "koko-1", -2, -2);
    this.spriteId = SPRITE_ID;

    scene.anims
    .create({
      key: "koko-idle",
      frames: this.anims.generateFrameNames("sprites", {
        start: 1,
        end: 3,
        prefix: "koko-",
      }),
      repeat: -1,
      frameRate: 3,
    })
    .addFrame(
      this.anims.generateFrameNames("sprites", {
        start: 2,
        end: 2,
        prefix: "koko-",
      })
    );

    this.anims.play("koko-idle", true);
    this.hasUnreadMessage(this.spriteId);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Koko(this.scene, x, y);

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
