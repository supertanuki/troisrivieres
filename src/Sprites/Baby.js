import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "baby";

export default class Baby extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "baby-1", 0, 0, true);
    this.spriteId = SPRITE_ID;

    scene.anims.create({
      key: "baby-idle",
      frames: [
        {
          key: "sprites",
          frame: "baby-1",
        },
        {
          key: "sprites",
          frame: "baby-2",
        },
      ],
      repeat: -1,
      frameRate: 2,
    });

    this.anims.play("baby-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Baby(this.scene, x, y);

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
