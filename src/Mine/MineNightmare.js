import Phaser from "phaser";
import "../Sprites/Hero";
import { isDebug } from "../Utils/isDebug";
import { dispatchUnlockEvents } from "../Utils/events";

export default class MineNightmare extends Phaser.Scene {
  constructor() {
    super({
      key: "mine-nightmare",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: 0.5 },
        },
      },
    });

    this.stopWater = true;
  }

  preload() {
    this.load.atlas("mine", "sprites/mine.png", "sprites/mine.json");
  }

  create() {
    console.log('create MineNightmare')
    this.scale.setGameSize(550, 300);
    this.cameras.main.setBackgroundColor("#ffffff");

    this.hero = this.add.hero(275, 150, "mai", "idle-down-1");
    this.hero.setAlpha(0);

    this.tweens.add({
      targets: this.hero,
      angle: 360,
      scale: 2,
      alpha: 1,
      ease: "Sine.linear",
      duration: 6000,
      onComplete: () => {
        this.tweens.add({
          targets: this.hero,
          angle: 180,
          scale: 4,
          alpha: 0,
          ease: "Sine.linear",
          duration: 6000,
          onComplete: () => this.endScene(),
        });
      },
    });

    this.createRock(500, 250, 50, 50, "rock-1");
    this.createRock(50, 250, 500, 50, "rock-2");
    this.createRock(50, 50, 500, 250, "rock-3");
    this.createRock(100, 200, 300, 20, "rock-4");

    this.tube = this.add.container();

    this.tube.add(
      this.add.tileSprite(0, -33, 22, 1000, "mine", "tube").setOrigin(0.5, 1)
    );

    this.tube.add(this.add.image(0, 0, "mine", "tube-end").setOrigin(0.43, 1));

    this.tube.setDepth(1000).setAlpha(0);

    this.water = this.add.particles(0, 0, "mine", {
      frame: ["water-blue"],
      speed: { min: 200, max: 300 },
      angle: { min: 70, max: 110 },
      gravityY: 300,
      lifespan: 2000,
      quantity: 100,
      scale: { start: 0.5, end: 0 },
      emitting: false,
    });
    this.water.setDepth(1);

    this.tweens.add({
      targets: this.tube,
      angle: 180,
      alpha: 1,
      x: 500,
      y: 216,
      ease: "Sine.linear",
      duration: 4500,
      onUpdate: (event) => {
        this.stopWater = event.progress < 0.2;
        if (event.progress > 0.8)
          this.water.updateConfig({ frame: ["water-maroon"] });
      },
      onComplete: () => {
        this.tweens.add({
          targets: this.tube,
          angle: 180,
          alpha: 0,
          x: 400,
          y: 20,
          ease: "Sine.linear",
          duration: 4500,
          onUpdate: (event) => {
            this.stopWater = event.progress > 0.9;
          },
        });
      },
    });
  }

  endScene() {
    this.cameras.main.fadeOut(1000, 255, 255, 255, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.stop();
      dispatchUnlockEvents(["second_act_begin"]);
    });
  }

  createRock(initX, initY, finalX, finalY, frame) {
    const rock = this.add.image(initX, initY, "mine", frame);

    rock.setAlpha(0);
    this.tweens.add({
      targets: rock,
      alpha: 0.8,
      ease: "Sine.linear",
      duration: 5000,
      onComplete: () => {
        this.tweens.add({
          targets: rock,
          x: finalX,
          y: finalY,
          alpha: 0,
          ease: "Sine.linear",
          duration: 5000,
        });
      },
    });
    this.tweens.add({
      targets: rock,
      angle: 360,
      x: finalX,
      y: finalY,
      alpha: 0.8,
      ease: "Sine.linear",
      duration: 10000,
    });

    return rock;
  }

  update() {
    if (!this.stopWater) {
      this.water.emitParticleAt(this.tube.x, this.tube.y);
      this.water.updateConfig({
        angle: { min: this.tube.angle + 100, max: this.tube.angle + 80 },
      });
    }
  }
}
