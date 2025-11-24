import Phaser from "phaser";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import { gameDuration, urlParamHas } from "../Utils/debug";
import MiniGameUi from "../UI/MiniGameUi";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { getUiMessage } from "../Workflow/messageWorkflow";
import {
  playMiniGameTheme,
  playSound,
  preloadSound,
  stopSound,
} from "../Utils/music";

const rockPositions = [110, 175, 237];
const tubePositionsY = [60, 125, 187];
const waterDeltaY = 50;

const conveyorInitialSpeed = [0.8, 1, 1.2];
const conveyorSpeedIncrement = 0.6;
const conveyorSpeedIncrementAgain = 0.8;

const numberRockValidatedBeforeSpeedIncrement = 5;
const numberRocksValidatedBeforeSpeedIncrementAgain = 40;

const waterReductionFactor = 0.2;
const waterRefillFactor = 0.5;

const numberRockValidatedToHaveMoreMaterials = 12;
const timeBetweenRocks = 2000;
const moreMaterialsTimeBetweenRocks = 1000;
const numberIsRefined = 60;

const tubeSpeed = 5;
const tubeDeltaEffect = 40;

export default class Mine extends MiniGameUi {
  constructor() {
    super("mine");

    this.verticalScore = true;
    this.rocks = [];
    this.movingCable = false;
    this.rockValidated = 0;
    this.rockNotValidated = 0;
    this.speed = conveyorInitialSpeed;
    this.control = "none";
    this.waterStockPercentage = 100;
    this.rechargeWater = false;
    this.conveyor = [];
    this.conveyorPosition = [0, 0, 0];
    this.tubeRollings = [];
    this.tubeCurrentY = 0;
    this.goingDown = true;
    this.isCinematic = true;
    this.firstStep = true;
    this.faster = false;
    this.fasterAgain = false;
    this.moreMaterials = false;
    this.warnings = 0;
  }

  preload() {
    super.preload();
    this.load.atlas("mine", "sprites/mine.png", "sprites/mine.json");
  }

  create() {
    super.create();

    this.cameras.main.setBackgroundColor(0x30221e);
    this.scale.setGameSize(550, 300);

    this.add
      .image(275, 0, "mine", "background")
      .setOrigin(0.5, 0)
      .setScale(-1, 1);
    this.add.image(180, 46, "mine", "water-tank"); // 156
    const mask = this.add.bitmapMask(null, 197, 35, "mine", "water-tank-mask");
    this.waterStock = this.add.image(197, 46, "mine", "water");
    this.waterStock.setMask(mask);
    this.add.image(197, 46, "mine", "water-glass");
    this.add.image(197, 18, "mine", "water-tank-top");

    this.conveyor.push(
      this.add
        .tileSprite(0, 92, 550, 48, "mine", "conveyor")
        .setOrigin(0, 0)
        .setScrollFactor(0, 0)
    );

    this.add
      .tileSprite(0, 140, 550, 19, "mine", "conveyor-bottom")
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    this.conveyor.push(
      this.add
        .tileSprite(0, 156, 550, 48, "mine", "conveyor")
        .setOrigin(0, 0)
        .setScrollFactor(0, 0)
    );

    this.add
      .tileSprite(10, 204, 550, 19, "mine", "conveyor-bottom")
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    this.conveyor.push(
      this.add
        .tileSprite(0, 220, 550, 48, "mine", "conveyor")
        .setOrigin(0, 0)
        .setScrollFactor(0, 0)
    );

    this.add
      .tileSprite(5, 268, 550, 19, "mine", "conveyor-bottom")
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    // right block
    this.add
      .image(509, 169, "mine", "right-block")
      .setOrigin(0.5, 0.5)
      .setDepth(1000);
    this.add
      .image(474, 69, "mine", "block-bottom")
      .setOrigin(0.5, 0.5)
      .setDepth(1);
    this.add
      .image(474, 133, "mine", "block-bottom")
      .setOrigin(0.5, 0.5)
      .setDepth(10);
    this.add
      .image(474, 197, "mine", "block-bottom")
      .setOrigin(0.5, 0.5)
      .setDepth(20);
    this.add
      .image(515, 257, "mine", "right-glass")
      .setOrigin(0.5, 0.5)
      .setDepth(1000);

    // left block
    this.add
      .image(40, 169, "mine", "right-block")
      .setOrigin(0.5, 0.5)
      .setScale(-1, 1)
      .setDepth(1000);
    this.add
      .image(75, 69, "mine", "block-bottom")
      .setOrigin(0.5, 0.5)
      .setScale(-1, 1)
      .setDepth(1);
    this.add
      .image(75, 133, "mine", "block-bottom")
      .setOrigin(0.5, 0.5)
      .setScale(-1, 1)
      .setDepth(10);
    this.add
      .image(75, 197, "mine", "block-bottom")
      .setOrigin(0.5, 0.5)
      .setScale(-1, 1)
      .setDepth(20);
    this.add
      .image(35, 257, "mine", "left-glass")
      .setOrigin(0.5, 0.5)
      .setDepth(1000);

    this.anims.create({
      key: "particules",
      frames: this.anims.generateFrameNames("mine", {
        start: 1,
        end: 4,
        prefix: "particules-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.rockParticles = this.add
      .sprite(275, 202, "mine", "particules-1")
      .setOrigin(0.5, 0.5)
      .setVisible(false);
    this.rockParticles.anims.play("particules", true);

    this.tube = this.add
      .tileSprite(0, 0, 22, 1000, "mine", "tube")
      .setOrigin(0.5, 1)
      .setDepth(1000);

    this.tubeEnd = this.add
      .image(275, 50, "mine", "tube-end")
      .setOrigin(0.43, 1)
      .setDepth(1000);

    this.add.image(64, 0, "mine", "tube-top").setOrigin(0, 0).setDepth(1000);

    for (let i = 0; i < 3; i++) {
      this.tubeRollings.push(
        this.add
          .sprite(80 + 13 * i, 2, "mine", "tube-rolling-1")
          .setOrigin(0, 0)
          .setDepth(1000)
      );
    }

    this.tubeShadow = this.add.ellipse(0, 0, 16, 10, 0x000000, 0.1);

    this.water = this.add.particles(0, 0, "mine", {
      frame: ["water-blue"],
      speed: { min: 200, max: 300 },
      angle: { min: 70, max: 110 },
      gravityY: 300,
      lifespan: 320,
      quantity: 50,
      scale: { start: 0.5, end: 0 },
      emitting: false,
    });
    this.water.setDepth(1);

    this.events.on("update", () => {
      if (this.isCinematic) return;

      if (!this.rechargeWater && this.action && this.waterStockPercentage > 0) {
        playSound("sfx_mini-jeu_jet-eau", this, false, 0.5, true);
        this.water.emitParticleAt(this.tubeEnd.x, this.tubeEnd.y);

        this.water.forEachAlive((particle) => {
          const limit =
            rockPositions[this.tubeCurrentY] + Phaser.Math.Between(0, 30);
          if (particle.y >= limit) {
            particle.y = limit;
            particle.velocityY *= -Phaser.Math.Between(1, 100) / 100;
            particle.velocityX *= Phaser.Math.Between(1, 20) / 10;
          }
        });

        this.waterStockPercentage -= waterReductionFactor;

        if (this.waterStockPercentage <= 0) {
          this.waterStockPercentage = 0;
          this.rechargeWater = true;
          this.updateMessage(getUiMessage("mine.waterEmpty"));
        }
      } else {
        stopSound("sfx_mini-jeu_jet-eau", this);
        this.waterStockPercentage += waterRefillFactor;

        if (this.waterStockPercentage >= 100) {
          this.waterStockPercentage = 100;
        }

        if (this.rechargeWater && this.waterStockPercentage === 100) {
          this.rechargeWater = false;
          this.updateMessage(getUiMessage("mine.waterFull"));
        }
      }

      this.waterStock.y =
        46 + ((100 - 46) * (100 - this.waterStockPercentage)) / 100;
      this.waterStock.setVisible(this.waterStockPercentage > 5);
    });

    sceneEventsEmitter.on(
      sceneEvents.EventsDispatched,
      this.listenDispatchedEvents,
      this
    );

    if (urlParamHas("bypassminigame")) {
      this.endGame();
      return;
    }

    preloadSound("sfx_mini-jeu_jet-eau", this);
    preloadSound("sfx_mini-jeu_caillou_desagrege", this);
    preloadSound("sfx_mini-jeu_deplacement_tuyau", this);
    preloadSound("sfx_mini-jeu_reussite_3", this);

    this.createControls();
    this.startGame();
  }

  createControls() {
    super.createControls();

    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      up: "up",
      down: "down",
      left: "left",
      right: "right",
      w: "up",
      z: "up",
      q: "left",
      a: "left",
      s: "down",
      d: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (["ArrowUp", "z", "w"].includes(event.key)) {
          this.goingUp = true;
          this.goingDown = false;
        } else if (["ArrowDown", "s"].includes(event.key)) {
          this.goingDown = true;
          this.goingUp = false;
        } else if (["ArrowLeft", "q", "a"].includes(event.key)) {
          this.goingLeft = true;
          this.goingRight = false;
        } else if (["ArrowRight", "d"].includes(event.key)) {
          this.goingRight = true;
          this.goingLeft = false;
        } else if (event.keyCode === 32) {
          this.action = true;
          this.handleAction();
        }
      },
      this
    );

    this.input.keyboard.on(
      "keyup",
      (event) => {
        if (["ArrowUp", "z", "w"].includes(event.key)) {
          this.goingUp = false;
        } else if (["ArrowDown", "s"].includes(event.key)) {
          this.goingDown = false;
        } else if (["ArrowLeft", "q", "a"].includes(event.key)) {
          this.goingLeft = false;
        } else if (["ArrowRight", "d"].includes(event.key)) {
          this.goingRight = false;
        } else if (event.keyCode === 32) {
          this.action = false;
        }
      },
      this
    );

    if (isMobileOrTablet() && !urlParamHas("joystick")) {
      const arrowAlpha = 0.2;
      const arrowColor = 0xff5544;

      const fadeControl = (object) => {
        object.alpha = 0.5;
        this.tweens.add({
          targets: object,
          alpha: 0.1,
          duration: 500,
        });
      };

      this.add
        .bitmapText(40, 210, "FreePixel-16", "←", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const left = this.add
        .circle(40, 210, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.goingLeft = true;
          this.goingRight = false;
          fadeControl(left);
        });

      this.add
        .bitmapText(90, 160, "FreePixel-16", "↑", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const up = this.add
        .circle(90, 160, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.handleAction();
          this.goingUp = true;
          this.goingDown = false;
          fadeControl(up);
        });

      this.add
        .bitmapText(90, 260, "FreePixel-16", "↓", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const down = this.add
        .circle(90, 260, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.handleAction();
          this.goingUp = false;
          this.goingDown = true;
          fadeControl(down);
        });

      this.add
        .bitmapText(140, 210, "FreePixel-16", "→", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const right = this.add
        .circle(140, 210, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.goingLeft = false;
          this.goingRight = true;
          fadeControl(right);
        });

      this.input.on("pointerup", () => {
        this.goingLeft = false;
        this.goingRight = false;
        this.goingUp = false;
        this.goingDown = false;
        this.action = false;
      });

      this.input.on("pointerdown", () => {
        this.action = true;
        this.handleAction();
      });
    }

    if (isMobileOrTablet() && urlParamHas("joystick")) {
      this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
        x: 100,
        y: 200,
        radius: 50,
        base: this.add.circle(0, 0, 40, 0xff5544, 0.2).setDepth(10000),
        thumb: this.add.circle(0, 0, 20, 0xffffff, 0.3).setDepth(10000),
        dir: "8dir",
        forceMin: 16,
        enable: true,
        inputEnable: true,
        fixed: true,
      });

      // Make floating joystick
      this.input.on(
        "pointerdown",
        (pointer) => {
          this.joystick.setPosition(pointer.x, pointer.y);
          this.joystick.setVisible(true);
          this.action = true;
          this.handleAction();
        },
        this
      );

      this.joystick.on(
        "update",
        function () {
          this.goingAngle = this.joystick.angle;

          if (this.joystick.left) {
            this.goingLeft = true;
            this.goingRight = false;

            if (177.5 < this.goingAngle || -177.5 > this.goingAngle) {
              this.goingUp = false;
              this.goingDown = false;
            }
          } else if (this.joystick.right) {
            this.goingRight = true;
            this.goingLeft = false;

            if (22.5 > this.goingAngle && -22.5 < this.goingAngle) {
              this.goingUp = false;
              this.goingDown = false;
            }
          }

          if (this.joystick.up) {
            this.goingUp = true;
            this.goingDown = false;

            if (-67.5 > this.goingAngle && -112.5 < this.goingAngle) {
              this.goingRight = false;
              this.goingLeft = false;
            }
          } else if (this.joystick.down) {
            this.goingDown = true;
            this.goingUp = false;

            if (67.5 < this.goingAngle && 112.5 > this.goingAngle) {
              this.goingRight = false;
              this.goingLeft = false;
            }
          }
        },
        this
      );

      this.joystick.on(
        "pointerup",
        () => {
          this.joystick.setVisible(false);
          this.action = false;
          this.goingUp = false;
          this.goingDown = false;
          this.goingRight = false;
          this.goingLeft = false;
        },
        this
      );
    }
  }

  listenUnlockedEvents(data) {
    super.listenUnlockedEvents(data);

    if (eventsHas(data, "mine_after_tuto")) {
      this.afterTuto();
    }

    if (eventsHas(data, "mine_end")) {
      this.endGame();
    }
  }

  listenDispatchedEvents(data) {
    if (eventsHas(data, "mine_tuto_begin")) {
      this.tutoBegin();
    }
  }

  tutoBegin() {
    this.isCinematic = false;
    this.firstStep = true;
    this.createRock();
  }

  tutoEnd() {
    stopSound("sfx_mini-jeu_jet-eau", this);
    this.isCinematic = true;
    dispatchUnlockEvents(["mine_tuto_end"]);
    this.startDiscussion("mine");
  }

  tutoMissed() {
    stopSound("sfx_mini-jeu_jet-eau", this);
    dispatchUnlockEvents(["mine_tuto_missed"]);
    this.isCinematic = true;
    this.startDiscussion("mine");
  }

  afterTuto() {
    this.isCinematic = false;
    this.firstStep = false;
    this.createRock();
  }

  startGame() {
    this.timeStart = Date.now();

    if (urlParamHas("mine")) {
      playMiniGameTheme(this);
    }

    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.time.delayedCall(1000, () => this.startDiscussion("mine"));
  }

  endGame() {
    gameDuration("Mine", this.timeStart);
    super.endGame(["mine_after"]);
  }

  createRock() {
    const initX = 600;
    const index = Phaser.Math.Between(0, 2);
    const selectedY = rockPositions[index];
    const rock = this.add.sprite(initX, selectedY, "mine", "rock-1");
    rock.setDepth(1 + index * 10);

    // first one must be 0
    const refined = this.rocks.length
      ? Phaser.Math.Between(0, Math.round(numberIsRefined * 0.9))
      : 0;
    this.setRockTexture(rock, refined);
    this.rocks.push({ rock, index, refined });

    if (this.firstStep) return;

    this.time.addEvent({
      callback: () => {
        this.createRock();
        if (
          !this.moreMaterials &&
          this.rockValidated === numberRockValidatedToHaveMoreMaterials
        ) {
          this.moreMaterials = true;
          this.updateMessage(getUiMessage("mine.moreMaterials"));
        }
      },
      delay:
        this.rockValidated > numberRockValidatedToHaveMoreMaterials
          ? moreMaterialsTimeBetweenRocks
          : timeBetweenRocks,
    });
  }

  gameOver() {
    this.isCinematic = true;
    this.isGameOver = true;
    stopSound("sfx_mini-jeu_jet-eau", this);
    stopSound("sfx_mini-jeu_deplacement_tuyau", this);
    this.rockParticles.setVisible(false);
    dispatchUnlockEvents(["mine_game_over"]);
    this.startDiscussion("mine");
  }

  updateStep() {
    if (this.firstStep) {
      if (this.rockValidated) {
        this.tutoEnd();
      } else {
        this.tutoMissed();
      }
    }

    if (
      !this.faster &&
      this.rockValidated === numberRockValidatedBeforeSpeedIncrement
    ) {
      this.faster = true;
      this.speed.forEach(
        (value, index) => (this.speed[index] += conveyorSpeedIncrement)
      );
      this.updateMessage(getUiMessage("mine.faster"));
    }

    if (
      !this.fasterAgain &&
      this.rockValidated === numberRocksValidatedBeforeSpeedIncrementAgain
    ) {
      this.fasterAgain = true;
      this.speed.forEach(
        (value, index) => (this.speed[index] += conveyorSpeedIncrementAgain)
      );
      this.updateMessage(getUiMessage("mine.fasterAgain"));
    }

    const total = this.rockValidated + this.rockNotValidated;
    const percent = Math.round((100 * this.rockValidated) / (total || 1));
    console.log(percent + " % (" + this.rockValidated + " / " + total + ")");

    const warnings =
      (this.rockNotValidated > 5 && 1) +
      (this.rockNotValidated > 15 && 1) +
      (this.rockNotValidated > 25 && 1);

    if (warnings > this.warnings) {
      this.warnings++;

      this.updateMessage(
        getUiMessage(this.warnings === 2 ? "mine.lastWarning" : "mine.warning")
      );
      this.updateWarnings(this.warnings);

      if (this.warnings === 3) {
        this.gameOver();
        return;
      }
    }
  }

  updateWaterDepth() {
    this.water.setDepth(this.tubeCurrentY * 10 + 11);
  }

  up() {
    if (this.movingCable) {
      this.tubeMoving = true;
      return;
    }

    if (this.tubeCurrentY > 0) {
      this.tubeCurrentY--;
      this.moveCable();
      this.updateWaterDepth();
      this.tubeMoving = true;
    }
  }

  down() {
    if (this.movingCable) {
      this.tubeMoving = true;
      return;
    }

    if (this.tubeCurrentY < 2) {
      this.tubeCurrentY++;
      this.moveCable();
      this.updateWaterDepth();
      this.tubeMoving = true;
    }
  }

  moveCable() {
    this.movingCable = true;

    this.tweens.add({
      targets: this.tubeEnd,
      y: tubePositionsY[this.tubeCurrentY],
      ease: "Sine.easeInOut",
      duration: 300,
      onComplete: () => {
        this.movingCable = false;
      },
    });
  }

  setRockTexture(rock, refined) {
    const rockTextureId = Math.floor((refined * 6) / numberIsRefined);
    rock.setTexture("mine", "rock-" + (rockTextureId || 1));
  }

  whenTubeMoving() {
    playSound("sfx_mini-jeu_deplacement_tuyau", this, false, 1, true);
  }

  stopTubeMoving() {
    stopSound("sfx_mini-jeu_deplacement_tuyau", this);
  }

  update(time, delta) {
    if (this.isGameOver) return;

    this.rockParticles.setVisible(false);

    this.tubeRollings.forEach(
      (tubeRolling, index) => (tubeRolling.x = this.tubeEnd.x - 22 + 16 * index)
    );

    this.tubeMoving = false;

    if (this.goingUp && this.tubeEnd.y > 50) {
      this.up();
    } else if (this.goingDown && this.tubeEnd.y < 200) {
      this.down();
    }

    if (this.goingLeft && this.tubeEnd.x > 100) {
      this.tubeEnd.x -= tubeSpeed;
      this.tubeMoving = true;
    } else if (this.goingRight && this.tubeEnd.x < 450) {
      this.tubeEnd.x += tubeSpeed;
      this.tubeMoving = true;
    }

    if (this.tubeMoving) this.whenTubeMoving();
    else this.stopTubeMoving();

    this.tube.setPosition(this.tubeEnd.x, this.tubeEnd.y - 34);
    this.tubeShadow.setPosition(this.tubeEnd.x, this.tubeEnd.y + 58);

    this.conveyor.forEach((conveyor, index) => {
      this.conveyorPosition[index] += this.speed[index];
      conveyor.setTilePosition(this.conveyorPosition[index], 0);
    });

    for (const index in this.rocks) {
      const element = this.rocks[index];
      const rock = element.rock;
      rock.x -= this.speed[element.index];

      if (rock.x < -20) {
        this.rocks.splice(index, 1);
        rock.destroy();

        if (element.refined < numberIsRefined) {
          this.rockNotValidated++;
          this.updateStep();
        }
      }

      if (element.refined >= numberIsRefined) {
        continue;
      }

      if (
        rock.y < this.tubeEnd.y + waterDeltaY + 25 &&
        rock.y > this.tubeEnd.y + waterDeltaY - 25 &&
        this.action &&
        !this.rechargeWater &&
        rock.x > this.tubeEnd.x - tubeDeltaEffect &&
        rock.x < this.tubeEnd.x + tubeDeltaEffect
      ) {
        playSound("sfx_mini-jeu_caillou_desagrege", this, false, 1);
        element.refined++;
        this.setRockTexture(rock, element.refined);
        this.rockParticles.setVisible(true);
        this.rockParticles.setDepth(rock.depth);
        this.rockParticles.setPosition(rock.x, rock.y - 25);

        if (element.refined >= numberIsRefined) {
          playSound("sfx_mini-jeu_reussite_3", this, true);
          this.rockValidated++;
          this.updateStep();
        }
      }
    }
  }
}
