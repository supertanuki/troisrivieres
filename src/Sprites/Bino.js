import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "bino";

export default class Bino extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "bino-1");
    this.spriteId = SPRITE_ID;

    scene.anims.create({
      key: "bino-idle",
      frames: [
        {
          key: "sprites",
          frame: "bino-1",
          duration: 600,
        },
        {
          key: "sprites",
          frame: "bino-2",
          duration: 600,
        },
        {
          key: "sprites",
          frame: "bino-3",
          duration: 300,
        },
        {
          key: "sprites",
          frame: "bino-2",
          duration: 600,
        },
      ],
      repeat: -1,
      frameRate: 6,
    });

    this.anims.play("bino-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Bino(this.scene, x, y);

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
