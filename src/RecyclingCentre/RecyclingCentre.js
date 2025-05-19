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
import { playMiniGameTheme } from "../Utils/music";

const OBJECTS_NAMES = ["console1", "laptop", "phone", "screen"];
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
    this.screwFrontPosition = 0;
    this.screwBackPosition = 0;
    this.conveyorPosition = 0;
    this.speed = SPEED_INCREMENT;
    this.selectedObject = "console1";
    this.warnings = 0;
  }

  preload() {
    super.preload();
    this.load.atlas(
      "recycling",
      "sprites/recycling.png",
      "sprites/recycling.json"
    );
    this.load.image("screw-1", "img/screw-1.png");
    this.load.image("screw-2", "img/screw-2.png");
  }

  create() {
    this.timeStart = Date.now();
    super.create();
    this.cameras.main.setBackgroundColor(0x444444);
    this.scale.setGameSize(550, 300);
    this.matter.world.setBounds(0, -100, 550, 400);

    this.add.rectangle(0, 220, 550, 100, 0x4e5050).setOrigin(0, 0);
    this.leftCable = this.add.graphics().setDepth(1);
    this.rightCable = this.add.graphics().setDepth(1);

    const containerBase = this.add.rectangle(0, 0, 80, 70, 0x111111).setDepth(1);
    this.screwBack = this.add.tileSprite(-40, -35, 80, 19, "screw-2").setOrigin(0, 1);
    this.screwFront = this.add.tileSprite(-40, -35, 80, 19, "screw-1").setOrigin(0, 1).setDepth(1);
    this.currentObject = this.add.image(0, 0, "recycling", this.selectedObject).setDepth(1);
    this.previousObject = this.add.image(0, -25, "recycling", "screen").setScale(0.5).setAlpha(0.4);
    this.nextObject = this.add.image(0, 25, "recycling", "laptop").setScale(0.5).setAlpha(0.4);

    const arrowStyle = {
      fontFamily: "DefaultFont",
      fontSize: "16px",
      fill: "#ffffff",
    };
    this.arrowUp = this.add
      .text(15, -25, "↑", arrowStyle)
      .setResolution(FONT_RESOLUTION)
      .setOrigin(0.5, 0.5)
      .setDepth(1);
    this.arrowDown = this.add
      .text(15, 25, "↓", arrowStyle)
      .setResolution(FONT_RESOLUTION)
      .setOrigin(0.5, 0.5)
      .setDepth(1);
      

    // Créer le container Phaser
    this.containersObject = this.add.container(initialX, initialY, [
      containerBase,
      this.screwBack,
      this.screwFront,
      this.currentObject,
      this.previousObject,
      this.nextObject,
      this.arrowUp,
      this.arrowDown,
    ]);

    this.physics.add.existing(this.containersObject);
    this.containersObject.setDepth(1);
    const body = this.containersObject.body;
    body.setAllowGravity(false);
    body.setMaxVelocity(200);
    body.setDamping(true);
    body.setDrag(0.01);


    /*
    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      console.log({
        event,
        bodyA: bodyA.gameObject,
        bodyB: bodyB.gameObject,
      });
      if (bodyB?.gameObject?.y < 50) return;
      bodyB?.gameObject?.setTint(0x555555);
      bodyA?.gameObject?.setTint(0x555555);
      //this.moveContainersY(bodyB?.gameObject?.y)
    });
    */

    this.createControls();
    this.startGame();
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
    
    // todo : to remove
    this.updateMessage('Game over');
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
    let nextIndex = index + direction
    nextIndex = nextIndex > OBJECTS_NAMES.length - 1 ? 0 : nextIndex;
    nextIndex = nextIndex < 0 ? OBJECTS_NAMES.length - 1 : nextIndex;
   return OBJECTS_NAMES[nextIndex];
  }

  setSelectedObject(direction) {
    this.selectedObject = this.getObjectNameByDirection(direction);
    this.currentObject.setFrame(this.selectedObject)
    this.previousObject.setFrame(this.getObjectNameByDirection(-1))
    this.nextObject.setFrame(this.getObjectNameByDirection(1))
  }

  up() {
    this.setSelectedObject(-1) 
  }

  down() {
    this.setSelectedObject(1) 
  }

  createDebris(x, y) {
    Array(Phaser.Math.Between(10, 30))
      .fill(0)
      .forEach((i) => new RockDebris(this, x, y));
  }

  initObject() {
    if (this.isCinematic) return;

    const warnings = Math.round(this.objects.length/30);
    if (warnings > this.warnings) {
      this.warnings = warnings;
      this.updateWarnings(this.warnings);
    }

    if (this.objects.length > 120) {
      this.gameOver();
      return;
    }

    const name = Phaser.Math.RND.pick(OBJECTS_NAMES);
    const consoleId = Phaser.Math.Between(1, 4);

    const object = this.matter.add.gameObject(
      this.add.image(
        Phaser.Math.Between(150, 400),
        -30,
        "recycling",
        `${name}${name === "console" ? consoleId : ""}`
      )
    );
    //object.setVelocityY(0);
    this.objects.push(object);

    this.delayBetweenObjects -= 10;
    if (this.delayBetweenObjects < 100) this.delayBetweenObjects = 100;
    this.time.delayedCall(
      this.validatedObjects > 10
        ? this.delayBetweenObjects
        : Phaser.Math.Between(1800, 2500),
      () => this.initObject()
    );
  }

  /*
  moveContainersY(toY) {
    if (!toY) return;

    const containerY = this.containers[0].y;
    const stepY = toY - containerY;

    if (stepY >= 0 && this.containers[0].y + stepY < 100) return;

    this.containerObject.y += stepY;
    this.screwBack.y += stepY;
    this.screwFront.y += stepY;
  }
    */

  updateCable() {
    const containerX = this.containersObject.x;

    this.leftCable.clear();
    this.leftCable.lineStyle(10, 0x000000);
    const start = new Phaser.Math.Vector2(10, 200);
    const end = new Phaser.Math.Vector2(containerX - 35, 250);
    const control = new Phaser.Math.Vector2((containerX - 10) / 2, 300);
    const curve = new Phaser.Curves.QuadraticBezier(start, control, end);
    curve.draw(this.leftCable);

    this.rightCable.clear();
    this.rightCable.lineStyle(10, 0x000000);
    const startRight = new Phaser.Math.Vector2(540, 200);
    const endRight = new Phaser.Math.Vector2(containerX + 35, 250);
    const controlRight = new Phaser.Math.Vector2(
      (540 + containerX + 80) / 2,
      300
    );
    const curveRight = new Phaser.Curves.QuadraticBezier(
      startRight,
      controlRight,
      endRight
    );
    curveRight.draw(this.rightCable);
  }

  moveContainers(stepX) {
    this.containersObject.body.setAccelerationX(stepX*100);
  }

  updateContainers() {
    this.screwBackPosition++;
    this.screwBack.setTilePosition(this.screwBackPosition, 0);
    this.screwFrontPosition--;
    this.screwFront.setTilePosition(this.screwFrontPosition, 0);

    const containerX = this.containersObject.x;

    if (this.goingRight) {
      const realStepX = containerX > 400 ? 0 : STEPX;
      this.moveContainers(realStepX)
    } else if (this.goingLeft) {
      const realStepX = containerX < 150 ? 0 : STEPX;
      this.moveContainers(-realStepX)
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

      if (object.y < 190 || object.frame.name !== this.selectedObject) continue;
      if (object.x < this.containersObject.x - 45 || object.x > this.containersObject.x + 45) continue;

      this.validatedObjects++;
      this.createDebris(object.x, object.y);
      this.objects = this.objects.filter(
        (thisObject) => thisObject !== object
      );
      object.destroy();

      if (this.currentObject.scale === 1) {
        this.tweens.add({
          targets: this.currentObject,
          scale: 2,
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

class RockDebris extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color = 0x555555, gravity = false) {
    color =
      color |
      Phaser.Math.RND.pick([0x555555, 0x222222, 0xff0000, 0x00ff00, 0x0000ff]);
    width = width || Phaser.Math.Between(2, 6);
    height = height || Phaser.Math.Between(2, 6);
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
