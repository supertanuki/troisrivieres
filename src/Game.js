import { Scene } from "phaser";
import { sceneEventsEmitter, sceneEvents } from "./Events/EventsCenter";
import { gameDuration, urlParamHas } from "./Utils/debug";
import { Hero } from "./Sprites/Hero";
import { DiscussionStatus } from "./Utils/discussionStatus";
import { dispatchUnlockEvents, eventsHas } from "./Utils/events";
import { updateNightPosition } from "./Village/night";
import { init } from "./Village/init";
import { afterMineNightmare } from "./Story/afterMineNightmare";
import { firstSleep } from "./Story/firstSleep";
import { afterMine } from "./Story/afterMine";
import { minerFirstMet } from "./Story/minerFirstMet";
import { splashScreen } from "./Village/splashScreen";
import { mineAccessValidation } from "./Story/mineAccessValidation";
import { goToFactory, goToMine, goToRecycling } from "./Story/goToGame";
import { handleAction } from "./Village/handleAction";
import { afterFactory, afterFactoryNightmare } from "./Story/afterFactory";
import { beforeStrike, strike } from "./Story/strike";
import { gameOver } from "./Village/gameOver";
import {
  playDjangoTheme,
  playIndustryTheme,
  playNightAmbiance,
  playVillageAmbiance,
  playVillageAmbianceV1,
  playVillageTheme,
} from "./Utils/music";
import {
  afterRecycling,
  afterRecyclingNightmare,
} from "./Story/afterRecycling";
import { afterFinalMessage, beforeFinal } from "./Story/final";

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

    this.treesOfDc = [];
    this.treesOfDcCollider = [];
    this.birds = [];
    this.isNoMoreBirds = false;
    this.butterflies = [];
    this.pointsCollider = [];
    this.heroPositions = {};
    this.maskNightOverlays = [];
    this.darkOverlay = null;
    this.nightOverlays = [];
    this.bikes = [];

    this.isCinematic = false;
    this.night = false;
    this.villageTheme = null;
    this.industryTheme = null;
    this.miniGameTheme = null;
    this.djangoTheme = null;
    this.nightmareTheme = null;
    this.villageAmbianceV1 = null;
    this.villageAmbianceV2 = null;
    this.nightAmbiance = null;
    this.datacentreThemeEnabled = false;
    this.sounds = [];

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
    this.miner = null;
    this.deer = null;
    this.blueWorker1 = null;
    this.blueWorker2 = null;
    this.dcWorkerChief = null;

    this.ball = null;
    this.tent = null;
    this.checkDjangoDoor = true;

    this.screens = null;
    this.screenOffSprites = [];
    this.screenShutDownCount = 0;

    this.isBonus = false;
    this.isFinal = false;
    this.isBeforeFinal = false;
    this.howToPlay = true;

    /** @type {Phaser.Tilemaps.Tilemap | null} */
    this.map = null;
    /** @type {Phaser.Tilemaps.Tileset | null} */
    this.tileset = null;
  }

  preload() {
    if (!urlParamHas("noanims")) {
      this.load.scenePlugin(
        "AnimatedTiles",
        "plugins/AnimatedTiles.js",
        "animatedTiles",
        "animatedTiles"
      );
    }
  }

  create() {
    this.timeStart = Date.now();

    if (urlParamHas("debug")) {
      this.fpsText = this.add
        .text(10, 10, "hello", { fontSize: "10px", fill: "#fff" })
        .setDepth(10000)
        .setScrollFactor(0);
      this.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
          this.fpsText.setText(`FPS: ${this.game.loop.actualFps.toFixed(2)}`);
        },
      });
    }

    splashScreen(this);
  }

  startGame() {
    if (urlParamHas("dreamMine")) {
      this.gotoScene("mine-nightmare");
      return;
    }

    if (urlParamHas("dreamFactory")) {
      this.gotoScene("factory-nightmare");
      return;
    }

    if (urlParamHas("dreamRecycling")) {
      this.gotoScene("recycling-nightmare");
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

    if (urlParamHas("recyclingCentre")) {
      this.debugRecyclingCentre();
      return;
    }

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

  debugRecyclingCentre() {
    this.scene.pause("game");
    this.scene.launch("recyclingCentre");
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

  wakeGame(fadeInFromWhite = false) {
    this.scene.wake("game");
    this.scene.wake("message");
    this.resetGameSize();

    const color = fadeInFromWhite ? 255 : 0;
    this.cameras.main.fadeIn(1000, color, color, color);
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
      sceneEvents.DiscussionAbort,
      this.handleDiscussionAbort,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionInProgress,
      this.handleDiscussionInProgress,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.ScreenShutdown,
      this.handleScreenShutdown,
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

    if (eventsHas(data, "second_act_begin")) {
      afterMineNightmare(this);
    }

    if (eventsHas(data, "factory_start")) {
      goToFactory(this);
    }

    if (eventsHas(data, "factory_after")) {
      afterFactory(this);
    }

    if (eventsHas(data, "third_act_begin")) {
      afterFactoryNightmare(this);
    }

    if (eventsHas(data, "recycling_start")) {
      goToRecycling(this);
    }

    if (eventsHas(data, "recycling_after")) {
      afterRecycling(this);
    }

    if (eventsHas(data, "fourth_act_begin")) {
      afterRecyclingNightmare(this);
    }

    if (eventsHas(data, "django_ready_for_strike")) {
      strike(this);
    }

    if (eventsHas(data, "strike_end")) {
      beforeFinal(this);
    }

    if (eventsHas(data, "after_final_message")) {
      afterFinalMessage(this);
    }

    if (eventsHas(data, "game_over")) {
      gameOver(this);
      gameDuration("Game", this.timeStart);
    }
  }

  handleDiscussionReady(sprite) {
    if (!this.scene.isActive()) return;

    if (
      this.currentDiscussionStatus === DiscussionStatus.READY &&
      this.currentDiscussionSprite !== sprite
    ) {
      console.log('abort', this.currentDiscussionSprite, sprite)
      this.handleDiscussionAbort(this.currentDiscussionSprite);
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
    console.log("handleDiscussionStarted");
    this.currentDiscussionStatus = DiscussionStatus.STARTED;
  }

  handleDiscussionWaiting(data) {
    if (!this.scene.isActive()) return;
    this.currentDiscussionStatus = DiscussionStatus.WAITING;
  }

  handleDiscussionEnded(sprite) {
    if (!this.scene.isActive()) return;
    if ((!sprite || !this[sprite]) && "screen" !== sprite.substring(0, 6))
      return;

    console.log("handleDiscussionEnded", sprite);
    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this[sprite]?.stopChatting();
  }

  handleDiscussionAbort(sprite) {
    if (!this.scene.isActive()) return;
    if (!sprite || !this[sprite]) return;

    this.currentDiscussionStatus = DiscussionStatus.NONE;
    this[sprite]?.abortChatting();
  }

  handleScreenShutdown(sprite) {
    this.screenShutDownCount++;
    if (this.screenShutDownCount === 3) {
      dispatchUnlockEvents(["screens_shutdown"]);
      beforeStrike(this);
    }
  }

  update(time, delta) {
    if (this.night && this.darkOverlay) {
      updateNightPosition(this);
    }

    if (this.hero) {
      this.hero.updateShadow();
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
      console.log("stopAndWait", this.currentDiscussionStatus);
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

    if (this.goingLeft || this.goingUp || this.goingDown || this.goingRight) {
      this.hero.playMoveSound();
    } else {
      this.hero.stopMoveSound();
    }

    if (this.goingUp) {
      this.hero.animateToUp();

      // try to enter in Django home
      const djangoDoor = this.heroPositions["heroDjangoDoor"];
      if (
        this.checkDjangoDoor &&
        this.hero.x > djangoDoor.x - 8 &&
        this.hero.x < djangoDoor.x + 8 &&
        this.hero.y > djangoDoor.y - 5 &&
        this.hero.y < djangoDoor.y + 5
      ) {
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

    if (urlParamHas("nomusic") || this.isBeforeFinal || this.isFinal) {
      // do nothing
    } else if (this.night) {
      playNightAmbiance(this);
    } else if (
      this.hero.y < 445 || // factory
      (this.miner && this.hero.x > this.miner.x + 25) || // mine
      (this.hero.x < 880 && this.hero.y < 615) || // recycling
      (this.datacentreThemeEnabled &&
        this.hero.x > 1110 &&
        this.hero.x < 1500 &&
        this.hero.y > 984 &&
        this.hero.y < 1210) // datacentre
    ) {
      playIndustryTheme(this);
    } else if (this.hero.x > 1120) {
      playVillageTheme(this);
      playVillageAmbiance(this);
    } else {
      playVillageAmbiance(this);
    }

    if (
      !this.goingDown &&
      !this.goingUp &&
      !this.goingRight &&
      !this.goingLeft
    ) {
      this.stopMoving();
    }

    this.hero.updateShadow();
  }
}
