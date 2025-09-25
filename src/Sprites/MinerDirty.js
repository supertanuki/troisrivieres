import Chat from "../UI/Chat";

class MinerDirty extends Chat {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, "sprites", "miner-dirty-1", 0, -5, true);
    this.delta = 20;
    this.futureMinerPosition = null;
    this.initialY = y;
  }

  setSpriteNumber(spriteNumber) {
    this.spriteId = `minerDirty${spriteNumber}`;
    this.anims.play(`miner-dirty-idle-${spriteNumber - 1}`, true);

    if (spriteNumber > 2) {
        this.scaleX = -1;   
        this.setOffset(this.width, this.height / 2);
        return
    }

    this.setOffset(0, this.height / 2);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "minerDirty",
  function (x, y, texture, frame, spriteId) {
    const sprite = new MinerDirty(
      this.scene,
      x,
      y,
      texture,
      frame
    );

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(10, 1);
    sprite.setImmovable(true);
    sprite.setInteractive();
    sprite.setSpriteNumber(spriteId);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);

export const createDirtyMinerAnimation = function (scene) {
  scene.anims.create({
    key: "miner-dirty-idle-1",
    frames: [
      {
        key: "sprites",
        frame: "miner-dirty-1",
      },
      {
        key: "sprites",
        frame: "miner-dirty-2",
      },
    ],
    repeat: -1,
    frameRate: 2,
  });

  scene.anims.create({
    key: "miner-dirty-idle-2",
    frames: [
      {
        key: "sprites",
        frame: "miner-dirty-2",
      },
      {
        key: "sprites",
        frame: "miner-dirty-1",
      },
    ],
    repeat: -1,
    frameRate: 3,
  });

  scene.anims.create({
    key: "miner-dirty-idle-3",
    frames: [
      {
        key: "sprites",
        frame: "miner-dirty-1",
      },
      {
        key: "sprites",
        frame: "miner-dirty-1",
      },
      {
        key: "sprites",
        frame: "miner-dirty-2",
      },
    ],
    repeat: -1,
    frameRate: 4,
  });
};
