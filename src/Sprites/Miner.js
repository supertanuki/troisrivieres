import Chat from "../UI/Chat";

export const SPRITE_ID = "miner";

class Miner extends Chat {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, "sprites", "miner-1", 0, -5);
    this.spriteId = SPRITE_ID;
    this.delta = 40;

    this.futureMinerPosition = null;
    this.initialY = y;

    scene.anims.create({
      key: "miner-idle",
      defaultTextureKey: "sprites",
      duration: 2100,
      repeat: -1,
      frames: [
        {
          frame: "miner-1",
          duration: 2000,
        },
        {
          frame: "miner-2",
          duration: 100,
        },
      ],
    });

    this.anims.play("miner-idle", true);
    this.hasUnreadMessage(this.spriteId);
  }

  unlockAccessToMine(x, y) {
    this.setPosition(x, y);
    this.setSize(5, 1);
    this.setOffset(this.width - 2, this.height/2);
  }

  setPositionAfterMine(x, y) {
    this.setPosition(x, y);
    this.scaleX = 1;
    this.body.setSize(this.width + 6, this.height + 10);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  SPRITE_ID,
  function (x, y, texture, frame) {
    const sprite = new Miner(this.scene, x, y, texture, frame);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width + 6, sprite.height + 10);
    sprite.setImmovable(true);
    sprite.setInteractive();
    sprite.scaleX = -1;
    sprite.setOffset(sprite.width, -5);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
