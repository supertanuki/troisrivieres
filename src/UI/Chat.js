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
    disabledChatIcon
  ) {
    super(scene, x, y, texture, frame);
    this.scene = scene;

    this.setDepth(INITIAL_DEPTH);

    this.delta = defaultDelta;
    this.spriteId = null;
    this.heroNearMe = false;
    this.chatIconDeltaX = chatIconDeltaX || 0;
    this.chatIconDeltaY = chatIconDeltaY || 0;
    this.disabledChatIcon = disabledChatIcon || false;
    this.previousChatImageUiVisibility = false;

    if (!this.disabledChatIcon) {
      this.chatImageUi = scene.add
        .sprite(x + this.chatIconDeltaX, y - 13 + this.chatIconDeltaY, "sprites", "exclam-3")
        .setDepth(1000)
        .setVisible(true);
      this.chatImageUi.anims.play("exclam", true);
    }

    sceneEventsEmitter.on(sceneEvents.DiscussionReady, this.readyToChat, this);
    sceneEventsEmitter.on(
      sceneEvents.HasUnreadMessage,
      this.hasUnreadMessage,
      this
    );
  }

  setPosition(x, y) {
    super.setPosition(x, y);
    this.updateChatIconPosition();
    return this;
  }

  setVisible(value) {
    super.setVisible(value);
    if (!this.chatImageUi) return;

    if (!value) {
      this.previousChatImageUiVisibility = this.chatImageUi.visible;

      this.chatImageUi.setVisible(false);
      return;
    }

    if (this.previousChatImageUiVisibility) {
      this.chatImageUi.setVisible(true);
    }
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
    console.log("stopChatting", this.spriteId);
    if (this.chatImageUi) this.chatImageUi.setVisible(false);
    if (this.afterStopChatting) this.afterStopChatting();
  }

  abortChatting() {
    console.log("abortChatting", this.spriteId);
    if (this.afterStopChatting) this.afterStopChatting();
  }

  disableChatIcon() {
    this.disabledChatIcon = true;
    this.chatImageUi?.setVisible(false);
  }

  enableChatIcon() {
    console.log(this.spriteId, this.chatImageUi.x, this.chatImageUi.visible, this.disabledChatIcon)
    this.disabledChatIcon = false;
    this.chatImageUi.setVisible(true);
  }

  hasUnreadMessage(spriteId) {
    if (this.disabledChatIcon || this.spriteId !== spriteId || !this.chatImageUi)
      return;

    this.updateChatIconPosition();
    this.chatImageUi.setVisible(true);
  }

  updateChatIconPosition() {
    if (!this.chatImageUi) return;

    this.chatImageUi.setPosition(
      this.x + this.chatIconDeltaX,
      this.y - 13 + this.chatIconDeltaY
    );
  }

  readyToChat(spriteId) {
    if (this.spriteId !== spriteId) return;
    if (this.scene.isCinematic) return;
    if (this.afterReadyToChat) this.afterReadyToChat();
  }

  setDelta(delta) {
    this.delta = 0;
  }
}
