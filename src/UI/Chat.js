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
    chatIconDeltaX = 0,
    chatIconDeltaY = 0,
    disabledChatIcon = false,
    disabledShadow = false,
    shadowDeltaX = 0,
    shadowDeltaY = 10,
    shadowDouble = false,
    shadowDoubleSpace = 20
  ) {
    super(scene, x, y, texture, frame);
    this.scene = scene;

    this.setDepth(INITIAL_DEPTH);

    this.delta = defaultDelta;
    this.spriteId = null;
    this.heroNearMe = false;
    this.chatIconDeltaX = chatIconDeltaX;
    this.chatIconDeltaY = chatIconDeltaY;
    this.shadowDeltaX = shadowDeltaX;
    this.shadowDeltaY = shadowDeltaY;
    this.shadowDoubleSpace = shadowDoubleSpace;

    this.disabledChatIcon = disabledChatIcon;
    this.previousChatImageUiVisibility = false;

    if (!disabledShadow) {
      this.shadow = scene.add.ellipse(x + shadowDeltaX, y + shadowDeltaY, 10, 6, 0x000000, 0.1).setDepth(99);

      if (shadowDouble) {
        this.secondShadow = scene.add.ellipse(x + shadowDeltaX + shadowDoubleSpace, y + shadowDeltaY, 10, 6, 0x000000, 0.1).setDepth(99);
      }
    }

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
    this.shadow?.setPosition(x + this.shadowDeltaX, y + this.shadowDeltaY);
    this.secondShadow?.setPosition(x + this.shadowDeltaX + this.shadowDoubleSpace, y + this.shadowDeltaY)
    this.updateChatIconPosition();
    return this;
  }

  destroy() {
    super.destroy();
    this.shadow?.destroy();
    this.secondShadow?.destroy();
  }

  setVisible(value) {
    super.setVisible(value);
    this.shadow?.setVisible(value);
    this.secondShadow?.setVisible(value);

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

    if (isHeroNearMe && [INITIAL_DEPTH, FRONT_HERO_DEPTH].includes(this.depth)) {
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
