import Phaser from "phaser";
import Chat from "../UI/Chat";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { eventsHas } from "../Utils/events";

export const SPRITE_ID = "nono";

export default class Nono extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "nono-1", -2, -2);
    this.spriteId = SPRITE_ID;

    scene.anims.create({
      key: "nono-idle",
      frames: [
        {
          key: "sprites",
          frame: "nono-1",
          duration: 700,
        },
        {
          key: "sprites",
          frame: "nono-2",
          duration: 700,
        },
        {
          key: "sprites",
          frame: "nono-1",
          duration: 700,
        },
        {
          key: "sprites",
          frame: "nono-2",
          duration: 700,
        },
        {
          key: "sprites",
          frame: "nono-3",
          duration: 300,
        },
      ],
      repeat: -1,
    });

    this.anims.play("nono-idle", true);
    this.hasUnreadMessage(this.spriteId);

    sceneEventsEmitter.on(sceneEvents.EventsUnlocked, this.listenEvents, this);
  }

  listenEvents(data) {
    if (eventsHas(data, "pre_card_for_mine")) {
      this.anims.stop();
      this.setTexture("sprites", "nono-card");
    }

    if (eventsHas(data, "card_for_mine")) {
      this.anims.play("nono-idle", true);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Nono(this.scene, x, y);

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
