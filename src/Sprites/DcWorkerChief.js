import Chat from "../UI/Chat";

export const SPRITE_ID = "dcWorkerChief";

class DcWorkerChief extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "miner-1", 0, -5);
    this.spriteId = SPRITE_ID;
    this.delta = 40;

    this.anims.play("miner-idle", true);
    this.hasUnreadMessage(SPRITE_ID);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  SPRITE_ID,
  function (x, y) {
    const sprite = new DcWorkerChief(this.scene, x, y);

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
  }
);
