import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "bino";

export default class Bino extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "bino-1");
    this.spriteId = SPRITE_ID;
    this.cleaningRoadPosition = {x: 0, y: 0};

    scene.anims.create({
      key: "bino-idle",
      frames: [
        {
          key: "sprites",
          frame: "bino-1",
        },
        {
          key: "sprites",
          frame: "bino-2",
        },
        {
          key: "sprites",
          frame: "bino-3",
        },
        {
          key: "sprites",
          frame: "bino-2",
        },
      ],
      repeat: -1,
      frameRate: 2,
    });

    this.anims.play("bino-idle", true);
  }

  setCleaningRoadPosition(x, y) {
    this.cleaningRoadPosition = {x, y};
  }

  setCleaningRoad() {
    const {x, y} = this.cleaningRoadPosition;
    this.setPosition(x, y);
    this.scaleX = -1;
    this.setOffset(this.width, this.height/2);
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
