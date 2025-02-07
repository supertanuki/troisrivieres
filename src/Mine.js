import Phaser from "phaser";
import isMobile from "./Utils/isMobile";
import { isDebug } from "./Utils/isDebug";

const SPEED = 1;
const rockPositions = [150, 190, 230];
const cablePositionsX = [100, 150, 200];
const cablePositionsY = [50, 100, 150];

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
    this.textObject = this.add.text(config.width / 2, 50, "", {
      font: "14px Arial",
      fill: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.9)",
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

    const segments = [];
    const numSegments = 20;
    const segmentWidth = 10;
    const segmentHeight = 10;

    for (let i = 0; i < numSegments; i++) {
      const segment = this.matter.add.sprite(0, 0, "circle", null, {
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

    this.water = this.add.particles(0, 0, "water", {
      speed: { min: 100, max: 200 },
      angle: { min: -50, max: 50 },
      gravityY: 300,
      lifespan: 1000,
      quantity: 100,
      scale: { start: 0.5, end: 0 },
      emitting: false,
    });
    this.water.setDepth(2);

    this.events.on("update", () => {
      this.water.emitParticleAt(
        this.lastSegment.position.x + 10,
        this.lastSegment.position.y
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
    const selectedY = [...rockPositions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 1)[0];
    const index = rockPositions.indexOf(selectedY);
    const rock = this.add.image(initX, selectedY, "rock");
    this.rocks.push({ rock, index, refined: 0 });

    this.time.addEvent({
      callback: () => {
        this.createRock();
      },
      delay: 1000,
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

  up() {
    if (this.movingCable) return;

    if (this.currentCablePosition.y > 0) {
      this.currentCablePosition.y--;
      this.moveCable();
    }
  }

  down() {
    if (this.movingCable) return;

    if (this.currentCablePosition.y < 2) {
      this.currentCablePosition.y++;
      this.moveCable();
    }
  }

  moveCable() {
    this.movingCable = true;
    this.tweens.add({
      targets: this.lastSegment.position,
      x: cablePositionsX[this.currentCablePosition.x],
      y: cablePositionsY[this.currentCablePosition.y],
      ease: "Sine.easeInOut",
      duration: 500,
      onComplete: () => {
        this.movingCable = false;
      },
    });
  }

  update() {
    const deltaX = 100;
    const dephtX = 100;
    for (const element of this.rocks) {
      element.rock.x -= SPEED;
      if (element.index === this.currentCablePosition.y) {
        if (
          element.rock.x > this.lastSegment.position.x + deltaX - dephtX &&
          element.rock.x < this.lastSegment.position.x + deltaX + dephtX
        ) {
          element.rock.scale = element.rock.scale * 0.995;
        }
      }
    }

    if (!this.movingCable) {
      this.lastSegment.position.y =
        cablePositionsY[this.currentCablePosition.y];
      this.lastSegment.position.x =
        cablePositionsX[this.currentCablePosition.x];
    }
  }
}
