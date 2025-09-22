import Phaser from "phaser";
import { gameDuration, isDebug } from "../Utils/debug";
import { dispatchUnlockEvents } from "../Utils/events";

export default class RecyclingCentreNightmare extends Phaser.Scene {
  constructor() {
    super({
      key: "recycling-nightmare",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: 0.5 },
        },
      },
    });
  }

  preload() {
    this.load.atlas("factory", "sprites/factory.png", "sprites/factory.json");
  }

  create() {
    this.timeStart = Date.now();

    this.anims.create({
      key: "mai-sleeping",
      frames: this.anims.generateFrameNames("mai", {
        start: 1,
        end: 3,
        prefix: "sleeping-",
      }),
      repeat: -1,
      yoyo: true,
      frameRate: 2,
    });
    this.scale.setGameSize(550, 300);
    this.cameras.main.setBackgroundColor("#ffffff");

    this.hero = this.add.sprite(275, 150, "mai", "sleeping-1");
    this.hero.anims.play("mai-sleeping", true);
    this.hero.setAlpha(0).setDepth(1);

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
  }

  endScene() {
    this.cameras.main.fadeOut(2000, 255, 255, 255, (cam, progress) => {
      if (progress !== 1) return;
      gameDuration("Dream factory", this.timeStart);
      this.scene.stop();
      dispatchUnlockEvents(["fourth_act_begin"]);
    });
  }

  update() {
  }
}
