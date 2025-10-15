import Game from "../Game";
import "../Sprites/Hero";
import "../Sprites/Django";
import "../Sprites/Koko";
import "../Sprites/SleepingGuy";
import "../Sprites/TwoWomen";
import "../Sprites/Baby";
import "../Sprites/Bino";
import "../Sprites/Cat";
import "../Sprites/Dog";
import "../Sprites/Escargot";
import "../Sprites/Cow";
import "../Sprites/Veal";
import "../Sprites/Fisherman";
import "../Sprites/Miner";
import "../Sprites/Ball";
import "../Sprites/Girl";
import "../Sprites/Boy";
import "../Sprites/TwoGuys";
import "../Sprites/Bike";
import "../Sprites/Deer";
import "../Sprites/Owl";
import { createHeroAnims } from "../Sprites/HeroAnims";
import { urlParamHas } from "../Utils/debug";
import { addBirds } from "./birds";
import { addButterflies } from "./butterflies";
import { addJoystickForMobile, createControls } from "./controls";
import { addDebugControls } from "./debugControls";
import { createTrees } from "./trees";
import { intro } from "../Story/intro";
import { handleAction } from "./handleAction";
import { preloadSound } from "../Utils/music";
import { FONT_RESOLUTION, FONT_SIZE } from "../UI/Message";
import { getUiMessage } from "../Workflow/messageWorkflow";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";

/** @param {Game} scene  */
export const init = function (scene) {
  console.time("Init");
  scene.map = scene.make.tilemap({ key: "map" });
  scene.tileset = scene.map.addTilesetImage("Atlas_01", "tiles");

  scene.land = scene.map
    .createLayer("land", scene.tileset)
    .setDepth(20)
    .setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.map.createLayer("landUp", scene.tileset).setDepth(40);
  scene.bridgesShadow = scene.map
    .createLayer("bridgesShadow", scene.tileset)
    .setDepth(50);
  scene.bridges = scene.map.createLayer("bridges", scene.tileset).setDepth(60);

  scene.bottomObjects = scene.map
    .createLayer("bottom", scene.tileset)
    .setDepth(70)
    .setCollisionByProperty({ collide: true });

  scene.potagerBottom = scene.map
    .createLayer("potagerBottom", scene.tileset)
    .setDepth(70);

  createTrees(scene);

  scene.map.getObjectLayer("hero").objects.forEach((heroPosition) => {
    scene.heroPositions[heroPosition.name] = {
      x: heroPosition.x,
      y: heroPosition.y,
    };

    if (heroPosition.name !== "hero") {
      return;
    }

    scene.tent = scene.add
      .sprite(heroPosition.x + 2, heroPosition.y - 2, "sprites", "tent-1")
      .setDepth(100);
    scene.hero = scene.add.hero(heroPosition.x, heroPosition.y).setDepth(100);
    scene.hero.stopAndWait();
    createHeroAnims(scene.anims);
  });

  addBirds(scene);
  addButterflies(scene);

  if (!urlParamHas("noanims")) {
    console.time("animatedTiles");
    scene.animatedTiles.init(scene.map);
    console.timeEnd("animatedTiles");
  }

  scene.cameras.main.setBounds(
    0,
    400, // top of the village is disabled
    2144, // mine on the right is disabled
    scene.map.heightInPixels - 408
  );
  scene.cameras.main.startFollow(scene.hero, true);

  addDebugControls(scene);
  createControls(scene);
  addJoystickForMobile(scene);
  scene.addEventsListeners();

  scene.obstacles = scene.map
    .createLayer("obstacles", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);

  scene.obstacleRecyclingLayer = scene.map
    .createLayer("obstacleRecycling", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);

  scene.cameras.main.fadeIn(1000, 0, 0, 0);

  scene.time.delayedCall(2000, () => delayedInit(scene));
  scene.time.delayedCall(3000, () => scene.scene.run("message"));
  scene.time.delayedCall(4000, () => howToPlay(scene));

  console.timeEnd("Init");

  if (!urlParamHas("nostart")) intro(scene);
};

/** @param {Game} scene  */
const howToPlay = function (scene) {
  scene.howToPlayText = scene.add
    .text(225, 220, getUiMessage("game.howToPlay"), {
      fontFamily: "DefaultFont",
      fontSize: FONT_SIZE,
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: 4,
    })
    .setAlpha(0)
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5)
    .setWordWrapWidth(200)
    .setResolution(FONT_RESOLUTION)
    .setDepth(10000);

  scene.tweens.add({
    targets: scene.howToPlayText,
    alpha: 0.8,
    y: 200,
    ease: "Sine.easeInOut",
    duration: 2000,
  });

  hideOrNotHowToPlay(scene);
};

/** @param {Game} scene  */
const hideOrNotHowToPlay = function (scene) {
  if (scene.howToPlay) {
    scene.time.delayedCall(1000, () => hideOrNotHowToPlay(scene));
    return;
  }

  scene.tweens.add({
    targets: scene.howToPlayText,
    alpha: 0,
    y: 220,
    ease: "Sine.easeInOut",
    duration: 2000,
    onComplete: () => scene.howToPlayText.destroy(),
  });
}

/** @param {Game} scene  */
export const delayedInit = function (scene) {
  scene.anims
    .create({
      key: "exclam",
      frames: scene.anims.generateFrameNames("sprites", {
        start: 1,
        end: 3,
        prefix: "exclam-",
      }),
      repeat: -1,
      frameRate: 6,
    })
    .addFrame([{ key: "sprites", frame: "exclam-2", duration: 1 }]);

  scene.map.getObjectLayer("sprites").objects.forEach((o) => {
    if (o.name === "django") {
      scene.django = scene.add.django(o.x, o.y);
      scene.django.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "koko") {
      scene.koko = scene.add.koko(o.x, o.y);
      scene.koko.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "sleepingGuy") {
      scene.sleepingGuy = scene.add.sleepingGuy(o.x, o.y);
      scene.sleepingGuy.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "twoGuys") {
      scene.twoGuys = scene.add.twoGuys(o.x, o.y);
      scene.twoGuys.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "twoWomen") {
      scene.twoWomen = scene.add.twoWomen(o.x, o.y);
      scene.twoWomen.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "baby") {
      scene.baby = scene.add.baby(o.x, o.y);
      scene.baby.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "bino") {
      scene.bino = scene.add.bino(o.x, o.y);
      scene.bino.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "binoCleaningRoad") {
      scene.bino.setCleaningRoadPosition(o.x, o.y);
    }

    if (o.name === "mino") {
      scene.fisherman = scene.add.fisherman(o.x, o.y);
      scene.fisherman.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "cat") {
      scene.cat = scene.add.cat(o.x, o.y);
      scene.cat.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "dog") {
      scene.dog = scene.add.dog(o.x, o.y);
      scene.dog.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "escargot") {
      scene.escargot = scene.add.escargot(o.x, o.y);
      scene.escargot.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "cow") {
      scene.cow = scene.add.cow(o.x, o.y);
      scene.cow.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "cowHidden") {
      scene.cowHidden = scene.add.cow(o.x, o.y);
      scene.cowHidden.toRight();
      scene.cowHidden.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "veal") {
      scene.veal = scene.add.veal(o.x, o.y);
      scene.veal.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "miner") {
      scene.miner = scene.add.miner(o.x, o.y);
      scene.miner.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "ball") {
      scene.ball = scene.add.ball(o.x, o.y);
    }

    if (o.name === "girl") {
      scene.girl = scene.add.girl(o.x, o.y);
    }

    if (o.name === "boy") {
      scene.boy = scene.add.boy(o.x, o.y);
      scene.boy.on("pointerdown", () => handleAction(scene), this);
    }

    if (o.name === "bike") {
      scene.bikes.push(scene.add.bike(o.x, o.y));
    }

    if (o.name === "boySad") {
      scene.boy.setSadPosition(o.x, o.y);
    }

    if (o.name === "girlSad") {
      scene.girl.setSadPosition(o.x, o.y);
    }

    if (o.name === "deer") {
      scene.deer = scene.add.deer(o.x, o.y);
    }

    if (o.name === "owl") {
      scene.owl = scene.add.owl(o.x, o.y);
    }
  });

  scene.bridgesTop = scene.map
    .createLayer("bridgesTop", scene.tileset)
    .setDepth(110);

  scene.topObjects = scene.map
    .createLayer("top", scene.tileset)
    .setDepth(120)
    .setCollisionByProperty({ collide: true });

  scene.potagerTop = scene.map
    .createLayer("potagerTop", scene.tileset)
    .setDepth(120)
    .setCollisionByProperty({ collide: true });

  // smooth collision management (barrière...)
  scene.topObjects.forEachTile((tile) => {
    if (tile.properties?.pointCollide === true) {
      scene.pointsCollider.push(
        scene.physics.add
          .sprite(tile.getCenterX(), tile.getCenterY(), null)
          .setSize(10, 1)
          .setImmovable(true)
          .setVisible(false)
      );
    }
  });

  scene.land.forEachTile((tile) => {
    if (tile.properties?.topCollide === true) {
      scene.pointsCollider.push(
        scene.physics.add
          .sprite(tile.getCenterX(), tile.getCenterY() - 7, null)
          .setSize(16, 1)
          .setImmovable(true)
          .setVisible(false)
      );
    }
  });

  scene.obstaclesFactoryLayer = scene.map
    .createLayer("obstaclesFactory", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);

  scene.physics.add.collider(scene.miner, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "miner");
  });

  scene.physics.add.collider(scene.bino, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "bino");
  });

  scene.physics.add.collider(scene.django, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
  });

  scene.physics.add.collider(scene.koko, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "koko");
  });

  scene.physics.add.collider(scene.sleepingGuy, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "sleepingGuy");
  });

  scene.physics.add.collider(scene.twoWomen, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "twoWomen");
  });

  scene.physics.add.collider(scene.baby, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "baby");
  });

  scene.physics.add.collider(scene.twoGuys, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "twoGuys");
  });

  scene.physics.add.collider(scene.fisherman, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "fisherman");
  });

  scene.physics.add.collider(scene.cat, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "cat");
  });

  scene.physics.add.collider(scene.dog, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "dog");
  });

  scene.physics.add.collider(scene.escargot, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "escargot");
  });

  scene.physics.add.collider(scene.cow, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "cow");
  });

  scene.physics.add.collider(scene.cowHidden, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "cow");
  });

  scene.physics.add.collider(scene.veal, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "veal");
  });

  scene.physics.add.collider(scene.boy, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "boy");
  });
  scene.physics.add.collider(scene.girl, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "girl");
  });

  scene.physics.add.collider(scene.bikes, scene.hero);

  scene.physics.add.collider(scene.hero, scene.water);
  scene.physics.add.collider(scene.hero, scene.land);
  scene.physics.add.collider(scene.hero, scene.obstacles);
  scene.obstacleRecyclingCollider = scene.physics.add.collider(scene.hero, scene.obstacleRecyclingLayer);
  scene.physics.add.collider(scene.hero, scene.topObjects);
  scene.potagerCollider = scene.physics.add.collider(scene.hero, scene.potagerTop);
  scene.physics.add.collider(scene.hero, scene.bottomObjects);
  scene.physics.add.collider(scene.hero, scene.pointsCollider);
  scene.obstaclesFactoryCollider = scene.physics.add.collider(scene.hero, scene.obstaclesFactoryLayer);

  for (const element of ["hommes", "femmes", "enfants", "ouvriers"]) {
    for (let i = 1; i <= 4; i++) {
      preloadSound(`sfx_voix_${element}_${i}`, scene);
    }
  }

  preloadSound("sfx_chat_1", scene);
  preloadSound("sfx_chat_2", scene);

  preloadSound("sfx_chien_1", scene);
  preloadSound("sfx_chien_2", scene);

  preloadSound("sfx_vache_1", scene);
  preloadSound("sfx_vache_2", scene);
};
