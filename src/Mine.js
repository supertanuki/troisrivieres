import Phaser from "phaser";
import isMobileOrTablet from "./Utils/isMobileOrTablet";
import { getUrlParam, isDebug } from "./Utils/isDebug";

const rockPositions = [150, 190, 230];

const conveyorInitialSpeed = getUrlParam('conveyorInitialSpeed', 1)
const conveyorSpeedIncrement = getUrlParam('conveyorSpeedIncrement', 0.5)
const numberRockValidatedBeforeSpeedIncrement = getUrlParam('numberRockValidatedBeforeSpeedIncrement', 3)

const waterReductionFactor = getUrlParam('waterReductionFactor', 0.2)
const waterRefillFactor = getUrlParam('waterRefillFactor', 0.5)

const numberRockValidatedToHaveMoreMaterials = getUrlParam('numberRockValidatedToHaveMoreMaterials', 12)
const timeBetweenRocks = getUrlParam('timeBetweenRocks', 2000)
const moreMaterialsTimeBetweenRocks = getUrlParam('moreMaterialsTimeBetweenRocks', 1000)
const numberIsRefined = getUrlParam('numberIsRefined', 60);

const tubeSpeed = getUrlParam('tubeSpeed', 5);
const tubeDeltaEffect = getUrlParam('tubeDeltaEffect', 40);

export default class Mine extends Phaser.Scene {
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
  }

  preload() {
    this.load.image("rock", "img/rock.png");
    this.load.image("water", "img/rain.png");
    this.load.image("tapis", "img/factory/tapisroulant.jpg");
  }

  create() {
    this.add.image(0, -180, "tapis").setOrigin(0, 0);
    this.createControls();

    const config = this.sys.game.config;
    this.scoreObject = this.add.text(10, 20, "0", {
      font: "14px Arial",
      fill: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.9)",
      padding: 6,
      alpha: 0,
    })
    this.scoreObject
      .setScrollFactor(0)
      .setDepth(1000)
      .setWordWrapWidth(300)
      .setActive(true)
      .setVisible(false);

    this.textObject = this.add.text(config.width / 2, 100, "hello", {
      font: "14px Arial",
      fill: "#ffffff",
      backgroundColor: "rgba(100,100,0,0.9)",
      padding: 6,
      alpha: 0,
    });
    this.textObject
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(1000)
      .setWordWrapWidth(300)
      .setActive(false)
      .setVisible(false);

    // Fade init
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.matter.world.setBounds(0, 0, 550, 300);
    this.targetV = this.add.rectangle(100, 100, 20, 4, 0x2244ff);
    this.targetH = this.add.rectangle(100, 100, 4, 16, 0x2244ff);

    this.add.rectangle(0, 29, 550, 10, 0x115555).setOrigin(0, 0);

    this.waterStockAlert = this.add
      .rectangle(275, 0, 550, 29, 0xff0000)
      .setOrigin(0.5, 0)
      .setVisible(false);

    this.waterStock = this.add
      .rectangle(275, 29, 550, 29, 0x66aaff)
      .setOrigin(0.5, 0)
      .setDepth(10);

    this.tube = this.add
      .rectangle(275, 100, 12, 200, 0x115555)
      .setOrigin(0.5, 1)
      .setDepth(3);

    this.water = this.add.particles(0, 0, "water", {
      speed: { min: 200, max: 300 },
      angle: { min: 70, max: 110 },
      gravityY: 300,
      lifespan: 1000,
      quantity: 100,
      scale: { start: 0.5, end: 0 },
      emitting: false,
    });
    this.water.setDepth(1);

    this.particlesBound = this.water.addParticleBounds(0, 0, 550, 200)

    this.events.on("update", () => {
      if (!this.rechargeWater && this.action && this.waterStockPercentage > 0) {
        this.water.emitParticleAt(this.tube.x, this.tube.y);
        this.waterStockPercentage -= waterReductionFactor;

        if (this.waterStockPercentage < 0) {
          this.waterStockPercentage = 0;
          this.rechargeWater = true;
          this.targetV.setVisible(false);
          this.targetH.setVisible(false);
          this.updateMessage("Réserve d'eau vide !");
        }
      } else {
        this.waterStockPercentage += waterRefillFactor;

        if (this.waterStockPercentage >= 100) {
          this.waterStockPercentage = 100;
        }

        if (this.rechargeWater && this.waterStockPercentage === 100) {
          this.rechargeWater = false;
          this.targetV.setVisible(true);
          this.targetH.setVisible(true);
          this.waterStockAlert.setVisible(false);
          this.updateMessage("Réserve d'eau rechargée !");
        }
      }

      this.waterStockAlert.setVisible(
        this.rechargeWater || this.waterStockPercentage < 30
      );

      this.waterStock.height = (29 * this.waterStockPercentage) / 100;
      this.waterStock.y = 29 - this.waterStock.height;
    });

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
        base: this.add.circle(0, 0, 50, 0xff5544, 0.4),
        thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.3),
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
  
      this.joystick.on("pointerdown", () => {
        this.action = true;
      }, this);
    }
  }

  startGame() {
    this.createRock();
  }

  createRock() {
    const initX = 600;
    const index = Phaser.Math.Between(0, 2);
    const selectedY = rockPositions[index];
    const rock = this.add.image(initX, selectedY, "rock");
    const scale = Math.random() + 0.5;
    rock.setScale(scale > 1 ? 1 : scale);
    rock.setDepth(index * 10);
    const refined = Math.round(numberIsRefined / 3 / scale)
    this.rocks.push({ rock, index, refined });

    this.time.addEvent({
      callback: () => {
        this.createRock();
        if (this.rockValidated === numberRockValidatedToHaveMoreMaterials) {
          this.updateMessage("Plus de matières à traiter !");
        }
      },
      delay: this.rockValidated > numberRockValidatedToHaveMoreMaterials ? moreMaterialsTimeBetweenRocks : timeBetweenRocks,
    });
  }

  updateScore() {
    const total = this.rockValidated + this.rockNotValidated
    const percent = Math.round(100 * this.rockValidated / (total || 1))
    this.scoreObject.setText(
      percent + " %\n" +
      this.rockValidated +
        " / " +
        total
    );
    this.scoreObject.setVisible(true)
  }

  updateMessage(message) {
    this.textObject.text = message;
    this.textObject.setVisible(true);
    this.time.delayedCall(2000, () => {
      this.textObject.setVisible(false);
    });
  }

  update() {
    if (this.goingUp) {
      if (this.tube.y > 50) this.tube.y -= tubeSpeed;
    } else if (this.goingDown) {
      if (this.tube.y < 150) this.tube.y += tubeSpeed;
    }

    if (this.goingDown || this.goingUp) {
      this.particlesBound.active = false
      this.particlesBound = this.water.addParticleBounds(0, 0, 550, this.tube.y + 100)
    }

    const depth = this.tube.y < 100 ? 1 : this.tube.y < 120 ? 11 : 21
    this.water.setDepth(depth);

    if (this.goingLeft) {
      if (this.tube.x > 100) this.tube.x -= tubeSpeed;
    } else if (this.goingRight) {
      if (this.tube.x < 450) this.tube.x += tubeSpeed;
    }

    this.targetV.setPosition(this.tube.x, this.tube.y + 100);
    this.targetH.setPosition(this.tube.x, this.tube.y + 100);

    for (const index in this.rocks) {
      const element = this.rocks[index];
      const rock = element.rock;
      rock.x -= this.speed;

      if (rock.x < -20) {
        this.rocks.splice(index, 1);
        rock.destroy();

        if (element.refined <= numberIsRefined) {
          this.rockNotValidated++;
          this.updateScore();
        }
      }

      if (element.refined > numberIsRefined) {
        continue;
      }

      if (rock.y < this.tube.y + 125 && rock.y > this.tube.y + 75) {
        if (
          !this.rechargeWater &&
          this.action &&
          rock.x > this.tube.x - tubeDeltaEffect &&
          rock.x < this.tube.x + tubeDeltaEffect
        ) {
          rock.scale = rock.scale * 0.995;
          rock.setTint(element.refined % 2 ? 0xffffff : 0x555555);
          element.refined++;

          if (element.refined > numberIsRefined) {
            rock.setTint(0xff5555);
            this.rockValidated++;
            this.updateScore();

            if (this.rockValidated === numberRockValidatedBeforeSpeedIncrement) {
              this.speed += conveyorSpeedIncrement;
              this.updateMessage("Plus vite maintenant !!!");
            }

            const copiedRock = this.add.image(rock.x, rock.y, "rock");
            copiedRock.scale = rock.scale;
            copiedRock.setTint(0xff5555);
            this.tweens.add({
              targets: copiedRock,
              x: 20,
              y: 30,
              alpha: 0.2,
              ease: "Sine.easeInOut",
              duration: 500,
              onComplete: () => {
                copiedRock.destroy();
              },
            });
          }
        }
      }
    }
  }
}
