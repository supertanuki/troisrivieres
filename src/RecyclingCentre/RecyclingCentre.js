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

const COMPONENTS = {
  blue: "component-blue",
  violet: "component-violet",
  yellow: "component-yellow",
  red: "component-red",
};

const OBJECTS_NAMES = ["console1", "laptop", "phone", "screen"];
const SPEED_INCREMENT = getUrlParam("speedIncrement", 0.8);
const initialY = 252;
const initialX = 275;
const step = 90;
const GRAVITY = 7;

export default class RecyclingCentre extends MiniGameUi {
  constructor() {
    super({
      key: "recyclingCentre",
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
    this.waterLevel = 100;
  }

  preload() {
    super.preload();
    this.load.atlas(
      "recycling",
      "sprites/recycling.png",
      "sprites/recycling.json"
    );
    this.load.atlas("factory", "sprites/factory.png", "sprites/factory.json");
    this.load.image("screw-1", "img/screw-1.png");
    this.load.image("screw-2", "img/screw-2.png");
  }

  create() {
    this.timeStart = Date.now();
    super.create();
    this.cameras.main.setBackgroundColor(0x777777);
    this.scale.setGameSize(550, 300);

    this.add.rectangle(0, 220, 550, 100, 0x4e5050).setOrigin(0, 0);
    this.water = this.add.rectangle(0, 300, 550, 50, 0x0dfae7).setOrigin(0, 1);

    this.conveyor = this.add
      .tileSprite(520, 0, 220, 480, "factory", "tapis")
      .setRotation(1.5708)
      .setOrigin(0, 0);

    this.screwBack = this.add
      .tileSprite(0, 201, 550, 19, "screw-2")
      .setOrigin(0, 0);
    this.screwFront = this.add
      .tileSprite(0, 201, 550, 19, "screw-1")
      .setOrigin(0, 0)
      .setDepth(1);

    let i = 0;
    for (const name in COMPONENTS) {
      this.containers.push(
        this.add.image(initialX + step * i, initialY, "factory", `tray-${name}`)
      );
      i++;
    }

    i = 0;
    for (const name of OBJECTS_NAMES) {
      const x = initialX + step * i;
      this.containersObject.push({
        name,
        destroyed: 0,
        image: this.add.image(x, initialY, "recycling", name),
        text: this.add.text(x - 6, initialY - 30, "0"),
      });
      i++;
    }

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
    this.waterLevel += 10;
    if (this.waterLevel > 100) this.waterLevel = 100;
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

    const object = this.physics.add.sprite(
      Phaser.Math.Between(100, 400),
      -30,
      "recycling",
      `${name}${name === "console" ? consoleId : ""}`
    );
    //object.setVelocityY(50);
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

  update() {
    if (this.isCinematic) return;

    this.screwBackPosition--;
    this.screwBack.setTilePosition(this.screwBackPosition, 0);
    this.screwFrontPosition++;
    this.screwFront.setTilePosition(this.screwFrontPosition, 0);

    this.conveyorPosition -= this.speed;
    this.conveyor.setTilePosition(this.conveyorPosition, 0);

    if (this.waterLevel > 1) {
      if (this.goingRight) {
        for (const container of this.containers) container.x += 3;
        for (const { image, text } of this.containersObject) {
          image.x += 3;
          text.x += 3;
        }
        /*
          for (const object of this.objects) {
            object.x -= 1;
            this.conveyor.x--;
          }
            */
      } else if (this.goingLeft) {
        for (const container of this.containers) container.x -= 3;
        for (const { image, text } of this.containersObject) {
          image.x -= 3;
          text.x -= 3;
        }
        /*
          for (const object of this.objects) {
            object.x += 1;
            this.conveyor.x++;
          }
          */
      }
    }

    for (const object of this.objects) {
      object.y = object.y + this.speed;
      if (object.y < 200) continue;

      this.validatedObjects++;
      this.createDebris(object.x, object.y);
      object.destroy();
      this.objects = this.objects.filter((thisObject) => thisObject !== object);

      for (const index in this.containersObject) {
        const containerObject = this.containersObject[index];
        if (object.frame.name !== containerObject.name) continue;

        const image = this.containersObject[index].image;
        if (object.x < image.x - 30 || object.x > image.x + 30) break;

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

    if (this.waterLevel < 20) {
      this.updateMessage(
        "Niveau d'eau faible, appuie sur espace pour recharger !"
      );
    }

    if (this.waterLevel > 0) {
      this.waterLevel -= 0.25;
      this.water.height = (50 * this.waterLevel) / 100;
      this.water.y = 300 + 50 - this.water.height;
    }
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
