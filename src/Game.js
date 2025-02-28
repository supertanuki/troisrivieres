import Phaser from "phaser";
import { sceneEventsEmitter, sceneEvents } from "./Events/EventsCenter";
import isMobileOrTablet from "./Utils/isMobileOrTablet";
import { isCable, isFactory, isMine, isScene1, urlParamHas } from "./Utils/isDebug";

import "./Sprites/Hero";
import "./Sprites/Farmer";
import "./Sprites/Miner";
import "./Sprites/Bird";

const DiscussionStatus = {
  NONE: "NONE",
  READY: "READY",
  STARTED: "STARTED",
  WAITING: "WAITING",
  INPROGRESS: "INPROGRESS",
};

const nightColor = 0x000055;

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
    this.pointsCollider = [];
  }

  preload() {
    this.load.scenePlugin(
      "AnimatedTiles",
      "plugins/AnimatedTiles.js",
      "animatedTiles",
      "animatedTiles"
    );
  }

  gotoScene(scene) {
    this.scene.pause("game");
    this.scene.start(scene);
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
    this.scale.setGameSize(450, 250);

    if (urlParamHas('nostart')) {
      this.start();
      return
    }

    const text = this.add
      .text(225, 125, "Démarrer", { font: "32px Courier", fill: "#ffffff" })
      .setOrigin(0.5, 0.5);
    text.setInteractive({ useHandCursor: true });
    text.on("pointerdown", () => {
      text.setText("Chargement...")
      text.disableInteractive(true);

      this.time.delayedCall(100, () => {
        text.destroy();
        this.start();
      });
    });
  }

  start() {
    if (urlParamHas('dreamMine')) {
      this.gotoScene('dream-mine');
      return;
    }

    if (isScene1()) {
      this.gotoScene1();
      return;
    }

    if (isFactory()) {
      this.gotoFactory();
      return;
    }

    if (isMine()) {
      this.gotoMine();
      return;
    }

    if (isCable()) {
      this.gotoCable();
      return;
    }

    this.scene.run("message");

    // Fade init
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    //this.cameras.main.zoomTo(1.4)

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.M)
      .on("down", () => {
        console.log("MINUS");
        this.cameras.main.zoomTo(this.cameras.main.zoom === 1.4 ? 1 : 0.6, 100);
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.P)
      .on("down", () => {
        console.log("PLUS");
        this.cameras.main.zoomTo(this.cameras.main.zoom === 0.6 ? 1 : 1.4, 100);
      });

    const ctrlR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    ctrlR.on("down", () => {
      const enabled = this.roads.visible;
      this.roads.setVisible(!enabled);
      this.roadsBottom.setVisible(!enabled);

      this.bridgesShadow.setVisible(enabled);
      this.bridges.setVisible(enabled);
      this.bridgesTop.setVisible(enabled);
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

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).on("down", () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
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

    this.roadsBottom = map
      .createLayer("roadsBottom", tileset)
      .setVisible(false);
    this.roads = map.createLayer("roads", tileset).setVisible(false);

    this.bottomObjects = map
      .createLayer("bottom", tileset)
      .setCollisionByProperty({ collide: true });

    this.bottomObjects2 = map
      .createLayer("bottom2", tileset)
      .setCollisionByProperty({ collide: true });

    this.sprites = map.createLayer("sprites", tileset);
    this.sprites.setCollisionByProperty({ collide: true });

    // Add trees base
    this.anims.create({
      key: 'sapin',
      frames: this.anims.generateFrameNames('trees', { start: 1, end: 2, prefix: 'sapin-' }),
      repeat: -1,
      frameRate: 1
    });
    const treesLayer = map.getObjectLayer('trees')
    // sort tress in order to draw trees from top to down
    treesLayer.objects.sort((a, b) => a.y - b.y);
    treesLayer.objects.forEach(treeObject => {
      this.add.image(treeObject.x, treeObject.y - 8, "trees", `${treeObject.name}-base`);
    });

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




    this.bridgesTop = map.createLayer("bridgesTop", tileset);

    this.obstacles = map
      .createLayer("obstacles", tileset)
      .setCollisionByProperty({ collide: true })
      .setVisible(false);

    this.topObjects = map
      .createLayer("top", tileset)
      .setCollisionByProperty({ collide: true });

    // smooth collision management (barrière...)
    this.topObjects.forEachTile((tile) => {
      if (tile.properties?.pointCollide === true) {
        this.pointsCollider.push(
          this.physics.add
            .sprite(tile.getCenterX(), tile.getCenterY(), null)
            .setSize(10, 1)
            .setImmovable(true)
            .setVisible(false)
        );
      }
    });

    this.topObjects2 = map
    .createLayer("top2", tileset)
    .setCollisionByProperty({ collide: true });

    // Add trees top after hero was created
    treesLayer.objects.forEach(treeObject => {
      const tree = this.physics.add.sprite(treeObject.x, treeObject.y - 40, "trees", `${treeObject.name}-1`)
      tree.anims.play(treeObject.name);
      this.pointsCollider.push(
        this.physics.add
          .sprite(treeObject.x, treeObject.y - 16, null)
          .setSize(16, 1)
          .setImmovable(true)
          .setVisible(false)
      );
    });

    map.createLayer("bottomStaticTrees", tileset)
    map.createLayer("staticTrees", tileset)

    map.getObjectLayer("birds").objects.forEach((birdPosition) => {
      this.birds.push(this.add.bird(birdPosition.x, birdPosition.y));
    });

    const ctrlV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    ctrlV.on("down", () => {
      map.getObjectLayer("heroInVillage").objects.forEach((heroPositionInVillage) => {
        this.hero.setPosition(
          heroPositionInVillage.x,
          heroPositionInVillage.y
        );
      });
    });

    const ctrlF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    ctrlF.on("down", () => {
      map.getObjectLayer("hero").objects.forEach((heroPosition) => {
        this.hero.setPosition(
          heroPosition.x,
          heroPosition.y
        );
      });
    });

    this.addNightMode()

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

    this.music = this.sound.add("village-theme");
    this.music.loop = true;
    this.music.play();
  }

  addNightCircle(radius) {
    const nightOverlay = this.add.graphics();
    nightOverlay.fillStyle(nightColor, 0.3);
    nightOverlay.fillRect(0, 0, this.scale.width, this.scale.height);
    nightOverlay.setScrollFactor(0, 0);
    nightOverlay.setVisible(false);

    const maskGraphics = this.make.graphics();
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillCircle(225, 125, radius);
    maskGraphics.setScrollFactor(0, 0);
    
    const mask = maskGraphics.createGeometryMask();
    mask.invertAlpha = true;
    nightOverlay.setMask(mask);

    return nightOverlay
  }

  addNightMode() {
    this.nightOverlay1 = this.addNightCircle(50)
    this.nightOverlay2 = this.addNightCircle(70)
    this.nightOverlay3 = this.addNightCircle(90)

    const darkOverlay = this.add
      .rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, nightColor)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setAlpha(0)
      .setVisible(true)

    let night = false;
    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.N)
      .on("down", () => {
        if (night) {
          night = false;
          darkOverlay.setVisible(false);
          this.nightOverlay1.setVisible(false);
          this.nightOverlay2.setVisible(false);
          this.nightOverlay3.setVisible(false);
          return;
        }

        night = true;
        darkOverlay.setAlpha(0);
        darkOverlay.setVisible(true);
        this.tweens.add({
          targets: darkOverlay,
          alpha: 0.3,
          duration: 3000,
          ease: "Sine.easeInOut",
        });

        this.nightOverlay1.setAlpha(0);
        this.nightOverlay1.setVisible(true);
        this.tweens.add({
          targets: this.nightOverlay1,
          alpha: 1,
          duration: 3000,
          ease: "Sine.easeInOut",
        });

        this.nightOverlay2.setAlpha(0);
        this.nightOverlay2.setVisible(true);
        this.tweens.add({
          targets: this.nightOverlay2,
          alpha: 1,
          duration: 3000,
          ease: "Sine.easeInOut",
        });

        this.nightOverlay3.setAlpha(0);
        this.nightOverlay3.setVisible(true);
        this.tweens.add({
          targets: this.nightOverlay3,
          alpha: 1,
          duration: 3000,
          ease: "Sine.easeInOut",
        });
      });
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
    this.physics.add.collider(this.hero, this.obstacles);
    this.physics.add.collider(this.hero, this.topObjects);
    this.physics.add.collider(this.hero, this.topObjects2);
    this.physics.add.collider(this.hero, this.bottomObjects);
    this.physics.add.collider(this.hero, this.bottomObjects2);
    this.physics.add.collider(this.hero, this.sprites);
    this.physics.add.collider(this.hero, this.pointsCollider);
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
    if (!isMobileOrTablet()) {
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
    if (!isMobileOrTablet()) {
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
