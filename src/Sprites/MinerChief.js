import Chat from "../UI/Chat";

export const SPRITE_ID = "minerChief";

class MinerChief extends Chat {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, "sprites", "miner", 0, -5);
    this.spriteId = SPRITE_ID;
    this.delta = 20;

    this.futureMinerPosition = null;
    this.initialY = y;

    scene.anims.create({
      key: "miner-chief-idle",
      frames: [
        {
          key: "sprites",
          frame: "miner-chief-1",
          duration: 300,
        },
        {
            key: "sprites",
            frame: "miner-chief-2",
            duration: 300,
          },
        {
          key: "sprites",
          frame: "miner-chief-3",
          duration: 300,
        },
      ],
      repeat: -1,
      frameRate: 1,
    });

    this.anims.play("miner-chief-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  SPRITE_ID,
  function (x, y, texture, frame) {
    const sprite = new MinerChief(this.scene, x, y, texture, frame);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width, 1);
    sprite.setImmovable(true);
    sprite.setInteractive();
    sprite.scaleX = -1;
    sprite.setOffset(sprite.width, sprite.height/2);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
