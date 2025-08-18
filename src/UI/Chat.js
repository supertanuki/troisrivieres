import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";

const INITIAL_DEPTH = 99;
const FRONT_HERO_DEPTH = 101;

const defaultDelta = 25;

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

    this.delta = defaultDelta;
    this.spriteId = null;
    this.heroNearMe = false;
    this.chatIconDeltaX = chatIconDeltaX || 0;
    this.chatIconDeltaY = chatIconDeltaY || 0;
    this.disableChatIcon = disableChatIcon;

    if (!this.disableChatIcon) {
      this.chatImageUi = scene.add
        .sprite(0, 0, "sprites", "exclam-3")
        .setDepth(1000)
        .setVisible(true);
      this.chatImageUi.anims.play("exclam", true);
    }

    sceneEventsEmitter.on(sceneEvents.DiscussionReady, this.readyToChat, this);
    sceneEventsEmitter.on(sceneEvents.HasUnreadMessage, this.hasUnreadMessage, this);
  }

  isHeroNearMe() {
    const hero = this.scene.hero;
    return (
      hero.x > this.x - this.delta &&
      hero.x < this.x + this.delta &&
      hero.y > this.y - this.delta &&
      hero.y < this.y + this.delta
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
            : sceneEvents.DiscussionAbort,
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
    console.log('stopChatting', this.spriteId)
    if (this.chatImageUi) this.chatImageUi.setVisible(false);
    if (this.afterStopChatting) this.afterStopChatting();
  }

  abortChatting() {
    console.log('abortChatting', this.spriteId);
    if (this.afterStopChatting) this.afterStopChatting();
  }

  hasUnreadMessage(spriteId) {
    if (this.disableChatIcon || this.spriteId !== spriteId || !this.chatImageUi) return;

    this.chatImageUi.setPosition(
      this.x + this.chatIconDeltaX,
      this.y - 13 + this.chatIconDeltaY
    );
    this.chatImageUi.setVisible(true);
  }

  readyToChat(spriteId) {
    if (this.spriteId !== spriteId) return;
    if (this.scene.isCinematic) return;
    if (this.afterReadyToChat) this.afterReadyToChat();
  }
}
