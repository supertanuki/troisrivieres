import Phaser from "phaser";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import { getUrlParam, isDebug } from "../Utils/isDebug";
import MiniGameUi from "../UI/MiniGameUi";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { getUiMessage } from "../Workflow/messageWorkflow";

const rockPositions = [110, 175, 237];
const tubePositionsY = [60, 125, 187];
const waterDeltaY = 50;

const conveyorInitialSpeed = [0.8, 1, 1.2];
const conveyorSpeedIncrement = 0.6;

const numberRockValidatedBeforeSpeedIncrement = getUrlParam(
  "numberRockValidatedBeforeSpeedIncrement",
  5
);

const numberRocksValidatedBeforeSpeedIncrementAgain = getUrlParam(
  "numberRocksValidatedBeforeSpeedIncrementAgain",
  30
);

const waterReductionFactor = getUrlParam("waterReductionFactor", 0.2);
const waterRefillFactor = getUrlParam("waterRefillFactor", 0.5);

const numberRockValidatedToHaveMoreMaterials = getUrlParam(
  "numberRockValidatedToHaveMoreMaterials",
  12
);
const timeBetweenRocks = getUrlParam("timeBetweenRocks", 2000);
const moreMaterialsTimeBetweenRocks = getUrlParam(
  "moreMaterialsTimeBetweenRocks",
  1000
);
const numberIsRefined = getUrlParam("numberIsRefined", 60);

const tubeSpeed = getUrlParam("tubeSpeed", 5);
const tubeDeltaEffect = getUrlParam("tubeDeltaEffect", 40);

export default class Mine extends MiniGameUi {
  constructor() {
    super({
      key: "mine",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: 0.5 },
        },
      },
    });
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
    this.tutoMissedCount = 0;
    this.warnings = 0;
  }

  preload() {
    this.load.atlas("mine", "sprites/mine.png", "sprites/mine.json");
    this.load.image("water", "img/rain.png");
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

    this.water = this.add.particles(0, 0, "water", {
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

    sceneEventsEmitter.on(sceneEvents.EventsUnlocked, this.listenEvents, this);

    this.createControls();
    this.startGame();
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
          this.goingUp = true;
          this.goingDown = false;
        } else if (event.key === "ArrowDown") {
          this.goingDown = true;
          this.goingUp = false;
        } else if (event.key === "ArrowLeft") {
          this.goingLeft = true;
          this.goingRight = false;
        } else if (event.key === "ArrowRight") {
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
      function (event) {
        if (event.key == "ArrowUp") {
          this.goingUp = false;
        } else if (event.key == "ArrowDown") {
          this.goingDown = false;
        } else if (event.key == "ArrowLeft") {
          this.goingLeft = false;
        } else if (event.key == "ArrowRight") {
          this.goingRight = false;
        } else if (event.keyCode === 32) {
          this.action = false;
        }
      },
      this
    );

    if (isMobileOrTablet()) {
      this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
        x: 100,
        y: 200,
        radius: 100,
        base: this.add.circle(0, 0, 50, 0xff5544, 0.4).setDepth(10000),
        thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.3).setDepth(10000),
        dir: "8dir",
        forceMin: 16,
        enable: true,
        inputEnable: true,
        fixed: true,
      });

      // Make floating joystick
      this.input.on(
        "pointerdown",
        function (pointer) {
          this.joystick.setPosition(pointer.x, pointer.y);
          this.joystick.setVisible(true);
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

      this.joystick.on(
        "pointerdown",
        () => {
          this.action = true;
          this.handleAction();
        },
        this
      );
    }
  }

  listenEvents(data) {
    if (eventsHas(data, "mine_tuto_begin")) {
      this.tutoBegin();
    }

    if (eventsHas(data, "mine_tuto_rebegin")) {
      this.tutoBegin();
    }

    if (eventsHas(data, "mine_after_tuto")) {
      this.afterTuto();
    }

    if (eventsHas(data, "mine_end")) {
      this.endGame();
    }
  }

  tutoBegin() {
    this.isCinematic = false;
    this.firstStep = true;
    this.createRock();
  }

  tutoEnd() {
    this.isCinematic = true;
    dispatchUnlockEvents(["mine_tuto_end"]);
    this.startDiscussion("mine");
  }

  tutoMissed() {
    this.tutoMissedCount++;
    dispatchUnlockEvents(
      this.tutoMissedCount > 1
        ? ["mine_tuto_missed_twice"]
        : ["mine_tuto_missed"]
    );
    this.isCinematic = true;
    this.startDiscussion("mine");
  }

  afterTuto() {
    this.isCinematic = false;
    this.firstStep = false;
    this.createRock();
  }

  startGame() {
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.cameras.main.fadeIn(2000, 0, 0, 0);

    this.time.addEvent({
      callback: () => this.startDiscussion("mine"),
      delay: 1000,
    });
  }

  endGame() {
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.stop();
      dispatchUnlockEvents(["mine_after"]);
    });
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
        (value, index) => (this.speed[index] += conveyorSpeedIncrement)
      );
      this.updateMessage(getUiMessage("mine.fasterAgain"));
    }

    const total = this.rockValidated + this.rockNotValidated;
    const percent = Math.round((100 * this.rockValidated) / (total || 1));
    console.log(percent + " % (" + this.rockValidated + " / " + total + ")");

    const warnings =
      (this.rockNotValidated > 15 && 1) +
      (this.rockNotValidated > 25 && 1) +
      (this.rockNotValidated > 35 && 1) +
      (this.rockNotValidated > 45 && 1);
    if (warnings > this.warnings) {
      this.warnings++;
      if (this.warnings > 3) {
        this.gameOver();
        return;
      }

      this.updateMessage(
        getUiMessage(this.warnings === 3 ? "mine.lastWarning" : "mine.warning")
      );
      this.updateWarnings(this.warnings);
    }
  }

  updateWaterDepth() {
    this.water.setDepth(this.tubeCurrentY * 10 + 11);
  }

  up() {
    if (this.movingCable) return;

    if (this.tubeCurrentY > 0) {
      this.tubeCurrentY--;
      this.moveCable();
      this.updateWaterDepth();
    }
  }

  down() {
    if (this.movingCable) return;

    if (this.tubeCurrentY < 2) {
      this.tubeCurrentY++;
      this.moveCable();
      this.updateWaterDepth();
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
    const rockTextureId = Math.round((refined * 6) / numberIsRefined);
    rock.setTexture("mine", "rock-" + (rockTextureId || 1));
  }

  update(time, delta) {
    if (this.isGameOver) return;
    //console.log('Mine update ' + time)

    this.rockParticles.setVisible(false);

    this.tubeRollings.forEach(
      (tubeRolling, index) => (tubeRolling.x = this.tubeEnd.x - 22 + 16 * index)
    );

    if (this.goingUp && this.tubeEnd.y > 50) {
      this.up();
    } else if (this.goingDown && this.tubeEnd.y < 200) {
      this.down();
    }

    if (this.goingLeft && this.tubeEnd.x > 100) {
      this.tubeEnd.x -= tubeSpeed;
    } else if (this.goingRight && this.tubeEnd.x < 450) {
      this.tubeEnd.x += tubeSpeed;
    }

    this.tube.x = this.tubeEnd.x;
    this.tube.y = this.tubeEnd.y - 34;

    this.conveyor.forEach((conveyor, index) => {
      this.conveyorPosition[index] += this.speed[index];
      conveyor.setTilePosition(this.conveyorPosition[index], 0);
    });

    //if (this.isCinematic) return

    for (const index in this.rocks) {
      const element = this.rocks[index];
      const rock = element.rock;
      rock.x -= this.speed[element.index];

      if (rock.x < -20) {
        this.rocks.splice(index, 1);
        rock.destroy();

        if (element.refined <= numberIsRefined) {
          this.rockNotValidated++;
          this.updateStep();
        }
      }

      if (element.refined > numberIsRefined) {
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
        element.refined++;
        this.setRockTexture(rock, element.refined);
        this.rockParticles.setVisible(true);
        this.rockParticles.setDepth(rock.depth);
        this.rockParticles.setPosition(rock.x, rock.y - 25);

        if (element.refined > numberIsRefined) {
          this.rockValidated++;
          this.updateStep();
        }
      }
    }
  }
}
