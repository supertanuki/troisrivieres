import isMobileOrTablet from "../Utils/isMobileOrTablet";
import MiniGameUi from "../UI/MiniGameUi";
import { gameDuration, isDebug, urlParamHas } from "../Utils/debug";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { playMiniGameTheme, playSound, preloadSound } from "../Utils/music";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { getUiMessage } from "../Workflow/messageWorkflow";

export const OBJECTS_NAMES = ["laptop", "console", "phone"];
export const OBJECTS_COLORS = {
  console: 0xbe4343,
  laptop: 0x6ec9c6,
  phone: 0xc09e5a,
};
const initialY = 252;
const initialX = 200;
const STEPX = 5;
const yGravity = 0.04;

export default class RecyclingCentre extends MiniGameUi {
  constructor() {
    super({
      key: "recyclingCentre",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: yGravity },
        },
      },
    });

    this.delayBetweenObjects = 1500;
    this.objects = [];
    this.containers = [];
    this.containersObject = null;
    this.validatedObjects = 0;
    this.notValidatedObjects = 0;
    this.conveyorPosition = 0;
    this.selectedObject = "laptop";
    this.warnings = 0;
    this.previousValidatedObjects = 0;
    this.currentYGravity = yGravity;
  }

  preload() {
    super.preload();
    this.load.atlas(
      "recyclingCentre",
      "sprites/recyclingCentre.png",
      "sprites/recyclingCentre.json"
    );
  }

  create() {
    super.create();
    this.timeStart = Date.now();

    this.anims.create({
      key: "trap-open",
      frames: this.anims.generateFrameNames("recyclingCentre", {
        start: 1,
        end: 4,
        prefix: "trap",
      }),
      repeat: 0,
      frameRate: 10,
    });

    this.anims.create({
      key: "trap-close",
      frames: this.anims.generateFrameNames("recyclingCentre", {
        start: 4,
        end: 1,
        prefix: "trap",
      }),
      repeat: 0,
      frameRate: 10,
    });

    this.anims.create({
      key: "shredder-console",
      frames: this.anims.generateFrameNames("recyclingCentre", {
        start: 1,
        end: 2,
        prefix: "shredder-console-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: "shredder-phone",
      frames: this.anims.generateFrameNames("recyclingCentre", {
        start: 1,
        end: 2,
        prefix: "shredder-phone-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: "shredder-laptop",
      frames: this.anims.generateFrameNames("recyclingCentre", {
        start: 1,
        end: 2,
        prefix: "shredder-laptop-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: "wheel-right",
      frames: this.anims.generateFrameNames("recyclingCentre", {
        start: 1,
        end: 4,
        prefix: "wheel-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: "wheel-left",
      frames: this.anims.generateFrameNames("recyclingCentre", {
        start: 4,
        end: 1,
        prefix: "wheel-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.scale.setGameSize(550, 300);
    this.matter.world.setBounds(0, -100, 550, 400);

    this.add.image(275, 150, "recyclingCentre", "background");
    this.add.image(275, 0, "recyclingCentre", "track").setOrigin(0.5, 0);

    this.waterLevelLeft = this.add
      .image(26, 300, "recyclingCentre", "water-level")
      .setDepth(1);
    this.add.image(27, 192, "recyclingCentre", "water-tank").setDepth(1);

    this.waterLevelRight = this.add
      .image(524, 250, "recyclingCentre", "water-level")
      .setScale(-1, 1)
      .setDepth(1);
    this.add
      .image(522, 192, "recyclingCentre", "water-tank")
      .setScale(-1, 1)
      .setDepth(1);

    this.objectSource = this.add
      .sprite(275, 0, "recyclingCentre", "trap1")
      .setOrigin(0.5, 0)
      .setDepth(1);

    this.leftCable = this.add.graphics().setDepth(1);
    this.rightCable = this.add.graphics().setDepth(1);

    this.shredder = this.add
      .sprite(0, -65, "recyclingCentre", "shredder-laptop-1")
      .setOrigin(0.5, 0)
      .setDepth(1);
    this.shredder.anims.play("shredder-laptop");
    const containerBase = this.add
      .image(0, 0, "recyclingCentre", "shredder")
      .setDepth(2);

    this.wheelLeft = this.add
      .sprite(-50, 45, "recyclingCentre", "wheel-1")
      .setDepth(2);

    this.wheelRight = this.add
      .sprite(50, 45, "recyclingCentre", "wheel-1")
      .setDepth(2);

    this.buttonLeftTop = this.add
      .image(-37, 0, "recyclingCentre", "button-blue")
      .setDepth(1);
    this.buttonLeftBottom = this.add
      .image(-37, 22, "recyclingCentre", "button-blue")
      .setDepth(1);
    this.buttonRightTop = this.add
      .image(37, 0, "recyclingCentre", "button-blue")
      .setDepth(1);
    this.buttonRightBottom = this.add
      .image(37, 22, "recyclingCentre", "button-blue")
      .setDepth(1);

    this.currentObject = this.add
      .image(0, 2, "recyclingCentre", this.selectedObject)
      .setDepth(1);
    this.previousObject = this.add
      .image(0, -23, "recyclingCentre", "phone-little")
      .setAlpha(0.4);
    this.nextObject = this.add
      .image(0, 27, "recyclingCentre", "console-little")
      .setAlpha(0.4);

    this.containersObject = this.add.container(initialX, initialY, [
      this.wheelLeft,
      this.wheelRight,
      this.shredder,
      this.buttonLeftTop,
      this.buttonLeftBottom,
      this.buttonRightTop,
      this.buttonRightBottom,
      containerBase,
      this.currentObject,
      this.previousObject,
      this.nextObject,
    ]);

    this.physics.add.existing(this.containersObject);
    this.containersObject.setDepth(1);
    const body = this.containersObject.body;
    body
      .setAllowGravity(false)
      .setMaxVelocity(200)
      .setDamping(true)
      .setDrag(0.01);

    if (urlParamHas("bypassminigame")) {
      this.endGame();
      return;
    }

    sceneEventsEmitter.on(
      sceneEvents.EventsDispatched,
      this.listenDispatchedEvents,
      this
    );

    this.createControls();
    this.startGame();

    preloadSound("sfx_mini-jeu_broyeur", this);
    preloadSound("sfx_mini-jeu_roulement_broyeur", this);
    preloadSound("sfx_mini-jeu_trappe_dechet", this);
    preloadSound("sfx_mini-jeu_reussite", this);
  }

  startGame() {
    if (urlParamHas("recyclingCentre")) {
      playMiniGameTheme(this);
    }

    // reset waters level
    this.moveContainers(0);
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.time.delayedCall(1000, () => this.startDiscussion("recyclingCentre"));
  }

  gameOver() {
    this.isCinematic = true;
    this.isGameOver = true;
    this.shredder.anims.stop();

    dispatchUnlockEvents(["recycling_game_over"]);
    this.startDiscussion("recyclingCentre");
  }

  endGame() {
    gameDuration("recyclingCentre", this.timeStart);
    super.endGame(["recycling_after"]);
  }

  listenDispatchedEvents(data) {
    if (eventsHas(data, "recycling_tuto_begin")) {
      this.tutoBegin();
    }
  }

  listenUnlockedEvents(data) {
    super.listenUnlockedEvents(data);

    if (eventsHas(data, "recycling_after_tuto")) {
      this.afterTuto();
    }

    if (eventsHas(data, "recycling_end")) {
      this.endGame();
    }
  }

  tutoBegin() {
    console.log("tutoBegin");
    for (const object of this.objects) {
      this.tweens.add({
        targets: object,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          object.destroy();
        },
      });
    }
    this.objects = [];
    this.isCinematic = false;
    this.firstStep = true;
    this.time.delayedCall(1500, () => this.initObject());
  }

  tutoMissed() {
    dispatchUnlockEvents(["recycling_tuto_missed"]);
    this.isCinematic = true;
    this.startDiscussion("recyclingCentre");
  }

  tutoEnd() {
    console.log("tutoEnd");
    this.isCinematic = true;
    dispatchUnlockEvents(["recycling_tuto_end"]);
    this.startDiscussion("recyclingCentre");
  }

  afterTuto() {
    console.log("afterTuto");
    this.isCinematic = false;
    this.firstStep = false;
    // start
    this.time.delayedCall(1500, () => this.initObject());
  }

  getObjectNameByDirection(direction) {
    const index = OBJECTS_NAMES.indexOf(this.selectedObject);
    let nextIndex = index + direction;
    nextIndex = nextIndex > OBJECTS_NAMES.length - 1 ? 0 : nextIndex;
    nextIndex = nextIndex < 0 ? OBJECTS_NAMES.length - 1 : nextIndex;
    return OBJECTS_NAMES[nextIndex];
  }

  setSelectedObject(direction) {
    if (this.changeMode) return;
    this.changeMode = true;
    this.selectedObject = this.getObjectNameByDirection(direction);
    this.currentObject.setFrame(this.selectedObject);
    this.previousObject.setFrame(this.getObjectNameByDirection(-1) + "-little");
    this.nextObject.setFrame(this.getObjectNameByDirection(1) + "-little");
    playSound("sfx_mini-jeu_reussite", this, true, 0.06);

    this.tweens.add({
      targets: this.shredder,
      y: -30,
      duration: 100,
      onComplete: () => {
        this.shredder.anims.play("shredder-" + this.selectedObject);
        this.tweens.add({
          targets: this.shredder,
          y: -65,
          duration: 100,
          onComplete: () => this.changeMode = false,
        });
      },
    });
  }

  right() {
    this.goingRight = true;
  }

  left() {
    this.goingLeft = true;
  }

  up() {
    if (this.isCinematic) return;
    this.setSelectedObject(-1);
    this.feedbackButton(this.buttonLeftTop);
    this.feedbackButton(this.buttonRightTop);
  }

  down() {
    if (this.isCinematic) return;
    this.setSelectedObject(1);
    this.feedbackButton(this.buttonLeftBottom);
    this.feedbackButton(this.buttonRightBottom);
  }

  feedbackButton(button) {
    button.setTexture("recyclingCentre", "button-red");
    this.time.delayedCall(300, () => {
      button.setTexture("recyclingCentre", "button-blue");
    });
  }

  createDebris(x, y, name) {
    const color = OBJECTS_COLORS[name];
    Array(Phaser.Math.Between(20, 40))
      .fill(0)
      .forEach((i) => new ObjectDebris(this, x, y, color));
  }

  initObject() {
    if (this.isCinematic) return;

    const warnings =
      (this.notValidatedObjects > 2 && 1) +
      (this.objects.length > 10 && 1) +
      (this.objects.length > 60 && 1);

    if (warnings > this.warnings) {
      this.warnings = warnings;
      this.updateWarnings(this.warnings);
      this.updateMessage(getUiMessage("recycling.error"));
    }

    if (warnings === 3) {
      this.gameOver();
      return;
    }

    const name = this.firstStep
      ? "console"
      : Phaser.Math.RND.pick(OBJECTS_NAMES);
    const x = Phaser.Math.Between(150, 400);
    playSound("sfx_mini-jeu_trappe_dechet", this, true, 1);

    if (!this.isTrapAnimating) {
      this.isTrapAnimating = true;
      this.objectSource.anims.play("trap-open", true);

      this.time.delayedCall(1200, () => {
        this.objectSource.anims.play("trap-close", true);
        this.isTrapAnimating = false;
      });
    }

    this.tweens.add({
      ease: "Sine.easeInOut",
      targets: this.objectSource,
      x,
      duration: 200,
      onComplete: () => {
        const object = this.matter.add.gameObject(
          this.add.image(x, 30, "recyclingCentre", name + "-broken")
        );
        this.objects.push(object);
      },
    });

    if (this.firstStep) return;

    this.delayBetweenObjects -= 10;
    if (this.delayBetweenObjects < 100) this.delayBetweenObjects = 100;

    const delay =
      this.validatedObjects > 10
        ? this.delayBetweenObjects
        : Phaser.Math.Between(1500, 2500);
    this.time.delayedCall(delay, () => this.initObject());

    if (
      this.previousValidatedObjects !== this.validatedObjects &&
      [11, 25].includes(this.validatedObjects)
    ) {
      this.previousValidatedObjects = this.validatedObjects;

      this.currentYGravity += 0.02;
      this.matter.world.setGravity(0, this.currentYGravity);

      this.updateMessage(getUiMessage("recycling.faster"));
    }
  }

  updateCable() {
    const containerX = this.containersObject.x;

    this.leftCable.clear();
    this.leftCable.lineStyle(10, 0x060a11);
    const start = new Phaser.Math.Vector2(70, 250);
    const end = new Phaser.Math.Vector2(containerX - 45, 250);
    const control = new Phaser.Math.Vector2((containerX + 20) / 2, 300);
    const curve = new Phaser.Curves.QuadraticBezier(start, control, end);
    curve.draw(this.leftCable);

    const maskGraphicsLeft = this.make.graphics();
    maskGraphicsLeft.fillRect(70, 0, 500, 300);
    const maskLeft = maskGraphicsLeft.createGeometryMask();
    this.leftCable.setMask(maskLeft);

    this.rightCable.clear();
    this.rightCable.lineStyle(10, 0x060a11);
    const startRight = new Phaser.Math.Vector2(480, 250);
    const endRight = new Phaser.Math.Vector2(containerX + 45, 250);
    const controlRight = new Phaser.Math.Vector2((500 + containerX) / 2, 300);
    const curveRight = new Phaser.Curves.QuadraticBezier(
      startRight,
      controlRight,
      endRight
    );
    curveRight.draw(this.rightCable);

    const maskGraphicsRight = this.make.graphics();
    maskGraphicsRight.fillRect(0, 0, 480, 300);
    const maskRight = maskGraphicsRight.createGeometryMask();
    this.rightCable.setMask(maskRight);
  }

  updateWaters() {
    this.waterLevelLeft.y = this.containersObject.x / 2 + 155;
    this.waterLevelRight.y = -this.containersObject.x / 2 + 420;
  }

  moveContainers(stepX) {
    this.containersObject.body.setAccelerationX(stepX * 100);
    playSound("sfx_mini-jeu_roulement_broyeur", this, false, 0.5);
  }

  updateContainers() {
    const containerX = this.containersObject.x;

    if (this.goingRight) {
      const realStepX = containerX > 370 ? 0 : STEPX;
      this.moveContainers(realStepX);
    } else if (this.goingLeft) {
      const realStepX = containerX < 180 ? 0 : STEPX;
      this.moveContainers(-realStepX);
    } else {
      this.containersObject.body.setAccelerationX(0);
    }
  }

  updateWheels() {
    if (
      this.containersObject.body.velocity.x > 8 ||
      this.containersObject.body.velocity.x < -8
    ) {
      this.wheelLeft.play("wheel-" + (this.goingLeft ? "left" : "right"), true);
      this.wheelRight.play(
        "wheel-" + (this.goingLeft ? "left" : "right"),
        true
      );
      return;
    }
    this.wheelLeft.stop();
    this.wheelRight.stop();
  }

  updateObjects() {
    if (this.isCinematic) return;

    for (const object of this.objects) {
      if (object.y > 220) {
        object.setTint(0x777777);

        if (this.firstStep) this.tutoMissed();
        else this.notValidatedObjects++;

        continue;
      }

      if (
        object.y < 190 ||
        object.frame.name !== this.selectedObject + "-broken"
      )
        continue;

      if (
        object.x < this.containersObject.x - 45 ||
        object.x > this.containersObject.x + 45
      )
        continue;

      this.validatedObjects++;
      this.destroyObject(object);
      if (this.firstStep) this.tutoEnd();

      if (this.currentObject.scale === 1) {
        this.tweens.add({
          targets: this.currentObject,
          scale: 1.4,
          yoyo: 1,
          duration: 100,
        });
      }
    }
  }

  destroyObject(object) {
    this.objects = this.objects.filter((thisObject) => thisObject !== object);
    playSound("sfx_mini-jeu_broyeur", this, false, 1);
    this.createDebris(object.x, object.y, this.selectedObject);
    object.destroy();
  }

  update() {
    this.containersObject.body.setAccelerationX(0);
    this.updateCable();
    this.updateWaters();
    this.updateWheels();

    if (this.isCinematic) return;

    this.updateContainers();
    this.updateObjects();
  }

  createControls() {
    super.createControls();

    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      up: "up",
      down: "down",
      left: "left",
      right: "right",
      w: "up",
      z: "up",
      q: "left",
      a: "left",
      s: "down",
      d: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (["ArrowUp", "z", "w"].includes(event.key)) {
          this.up();
        } else if (["ArrowDown", "s"].includes(event.key)) {
          this.down();
        } else if (["ArrowLeft", "q", "a"].includes(event.key)) {
          this.left();
        } else if (["ArrowRight", "d"].includes(event.key)) {
          this.right();
        } else if (event.keyCode === 32) {
          this.handleAction();
        }
      },
      this
    );

    this.input.keyboard.on(
      "keyup",
      (event) => {
        if (["ArrowLeft", "q", "a"].includes(event.key)) {
          this.goingLeft = false;
        } else if (["ArrowRight", "d"].includes(event.key)) {
          this.goingRight = false;
        }
      },
      this
    );

    if (isMobileOrTablet()) {
      const arrowAlpha = 0.2;
      const arrowColor = 0xff5544;

      const fadeControl = (object) => {
        object.alpha = 0.5;
        this.tweens.add({
          targets: object,
          alpha: 0.1,
          duration: 500,
        });
      };

      this.add
        .bitmapText(40, 210, "FreePixel-16", "←", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const left = this.add
        .circle(40, 210, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.left();
          fadeControl(left);
        });

      this.add
        .bitmapText(90, 160, "FreePixel-16", "↑", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const up = this.add
        .circle(90, 160, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.handleAction();
          this.up();
          fadeControl(up);
        });

      this.add
        .bitmapText(90, 260, "FreePixel-16", "↓", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const down = this.add
        .circle(90, 260, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.handleAction();
          this.down();
          fadeControl(down);
        });

      this.add
        .bitmapText(140, 210, "FreePixel-16", "→", 16)
        .setOrigin(0.5, 0.5)
        .setDepth(100000);
      const right = this.add
        .circle(140, 210, 30, arrowColor)
        .setAlpha(arrowAlpha)
        .setDepth(100000)
        .setInteractive()
        .on("pointerdown", () => {
          this.right();
          fadeControl(right);
        });

      this.input.on("pointerup", () => {
        this.goingLeft = false;
        this.goingRight = false;
      });

      this.input.on("pointerdown", () => this.handleAction());
    }
  }
}

export class ObjectDebris extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, objectColor) {
    const color = Phaser.Math.RND.pick([0xcccccc, objectColor]);
    const width = Phaser.Math.Between(2, 6);
    const height = Phaser.Math.Between(2, 6);
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(true);
    this.body.setVelocityX(Phaser.Math.Between(-200, 200));
    this.body.setVelocityY(Phaser.Math.Between(-100, 100));

    this.init();
  }
  init() {
    this.scene.tweens.add({
      targets: this,
      duration: 800,
      scale: { from: 1, to: 0 },
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
