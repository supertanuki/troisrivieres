import isMobileOrTablet from "../Utils/isMobileOrTablet";
import MiniGameUi from "../UI/MiniGameUi";
import {
  gameDuration,
  getUrlParam,
  isDebug,
  urlParamHas,
} from "../Utils/debug";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { FONT_RESOLUTION } from "../UI/Message";
import { playMiniGameTheme, playSound, preloadSound } from "../Utils/music";

const OBJECTS_NAMES = ["console", "laptop", "phone"];
const OBJECTS_COLORS = {
  console: 0xbe4343,
  laptop: 0x6ec9c6,
  phone: 0xc09e5a,
};
const SPEED_INCREMENT = getUrlParam("speedIncrement", 0.8);
const initialY = 252;
const initialX = 200;
const GRAVITY = 0.05;
const STEPX = 5;

export default class RecyclingCentre extends MiniGameUi {
  constructor() {
    super({
      key: "recyclingCentre",
      physics: {
        matter: {
          debug: isDebug(),
          gravity: { y: GRAVITY },
        },
      },
    });

    this.delayBetweenObjects = 1000;
    this.objects = [];
    this.containers = [];
    this.containersObject = null;
    this.validatedObjects = 0;
    this.conveyorPosition = 0;
    this.speed = SPEED_INCREMENT;
    this.selectedObject = "console";
    this.warnings = 0;
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
    this.timeStart = Date.now();
    super.create();

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

    this.scale.setGameSize(550, 300);
    this.matter.world.setBounds(0, -100, 550, 400);

    this.add.image(275, 150, "recyclingCentre", "background");
    this.add.image(275, 0, "recyclingCentre", "track").setOrigin(0.5, 0);

    this.add.image(26, 300, "recyclingCentre", "water-level").setDepth(1);
    this.add.image(27, 192, "recyclingCentre", "water-tank").setDepth(1);

    this.add
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
      .sprite(0, -65, "recyclingCentre", "shredder-console-1")
      .setOrigin(0.5, 0)
      .setDepth(1);
    this.shredder.anims.play("shredder-console");
    const containerBase = this.add
      .image(0, 0, "recyclingCentre", "shredder")
      .setDepth(2);

    const wheelLeft = this.add
      .image(-50, 45, "recyclingCentre", "wheel")
      .setDepth(2);

    const wheelRight = this.add
      .image(50, 45, "recyclingCentre", "wheel")
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
      .image(0, 27, "recyclingCentre", "laptop-little")
      .setAlpha(0.4);

    this.containersObject = this.add.container(initialX, initialY, [
      wheelLeft,
      wheelRight,
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
    body.setAllowGravity(false);
    body.setMaxVelocity(200);
    body.setDamping(true);
    body.setDrag(0.01);

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

    this.cameras.main.fadeIn(2000, 0, 0, 0);

    /*
    this.time.addEvent({
      callback: () => this.startDiscussion("factory"),
      delay: 1000,
    });
    */
    this.afterTuto();
  }

  gameOver() {
    this.isCinematic = true;
    this.isGameOver = true;
    this.shredder.anims.stop();

    // todo : to remove
    this.updateMessage("Game over");
    return;

    dispatchUnlockEvents(["recyclingcentre_game_over"]);
    this.startDiscussion("recyclingCentre");
  }

  endGame() {
    gameDuration("recyclingCentre", this.timeStart);
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.stop();
      dispatchUnlockEvents(["recyclingcentre_after"]);
    });
  }

  listenDispatchedEvents(data) {
    if (eventsHas(data, "recyclingcentre_tuto_begin")) {
      this.tutoBegin();
    }
  }

  listenUnlockedEvents(data) {
    if (eventsHas(data, "recyclingcentre_after_tuto")) {
      this.afterTuto();
    }

    if (eventsHas(data, "recyclingcentre_end")) {
      this.endGame();
    }
  }

  tutoBegin() {
    this.isCinematic = false;
    this.firstStep = true;
  }

  tutoMissed() {
    dispatchUnlockEvents(["recyclingcentre_tuto_missed"]);
    this.isCinematic = true;
    this.startDiscussion("recyclingcentre");
  }

  tutoEnd() {
    this.isCinematic = true;
    dispatchUnlockEvents(["recyclingcentre_tuto_end"]);
    this.startDiscussion("recyclingcentre");
  }

  afterTuto() {
    this.isCinematic = false;
    this.firstStep = false;
    // start
    this.time.delayedCall(1500, () => this.initObject());
  }

  handleAction() {
    super.handleAction();
  }

  right() {
    super.handleAction();
    this.goingRight = true;
  }

  left() {
    super.handleAction();
    this.goingLeft = true;
  }

  getObjectNameByDirection(direction) {
    const index = OBJECTS_NAMES.indexOf(this.selectedObject);
    let nextIndex = index + direction;
    nextIndex = nextIndex > OBJECTS_NAMES.length - 1 ? 0 : nextIndex;
    nextIndex = nextIndex < 0 ? OBJECTS_NAMES.length - 1 : nextIndex;
    return OBJECTS_NAMES[nextIndex];
  }

  setSelectedObject(direction) {
    this.selectedObject = this.getObjectNameByDirection(direction);
    this.currentObject.setFrame(this.selectedObject);
    this.previousObject.setFrame(this.getObjectNameByDirection(-1) + "-little");
    this.nextObject.setFrame(this.getObjectNameByDirection(1) + "-little");
    playSound('sfx_mini-jeu_reussite', this, true, 0.1);

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
        });
      },
    });
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
    Array(Phaser.Math.Between(10, 30))
      .fill(0)
      .forEach((i) => new ObjectDebris(this, x, y, color));
  }

  initObject() {
    if (this.isCinematic) return;

    const warnings = Math.round(this.objects.length / 30);
    if (warnings > this.warnings) {
      this.warnings = warnings;
      this.updateWarnings(this.warnings);
    }

    if (this.objects.length > 120) {
      this.gameOver();
      return;
    }

    const name = Phaser.Math.RND.pick(OBJECTS_NAMES);
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

    this.delayBetweenObjects -= 10;
    if (this.delayBetweenObjects < 100) this.delayBetweenObjects = 100;
    this.time.delayedCall(
      this.validatedObjects > 10
        ? this.delayBetweenObjects
        : Phaser.Math.Between(1800, 2500),
      () => this.initObject()
    );
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

  moveContainers(stepX) {
    this.containersObject.body.setAccelerationX(stepX * 100);
    playSound("sfx_mini-jeu_roulement_broyeur", this, false, 0.5);
  }

  updateContainers() {
    const containerX = this.containersObject.x;

    if (this.goingRight) {
      const realStepX = containerX > 350 ? 0 : STEPX;
      this.moveContainers(realStepX);
    } else if (this.goingLeft) {
      const realStepX = containerX < 200 ? 0 : STEPX;
      this.moveContainers(-realStepX);
    } else {
      this.containersObject.body.setAccelerationX(0);
    }
  }

  updateObjects() {
    for (const object of this.objects) {
      if (object.y > 210) {
        object.setTint(0x555555);
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

      playSound('sfx_mini-jeu_broyeur', this, false, 1);
      this.validatedObjects++;
      this.createDebris(object.x, object.y, this.selectedObject);
      this.objects = this.objects.filter((thisObject) => thisObject !== object);
      object.destroy();

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

  update() {
    this.containersObject.body.setAccelerationX(0);
    this.updateCable();

    if (this.isCinematic) return;

    this.updateContainers();
    this.updateObjects();
  }

  createControls() {
    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      down: "down",
      left: "left",
      right: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (event.key === "ArrowDown") {
          this.down();
        } else if (event.key === "ArrowUp") {
          this.up();
        } else if (event.key === "ArrowLeft") {
          this.left();
        } else if (event.key === "ArrowRight") {
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
        if (event.key === "ArrowLeft") {
          this.goingLeft = false;
        } else if (event.key === "ArrowRight") {
          this.goingRight = false;
        }
      },
      this
    );

    if (isMobileOrTablet()) {
      const delta = 80;
      const arrowY = 225;

      const arrowStyle = {
        fontFamily: "DefaultFont",
        fontSize: "32px",
        fill: "#ffffff",
      };

      this.add
        .text(70, arrowY, "←", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(70, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(275, arrowY, "↑", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(275, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(480, arrowY, "→", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(480, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.input.on(
        "pointerdown",
        (pointer) => {
          if (pointer.x < 275 - delta) {
            this.left();
            return;
          }

          if (pointer.x > 275 + delta) {
            this.right();
            return;
          }

          this.handleAction();
        },
        this
      );
    }
  }
}

class ObjectDebris extends Phaser.GameObjects.Rectangle {
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
