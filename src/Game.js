import Phaser from "phaser";
import { sceneEventsEmitter, sceneEvents } from "./Events/EventsCenter";
import isMobile from "./Utils/isMobile";

import "./Sprites/Hero";
import "./Sprites/Farmer";
import "./Sprites/Miner";
import "./Sprites/Bird";
import { isCable, isFactory, isMine, isScene1 } from "./Utils/isDebug";

const DiscussionStatus = {
  NONE: "NONE",
  READY: "READY",
  STARTED: "STARTED",
  WAITING: "WAITING",
  INPROGRESS: "INPROGRESS",
};

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.controls = null;
    this.cursors = null;
    this.hero = null;
    this.joystick = null;

    this.goingLeft = false;
    this.goingRight = false;
    this.goingDown = false;
    this.goingUp = false;
    this.goingAngle = null;
    this.water = null;
    this.land = null;
    this.topObjects = null;

    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this.currentDiscussionSprite = null;
    this.birds = [];

    this.backgrounds = [];
  }

  preload() {
    this.load.scenePlugin(
      "AnimatedTiles",
      "plugins/AnimatedTiles.js",
      "animatedTiles",
      "animatedTiles"
    );
  }

  gotoScene1() {
    this.scene.pause("game");
    this.scene.start("cable-game");
  }

  gotoFactory() {
    this.scene.pause("game");
    this.scene.start("factory");
  }

  gotoMine() {
    this.scene.pause("game");
    this.scene.start("mine");
  }

  gotoCable() {
    this.scene.pause("game");
    this.scene.start("cable");
  }

  create() {
    if (isScene1()) {
      this.gotoScene1();
    }

    if (isFactory()) {
      this.gotoFactory();
    }

    if (isMine()) {
      this.gotoMine();
    }

    if (isCable()) {
      this.gotoCable();
    }

    this.scene.run("message");

    // Fade init
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.M)
      .on("down", () => {
        console.log("MINUS");
        this.cameras.main.zoomTo(this.cameras.main.zoom === 2 ? 1 : 0.6, 100);
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.P)
      .on("down", () => {
        console.log("PLUS");
        this.cameras.main.zoomTo(this.cameras.main.zoom === 0.6 ? 1 : 2, 100);
      });

    const ctrlR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    ctrlR.on("down", () => {
      const enabled = this.roads.visible
      this.roads.setVisible(!enabled);
      this.roadsBottom.setVisible(!enabled);

      this.bridgesShadow.setVisible(enabled);
      this.bridges.setVisible(enabled);
      this.bridgesTop.setVisible(enabled)
    });

    const ctrlA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    ctrlA.on("down", () => {
      this.landLessWater.setVisible(!this.landLessWater.visible);
      this.landLessWater.setActive(!this.landLessWater.visible);
      return;

      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        (cam, effect) => {
          this.gotoFactory();
        }
      );
    });

    // parallax backgrounds
    /*
    const { width, height } = this.scale;
    this.add.image(0, 0, "background-sky").setOrigin(0, 0).setScrollFactor(0);
    this.backgrounds.push({
      ratioX: 0.1,
      ratioY: 0.5,
      sprite: this.add
        .tileSprite(0, -100, width, height, "background-mountains")
        //.setPosition(0, 0)
        .setOrigin(0, 0)
        .setScrollFactor(0, 0),
    });
    this.backgrounds.push({
      ratioX: 0.2,
      ratioY: 0.8,
      sprite: this.add
        .tileSprite(0, -170, width, height, "background-middle")
        //.setPosition(0, 0)
        .setOrigin(0, 0)
        .setScrollFactor(0, 0),
    });
    */

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("Atlas_01", "tiles");
    map.createLayer("waterUp", tileset);

    this.land = map.createLayer("land", tileset);
    this.land.setCollisionByProperty({ collide: true });

    this.landLessWater = map.createLayer("landLessWater", tileset);
    this.landLessWater.setCollisionByProperty({ collide: true });
    this.landLessWater.setVisible(false);
    this.landLessWater.setActive(false);

    map.createLayer("landUp", tileset);
    this.bridgesShadow = map.createLayer("bridgesShadow", tileset);
    this.bridges = map.createLayer("bridges", tileset);
    this.bridgesTop = map.createLayer("bridgesTop", tileset);

    this.roadsBottom = map.createLayer("roadsBottom", tileset).setVisible(false);
    this.roads = map.createLayer("roads", tileset).setVisible(false);

    map.createLayer("bottom", tileset);

    this.sprites = map.createLayer("sprites", tileset);
    this.sprites.setCollisionByProperty({ collide: true });

    map.getObjectLayer("hero").objects.forEach((heroPosition) => {
      this.hero = this.add.hero(
        heroPosition.x,
        heroPosition.y,
        "mai",
        "idle-down-1"
      );
      this.hero.animateToDown();
      this.hero.stopAndWait();
    });

    map.getObjectLayer("farmer").objects.forEach((farmerPosition) => {
      this.farmer = this.add.farmer(
        farmerPosition.x,
        farmerPosition.y,
        "farmer"
      );
      this.farmer.on("pointerdown", this.handleAction, this);
    });

    /*
    let futurePosition;
    map.getObjectLayer("miner").objects.forEach((minerPosition) => {
      if ("miner_position1" === minerPosition.name) {
        this.miner = this.add.miner(minerPosition.x, minerPosition.y, "miner");
        this.miner.setImmovable(true);
        this.miner.setInteractive();
        this.miner.on("pointerdown", this.handleAction, this);
      } else {
        futurePosition = { x: minerPosition.x, y: minerPosition.y };
      }
    });
    this.miner.addFuturePosition(futurePosition);
    */

    this.topObjects = map.createLayer("top", tileset);
    this.topObjects.setCollisionByProperty({ collide: true });

    map.getObjectLayer("birds").objects.forEach((birdPosition) => {
      this.birds.push(this.add.bird(birdPosition.x, birdPosition.y));
    });

    const width = this.land.width;
    const height = this.land.height;
    const darkOverlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000)
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setVisible(false)
      .setActive(false);
    let night = false
    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.N)
      .on("down", () => {
        if (night) {
          night = false
          darkOverlay.setVisible(false);
          darkOverlay.setAlpha(0);
          return
        }

        night = true
        darkOverlay.setVisible(true);
        this.tweens.add({
          targets: darkOverlay,
          alpha: 0.7, // Passe à noir complet
          duration: 5000, // En 1 seconde
          ease: "Sine.easeInOut",
        });
      });

    this.animatedTiles.init(map);

    this.addCollisionManagement();

    this.cameras.main.startFollow(this.hero, true);
    this.createControls();
    this.addJoystickForMobile();
    //this.addControlsForMobile();

    sceneEventsEmitter.on(
      sceneEvents.DiscussionReady,
      this.handleDiscussionReady,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionStarted,
      this.handleDiscussionStarted,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionWaiting,
      this.handleDiscussionWaiting,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionEnded,
      this.handleDiscussionEnded,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionInProgress,
      this.handleDiscussionInProgress,
      this
    );

    sceneEventsEmitter.on(sceneEvents.EventsUnlocked, this.listenEvents, this);
  }

  listenEvents(data) {
    if (data.newUnlockedEvents.includes("mine_clothes_found")) {
      //this.landUpdated.setVisible(true);
      this.cameras.main.fadeOut(200, 0, 0, 0);

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        (cam, effect) => {
          this.time.delayedCall(500, () => {
            this.cameras.main.fadeIn(200, 0, 0, 0);
          });
        }
      );
    }
  }

  addCollisionManagement() {
    this.physics.add.collider(this.farmer, this.land, () => {
      this.farmer.changeDirection();
    });
    this.physics.add.collider(this.farmer, this.topObjects, () => {
      this.farmer.changeDirection();
    });
    this.physics.add.collider(this.farmer, this.water, () => {
      this.farmer.changeDirection();
    });

    this.physics.add.collider(this.farmer, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "farmer");
      this.farmer.readyToChat();
    });

    /*
    this.physics.add.collider(this.miner, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "miner");
      this.miner.readyToChat();
    });
    */

    this.physics.add.collider(this.birds, this.hero, (bird) => {
      bird.fly();
    });
    this.physics.add.collider(this.birds, this.farmer, (bird) => {
      bird.fly();
    });

    this.physics.add.collider(this.hero, this.water);
    this.physics.add.collider(this.hero, this.land);
    this.physics.add.collider(this.hero, this.topObjects);
    this.physics.add.collider(this.hero, this.sprites);
  }

  handleDiscussionReady(sprite) {
    if (this.currentDiscussionStatus !== DiscussionStatus.NONE) {
      return;
    }

    this.currentDiscussionStatus = DiscussionStatus.READY;
    this.currentDiscussionSprite = sprite;
    this.endWaitingToChatAfterDelay(sprite);
  }

  handleDiscussionInProgress() {
    this.currentDiscussionStatus = DiscussionStatus.INPROGRESS;
  }

  handleDiscussionStarted() {
    this.currentDiscussionStatus = DiscussionStatus.STARTED;
  }

  handleDiscussionWaiting() {
    this.currentDiscussionStatus = DiscussionStatus.WAITING;
  }

  handleDiscussionEnded(sprite) {
    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this[sprite].stopChatting();
    // move after delay
    this.time.addEvent({
      callback: () => {
        if (this.currentDiscussionStatus == DiscussionStatus.NONE) {
          this[sprite].move();
        }
      },
      delay: 2000,
    });
  }

  endWaitingToChatAfterDelay(sprite) {
    this.time.addEvent({
      callback: () => {
        if (this.currentDiscussionStatus === DiscussionStatus.READY) {
          this.currentDiscussionStatus = DiscussionStatus.NONE;
          this[sprite].stopChatting();
          this[sprite].move();
        }
      },
      delay: 2000,
    });
  }

  createControls() {
    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (event.key === "ArrowUp") {
          this.goingUp = true;
          this.goingDown = false;
        } else if (event.key === "ArrowDown") {
          this.goingDown = true;
          this.goingUp = false;
        } else if (event.key === "ArrowLeft") {
          this.goingLeft = true;
          this.goingRight = false;
        } else if (event.key === "ArrowRight") {
          this.goingRight = true;
          this.goingLeft = false;
        } else if (event.keyCode === 32) {
          this.handleAction();
        }
      },
      this
    );

    this.input.keyboard.on(
      "keyup",
      function (event) {
        if (event.key == "ArrowUp") {
          this.goingUp = false;
        } else if (event.key == "ArrowDown") {
          this.goingDown = false;
        } else if (event.key == "ArrowLeft") {
          this.goingLeft = false;
        } else if (event.key == "ArrowRight") {
          this.goingRight = false;
        }
      },
      this
    );
  }

  handleAction() {
    if (this.currentDiscussionStatus === DiscussionStatus.WAITING) {
      this.currentDiscussionStatus = DiscussionStatus.STARTED;
      sceneEventsEmitter.emit(sceneEvents.DiscussionContinuing);
      return;
    }

    if (this.currentDiscussionStatus === DiscussionStatus.READY) {
      this.currentDiscussionStatus = DiscussionStatus.STARTED;
      sceneEventsEmitter.emit(
        sceneEvents.DiscussionStarted,
        this.currentDiscussionSprite
      );
      return;
    }
  }

  addControlsForMobile() {
    if (!isMobile()) {
      return;
    }
    const screenWidth = Number(this.sys.game.config.width);
    const screenHeight = Number(this.sys.game.config.height);
    const deltaX = 150;
    const deltaY = 50;

    this.input.on(
      "pointerdown",
      (pointer) => {
        if (pointer.x < screenWidth / 2 - deltaX) {
          this.goingLeft = true;
          this.goingRight = false;
          return;
        }

        if (pointer.x > screenWidth / 2 + deltaX) {
          this.goingLeft = false;
          this.goingRight = true;
          return;
        }

        if (
          pointer.x > screenWidth / 2 - deltaX &&
          pointer.x < screenWidth / 2 + deltaX
        ) {
          if (pointer.y < screenHeight / 2 - deltaY) {
            this.goingLeft = false;
            this.goingRight = false;
            this.goingUp = true;
            this.goingDown = false;
            return;
          }

          if (pointer.y > screenHeight / 2 + deltaY) {
            this.goingLeft = false;
            this.goingRight = false;
            this.goingUp = false;
            this.goingDown = true;
            return;
          }
        }

        this.handleAction();
      },
      this
    );

    this.input.on("pointerup", (pointer) => {
      this.stopMoving();
    });
  }

  addJoystickForMobile() {
    if (!isMobile()) {
      return;
    }

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 200,
      radius: 100,
      base: this.add.circle(0, 0, 50, 0xff5544, 0.4),
      thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.3),
      dir: "8dir",
      forceMin: 16,
      enable: true,
      inputEnable: true,
      fixed: true,
    });

    // Make floating joystick
    this.input.on(
      "pointerdown",
      function (pointer) {
        this.joystick.setPosition(pointer.x, pointer.y);
        this.joystick.setVisible(true);
        this.handleAction();
      },
      this
    );

    this.joystick.on(
      "update",
      function () {
        this.goingAngle = this.joystick.angle;

        if (this.joystick.left) {
          this.goingLeft = true;
          this.goingRight = false;

          if (177.5 < this.goingAngle || -177.5 > this.goingAngle) {
            this.goingUp = false;
            this.goingDown = false;
          }
        } else if (this.joystick.right) {
          this.goingRight = true;
          this.goingLeft = false;

          if (22.5 > this.goingAngle && -22.5 < this.goingAngle) {
            this.goingUp = false;
            this.goingDown = false;
          }
        }

        if (this.joystick.up) {
          this.goingUp = true;
          this.goingDown = false;

          if (-67.5 > this.goingAngle && -112.5 < this.goingAngle) {
            this.goingRight = false;
            this.goingLeft = false;
          }
        } else if (this.joystick.down) {
          this.goingDown = true;
          this.goingUp = false;

          if (67.5 < this.goingAngle && 112.5 > this.goingAngle) {
            this.goingRight = false;
            this.goingLeft = false;
          }
        }
      },
      this
    );

    this.joystick.on(
      "pointerup",
      function () {
        this.joystick.setVisible(false);
        this.stopMoving();
      },
      this
    );
  }

  stopMoving() {
    this.goingLeft = false;
    this.goingRight = false;
    this.goingDown = false;
    this.goingUp = false;
    this.hero.stopAndWait();
  }

  update(time, delta) {
    if (!this.cursors || !this.hero) {
      return;
    }

    this.hero.resetVelocity();

    if (
      [
        DiscussionStatus.STARTED,
        DiscussionStatus.WAITING,
        DiscussionStatus.INPROGRESS,
      ].includes(this.currentDiscussionStatus)
    ) {
      this.hero.stopAndWait();
      return;
    }

    if (this.goingLeft) {
      this.hero.goLeft();
    } else if (this.goingRight) {
      this.hero.goRight();
    }

    if (this.goingUp) {
      this.hero.goUp();
    } else if (this.goingDown) {
      this.hero.goDown();
    }

    // Animation need to be done once
    if (this.goingUp) {
      this.hero.animateToUp();
    } else if (this.goingDown) {
      this.hero.animateToDown();
    } else if (this.goingRight) {
      this.hero.animateToRight();
    } else if (this.goingLeft) {
      this.hero.animateToLeft();
    }

    if (
      !this.goingDown &&
      !this.goingUp &&
      !this.goingRight &&
      !this.goingLeft
    ) {
      this.stopMoving();
    }

    // parallax backgrounds
    /*
    for (let i = 0; i < this.backgrounds.length; ++i) {
      const background = this.backgrounds[i];
      background.sprite.setTilePosition(
        this.cameras.main.scrollX * background.ratioX,
        this.cameras.main.scrollY * background.ratioY
      );
    }
      */
  }
}
