import Phaser from "phaser";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import MiniGameUi from "../UI/MiniGameUi";
import { gameDuration, urlParamHas } from "../Utils/debug";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { getUiMessage } from "../Workflow/messageWorkflow";
import { FONT_RESOLUTION } from "../UI/Message";
import { playMiniGameTheme } from "../Utils/music";


export default class RecyclingCentre extends MiniGameUi {
  constructor() {
    super({
      key: "recyclingCentre",
    });
  }

  preload() {
    super.preload();
  }

  create() {
    this.timeStart = Date.now();
    super.create();
    this.cameras.main.setBackgroundColor(0x000000);
    this.scale.setGameSize(550, 300);

    this.createControls();
    this.startGame();
  }

  startGame() {
    if (urlParamHas('recyclingCentre')) {
      playMiniGameTheme(this);
    }

    this.cameras.main.fadeIn(2000, 0, 0, 0);

    /*
    this.time.addEvent({
      callback: () => this.startDiscussion("factory"),
      delay: 1000,
    });
    */
  }

  gameOver() {
    this.isCinematic = true;
    this.isGameOver = true;
    dispatchUnlockEvents(["recyclingcentre_game_over"]);
    this.startDiscussion("recyclingCentre");
  }

  endGame() {
    gameDuration("recyclingCentre", this.timeStart);
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.stop();
      dispatchUnlockEvents(["recyclingcentre_after"]);
    });
  }

  listenDispatchedEvents(data) {
    if (eventsHas(data, "recyclingcentre_tuto_begin")) {
      this.tutoBegin();
    }
  }

  listenUnlockedEvents(data) {
    if (eventsHas(data, "recyclingcentre_after_tuto")) {
      this.afterTuto();
    }

    if (eventsHas(data, "recyclingcentre_end")) {
      this.endGame();
    }
  }

  tutoBegin() {
    this.isCinematic = false;
    this.firstStep = true;
  }

  tutoMissed() {
    dispatchUnlockEvents(["recyclingcentre_tuto_missed"]);
    this.isCinematic = true;
    this.startDiscussion("recyclingcentre");
  }

  tutoEnd() {
    this.isCinematic = true;
    dispatchUnlockEvents(["recyclingcentre_tuto_end"]);
    this.startDiscussion("recyclingcentre");
  }

  afterTuto() {
    this.isCinematic = false;
    this.firstStep = false;
    // start
  }

  createControls() {
    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (event.key === "ArrowUp") {
          this.up();
        } else if (event.key === "ArrowDown") {
          this.down()
        } else if (event.key === "ArrowLeft") {
          this.left();
        } else if (event.key === "ArrowRight") {
          this.right();
        } else if (event.keyCode === 32) {
          this.handleAction();
        }
      },
      this
    );

    if (isMobileOrTablet()) {
      const delta = 80;
      const arrowY = 225;

      const arrowStyle = {
        fontFamily: "DefaultFont",
        fontSize: "32px",
        fill: "#ffffff",
      };

      this.add
        .text(70, arrowY, "←", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(70, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(275, arrowY, "↑", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(275, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(480, arrowY, "→", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(480, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.input.on(
        "pointerdown",
        (pointer) => {
          if (pointer.x < 275 - delta) {
            this.left();
            return;
          }

          if (pointer.x > 275 + delta) {
            this.right();
            return;
          }

          this.handleAction();
        },
        this
      );
    }
  }

  handleAction() {
    super.handleAction();

    if (this.currentDiscussionStatus === DiscussionStatus.NONE) {
      this.setComponent();
    }
  }

  right() {
    super.handleAction();
  }

  left() {
    super.handleAction();
  }

  up() {
    super.handleAction();
  }

  down() {
    super.handleAction();
  }

  update() {
    if (this.isCinematic) return;

  }
}
