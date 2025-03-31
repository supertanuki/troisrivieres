import { Scene } from 'phaser';
import { sceneEventsEmitter, sceneEvents } from "./Events/EventsCenter";
import { urlParamHas } from "./Utils/isDebug";
import { Hero } from "./Sprites/Hero";
import { DiscussionStatus } from "./Utils/discussionStatus";
import { eventsHas } from "./Utils/events";
import { updateNightPosition } from "./Village/night";
import { init } from "./Village/init";
import { afterMineNightmare } from "./Story/afterMineNightmare";
import { firstSleep } from "./Story/firstSleep";
import { afterMine } from "./Story/afterMine";
import { minerFirstMet } from "./Story/minerFirstMet";
import { splashScreen } from "./Village/splashScreen";
import { mineAccessValidation } from './Story/mineAccessValidation';
import { goToMine } from './Story/goToMine';
import { handleAction } from './Village/handleAction';

export default class Game extends Scene {
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
    this.night = false;

    this.django = null;
    this.koko = null;
    this.sleepingGuy = null;
    this.twoGuys = null;
    this.baby = null;
    this.twoWomen = null;
    this.bino = null;
    this.fisherman = null;
    this.dog = null;
    this.escargot = null;
    this.cat = null;
    this.boy = null;
    this.girl = null;
    this.ball = null;
    this.tent = null;

    /** @type {Phaser.Tilemaps.Tilemap | null} */
    this.map = null;
    /** @type {Phaser.Tilemaps.Tileset | null} */
    this.tileset = null;
  }

  preload() {
    console.log('Preload village')
    this.load.scenePlugin(
      "AnimatedTiles",
      "plugins/AnimatedTiles.js",
      "animatedTiles",
      "animatedTiles"
    );
  }

  create() {
    splashScreen(this);
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

    init(this);
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

  resetGameSize() {
    this.scale.setGameSize(450, 250);
  }

  setHeroPosition(positionName) {
    const position = this.heroPositions[positionName];
    this.hero.setPosition(position.x, position.y);
  }

  stopMoving() {
    this.goingLeft = false;
    this.goingRight = false;
    this.goingDown = false;
    this.goingUp = false;
    this.hero.stopAndWait();
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
  }

  listenEvents(data) {
    if (eventsHas(data, "miner_first_met")) {
      minerFirstMet(this);
    }

    if (eventsHas(data, "pre_first_sleep")) {
      firstSleep(this);
    }

    if (eventsHas(data, "mine_access_validation")) {
      mineAccessValidation(this);
    }

    if (eventsHas(data, "mine_start")) {
      goToMine(this);
    }

    if (eventsHas(data, "mine_after")) {
      afterMine(this);
    }

    if (eventsHas(data, "mine_nightmare_after")) {
      afterMineNightmare(this);
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

  update(time, delta) {
    if (this.night && this.darkOverlay) {
      updateNightPosition(this);
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

    if (this.goingUp) {
      this.hero.animateToUp();

      // try to enter in Django home
      if (this.hero.x > 1139 && this.hero.x < 1151 && this.hero.y > 1291 && this.hero.y < 1295) {
        this.hero.stopAndWait();
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
        handleAction(this);
      }
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
