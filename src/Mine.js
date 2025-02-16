import Phaser from "phaser";
import isMobile from "./Utils/isMobile";
import { isDebug } from "./Utils/isDebug";

const rockPositions = [150, 190, 230];
const cablePositionsX = [150, 275, 450];
const cablePositionsY = [50, 100, 150];
const numberIsRefined = 20

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
    this.rockValidated = 0
    this.rockNotValidated = 0
    this.speed = 1
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
    });
    this.scoreObject
      .setScrollFactor(0)
      .setDepth(1000)
      .setWordWrapWidth(300)
      .setActive(true)
      .setVisible(true);

    this.textObject = this.add.text(config.width / 2, 50, "", {
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

    // Fade init
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.matter.world.setBounds(0, 0, 550, 300);
    this.targetV = this.add.rectangle(100, 100, 20, 4, 0x2244ff)
    this.targetH = this.add.rectangle(100, 100, 4, 16, 0x2244ff)

    this.tube = this.add.rectangle(0, 0, 6, 200, 0x555555)
    .setOrigin(0.5,1)
    .setDepth(3)

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
      speed: { min: 100, max: 200 },
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
    ]
    this.particlesBounds[1].active = false
    this.particlesBounds[2].active = false

    this.events.on("update", () => {
      this.water.emitParticleAt(
        //this.lastSegment.position.x,
        //this.lastSegment.position.y + 10
        this.tube.x,
        this.tube.y
      );
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
          this.up();
        } else if (event.key === "ArrowDown") {
          this.down();
        } else if (event.key === "ArrowLeft") {
          this.left();
        } else if (event.key === "ArrowRight") {
          this.right();
        } else if (event.keyCode === 32) {
          //this.handleAction();
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
            this.left();
            return;
          }

          if (pointer.x > screenWidth / 2 + delta) {
            this.right();
            return;
          }

          this.up();
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
    const selectedY = rockPositions[index]
    const rock = this.add.image(initX, selectedY, "rock");
    const scale = Math.random() + 0.5
    rock.setScale(scale > 1 ? 1 : scale)
    rock.setDepth(index*10)
    this.rocks.push({ rock, index, refined: 0 });

    this.time.addEvent({
      callback: () => {
        this.createRock();
      },
      delay: 2000,
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
      this.particlesBounds[key].active = key == this.currentCablePosition.y
    }

    this.water.setDepth(this.currentCablePosition.y * 10 + 1);
  }

  up() {
    if (this.movingCable) return;

    if (this.currentCablePosition.y > 0) {
      this.currentCablePosition.y--;
      this.moveCable();
      this.updateWaterBounds()
    }
  }

  down() {
    if (this.movingCable) return;

    if (this.currentCablePosition.y < 2) {
      this.currentCablePosition.y++;
      this.moveCable();
      this.updateWaterBounds()
    }
  }

  moveCable() {
    this.movingCable = true;
    this.tweens.add({
      targets: this.tube,
      x: cablePositionsX[this.currentCablePosition.x],
      y: cablePositionsY[this.currentCablePosition.y],
      ease: "Sine.easeInOut",
      duration: 500,
      onComplete: () => {
        this.movingCable = false;
      },
    });
  }

  updateScore() {
    this.scoreObject.setText(this.rockValidated + ' g / ' + (this.rockValidated + this.rockNotValidated) + ' kg')
  }

  update() {
    const targetY = rockPositions[this.currentCablePosition.y] + 10
    this.targetV.setPosition(this.tube.x, targetY)
    this.targetH.setPosition(this.tube.x, targetY)

    const deltaX = 0;
    const dephtX = 50;

    for (const index in this.rocks) {
      const element = this.rocks[index]
      const rock = element.rock
      rock.x -= this.speed;

      if (rock.x < -20) {
        this.rocks.splice(index, 1)
        rock.destroy()

        if (element.refined <= numberIsRefined) {
          this.rockNotValidated++
          this.updateScore()
        }
      }

      if (element.refined > numberIsRefined) {
        continue
      }

      if (element.index === this.currentCablePosition.y) {
        if (
          rock.x > this.tube.x + deltaX - dephtX &&
          rock.x < this.tube.x + deltaX + dephtX
        ) {
          rock.scale = rock.scale * 0.995;
          rock.setTint(element.refined % 2 ? 0xffffff : 0x555555)
          element.refined++

          if (element.refined > numberIsRefined) {
            rock.setTint(0xff5555)
            this.rockValidated++;
            this.updateScore()

            if (this.rockValidated === 3) {
              this.speed += 0.5
              this.textObject.text = 'Plus vite maintenant !!!'
              this.textObject.setVisible(true)
              this.time.delayedCall(1000, () => {
                this.textObject.setVisible(false)
              });
            }
            
            const copiedRock = this.add.image(rock.x, rock.y, "rock");
            copiedRock.scale = rock.scale
            copiedRock.setTint(0xff5555)
            this.tweens.add({
              targets: copiedRock,
              x: 20,
              y: 30,
              alpha: 0.2,
              ease: "Sine.easeInOut",
              duration: 500,
              onComplete: () => {
                copiedRock.destroy()
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
