import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "twoWomen";

export default class TwoWomen extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "twowomen-1", -2, -2);
    this.spriteId = SPRITE_ID;

    scene.anims.create({
      key: "twowomen-idle",
      frames: [
        {
          key: "sprites",
          frame: "twowomen-1",
          duration: 2,
        },
        {
          key: "sprites",
          frame: "twowomen-2",
          duration: 2,
        },
        {
          key: "sprites",
          frame: "twowomen-3",
          duration: 1,
        },
      ],
      repeat: -1,
      frameRate: 2,
    });

    this.anims.play("twowomen-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new TwoWomen(this.scene, x, y);

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
