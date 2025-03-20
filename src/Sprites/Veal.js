import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "veal";

export default class Veal extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "veal-1", 0, 0, true);
    this.spriteId = SPRITE_ID;

    scene.anims
      .create({
        key: "veal-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "veal-",
        }),
        repeat: -1,
        frameRate: 1,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "veal-",
        })
      );

    this.anims.play("veal-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Veal(this.scene, x, y);

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
