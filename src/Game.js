import Phaser from "phaser";
import { sceneEventsEmitter, sceneEvents } from "./Events/EventsCenter";
import { urlParamHas } from "./Utils/isDebug";

import "./Sprites/Django";
import "./Sprites/Koko";
import "./Sprites/SleepingGuy";
import "./Sprites/TwoWomen";
import "./Sprites/Baby";
import "./Sprites/Nono";
import "./Sprites/Bino";
import "./Sprites/Cat";
import "./Sprites/Dog";
import "./Sprites/Escargot";
import "./Sprites/Cow";
import "./Sprites/Veal";
import "./Sprites/Fisherman";
import "./Sprites/Miner";
import "./Sprites/Ball";
import "./Sprites/Girl";
import "./Sprites/Boy";
import "./Sprites/TwoGuys";
import "./Sprites/Bike";

import { Hero } from "./Sprites/Hero";
import { DiscussionStatus } from "./Utils/discussionStatus";
import { eventsHas } from "./Utils/events";
import { FONT_RESOLUTION, FONT_SIZE } from "./UI/Message";
import { createHeroAnims } from "./Sprites/HeroAnims";
import { createTrees } from "./Village/trees";
import { addDebugControls } from "./Village/debugControls";
import { addBirds, lessBirds } from "./Village/birds";
import { addJoystickForMobile, createControls } from "./Village/controls";
import { addCollisionManagement } from "./Village/collisionManagement";
import { addButterflies, lessButterflies } from "./Village/butterflies";
import { switchNight } from "./Village/night";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.controls = null;
    this.cursors = null;

    /** @type {Hero}  */
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
    this.butterflies = [];
    this.pointsCollider = [];
    this.heroPositions = {};
    this.maskNightOverlays = [];
    this.darkOverlay = null;
    this.nightOverlays = [];
    this.bikes = [];

    this.isCinematic = false;
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
    this.scene.launch(scene);
  }

  debugFactory() {
    this.scene.pause("game");
    this.scene.launch("factory");
  }

  debugMine() {
    this.scene.pause("game");
    this.scene.launch("mine");
  }

  gotoMine() {
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.launch("mine");
      this.sleepGame();
    });
  }

  gotoCable() {
    this.scene.pause("game");
    this.scene.launch("cable");
  }

  resetGameSize() {
    this.scale.setGameSize(450, 250);
  }

  create() {
    this.resetGameSize();

    if (urlParamHas("nostart")) {
      this.startGame();
      return;
    }

    const text = this.add
      .text(225, 125, "Démarrer", {
        fontFamily: "DefaultFont",
        fontSize: FONT_SIZE,
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.5)
      .setResolution(FONT_RESOLUTION);
    text.setInteractive({ useHandCursor: true });
    text.on("pointerdown", () => {
      text.disableInteractive(true);
      text.setText("Dans une forêt paisible,\nloin du fracas des villes...");

      this.time.delayedCall(500, () => {
        text.destroy();
        this.startGame();
      });
    });
  }

  startGame() {
    if (urlParamHas("dreamMine")) {
      this.gotoScene("mine-nightmare");
      return;
    }

    if (urlParamHas("factory")) {
      this.debugFactory();
      return;
    }

    if (urlParamHas("mine")) {
      this.debugMine();
      return;
    }

    this.scene.run("message");

    // Fade init
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // parallax mine backgrounds // @todo : load it when mine access is unlocked
    this.add
      .image(0, 0, "mineLand", "background")
      .setOrigin(0, 0)
      .setScrollFactor(0.05, 0.1);

    this.add
      .image(400, 0, "mineLand", "background")
      .setOrigin(0, 0)
      .setScrollFactor(0.05, 0.1);

    this.add
      .image(270, 120, "mineLand", "mine")
      .setOrigin(0, 0)
      .setScrollFactor(0.14, 0.32);

    this.add
      .image(1692, 231, "mineLand", "mine-machine")
      .setOrigin(0, 0)
      .setScrollFactor(0.7, 0.7);

    this.map = this.make.tilemap({ key: "map" });
    this.tileset = this.map.addTilesetImage("Atlas_01", "tiles");
    this.map.createLayer("waterUp", this.tileset).setDepth(10);

    this.land = this.map
      .createLayer("land", this.tileset)
      .setDepth(20)
      .setCollisionByProperty({ collide: true })
      .setCullPadding(2, 2);

    this.map.createLayer("landUp", this.tileset).setDepth(40);
    this.bridgesShadow = this.map
      .createLayer("bridgesShadow", this.tileset)
      .setDepth(50);
    this.bridges = this.map.createLayer("bridges", this.tileset).setDepth(60);

    this.bottomObjects = this.map
      .createLayer("bottom", this.tileset)
      .setDepth(70)
      .setCollisionByProperty({ collide: true });

    this.potagerBottom = this.map
      .createLayer("potagerBottom", this.tileset)
      .setDepth(80);

    createTrees(this);

    this.anims.create({
      key: "tent",
      frames: this.anims.generateFrameNames("sprites", {
        start: 1,
        end: 5,
        prefix: "tent-",
      }),
      repeat: 0,
      frameRate: 10,
    });

    this.map.getObjectLayer("hero").objects.forEach((heroPosition) => {
      this.heroPositions[heroPosition.name] = {
        x: heroPosition.x,
        y: heroPosition.y,
      };

      if (heroPosition.name !== "hero") {
        return;
      }

      this.tent = this.add
        .sprite(heroPosition.x + 2, heroPosition.y - 2, "sprites", "tent-1")
        .setDepth(100);
      this.hero = this.add.hero(heroPosition.x, heroPosition.y).setDepth(100);
      this.hero.stopAndWait();
      createHeroAnims(this.anims);
    });

    this.map.getObjectLayer("sprites").objects.forEach((spriteObject) => {
      if (spriteObject.name === "django") {
        this.django = this.add.django(spriteObject.x, spriteObject.y);
        this.django.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "koko") {
        this.koko = this.add.koko(spriteObject.x, spriteObject.y);
        this.koko.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "sleepingGuy") {
        this.sleepingGuy = this.add.sleepingGuy(spriteObject.x, spriteObject.y);
        this.sleepingGuy.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "twoGuys") {
        this.twoGuys = this.add.twoGuys(spriteObject.x, spriteObject.y);
        this.twoGuys.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "twoWomen") {
        this.twoWomen = this.add.twoWomen(spriteObject.x, spriteObject.y);
        this.twoWomen.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "baby") {
        this.baby = this.add.baby(spriteObject.x, spriteObject.y);
        this.baby.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "nono") {
        this.nono = this.add.nono(spriteObject.x, spriteObject.y);
        this.nono.on("pointerdown", this.handleAction, this);
        this.nono.setVisible(false);
        this.nono.body.checkCollision.none = true;
      }

      if (spriteObject.name === "bino") {
        this.bino = this.add.bino(spriteObject.x, spriteObject.y);
        this.bino.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "binoCleaningRoad") {
        this.bino.setCleaningRoadPosition(spriteObject.x, spriteObject.y);
      }

      if (spriteObject.name === "mino") {
        this.fisherman = this.add.fisherman(spriteObject.x, spriteObject.y);
        this.fisherman.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "cat") {
        this.cat = this.add.cat(spriteObject.x, spriteObject.y);
        this.cat.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "dog") {
        this.dog = this.add.dog(spriteObject.x, spriteObject.y);
        this.dog.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "escargot") {
        this.escargot = this.add.escargot(spriteObject.x, spriteObject.y);
        this.escargot.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "cow") {
        this.cow = this.add.cow(spriteObject.x, spriteObject.y);
        this.cow.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "veal") {
        this.veal = this.add.veal(spriteObject.x, spriteObject.y);
      }

      if (spriteObject.name === "miner") {
        this.miner = this.add.miner(spriteObject.x, spriteObject.y);
        this.miner.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "ball") {
        this.ball = this.add.ball(spriteObject.x, spriteObject.y);
      }

      if (spriteObject.name === "girl") {
        this.girl = this.add.girl(spriteObject.x, spriteObject.y);
      }

      if (spriteObject.name === "boy") {
        this.boy = this.add.boy(spriteObject.x, spriteObject.y);
        this.boy.on("pointerdown", this.handleAction, this);
      }

      if (spriteObject.name === "bike") {
        this.bikes.push(this.add.bike(spriteObject.x, spriteObject.y));
      }

      if (spriteObject.name === "boySad") {
        this.boy.setSadPosition(spriteObject.x, spriteObject.y);
      }

      if (spriteObject.name === "girlSad") {
        this.girl.setSadPosition(spriteObject.x, spriteObject.y);
      }
    });

    this.bridgesTop = this.map
      .createLayer("bridgesTop", this.tileset)
      .setDepth(110);

    this.obstacles = this.map
      .createLayer("obstacles", this.tileset)
      .setCollisionByProperty({ collide: true })
      .setVisible(false);

    this.topObjects = this.map
      .createLayer("top", this.tileset)
      .setDepth(120)
      .setCollisionByProperty({ collide: true });

    this.potagerTop = this.map
      .createLayer("potagerTop", this.tileset)
      .setDepth(120)
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

    addBirds(this);
    addButterflies(this);

    this.animatedTiles.init(this.map);

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.startFollow(this.hero, true);

    addDebugControls(this);
    addCollisionManagement(this);
    createControls(this);
    addJoystickForMobile(this);
    this.addEventsListeners();

    if (!urlParamHas("nomusic")) {
      this.music = this.sound.add("village-theme");
      this.music.loop = true;
      this.music.play();
    }

    if (!urlParamHas("nostart")) this.intro();
  }

  intro() {
    this.isIntro = true;
    this.isCinematic = true;
    this.hero.setVisible(false);
    this.time.addEvent({
      callback: () => {
        this.goingDown = true;
        this.hero.animateToDown();
        this.hero.setVisible(true);
      },
      delay: 1000,
    });

    this.events.on("update", () => {
      if (!this.isIntro) return;

      if (this.goingDown) {
        this.hero.slowDown();
      }

      if (this.hero.y > this.heroPositions["hero"].y + 5) {
        this.goingDown = false;
        this.tent.anims.play("tent", true);
        this.tent.on("animationcomplete", () => {
          this.tent.destroy();
          this.isCinematic = false;
          this.isIntro = false;
        });
      }
    });
  }

  hidePotager() {
    this.potagerBottom.setVisible(false);
    this.potagerTop.setVisible(false);
    this.potagerTop.forEachTile(tile => {
      tile.setCollision(false, false, false, false);
    });

    this.potagerNoMore = this.map
      .createLayer("potagerNoMore", this.tileset)
      .setDepth(80);
  }

  hideBikes() {
    this.bikes.forEach(bike => {
      bike.setVisible(false);
      bike.body.checkCollision.none = true;
    })
  }

  toggleRoads() {
    if (!this.roads) {
      this.roadsBottom = this.map
        .createLayer("roadsBottom", this.tileset)
        .setDepth(95)
        .setVisible(false);
      this.roads = this.map
        .createLayer("roads", this.tileset)
        .setDepth(96)
        .setVisible(false);
      this.roadsTop = this.map
        .createLayer("roadsTop", this.tileset)
        .setDepth(97)
        .setVisible(false);
    }

    const enabled = this.roads.visible;
    this.roads.setVisible(!enabled);
    this.roadsBottom.setVisible(!enabled);
    this.roadsTop.setVisible(!enabled);
    this.bridgesShadow.setVisible(enabled);
    this.bridges.setVisible(enabled);
    this.bridgesTop.setVisible(enabled);
  }

  setHeroPosition(positionName) {
    const position = this.heroPositions[positionName];
    this.hero.setPosition(position.x, position.y);
  }

  firstSleep() {
    this.isCinematic = true;
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.time.delayedCall(1000, () => this.endFirstSleep())
  }

  toggleSprites(state, withDjango = false) {
    [
      this.koko,
      this.sleepingGuy,
      this.twoGuys,
      this.baby,
      this.twoWomen,
      this.bino,
      this.fisherman,
      this.dog,
      this.escargot,
      this.cat,
      this.boy,
      this.girl,
      this.ball,
      ...(withDjango ? [this.django] : []),
    ].forEach((sprite) => {
      sprite.setVisible(state);
      sprite.setActive(state);
      sprite.body.checkCollision.none = !state;
    });

    this.birds.forEach((bird) => {
      bird.setVisible(state);
      bird.setActive(state);
      bird.body.checkCollision.none = !state;
    });

    this.butterflies.forEach((butterfly) => {
      butterfly.setVisible(state);
      butterfly.setActive(state);
    });
  }

  showRiverPolluted() {
    if (this.riverPolluted) return;
    this.riverPolluted = this.map.createLayer("riverPolluted", this.tileset).setDepth(45);
    this.landUpRiverPolluted = this.map.createLayer("landUpRiverPolluted", this.tileset).setDepth(46);
    this.bridgesShadowPolluted = this.map.createLayer("bridgesShadowPolluted", this.tileset).setDepth(51);
  }

  villageStateAfterFirstSleep() {
    this.showRiverPolluted();
    this.toggleSprites(true);
    this.boy.setSad();
    this.girl.setSad();
    this.fisherman.setSad();
    this.nono.setVisible(true);
    this.nono.body.checkCollision.none = false;
  }

  endFirstSleep() {
    this.isCinematic = true;
    this.hero.slowRight();
    this.hero.animateToRight();
    this.setHeroPosition("heroDjango");
    switchNight(this);

    this.villageStateAfterFirstSleep();

    sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, ["first_sleep"]);
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");

    this.time.delayedCall(1000, () => {
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.time.delayedCall(800, () => {
        this.isCinematic = false;
        this.handleAction();
      })
    });
  }

  afterMineNightmare() {
    this.wakeGame();
    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this.hero.stopAndWait();
    this.isCinematic = true;
    switchNight(this);
    this.villageStateAfterFirstSleep();
    this.toggleRoads();
    this.hideBikes();
    this.hidePotager();
    this.bino.setCleaningRoad();
    
    this.setHeroPosition("heroDjango");
    this.hero.slowRight();
    this.hero.animateToRight();

    this.toggleSprites(true, true);
    lessBirds(this);
    lessButterflies(this);
    
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");

    this.time.delayedCall(2000, () => {
      this.isCinematic = false;
      this.handleAction();
    });
  }

  afterMine() {
    this.wakeGame();
    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this.night = true;
    this.darkOverlay.setVisible(true);
    this.nightOverlays.forEach(nightOverlay => nightOverlay.setVisible(true));
    this.isCinematic = true;
    this.setHeroPosition("heroMine");
    this.hero.slowLeft();
    this.hero.animateToLeft();
    this.toggleSprites(false, true);

    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
        if (progress !== 1) return;
        this.setHeroPosition("heroAfterMine");
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.time.delayedCall(2200, () => {
          this.hero.slowUp();
          this.hero.animateToUp();

          this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
            if (progress !== 1) return;
            this.time.delayedCall(2000, () => {
              this.scene.launch("mine-nightmare");
              this.sleepGame();
            });
          });
        })
      });
    });
  }

  sleepGame() {
    this.scene.sleep("game");
    this.scene.sleep("message");
  }

  wakeGame() {
    this.scene.wake("game");
    this.scene.wake("message");
    this.resetGameSize();
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  addEventsListeners() {
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
  };

  listenEvents(data) {
    if (eventsHas(data, "miner_first_met")) {
      this.toggleSprites(false);
      switchNight(this);
    }

    if (eventsHas(data, "pre_first_sleep")) {
      this.firstSleep();
    }

    if (eventsHas(data, "mine_access_validation")) {
      this.gotoMine();
    }

    if (eventsHas(data, "mine_after")) {
      this.afterMine();
    }

    if (eventsHas(data, "mine_nightmare_after")) {
      this.afterMineNightmare();
    }
  }

  handleDiscussionReady(sprite) {
    if (!this.scene.isActive()) return;

    if (
      this.currentDiscussionStatus === DiscussionStatus.READY &&
      this.currentDiscussionSprite !== sprite
    ) {
      this.handleDiscussionEnded(this.currentDiscussionSprite);
    } else if (this.currentDiscussionStatus !== DiscussionStatus.NONE) {
      return;
    }

    this.currentDiscussionStatus = DiscussionStatus.READY;
    this.currentDiscussionSprite = sprite;
  }

  handleDiscussionInProgress() {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.INPROGRESS;
  }

  handleDiscussionStarted() {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.STARTED;
  }

  handleDiscussionWaiting(data) {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.WAITING;
  }

  handleDiscussionEnded(sprite) {
    if (!this.scene.isActive()) return;
    if (!sprite || !this[sprite]) return;

    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this[sprite]?.stopChatting();
  }

  handleAction() {
    if (this.isCinematic) return;

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

  stopMoving() {
    this.goingLeft = false;
    this.goingRight = false;
    this.goingDown = false;
    this.goingUp = false;
    this.hero.stopAndWait();
  }

  updateNightPosition() {
    const noX = this.hero.x - this.scale.width;
    const noY = this.hero.y - this.scale.height;

    this.nightOverlays.forEach((nightOverlay) =>
      nightOverlay.setPosition(noX, noY)
    );
    this.maskNightOverlays.forEach((maskNightOverlay) =>
      maskNightOverlay.setPosition(noX, noY)
    );
    this.darkOverlay.setPosition(this.hero.x, this.hero.y);
  }

  update(time, delta) {
    if (this.night && this.darkOverlay) {
      this.updateNightPosition();
    }

    if (!this.cursors || !this.hero || this.isCinematic || !this.hero.body) {
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
  }
}
