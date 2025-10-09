import Phaser from "phaser";
import { isDebug, urlParamHas } from "../Utils/debug";
import { dispatchUnlockEvents } from "../Utils/events";
import { ObjectDebris, OBJECTS_COLORS, OBJECTS_NAMES } from "./RecyclingCentre";
import { playNightmareTheme } from "../Utils/music";

export default class RecyclingCentreNightmare extends Phaser.Scene {
  constructor() {
    super({
      key: "recycling-nightmare",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: 0 },
        },
      },
    });

    this.delayBetweenObjects = 450;
  }

  preload() {
    this.load.atlas(
      "recyclingCentre",
      "sprites/recyclingCentre.png",
      "sprites/recyclingCentre.json"
    );
    this.load.image("vignette", "img/vignette.png");
  }

  create() {
    this.matter.world.setGravity(0, 0);
    this.matter.world.setBounds(0, 0, 550, 300);
    this.timeStart = Date.now();
    this.vignette = this.add
      .image(0, 0, "vignette")
      .setOrigin(0)
      .setAlpha(0.5)
      .setDepth(100000);

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

    this.time.delayedCall(1000, () => this.addObject());
  }

  addObject() {
    const name = Phaser.Math.RND.pick(OBJECTS_NAMES);
    const x = Phaser.Math.Between(100, 450);

    const object = this.matter.add.image(
      275,
      150,
      "recyclingCentre",
      name + "-broken"
    );
    object.setAlpha(0);
    object.applyForce({
      x: Phaser.Math.RND.pick([-0.01, 0.01]),
      y: Phaser.Math.RND.pick([-0.01, 0.01]),
    });
    this.tweens.add({
      targets: object,
      alpha: 0.7,
      ease: "Sine.linear",
      duration: 500,
    });

    this.delayBetweenObjects -= 10;
    if (this.delayBetweenObjects < 10) {
      this.delayBetweenObjects = 10;
      this.createDebris(
        Phaser.Math.Between(100, 450),
        Phaser.Math.Between(50, 250),
        name
      );
    }

    const delay = this.delayBetweenObjects;
    this.time.delayedCall(delay, () => this.addObject());

    if (urlParamHas("dreamRecycling")) {
      playNightmareTheme(this);
    }
  }

  createDebris(x, y, name) {
    const color = OBJECTS_COLORS[name];
    Array(Phaser.Math.Between(20, 40))
      .fill(0)
      .forEach((i) => new ObjectDebris(this, x, y, color));
  }

  endScene() {
    this.cameras.main.fadeOut(2000, 255, 255, 255, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.stop();
      dispatchUnlockEvents(["fourth_act_begin"]);
    });
  }
}
