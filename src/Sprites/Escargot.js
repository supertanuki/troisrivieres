import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "escargot";

export default class Escargot extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "escargot", 0, 0, true);
    this.spriteId = SPRITE_ID;

    scene.anims
      .create({
        key: "escargot-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "escargot-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "escargot-",
        })
      );

    this.anims.play("escargot-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Escargot(this.scene, x, y);

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
