import Phaser from "phaser";
import "../Sprites/Hero";
import { gameDuration, isDebug } from "../Utils/debug";
import { dispatchUnlockEvents } from "../Utils/events";

const COMPONENTS = {
  blue: "component-blue",
  violet: "component-violet",
  yellow: "component-yellow",
  red: "component-red",
  green: "component-green",
};

const MOTHERBOARDS = [
  { x: 275, y: 10 },
  { x: 400, y: 50 },
  { x: 475, y: 150 },
  { x: 400, y: 250 },
  { x: 275, y: 290 },
  { x: 150, y: 250 },
  { x: 75, y: 150 },
  { x: 150, y: 50 },
];

export default class FactoryNightmare extends Phaser.Scene {
  constructor() {
    super({
      key: "factory-nightmare",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: 0.5 },
        },
      },
    });

    this.conveyorPosition = 0;
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

    this.conveyor = this.add
      .tileSprite(275, 150, 700, 96, "factory", "tapis")
      .setAlpha(0);

    this.tweens.add({
      targets: this.conveyor,
      alpha: 0.5,
      ease: "Sine.linear",
      duration: 5000,
    });
    this.tweens.add({
      targets: this.conveyor,
      angle: 360,
      ease: "Sine.linear",
      duration: 15000,
    });

    for (const m of MOTHERBOARDS) {
      const motherboard = this.add
        .image(m.x, m.y, "factory", "motherboard")
        .setAlpha(0);
      this.tweens.add({
        targets: motherboard,
        alpha: 0.5,
        duration: 5000,
      });
      this.tweens.add({
        targets: motherboard,
        angle: 360,
        scale: 4,
        ease: "Sine.linear",
        duration: 15000,
      });
    }

    let index = 0;
    for (const c of Object.values(COMPONENTS)) {
      index++;
      const component = this.add.image(850 - index*50, 10+index*50, "factory", c).setAlpha(0.7).setDepth(1)
      this.tweens.add({
        targets: component,
        scale: 4,
        angle: 360,
        x: -80 * index,
        ease: "Sine.linear",
        duration: 15000,
      });
    }
  }

  endScene() {
    this.cameras.main.fadeOut(1000, 255, 255, 255, (cam, progress) => {
      if (progress !== 1) return;
      gameDuration("Dream factory", this.timeStart);
      this.scene.stop();
      dispatchUnlockEvents(["third_act_begin"]);
    });
  }

  update() {
    this.conveyorPosition -= 1;
    this.conveyor.setTilePosition(this.conveyorPosition, 0);
  }
}
