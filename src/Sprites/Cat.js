import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "cat";

export default class Cat extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "cat-1", 0, 0, true);
    this.spriteId = SPRITE_ID;
    this.delta = 20;

    scene.anims
      .create({
        key: "cat-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "cat-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "cat-",
        })
      );

    this.anims.play("cat-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Cat(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, 1);
  sprite.setImmovable(true);
  sprite.setInteractive();
  sprite.scaleX = -1;
  sprite.body.offset.x = sprite.width;

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
