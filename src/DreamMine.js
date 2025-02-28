import Phaser from "phaser";
import "./Sprites/Hero";
import { isDebug } from "./Utils/isDebug";

export default class DreamMine extends Phaser.Scene {
  constructor() {
    super({
      key: "dream-mine",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: 0.5 },
        },
      },
    });
  }

  preload() {
    this.load.image("rock", "img/rock.png");
    this.load.image("water", "img/water-maroon.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");

    this.hero = this.add.hero(275, 150, "mai", "idle-down-1");

    this.tweens.add({
      targets: this.hero,
      angle: 360,
      scale: 2,
      ease: "Sine.linear",
      duration: 10000,
      onComplete: () => {
        this.tweens.add({
          targets: this.hero,
          angle: 180,
          scale: 4,
          alpha: 0,
          ease: "Sine.linear",
          duration: 5000,
        });
      },
    });

    this.createRock(500, 250, 50, 50);
    this.createRock(50, 250, 500, 50);
    this.createRock(50, 50, 500, 250);
    this.createRock(100, 200, 300, 20);

    this.tube = this.add
        .rectangle(50, 50, 12, 400, 0x115555)
        .setOrigin(0.5, 1)
        .setDepth(3)
        .setAlpha(0)

    this.tweens.add({
        targets: this.tube,
        angle: 180,
        alpha: 1,
        x: 500,
        y: 250,
        ease: "Sine.easeIn",
        duration: 7000,
        yoyo: true,
        onUpdate: (event) => {
            if (event.progress > 0.8) this.stopWater = true
        }
    });

    this.water = this.add.particles(0, 0, "water", {
        speed: { min: 200, max: 300 },
        angle: { min: 70, max: 110 },
        gravityY: 300,
        lifespan: 2000,
        quantity: 100,
        scale: { start: 0.5, end: 0 },
        emitting: false,
      });
    this.water.setDepth(1);
  }

  createRock(initX, initY, finalX, finalY) {
    const rock = this.add.image(finalX, finalY, "rock");
    const scale = Math.random() + 0.5;
    rock.setScale(scale > 1 ? 1 : scale);

    rock.setAlpha(0)
    this.tweens.add({
      targets: rock,
      angle: 180,
      x: initX,
      y: initY,
      alpha: 0.8,
      ease: "Sine.easeIn",
      duration: 5000,
      onComplete: () => {
        this.tweens.add({
          targets: rock,
          angle: 180,
          x: Math.abs(initX-finalX)/2,
          y: Math.abs(initY-finalY)/2,
          ease: "Sine.linear",
          duration: 5000,
          onComplete: () => {
            this.tweens.add({
              targets: rock,
              angle: 180,
              x: finalX,
              y: finalY,
              alpha: 0,
              ease: "Sine.linear",
              duration: 5000,
            });
          },
        });
      },
    });

    return rock;
  }

  update() {
    if (!this.stopWater) {
        this.water.emitParticleAt(this.tube.x, this.tube.y);
        this.water.updateConfig({
            angle: { min: this.tube.angle + 100, max: this.tube.angle + 80 }
        })
    }
  }
}
