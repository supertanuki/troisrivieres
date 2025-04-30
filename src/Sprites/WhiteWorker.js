import Chat from "../UI/Chat";

class WhiteWorker extends Chat {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, "sprites", "white-worker-1", 0, -5);
  }

  setSpriteNumber(spriteNumber) {
    this.spriteId = `whiteWorker${spriteNumber}`;
    this.anims.play(`white-worker-idle-${spriteNumber}`, true);
    this.scaleX = -1;   
    this.setOffset(this.width, this.height / 2);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "whiteWorker",
  function (x, y, texture, frame, spriteId) {
    const sprite = new WhiteWorker(
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

export const createWhiteWorkerAnimation = function (scene) {
  scene.anims.create({
    key: "white-worker-idle-1",
    frames: [
      {
        key: "sprites",
        frame: "white-worker-1",
      },
      {
        key: "sprites",
        frame: "white-worker-2",
      },
    ],
    repeat: -1,
    frameRate: 2,
  });

  scene.anims.create({
    key: "white-worker-idle-2",
    frames: [
      {
        key: "sprites",
        frame: "white-worker-2",
      },
      {
        key: "sprites",
        frame: "white-worker-1",
      },
    ],
    repeat: -1,
    frameRate: 3,
  });

  scene.anims.create({
    key: "white-worker-idle-3",
    frames: [
      {
        key: "sprites",
        frame: "white-worker-1",
      },
      {
        key: "sprites",
        frame: "white-worker-1",
      },
      {
        key: "sprites",
        frame: "white-worker-2",
      },
    ],
    repeat: -1,
    frameRate: 4,
  });
};
