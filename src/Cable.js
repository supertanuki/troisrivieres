// TO REMOVE



import Phaser from "phaser";
import { isDebug } from "./Utils/isDebug";

const SPEED = 5;

export default class Cable extends Phaser.Scene {
  constructor() {
    super({
      key: "cable",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: 0.5 },
        },
      },
    });
  }

  preload() {
    this.load.image("circle", "img/circle.png");
    this.load.image("water", "img/rain.png");
    this.load.image("mine-background", "img/mine-background.png");

    this.load.image("rock", "img/rock.png");
    this.load.json("shapes", "img/shapes.json");

    this.load.audio("music-background", "sounds/music.mp3");
  }

  create() {
    this.scale.setGameSize(550, 300);
    this.matter.world.setBounds(0, 0, 550, 300);
    this.add.image(200, 150, "mine-background");
    const text = this.add.text(10, 10, 'Click to play and run music', { font: '32px Courier', fill: '#ffffff' });
    text.setInteractive()
    text.on('pointerdown', () => {
      text.destroy()
      this.start()
    })
  }

  start() {
    this.started = true

    //const shapes = this.cache.json.get("shapes");
    this.rock = this.matter.add.sprite(260, 195, "rock", null, {
      //shape: shapes.rock,
    });
    
    this.rock.setBody({
      type: "circle",
      radius: 30,
    });
    

    this.mousePosition = { x: 420, y: 50 };
    const segments = [];
    const numSegments = 20;
    const segmentWidth = 10;
    const segmentHeight = 10;

    for (let i = 0; i < numSegments; i++) {
      const segment = this.matter.add.sprite(420, 50, "circle", null, {
        shape: {
          type: "circle",
          width: segmentWidth,
          height: segmentHeight,
        },
        isStatic: i === 0,
      });

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

    this.input.on("pointermove", (pointer) => {
      this.mousePosition.x = pointer.x;
      this.mousePosition.y = pointer.y;
    });

    this.water = this.add.particles(0, 0, "water", {
      speed: { min: 100, max: 200 },
      angle: { min: -200, max: -150 },
      gravityY: 300,
      lifespan: 2000,
      quantity: 100,
      scale: { start: 0.5, end: 0 },
      emitting: false,
    });

    this.events.on("update", () => {
      this.water.emitParticleAt(
        this.lastSegment.position.x - 10,
        this.lastSegment.position.y
      );
    });

    this.createControls();

    // La musique se joue uniquement après une interaction (clic sur start)
    this.music = this.sound.add('music-background');
    this.music.loop = true
    //this.music.play()
  }

  goLeft() {
    this.mousePosition.x -= SPEED;
  }

  goRight() {
    this.mousePosition.x += SPEED;
  }

  goUp() {
    this.mousePosition.y -= SPEED;
  }

  goDown() {
    this.mousePosition.y += SPEED;
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
        }
      },
      this
    );
  }

  handleAction() {}

  update() {
    if (!this.started) {
      return
    }

    if (this.goingLeft) {
      this.goLeft();
    } else if (this.goingRight) {
      this.goRight();
    }

    if (this.goingUp) {
      this.goUp();
    } else if (this.goingDown) {
      this.goDown();
    }

    // Force
    const dx = this.mousePosition.x - this.lastSegment.position.x;
    const dy = this.mousePosition.y - this.lastSegment.position.y;
    const forceX = dx * 0.0005;
    const forceY = dy * 0.0005;
    this.matter.body.applyForce(
      this.lastSegment,
      { x: this.lastSegment.position.x, y: this.lastSegment.position.y },
      { x: forceX, y: forceY }
    );

    const waterOverlap = this.water.overlap(this.rock);
    if (waterOverlap.length > 0) {
      waterOverlap.forEach((particle) => {
        particle.kill();
      });
    }
  }
}
