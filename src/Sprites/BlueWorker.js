import Chat from "../UI/Chat";

class BlueWorker extends Chat {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, "sprites", "blue-worker-1", 0, 0, true);
  }

  setSpriteNumber(spriteNumber) {
    this.spriteId = `blueWorker${spriteNumber}`;
    this.anims.play(`blue-worker-idle-${spriteNumber}`, true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "blueWorker",
  function (x, y, texture, frame, spriteId) {
    const sprite = new BlueWorker(
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

export const createBlueWorkerAnimation = function (scene) {
  scene.anims.create({
    key: "blue-worker-idle-1",
    frames: [
      {
        key: "sprites",
        frame: "blue-worker-1",
        duration: 1000,
      },
      {
        key: "sprites",
        frame: "blue-worker-2",
        duration: 200,
      },
    ],
    repeat: -1,
  });

  scene.anims.create({
    key: "blue-worker-idle-2",
    frames: [
      {
        key: "sprites",
        frame: "blue-worker-2",
        duration: 300,
      },
      {
        key: "sprites",
        frame: "blue-worker-1",
        duration: 2000,
      },
    ],
    repeat: -1,
  });
};
