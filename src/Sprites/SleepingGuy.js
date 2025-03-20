import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "sleepingGuy";

export default class SleepingGuy extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "sleepingguy-1", 0, 0, true);
    this.spriteId = SPRITE_ID;

    scene.anims
    .create({
      key: "sleepingguy-idle",
      frames: this.anims.generateFrameNames("sprites", {
        start: 1,
        end: 3,
        prefix: "sleepingguy-",
      }),
      repeat: -1,
      frameRate: 3,
    })
    .addFrame(
      this.anims.generateFrameNames("sprites", {
        start: 2,
        end: 2,
        prefix: "sleepingguy-",
      })
    );

    this.anims.play("sleepingguy-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new SleepingGuy(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width + 2, 1);
  sprite.setImmovable(true);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
