import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { DiscussionStatus } from "../Utils/discussionStatus";

export default class MiniGameUi extends Phaser.Scene {
  create() {
    this.currentDiscussionStatus = DiscussionStatus.NONE;

    this.anims.create({
      key: "speaker-off-anim",
      frames: [
        {
          key: "ui",
          frame: "speaker-off",
        },
      ],
      repeat: -1,
      frameRate: 1,
    });

    this.anims.create({
      key: "speaker-on-anim",
      frames: [
        {
          key: "ui",
          frame: "speaker-off",
        },
        {
          key: "ui",
          frame: "speaker-on",
        },
      ],
      repeat: -1,
      frameRate: 8,
    });

    this.anims.create({
      key: "dialog-shout-anim",
      frames: [
        {
          key: "ui",
          frame: "dialog-shout-1",
        },
        {
          key: "ui",
          frame: "dialog-shout-2",
        },
      ],
      repeat: -1,
      frameRate: 8,
    });

    this.add
      .sprite(4, 0, "ui", "scoreboard")
      .setOrigin(0, 0)
      .setDepth(2000);

    this.scores = [];
    for (let i = 0; i <= 2; i++) {
      this.scores.push(
        this.add
          .sprite(12 + 24 * i, 22, "ui", "scoreok")
          .setOrigin(0, 0)
          .setDepth(2000)
      );
    }

    this.speaker = this.add
      .sprite(470, 0, "ui", "speaker-off")
      .setOrigin(0, 0)
      .setDepth(2000);

    this.dialogBackground = this.add
      .sprite(345, 50, "ui", "dialog-shout-1")
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setAlpha(0.8)
      .setVisible(false);

    this.dialogBackground.anims.play("dialog-shout-anim", true);

    this.textObject = this.add
      .text(345, 50, "", {
        fontFamily: "DefaultFont",
        fontSize: "14px",
        fill: "#ffffff",
      })
      .setResolution(1)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setWordWrapWidth(250)
      .setVisible(false);

    sceneEventsEmitter.on(
      sceneEvents.DiscussionStarted,
      this.handleDiscussionStarted,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionWaiting,
      this.handleDiscussionWaiting,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionEnded,
      this.handleDiscussionEnded,
      this
    );
    sceneEventsEmitter.on(sceneEvents.MessageSent, this.handleMessage, this);
  }

  startDiscussion(key) {
    console.log('startDiscussion mine status', this.scene.getStatus('mine'))
    sceneEventsEmitter.emit(sceneEvents.DiscussionStarted, key);
  }

  handleMessage(payload) {
    const { message, sprite } = payload;
    this.updateMessage(message, true);
  }

  updateMessage(message, waitUserAction = false) {
    if (!this.scene.isActive()) return

    this.dialogBackground.setVisible(true);
    this.speaker.anims.play("speaker-on-anim");
    this.textObject.text = message;
    this.textObject.setVisible(true);

    if (waitUserAction) {
      this.time.delayedCall(500, () =>
        sceneEventsEmitter.emit(sceneEvents.DiscussionWaiting)
      );
      return;
    }

    this.time.delayedCall(2500, () => {
      if (this.currentDiscussionStatus === DiscussionStatus.NONE)
        this.handleDiscussionEnded();
    });
  }

  updateWarnings(warningCount) {
    for (let i = 0; i < warningCount; i++)
      this.scores[i].setTexture("ui", "scoreko");
  }

  handleAction() {
    if (!this.scene.isActive()) return

    if (this.currentDiscussionStatus === DiscussionStatus.WAITING) {
      this.currentDiscussionStatus = DiscussionStatus.STARTED;
      sceneEventsEmitter.emit(sceneEvents.DiscussionContinuing);
      return;
    }
  }

  handleDiscussionStarted() {
    if (!this.scene.isActive()) return
    this.currentDiscussionStatus = DiscussionStatus.STARTED;
  }

  handleDiscussionWaiting() {
    if (!this.scene.isActive()) return
    this.currentDiscussionStatus = DiscussionStatus.WAITING;
  }

  handleDiscussionEnded() {
    if (!this.scene.isActive()) return
    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this.textObject.setVisible(false);
    this.speaker.anims.play("speaker-off-anim");
    this.dialogBackground.setVisible(false);
  }
}
