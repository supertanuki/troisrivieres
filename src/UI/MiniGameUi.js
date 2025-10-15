import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { FONT_RESOLUTION, FONT_SIZE } from "./Message";
import { playSound, preloadSound } from "../Utils/music";
import { eventsHas } from "../Utils/events";

const DEPTH = 2000;

export default class MiniGameUi extends Phaser.Scene {
  constructor(name) {
    super(name);
    this.sounds = [];
  }

  preload() {
    this.load.atlas("ui", "sprites/ui.png", "sprites/ui.json");
    this.load.image("vignette", "img/vignette.png");
  }

  create() {
    this.vignette = this.add
      .image(0, 0, "vignette")
      .setOrigin(0)
      .setAlpha(0.5)
      .setDepth(100000);
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

    this.anims.create({
      key: "score-warning",
      frames: [
        {
          key: "ui",
          frame: "scoreok",
        },
        {
          key: "ui",
          frame: "scoreko",
        },
      ],
      repeat: 5,
      frameRate: 8,
    });

    let scoreBoard;
    this.scores = [];

    if (this?.verticalScore) {
      scoreBoard = this.add
        .sprite(6, 0, "ui", "scoreboard-vertical")
        .setOrigin(0, 0);
      for (let i = 0; i <= 2; i++) {
        this.scores.push(
          this.add.sprite(14, 19 + 24 * i, "ui", "scoreok").setOrigin(0, 0)
        );
      }
    } else {
      scoreBoard = this.add.sprite(4, 0, "ui", "scoreboard").setOrigin(0, 0);
      for (let i = 0; i <= 2; i++) {
        this.scores.push(
          this.add.sprite(12 + 24 * i, 22, "ui", "scoreok").setOrigin(0, 0)
        );
      }
    }

    this.scoreBoardContainer = this.add.container(0, -95, [
      scoreBoard,
      this.scores[0],
      this.scores[1],
      this.scores[2],
    ]);
    this.scoreBoardContainer.setDepth(DEPTH);

    this.speaker = this.add
      .sprite(470, 0, "ui", "speaker-off")
      .setOrigin(0, 0)
      .setDepth(DEPTH);

    this.dialogBackground = this.add
      .sprite(345, 50, "ui", "dialog-shout-1")
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH)
      .setAlpha(0.8)
      .setVisible(false);

    this.dialogBackground.anims.play("dialog-shout-anim", true);

    this.textObject = this.add
      .text(345, 50, "", {
        fontFamily: "DefaultFont",
        fontSize: FONT_SIZE,
        fill: "#ffffff",
      })
      .setResolution(FONT_RESOLUTION)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH)
      .setWordWrapWidth(240)
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
    sceneEventsEmitter.on(
      sceneEvents.EventsUnlocked,
      this.listenUnlockedEvents,
      this
    );
    sceneEventsEmitter.on(sceneEvents.MessageSent, this.handleMessage, this);

    preloadSound("sfx_mini-jeu_haut-parleur", this);
    preloadSound("sfx_mini-jeu_erreur_2", this);
    preloadSound("sfx_mini-jeu_erreur_3", this);
    preloadSound("sfx_mini-jeu_apparition_panneau_erreurs_2", this);
  }

  listenUnlockedEvents(data) {
    console.log(data.newUnlockedEvents);
    if (
      [
        "mine_show_score_board",
        "factory_show_score_board",
        "recycling_show_score_board",
      ].includes(data.newUnlockedEvents[0])
    ) {
      this.showScoreBoard();
    }
  }

  showScoreBoard() {
    playSound("sfx_mini-jeu_apparition_panneau_erreurs_2", this, false, 0.7);
    this.tweens.add({
      targets: this.scoreBoardContainer,
      y: 0,
      ease: "Sine.easeOut",
      duration: 1500,
    });
  }

  startDiscussion(key) {
    sceneEventsEmitter.emit(sceneEvents.DiscussionStarted, key);
  }

  handleMessage(payload) {
    const { message, sprite } = payload;
    this.updateMessage(message, true);
  }

  updateMessage(message, waitUserAction = false) {
    if (!this.scene.isActive()) return;

    playSound("sfx_mini-jeu_haut-parleur", this, false, 0.5);

    this.dialogBackground.setVisible(true);
    this.speaker.anims.play("speaker-on-anim");
    this.textObject.text = message;
    this.textObject.setVisible(true);

    if (waitUserAction) {
      this.time.delayedCall(200, () =>
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
    playSound(
      warningCount <= 2 ? "sfx_mini-jeu_erreur_3" : "sfx_mini-jeu_erreur_2",
      this,
      true,
      1
    );

    if (warningCount > 3) warningCount = 3;
    for (let i = 0; i < warningCount; i++)
      this.scores[i].anims.play("score-warning", true);
  }

  handleAction() {
    if (!this.scene.isActive()) return;

    if (this.currentDiscussionStatus === DiscussionStatus.WAITING) {
      this.currentDiscussionStatus = DiscussionStatus.STARTED;
      sceneEventsEmitter.emit(sceneEvents.DiscussionContinuing);
      return;
    }
  }

  handleDiscussionStarted() {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.STARTED;
  }

  handleDiscussionWaiting() {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.WAITING;
  }

  handleDiscussionEnded() {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this.textObject.setVisible(false);
    this.speaker.anims.play("speaker-off-anim");
    this.dialogBackground.setVisible(false);
  }
}
