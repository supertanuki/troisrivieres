import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";

const INITIAL_DEPTH = 99;
const FRONT_HERO_DEPTH = 101;

export default class Chat extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    frame,
    chatIconDeltaX,
    chatIconDeltaY,
    disableChatIcon
  ) {
    super(scene, x, y, texture, frame);
    this.scene = scene;

    this.setDepth(INITIAL_DEPTH);

    this.spriteId = null;
    this.heroNearMe = false;

    scene.anims
      .create({
        key: "exclam",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "exclam-",
        }),
        repeat: -1,
        frameRate: 6,
      })
      .addFrame([{ key: "sprites", frame: "exclam-2", duration: 1 }]);

    this.chatIconDeltaX = chatIconDeltaX || 0;
    this.chatIconDeltaY = chatIconDeltaY || 0;
    this.disableChatIcon = disableChatIcon;

    this.chatImageUi = scene.add
      .sprite(0, 0, "sprites", "exclam-3")
      .setDepth(1000)
      .setVisible(false);
    this.chatImageUi.anims.play("exclam", true);

    sceneEventsEmitter.on(sceneEvents.DiscussionReady, this.readyToChat, this);
  }

  isHeroNearMe() {
    const hero = this.scene.hero;
    const delta = 40;
    return (
      hero.x > this.x - delta &&
      hero.x < this.x + delta &&
      hero.y > this.y - delta &&
      hero.y < this.y + delta
    );
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.visible) return;

    const isHeroNearMe = this.isHeroNearMe();
    if (this.heroNearMe !== isHeroNearMe) {
      this.heroNearMe = isHeroNearMe;

      if (this.spriteId) {
        sceneEventsEmitter.emit(
          isHeroNearMe
            ? sceneEvents.DiscussionReady
            : sceneEvents.DiscussionEnded,
          this.spriteId
        );
      }
    }

    if (isHeroNearMe) {
      const hero = this.scene.hero;
      if (this.y < hero.y) {
        this.setDepth(INITIAL_DEPTH);
      } else {
        this.setDepth(FRONT_HERO_DEPTH);
      }
    }
  }

  stopChatting() {
    this.chatImageUi.setVisible(false);
    if (this.afterStopChatting) this.afterStopChatting();
  }

  readyToChat(spriteId) {
    if (this.spriteId !== spriteId) return;
    if (this.scene.isCinematic) return;

    this.chatImageUi.setPosition(
      this.x + this.chatIconDeltaX,
      this.y - 13 + this.chatIconDeltaY
    );
    this.chatImageUi.setVisible(!this.disableChatIcon);

    if (this.afterReadyToChat) this.afterReadyToChat();
  }
}
