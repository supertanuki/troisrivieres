import Phaser from "phaser";
import { sceneEventsEmitter, sceneEvents } from "./Events/EventsCenter";
import isMobileOrTablet from "./Utils/isMobileOrTablet";
import {
  isCable,
  isFactory,
  isMine,
  isScene1,
  urlParamHas,
} from "./Utils/isDebug";

import "./Sprites/Django";
import "./Sprites/Koko";
import "./Sprites/Nono";
import "./Sprites/Bino";
import "./Sprites/Cat";
import "./Sprites/Dog";
import "./Sprites/Escargot";
import "./Sprites/Cow";
import "./Sprites/Fisherman";
import "./Sprites/Miner";
import "./Sprites/Bird";
import "./Sprites/Ball";
import "./Sprites/Girl";
import "./Sprites/Boy";

//import "./Sprites/Hero";
import { Hero } from "./Sprites/Hero";
import { DiscussionStatus } from "./Utils/discussionStatus";
import { eventsHas } from "./Utils/events";

const nightColor = 0x000055;

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

    this.backgrounds = [];
    this.pointsCollider = [];

    this.heroPositions = {};

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

  gotoScene1() {
    this.scene.pause("game");
    this.scene.launch("cable-game");
  }

  gotoFactory() {
    this.scene.pause("game");
    this.scene.launch("factory");
  }

  gotoMine() {
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      console.log("fadeout go to mine");
      this.scene.launch("mine");
      this.scene.sleep("game");
      this.scene.sleep("message");
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
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.5)
      .setResolution(10);
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
    this.scene.run("message");

    if (urlParamHas("dreamMine")) {
      this.gotoScene("mine-nightmare");
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

    if (isCable()) {
      this.gotoCable();
      return;
    }

    console.log("startGame");

    // Fade init
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    /*
    this.cameras.main.fadeOut(1000, 0, 0, 0, () => {
      
    });
    */

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

    this.map = this.make.tilemap({ key: "map" });
    this.tileset = this.map.addTilesetImage("Atlas_01", "tiles");
    this.map.createLayer("waterUp", this.tileset).setDepth(10);

    this.land = this.map
      .createLayer("land", this.tileset)
      .setDepth(20)
      .setCollisionByProperty({ collide: true });

    this.landLessWater = this.map
      .createLayer("landLessWater", this.tileset)
      .setDepth(30)
      .setCollisionByProperty({ collide: true })
      .setVisible(false);

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

    // Add trees
    this.anims.create({
      key: "sapin",
      frames: this.anims.generateFrameNames("trees", {
        start: 1,
        end: 2,
        prefix: "sapin-",
      }),
      repeat: -1,
      frameRate: 1,
    });
    this.anims.create({
      key: "arbre",
      frames: this.anims.generateFrameNames("trees", {
        start: 1,
        end: 2,
        prefix: "arbre-",
      }),
      repeat: -1,
      frameRate: 1,
    });
    this.anims.create({
      key: "pin",
      frames: this.anims.generateFrameNames("trees", {
        start: 1,
        end: 2,
        prefix: "pin-",
      }),
      repeat: -1,
      frameRate: 1,
    });
    const treesLayer = this.map.getObjectLayer("trees");
    // sort tress in order to draw trees from top to down
    treesLayer.objects.sort((a, b) => a.y - b.y);
    // Add trees base
    treesLayer.objects.forEach((treeObject) => {
      this.add
        .image(
          treeObject.x,
          treeObject.y - 8,
          "trees",
          `${treeObject.name}-base`
        )
        .setDepth(90)
        .setOrigin(0.5, 1);
    });

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

    this.map.createLayer("bottomStaticTrees", this.tileset).setDepth(130);

    // Add trees top after hero was created
    treesLayer.objects.forEach((treeObject) => {
      const tree = this.physics.add
        .sprite(
          treeObject.x,
          treeObject.y - 24,
          "trees",
          `${treeObject.name}-1`
        )
        .setOrigin(0.5, 1)
        .setDepth(130);
      tree.anims.play(treeObject.name);
      this.pointsCollider.push(
        this.physics.add
          .sprite(treeObject.x, treeObject.y - 10, null)
          .setSize(16, 1)
          .setOrigin(0.5, 1)
          .setImmovable(true)
          .setVisible(false)
      );
    });

    this.map.createLayer("staticTrees", this.tileset).setDepth(150);

    this.map.getObjectLayer("birds").objects.forEach((birdPosition) => {
      this.birds.push(
        this.add.bird(birdPosition.x, birdPosition.y).setDepth(160)
      );
    });

    this.animatedTiles.init(this.map);

    this.cameras.main.setBounds(0, 0, 2352, 1750);
    this.cameras.main.startFollow(this.hero, true);

    this.addDebugControls();
    this.addCollisionManagement();
    this.createControls();
    this.addJoystickForMobile();
    //this.addControlsForMobile();
    this.addEventsListeners();

    if (isMine()) {
      this.gotoMine();
      return;
    }

    if (!urlParamHas("nomusic")) {
      this.music = this.sound.add("village-theme");
      this.music.loop = true;
      this.music.play();
    }

    if (!urlParamHas("nostart")) this.intro();
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
  }

  intro() {
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
      if (!this.isCinematic) return;

      if (this.goingDown) {
        this.hero.slowDown();
      }

      if (this.hero.y > this.heroPositions["hero"].y + 5) {
        this.goingDown = false;
        this.tent.anims.play("tent", true);
        this.tent.on("animationcomplete", () => {
          this.tent.destroy();
          this.isCinematic = false;
        });
      }
    });
  }

  addDebugControls() {
    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.T)
      .on("down", () => {
        this.add
          .text(this.hero.x, this.hero.y + 100, "Trois-Rivières", {
            fontSize: "28px",
            fill: "#000000",
          })
          .setOrigin(0.5, 0.5)
          .setDepth(1000);
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.F)
      .on("down", () => {
        this.setHeroPosition("hero");
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.K)
      .on("down", () => {
        this.setHeroPosition("heroKoko");
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.B)
      .on("down", () => {
        this.setHeroPosition("heroMiner");
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.D)
      .on("down", () => {
        this.setHeroPosition("heroDjango");
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.N)
      .on("down", () => {
        this.setHeroPosition("heroNono");
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.S)
      .on("down", () => {
        this.gotoMine();
        return;
        sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, [
          "django_met",
          "miner_first_met",
          "pre_first_sleep",
          //"miner_ask_for_card",
        ]);
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.M)
      .on("down", () => {
        this.cameras.main.zoomTo(this.cameras.main.zoom === 1.4 ? 1 : 0.2, 100);
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.P)
      .on("down", () => {
        this.cameras.main.zoomTo(this.cameras.main.zoom === 0.2 ? 1 : 1.4, 100);
      });

    const ctrlR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    ctrlR.on("down", () => {
      if (!this.roads) {
        this.roadsBottom = this.map
          .createLayer("roadsBottom", this.tileset)
          .setDepth(95)
          .setVisible(false);
        this.roads = this.map
          .createLayer("roads", this.tileset)
          .setDepth(96)
          .setVisible(false);
      }

      const enabled = this.roads.visible;
      this.roads.setVisible(!enabled);
      this.roadsBottom.setVisible(!enabled);
      this.bridgesShadow.setVisible(enabled);
      this.bridges.setVisible(enabled);
      this.bridgesTop.setVisible(enabled);
    });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.A)
      .on("down", () => {
        this.landLessWater.setVisible(!this.landLessWater.visible);
        this.landLessWater.setActive(!this.landLessWater.visible);
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.U)
      .on("down", () => {
        this.cameras.main.fadeOut(200, 0, 0, 0, (cam, progress) => {
          if (progress !== 1) return;
          this.gotoFactory();
        });
      });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.L)
      .on("down", () => this.switchNight());
  }

  setHeroPosition(positionName) {
    const position = this.heroPositions[positionName];
    this.hero.setPosition(position.x, position.y);
  }

  addNightCircle(radius) {
    const nightOverlay = this.add.graphics();
    nightOverlay.fillStyle(nightColor, 0.3);
    nightOverlay.fillRect(0, 0, this.scale.width, this.scale.height);
    nightOverlay.setScrollFactor(0, 0);
    nightOverlay.setVisible(false);
    nightOverlay.setDepth(1000);

    const maskGraphics = this.make.graphics();
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillCircle(225, 125, radius);
    maskGraphics.setScrollFactor(0, 0);

    const mask = maskGraphics.createGeometryMask();
    mask.invertAlpha = true;
    nightOverlay.setMask(mask);

    return nightOverlay;
  }

  switchNight() {
    this.nightOverlay1 = this.nightOverlay1 || this.addNightCircle(50);
    this.nightOverlay2 = this.nightOverlay2 || this.addNightCircle(70);
    this.nightOverlay3 = this.nightOverlay3 || this.addNightCircle(90);

    this.darkOverlay =
      this.darkOverlay ||
      this.add
        .rectangle(
          this.scale.width / 2,
          this.scale.height / 2,
          this.scale.width,
          this.scale.height,
          nightColor
        )
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0, 0)
        .setVisible(false)
        .setDepth(1000);

    if (this.night) {
      this.night = false;
      this.darkOverlay.setVisible(false);
      this.nightOverlay1.setVisible(false);
      this.nightOverlay2.setVisible(false);
      this.nightOverlay3.setVisible(false);
      return;
    }

    this.night = true;
    this.darkOverlay.setAlpha(0);
    this.darkOverlay.setVisible(true);
    this.tweens.add({
      targets: this.darkOverlay,
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
  }

  firstSleep() {
    this.isCinematic = true;
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      console.log("firstSleep fadeOut completed");
      this.endFirstSleep();

      this.time.delayedCall(1000, () => {
        this.cameras.main.fadeIn(1000, 0, 0, 0, (cam, progress) => {
          if (progress !== 1) return;
          console.log("fadeOutAndFadeIn /// fadeIn completed");
          this.handleAction();
          this.isCinematic = false;
          console.log("end cinematic");
        });
      });
    });
  }

  toggleSprites(state) {
    [
      this.koko,
      this.bino,
      this.fisherman,
      this.dog,
      this.escargot,
      this.cat,
      this.boy,
      this.girl,
      this.ball,
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
  }

  endFirstSleep() {
    this.hero.slowRight();
    this.hero.animateToRight();
    this.setHeroPosition("heroDjango");

    this.map.createLayer("riverPolluted", this.tileset)?.setDepth(45);
    this.map.createLayer("landUpRiverPolluted", this.tileset)?.setDepth(46);
    this.map.createLayer("bridgesShadowPolluted", this.tileset)?.setDepth(51);

    this.switchNight();
    this.toggleSprites(true);

    this.boy.setSad();
    this.girl.setSad();
    this.fisherman.setSad();

    this.nono.setVisible(true);
    this.nono.body.checkCollision.none = false;

    sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, ["first_sleep"]);
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
  }

  listenEvents(data) {
    console.log("Game listenEvents", data);
    if (eventsHas(data, "miner_first_met")) {
      this.toggleSprites(false);
      this.switchNight();
    }

    if (eventsHas(data, "pre_first_sleep")) {
      this.firstSleep();
    }

    if (eventsHas(data, "mine_access_validation")) {
      this.gotoMine();
    }

    if (eventsHas(data, "mine_after")) {
      console.log("game listenEvents mine_after");
      this.scene.wake("game");
      console.log("game wake game");
      this.scene.wake("message");
      console.log("game wake message");

      this.resetGameSize();
      this.isCinematic = true;
      console.log("resetGameSize");

      this.cameras.main.fadeIn(1000, 0, 0, 0, (cam, progress) => {
        if (progress !== 1) return;
        console.log("game fadeIn done");
        this.isCinematic = false;
        this.currentDiscussionStatus = DiscussionStatus.NONE;
      });
    }
  }

  addCollisionManagement() {
    this.physics.add.collider(this.miner, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "miner");
    });

    this.physics.add.collider(this.bino, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "bino");
    });

    this.physics.add.collider(this.django, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
    });

    this.physics.add.collider(this.koko, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "koko");
    });

    this.physics.add.collider(this.nono, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "nono");
    });

    this.physics.add.collider(this.fisherman, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "fisherman");
    });

    this.physics.add.collider(this.cat, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "cat");
    });

    this.physics.add.collider(this.dog, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "dog");
    });

    this.physics.add.collider(this.escargot, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "escargot");
    });

    this.physics.add.collider(this.cow, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "cow");
    });

    this.physics.add.collider(this.boy, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "boy");
    });

    this.physics.add.collider(this.birds, this.hero, (bird) => {
      bird.fly();
    });

    this.physics.add.collider(this.hero, this.water);
    this.physics.add.collider(this.hero, this.land);
    this.physics.add.collider(this.hero, this.obstacles);
    this.physics.add.collider(this.hero, this.topObjects);
    this.physics.add.collider(this.hero, this.bottomObjects);
    this.physics.add.collider(this.hero, this.pointsCollider);
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
    console.log("handleDiscussionWaiting", data);
    this.currentDiscussionStatus = DiscussionStatus.WAITING;
  }

  handleDiscussionEnded(sprite) {
    if (!this.scene.isActive()) return;
    if (!sprite || !this[sprite]) return;

    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this[sprite]?.stopChatting();
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
    if (this.isCinematic) return;

    if (this.currentDiscussionStatus === DiscussionStatus.WAITING) {
      this.currentDiscussionStatus = DiscussionStatus.STARTED;
      sceneEventsEmitter.emit(sceneEvents.DiscussionContinuing);
      return;
    }

    if (this.currentDiscussionStatus === DiscussionStatus.READY) {
      console.log("handleAction", this.currentDiscussionSprite);
      this.currentDiscussionStatus = DiscussionStatus.STARTED;
      sceneEventsEmitter.emit(
        sceneEvents.DiscussionStarted,
        this.currentDiscussionSprite
      );
      return;
    }
  }

  /*
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
  */

  addJoystickForMobile() {
    if (!isMobileOrTablet()) {
      return;
    }

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 200,
      radius: 100,
      base: this.add.circle(0, 0, 50, 0xff5544, 0.4).setDepth(10000),
      thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.3).setDepth(10000),
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
    //console.log(!this.cursors, !this.hero, this.isCinematic, !this.hero?.body, this.currentDiscussionStatus)
    if (!this.cursors || !this.hero || this.isCinematic || !this.hero.body) {
      return;
    }
    //console.log('game update ' + time)

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
