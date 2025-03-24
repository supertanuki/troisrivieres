import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Chat from "../UI/Chat";

export const SPRITE_ID = "miner";

class Miner extends Chat {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, "sprites", "miner", 0, -5);
    this.spriteId = SPRITE_ID;

    this.futureMinerPosition = null;
    this.initialY = y;

    scene.anims.create({
      key: "miner-idle",
      frames: [
        {
          key: "sprites",
          frame: "miner-1",
          duration: 2000,
        },
        {
          key: "sprites",
          frame: "miner-2",
          duration: 300,
        },
      ],
      repeat: -1,
      frameRate: 1,
    });

    this.anims.play("miner-idle", true);

    sceneEventsEmitter.on(sceneEvents.EventsUnlocked, this.listenEvents, this);
  }

  listenEvents(data) {
    /*
    if (data.newUnlockedEvents.includes("miner_clothes_validated")) {
      this.moveMinerToNewPosition();
    }
    */
  }

  moveMinerToNewPosition() {
    console.log("moveMinerToNewPosition", this.futureMinerPosition);
    const { x, y } = this.futureMinerPosition;
    this.setPosition(x, y);
    this.chatImageUi.x = this.x;
    this.chatImageUi.y = this.y - 20;
  }

  addFuturePosition(futureMinerPosition) {
    this.futureMinerPosition = futureMinerPosition;
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
