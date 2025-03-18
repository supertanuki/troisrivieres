import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { spriteNames } from "../Workflow/messageWorkflow";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { eventsHas } from "../Utils/events";

const FONT_SIZE = "12px"
const FONT_RESOLUTION = 1;
const SHOW_TEXT_DELAY = 20;

export default class Message extends Phaser.Scene {
  constructor() {
    super("message");
    this.textObject = null;
    this.spriteNameObject = null;
    this.currentText = "";
    this.currentDiscussionStatus = DiscussionStatus.NONE;
  }

  create() {
    const config = this.sys.game.config;

    this.actionBackground = this.add
      .rectangle(config.width / 2, config.height - 30, 150, 30, 0x000000)
      .setAlpha(0.5)
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setVisible(false)

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
      .text(
        config.width / 2,
        config.height - 30,
        isMobileOrTablet() ? "Appuyer pour continuer" : "Appuyer sur espace",
        {
          fontFamily: 'DefaultFont',
          fontSize: FONT_SIZE,
          fill: "#ffffff",
        }
      )
      .setResolution(FONT_RESOLUTION)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setVisible(false)

    this.dialogBackground = this.add
      .sprite(config.width / 2, config.height - 30, "ui", "dialog-2")
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setAlpha(0.8)
      .setScrollFactor(0)
      .setVisible(false);

    this.dialogBackgroundColor = this.add
      .rectangle(config.width / 2, config.height - 30, 252, 44, 0x000000)
      .setAlpha(0.5)
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setScrollFactor(0)
      .setVisible(false);

    this.textObject = this.add
      .text(config.width / 2, config.height - 30, "", {
        fontFamily: 'DefaultFont', 
        fontSize: FONT_SIZE,
        fill: "#ffffff",
      })
      .setResolution(FONT_RESOLUTION)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(3000)
      .setWordWrapWidth(245)
      .setVisible(false);

    this.spriteNameObject = this.add
      .text(config.width / 2 - 132, config.height - 64, "", {
        fontFamily: 'DefaultFont',
        fontSize: FONT_SIZE,
        fill: "#ffffff",
        padding: 4,
      })
      .setResolution(FONT_RESOLUTION)
      .setFontStyle("bold")
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(3000)
      .setVisible(false)
      .setShadow(0, 0, "rgba(0,0,0,0.9)", 2);

    this.mineCard = this.add
      .image(config.width - 30, config.height - 30, "ui", "card")
      .setScrollFactor(0)
      .setDepth(3000)
      .setAlpha(0)
      .setVisible(false);

    sceneEventsEmitter.on(sceneEvents.MessageSent, this.handleMessage, this);
    sceneEventsEmitter.on(
      sceneEvents.DiscussionEnded,
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
    this.mineCard.setVisible(true);
    this.tweens.add({
      targets: this.mineCard,
      alpha: 1,
      scale: 1,
      ease: "Sine.easeInOut",
      loop: 0,
      duration: 500,
    });
  }

  hideMineCard() {
    this.tweens.add({
      targets: this.mineCard,
      alpha: 0,
      scale: 0.5,
      ease: "Sine.easeInOut",
      loop: 0,
      duration: 500,
      onComplete: () => this.mineCard.setVisible(false)
    });
  }

  listenEvents(data) {
    console.log("Message listenEvents", data);
    if (eventsHas(data, "card_for_mine")) {
      this.showMineCard();
    }

    if (eventsHas(data, "mine_access_validation")) {
      this.hideMineCard();
    }    
  }

  startDiscussion() {
    console.log('Message startDiscussion')
    if (!this.scene.isActive()) return
    this.currentDiscussionStatus = DiscussionStatus.STARTED;
    this.stopAction();
  }

  stopAction() {
    if (!this.scene.isActive()) return;
    console.log('Message stopAction')

    this.actionText.setVisible(false);
    this.actionBackground.setVisible(false);
    this.actionBackgroundLine.setVisible(false);
  }

  readyToAction() {
    if (!this.scene.isActive()) return;
    if (this.currentDiscussionStatus !== DiscussionStatus.NONE) return;
    if (this.scene.get('game')?.isCinematic) return;

    console.log('Message readyToAction')

    this.currentDiscussionStatus = DiscussionStatus.READY;
    this.actionText.setVisible(true);
    this.actionBackground.setVisible(true);
    this.actionBackgroundLine.setVisible(true);
  }

  handleDiscussionEnd() {
    if (!this.scene.isActive()) return;
    console.log('Message handleDiscussionEnd')

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
    console.log('Message handleMessage')

    const { message, sprite } = payload;
    if (this.textObject.visible && message === this.currentText) {
      return;
    }

    this.dialogBackground.setVisible(true);
    this.dialogBackgroundColor.setVisible(true);

    this.spriteNameObject.text = spriteNames[sprite];
    this.spriteNameObject.setVisible(true);

    this.textObject.text = "";
    this.currentText = message;
    this.textObject.setVisible(true);
    this.typewriteText(message);
  }

  typewriteText(text) {
    const splitedText = text.split(" ");
    const length = splitedText.length;
    let i = 0;
    this.time.addEvent({
      callback: () => {
        this.textObject.text += splitedText[i] + " ";
        ++i;

        if (i >= length) {
          sceneEventsEmitter.emit(sceneEvents.DiscussionWaiting);
        }
      },
      repeat: length - 1,
      delay: SHOW_TEXT_DELAY,
    });
  }
}
