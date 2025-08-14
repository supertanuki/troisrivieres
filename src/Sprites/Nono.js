import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "nono";

export default class Nono extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "nono-1", -2, -2);
    this.spriteId = SPRITE_ID;

    scene.anims
      .create({
        key: "nono-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "nono-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "nono-",
        })
      );

    this.anims.play("nono-idle", true);
    this.hasUnreadMessage(this.spriteId);
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
