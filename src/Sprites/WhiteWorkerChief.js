import Chat from "../UI/Chat";

export const SPRITE_ID = "whiteWorkerChief";

class WhiteWorkerChief extends Chat {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, "sprites", "white-worker-chief-1", 0, -5);
    this.spriteId = SPRITE_ID;
    this.delta = 20;

    this.futureMinerPosition = null;
    this.initialY = y;

    scene.anims.create({
      key: "white-worker-chief-idle",
      frames: [
        {
          key: "sprites",
          frame: "white-worker-chief-1",
          duration: 300,
        },
        {
            key: "sprites",
            frame: "white-worker-chief-2",
            duration: 300,
          },
        {
          key: "sprites",
          frame: "white-worker-chief-3",
          duration: 100,
        },
      ],
      repeat: -1,
      duration: 2000,
    });

    this.anims.play("white-worker-chief-idle", true);
    this.hasUnreadMessage(this.spriteId);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  SPRITE_ID,
  function (x, y, texture, frame) {
    const sprite = new WhiteWorkerChief(this.scene, x, y, texture, frame);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width, 1);
    sprite.setImmovable(true);
    sprite.setInteractive();
    sprite.setOffset(0, sprite.height/2);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
