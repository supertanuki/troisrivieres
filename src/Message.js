import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "./Events/EventsCenter";
import { spriteNames } from "./Workflow/messageWorkflow";

export default class Message extends Phaser.Scene {
  constructor() {
    super("message");
    this.textObject = null
    this.spriteNameObject = null
    this.currentText = ''
    this.delay = 10
  }

  create() {
    const config = this.sys.game.config;
    this.textObject = this.add.text(config.width / 2, config.height - 5, "", {
      font: "14px Arial",
      fill: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.9)",
      padding: 6,
      alpha: 0,
    })
    this.textObject
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(1000)
      .setWordWrapWidth(300)
      .setActive(false)
      .setVisible(false)

    this.spriteNameObject = this.add.text(0, 0, "", {
        font: "12px Arial",
        fill: "#000000",
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 4,
      })
    this.spriteNameObject
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(1000)
      .setActive(false)
      .setVisible(false)

    sceneEventsEmitter.on(sceneEvents.MessageSent, this.handleMessage, this)
    sceneEventsEmitter.on(sceneEvents.DiscussionEnded, this.handleDiscussionEnd, this)
  }

  handleDiscussionEnd() {
    this.textObject.text = ''
    this.textObject.setVisible(false)

    this.spriteNameObject.text = ''
    this.spriteNameObject.setVisible(false)
  }

  handleMessage(payload) {
    const {message, sprite} = payload;
    if (this.textObject.visible && message === this.currentText) {
      return
    }

    this.spriteNameObject.text = spriteNames[sprite]
    this.spriteNameObject.setVisible(true)

    this.textObject.text = ''
    this.currentText = message
    this.textObject.setVisible(true)
    this.typewriteText(message)
  }

  typewriteText(text) {
    const splitedText = text.split(' ');
    const length = splitedText.length
    let i = 0
    this.time.addEvent({
      callback: () => {
        this.textObject.text += splitedText[i] + ' '
        ++i

        this.spriteNameObject.setPosition(
          this.textObject.x - this.textObject.width/2 + 10,
          this.textObject.y - this.textObject.height
        )

        if (i >= length) {
          sceneEventsEmitter.emit(sceneEvents.DiscussionWaiting)
        }
      },
      repeat: length - 1,
      delay: this.delay,
    });
  }
}
