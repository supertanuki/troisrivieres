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
const CONTAINER_COLORS = [0x97cfe0, 0x97e0b7, 0xbbaa8e, 0x8f8ebb];
const SPEED_INCREMENT = getUrlParam("speedIncrement", 0.8);
const initialY = 252;
const initialX = 200;
const step = 80;
const GRAVITY = 0.1//0.05;
const STEPX = 3;

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
    this.containersObject = [];
    this.validatedObjects = 0;
    this.screwFrontPosition = 0;
    this.screwBackPosition = 0;
    this.conveyorPosition = 0;
    this.speed = SPEED_INCREMENT;
    this.screwBack = [];
    this.screwFront = [];
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

    for (let i = 0; i<4; i++) {
      const x = initialX + step * i;
      this.containers.push(
        this.add.rectangle(x, initialY, 80, 70, CONTAINER_COLORS[i]).setDepth(1)
      );
    }
    this.screwBack.push(this.add
      .tileSprite(initialX - 40, initialY - 35, 320, 19, "screw-2")
      .setOrigin(0, 1));
    this.screwFront.push(this.add
      .tileSprite(initialX - 40, initialY - 35, 320, 19, "screw-1")
      .setOrigin(0, 1)
      .setDepth(1));

    let i = 0;
    for (const name of OBJECTS_NAMES) {
      const x = initialX + step * i;
      this.containersObject.push({
        name,
        destroyed: 0,
        image: this.add.image(x, initialY, "recycling", name).setDepth(1),
        text: this.add.text(x - 6, initialY - 30, "0").setDepth(1),
      });
      i++;
    }

    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      console.log({
        event,
        bodyA: bodyA.gameObject,
        bodyB: bodyB.gameObject,
      });
      bodyB?.gameObject?.setTint(0x555555);
      bodyA?.gameObject?.setTint(0x555555);
      //this.moveContainersY(bodyB?.gameObject?.y)
    });

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

  down() {
    super.handleAction();
  }

  createDebris(x, y) {
    Array(Phaser.Math.Between(10, 30))
      .fill(0)
      .forEach((i) => new RockDebris(this, x, y));
  }

  initObject() {
    const name = Phaser.Math.RND.pick(OBJECTS_NAMES);
    const consoleId = Phaser.Math.Between(1, 4);

    const object = this.matter.add.gameObject(this.add.image(
      Phaser.Math.Between(150, 400),
      -30,
      "recycling",
      `${name}${name === "console" ? consoleId : ""}`
    ));
    //object.setVelocityY(0);
    this.objects.push(object);

    this.delayBetweenObjects -= 10;
    if (this.delayBetweenObjects < 100) this.delayBetweenObjects = 100;
    this.time.delayedCall(
      this.validatedObjects > 5
        ? this.delayBetweenObjects
        : Phaser.Math.Between(1800, 2500),
      () => this.initObject()
    );
  }

  moveContainersY(toY) {
    if (!toY) return;

    const containerY = this.containers[0].y;
    const stepY = toY - containerY;

    if (stepY >= 0 && this.containers[0].y + stepY < 100) return;

    for (const container of this.containers) container.y += stepY;
    for (const { image, text } of this.containersObject) {
      image.y += stepY;
      text.y += stepY;
    }
    for (const screwBack of this.screwBack) screwBack.y += stepY;
    for (const screwFront of this.screwFront) screwFront.y += stepY;
  }

  updateContainers() {
    // to optimize if there is one screw back and one screw front
    this.screwBackPosition--;
    for (const screwBack of this.screwBack) screwBack.setTilePosition(this.screwBackPosition, 0);
    this.screwFrontPosition++;
    for (const screwFront of this.screwFront) screwFront.setTilePosition(this.screwFrontPosition, 0);

    const containerX = this.containers[0].x;

    if (this.goingRight) {
      const realStepX = containerX > 400 ? 0 : STEPX;
      for (const container of this.containers) container.x += realStepX;
      for (const { image, text } of this.containersObject) {
        image.x += realStepX;
        text.x += realStepX;
      }
      for (const screwBack of this.screwBack) screwBack.x += realStepX;
      for (const screwFront of this.screwFront) screwFront.x += realStepX;
      /*
        for (const object of this.objects) {
          object.x -= 1;
          this.conveyor.x--;
        }
          */
    } else if (this.goingLeft) {
      const realStepX = containerX < -100 ? 0 : STEPX;
      for (const container of this.containers) container.x -= realStepX;
      for (const { image, text } of this.containersObject) {
        image.x -= realStepX;
        text.x -= realStepX;
      }
      for (const screwBack of this.screwBack) screwBack.x -= realStepX;
      for (const screwFront of this.screwFront) screwFront.x -= realStepX;
      /*
        for (const object of this.objects) {
          object.x += 1;
          this.conveyor.x++;
        }
        */
    }
  }

  updateObjects() {
    for (const object of this.objects) {
      //object.y = object.y + this.speed;
      if (object.y < 190 || object.y > 210) continue;

      for (const index in this.containersObject) {
        const containerObject = this.containersObject[index];
        if (object.frame.name !== containerObject.name) continue;

        const image = this.containersObject[index].image;
        if (object.x < image.x - 30 || object.x > image.x + 30) break;

        this.validatedObjects++;
        this.createDebris(object.x, object.y);
        this.objects = this.objects.filter((thisObject) => thisObject !== object);
        object.destroy();

        this.containersObject[index].destroyed++;
        this.containersObject[index].text.setText(
          `${this.containersObject[index].destroyed}`
        );

        if (image.scale === 1) {
          this.tweens.add({
            targets: image,
            scale: 2,
            yoyo: 1,
            duration: 100,
          });
        }

        break;
      }
    }
  }

  update() {
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
        } else if (event.key === "ArrowDown") {
          this.goingDown = false;
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
    //this.body.setAllowGravity(true);
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
