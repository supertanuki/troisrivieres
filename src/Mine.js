import Phaser from "phaser";
import isMobile from "./Utils/isMobile";
import { isDebug } from "./Utils/isDebug";

const rockPositions = [150, 190, 230];
const cablePositionsX = [150, 275, 450];
const cablePositionsY = [50, 100, 150];
const numberIsRefined = 50;

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
    this.currentCablePosition = { x: 0, y: 0 };
    this.movingCable = false;
    this.rockValidated = 0;
    this.rockNotValidated = 0;
    this.speed = 1;
    this.control = "none";
    this.waterStockPercentage = 100;
    this.rechargeWater = false;
  }

  preload() {
    this.load.image("tapis", "img/factory/tapisroulant.jpg");
    this.load.image("rock", "img/rock.png");
    this.load.image("circle", "img/circle.png");
    this.load.image("water", "img/rain.png");
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
      .rectangle(cablePositionsX[0], cablePositionsY[0], 12, 200, 0x115555)
      .setOrigin(0.5, 1)
      .setDepth(3);

    /*
    const segments = [];
    const numSegments = 12;
    const segmentWidth = 10;
    const segmentHeight = 10;

    for (let i = 0; i < numSegments; i++) {
      const segment = this.matter.add.sprite(config.width / 2, 0, "circle", null, {
        shape: {
          type: "circle",
          width: segmentWidth,
          height: segmentHeight,
        },
        isStatic: i === 0,
      });
      segment.setDepth(2);

      segments.push(segment);

      if (i > 0) {
        this.matter.add.constraint(
          segments[i - 1].body,
          segment.body,
          segmentWidth,
          0.5
        );
      }
    }

    this.lastSegment = segments[numSegments - 1].body;
    this.lastSegment.position.x = 200;
    this.lastSegment.position.y = cablePositionsY[0];
    */

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

    this.particlesBounds = [
      this.water.addParticleBounds(0, 0, 550, rockPositions[0] + 30),
      this.water.addParticleBounds(0, 0, 550, rockPositions[1] + 30),
      this.water.addParticleBounds(0, 0, 550, rockPositions[2] + 30),
    ];
    this.particlesBounds[1].active = false;
    this.particlesBounds[2].active = false;

    this.events.on("update", () => {
      if (!this.rechargeWater && this.action && this.waterStockPercentage > 0) {
        this.water.emitParticleAt(this.tube.x, this.tube.y);
        this.waterStockPercentage -= 0.2;

        if (this.waterStockPercentage < 0) {
          this.waterStockPercentage = 0;
          this.rechargeWater = true;
          this.targetV.setVisible(false);
          this.targetH.setVisible(false);
          this.updateMessage("Réserve d'eau vide !");
        }
      } else {
        this.waterStockPercentage += 0.5;

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

    if (isMobile()) {
      const screenWidth = Number(this.sys.game.config.width);
      const delta = 100;

      this.input.on(
        "pointerdown",
        (pointer) => {
          if (pointer.x < screenWidth / 2 - delta) {
            this.goingLeft = true;
            return;
          }

          if (pointer.x > screenWidth / 2 + delta) {
            this.control = "right";
            return;
          }

          // @todo
        },
        this
      );

      this.input.on(
        "pointerup",
        (pointer) => {
          this.control = "none";
        },
        this
      );
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
    this.rocks.push({ rock, index, refined: 0 });

    this.time.addEvent({
      callback: () => {
        this.createRock();
        if (this.rockValidated === 12) {
          this.updateMessage("Plus de matières à traiter !");
        }
      },
      delay: this.rockValidated > 12 ? 1000 : 2000,
    });
  }

  right() {
    if (this.movingCable) return;

    if (this.currentCablePosition.x < 2) {
      this.currentCablePosition.x++;
      this.moveCable();
    }
  }

  left() {
    if (this.movingCable) return;

    if (this.currentCablePosition.x > 0) {
      this.currentCablePosition.x--;
      this.moveCable();
    }
  }

  updateWaterBounds() {
    for (const key in this.particlesBounds) {
      this.particlesBounds[key].active = key == this.currentCablePosition.y;
    }

    this.water.setDepth(this.currentCablePosition.y * 10 + 1);
  }

  up() {
    if (this.movingCable) return;

    if (this.currentCablePosition.y > 0) {
      this.currentCablePosition.y--;
      this.moveCable();
      this.updateWaterBounds();
    }
  }

  down() {
    if (this.movingCable) return;

    if (this.currentCablePosition.y < 2) {
      this.currentCablePosition.y++;
      this.moveCable();
      this.updateWaterBounds();
    }
  }

  moveCable() {
    this.movingCable = true;
    this.tweens.add({
      targets: this.tube,
      y: cablePositionsY[this.currentCablePosition.y],
      ease: "Sine.easeInOut",
      duration: 200,
      onComplete: () => {
        this.movingCable = false;
      },
    });
  }

  updateScore() {
    const total = this.rockValidated + this.rockNotValidated
    const percent = Math.round(100 * this.rockValidated / (total || 1))
    this.scoreObject.setText(
      percent + " %\n" +
      this.rockValidated +
        " g / " +
        total +
        " kg"
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
      this.up();
    } else if (this.goingDown) {
      this.down();
    }

    if (this.goingLeft) {
      if (this.tube.x > 100) this.tube.x -= 5;
    } else if (this.goingRight) {
      if (this.tube.x < 450) this.tube.x += 5;
    }

    const targetY = rockPositions[this.currentCablePosition.y] + 10;
    this.targetV.setPosition(this.tube.x, targetY);
    this.targetH.setPosition(this.tube.x, targetY);

    const deltaX = 0;
    const dephtX = 40;

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

      if (element.index === this.currentCablePosition.y) {
        if (
          !this.rechargeWater &&
          this.action &&
          rock.x > this.tube.x + deltaX - dephtX &&
          rock.x < this.tube.x + deltaX + dephtX
        ) {
          rock.scale = rock.scale * 0.995;
          rock.setTint(element.refined % 3 ? 0xffffff : 0x555555);
          element.refined++;

          if (element.refined > numberIsRefined) {
            rock.setTint(0xff5555);
            this.rockValidated++;
            this.updateScore();

            if (this.rockValidated === 3) {
              this.speed += 0.5;
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

    /*
    if (!this.movingCable) {
      this.lastSegment.position.y =
        cablePositionsY[this.currentCablePosition.y];
      this.lastSegment.position.x =
        cablePositionsX[this.currentCablePosition.x];
    }
    */
  }
}
