import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "twoGuys";

export default class TwoGuys extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "twoguys-1", 0, -2, false, false, -8, 10, true, 17);
    this.spriteId = SPRITE_ID;

    scene.anims.create({
      key: "twoguys-idle",
      frames: [
        {
          key: "sprites",
          frame: "twoguys-1",
          duration: 600,
        },
        {
          key: "sprites",
          frame: "twoguys-2",
          duration: 800,
        },
        {
          key: "sprites",
          frame: "twoguys-1",
          duration: 900,
        },
        {
          key: "sprites",
          frame: "twoguys-2",
          duration: 800,
        },
        {
          key: "sprites",
          frame: "twoguys-3",
          duration: 200,
        },
      ],
      repeat: -1,
    });

    this.anims.play("twoguys-idle", true);
    this.hasUnreadMessage(this.spriteId);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new TwoGuys(this.scene, x, y);

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
