import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "dog";

export default class Dog extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "dog-1", 0, 0, true, false, -2, 6);
    this.spriteId = SPRITE_ID;
    this.delta = 20;

    scene.anims
      .create({
        key: "dog-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "dog-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "dog-",
        })
      );

    this.anims.play("dog-idle", true);
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

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
