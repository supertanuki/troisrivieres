import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { getUiMessage, spriteNames, spriteSounds } from "../Workflow/messageWorkflow";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { eventsHas } from "../Utils/events";
import { playSound } from "../Utils/music";
import { getLocale } from "../Utils/locale";

export default class Message extends Phaser.Scene {
  constructor() {
    super("message");
    this.textObject = null;
    this.spriteNameObject = null;
    this.currentText = "";
    this.currentDiscussionStatus = DiscussionStatus.NONE;
  }

  preload() {
    this.load.atlas("ui", "sprites/ui.png", "sprites/ui.json");
  }

  create() {
    const config = this.sys.game.config;

    this.actionBackground = this.add
      .rectangle(config.width / 2, config.height - 30, 200, 30, 0x000000)
      .setAlpha(0.5)
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setVisible(false);

    this.actionBackgroundLine = this.add
      .line(
        0,
        0,
        config.width / 2 - 60,
        config.height - 12,
        config.width / 2 + 60,
        config.height - 12,
        0x000000
      )
      .setLineWidth(4)
      .setAlpha(0.5)
      .setScrollFactor(0)
      .setOrigin(0, 0)
      .setDepth(2000)
      .setVisible(false);

    this.actionText = this.add
      .bitmapText(
        config.width / 2,
        config.height - 30,
        "FreePixel-16",
        getUiMessage("game.action"),
        16
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setTintFill(0xffffff)
      .setDepth(2000)
      .setVisible(false);

    this.dialogBackground = this.add
      .sprite(config.width / 2, config.height - 30, "ui", "dialog-2")
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setAlpha(0.8)
      .setScrollFactor(0)
      .setVisible(false);

    this.dialogBackgroundColor = this.add
      .rectangle(config.width / 2, config.height - 30, 252, 44, 0x000000)
      .setAlpha(0.7)
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setScrollFactor(0)
      .setVisible(false);

    this.textObject = this.add
      .bitmapText(config.width / 2, config.height - 30, "FreePixel-16", "", 16)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setTintFill(0xffffff)
      .setMaxWidth(250)
      .setDepth(3000)
      .setVisible(false);

    this.spriteNameObject = this.add
      .bitmapText(config.width / 2 - 128, config.height - 65, "FreePixelStrokeShadow-16", "", 16)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(3000)
      .setVisible(false);

    sceneEventsEmitter.on(sceneEvents.MessageSent, this.handleMessage, this);
    sceneEventsEmitter.on(
      sceneEvents.DiscussionEnded,
      this.handleDiscussionEnd,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionAbort,
      this.handleDiscussionEnd,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionReady,
      this.readyToAction,
      this
    );
    sceneEventsEmitter.on(sceneEvents.DiscussionStarted, this.stopAction, this);
    sceneEventsEmitter.on(sceneEvents.EventsUnlocked, this.listenEvents, this);
  }

  showMineCard() {
    playSound("sfx_objet_inventaire", this.scene.get("game"), false, 1);

    this.mineCard = this.add
      .image(225, 125, "ui", "card")
      .setScrollFactor(0)
      .setDepth(3000)
      .setAlpha(0);

    this.tweens.add({
      targets: this.mineCard,
      x: 450 - 30,
      y: 250 - 30,
      alpha: 1,
      scale: 1,
      ease: "Quad.easeOut",
      loop: 0,
      duration: 1000,
    });
  }

  hideMineCard() {
    if (!this.mineCard) return;

    this.tweens.add({
      targets: this.mineCard,
      alpha: 0,
      scale: 0.5,
      ease: "Sine.easeInOut",
      loop: 0,
      duration: 500,
      onComplete: () => this.mineCard.destroy(),
    });
  }

  listenEvents(data) {
    if (eventsHas(data, "card_for_mine")) {
      this.showMineCard();
    }

    if (eventsHas(data, "mine_access_validation")) {
      this.hideMineCard();
    }
  }

  startDiscussion() {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.STARTED;
    this.stopAction();
  }

  stopAction() {
    if (!this.scene.isActive()) return;

    this.actionText.setVisible(false);
    this.actionBackground.setVisible(false);
    this.actionBackgroundLine.setVisible(false);
  }

  readyToAction() {
    if (!this.scene.isActive()) return;
    if (this.currentDiscussionStatus !== DiscussionStatus.NONE) return;
    if (this.scene.get("game")?.isCinematic) return;

    this.currentDiscussionStatus = DiscussionStatus.READY;
    this.actionText.setVisible(true);
    this.actionBackground.setVisible(true);
    this.actionBackgroundLine.setVisible(true);
  }

  handleDiscussionEnd() {
    if (!this.scene.isActive()) return;

    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this.stopAction();
    this.textObject.text = "";
    this.textObject.setVisible(false);

    this.spriteNameObject.text = "";
    this.spriteNameObject.setVisible(false);
    this.dialogBackground.setVisible(false);
    this.dialogBackgroundColor.setVisible(false);
  }

  handleMessage(payload) {
    if (!this.scene.isActive()) return;

    const { message, sprite } = payload;
    if (this.textObject.visible && message === this.currentText) {
      return;
    }

    const gameScene = this.scene.get("game");
    if (spriteSounds[sprite]) {
      playSound(
        `${spriteSounds[sprite].sound}_${Phaser.Math.Between(
          1,
          spriteSounds[sprite]?.versions
        )}`,
        gameScene,
        false,
        0.3
      );
    }

    this.dialogBackground.setVisible(true);
    this.dialogBackgroundColor.setVisible(true);

    this.spriteNameObject.text = spriteNames[sprite]?.[getLocale()] || spriteNames[sprite];
    this.spriteNameObject.setVisible(!!this.spriteNameObject.text);

    this.textObject.text = message;
    this.currentText = message;
    this.textObject.setVisible(true);

    this.time.delayedCall(300, () =>
      sceneEventsEmitter.emit(sceneEvents.DiscussionWaiting)
    );
  }
}
