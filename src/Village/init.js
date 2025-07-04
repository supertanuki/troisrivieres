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
import { createHeroAnims } from "../Sprites/HeroAnims";
import { urlParamHas } from "../Utils/debug";
import { addBirds } from "./birds";
import { addButterflies } from "./butterflies";
import { addCollisionManagement } from "./collisionManagement";
import { addJoystickForMobile, createControls } from "./controls";
import { addDebugControls } from "./debugControls";
import { createTrees } from "./trees";
import { intro } from "../Story/intro";
import { handleAction } from "./handleAction";
import { playVillageTheme } from "../Utils/music";

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
    .setDepth(80);

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

  playVillageTheme(scene);

  scene.time.delayedCall(2000, () => delayedInit(scene));

  scene.time.delayedCall(3000, () => scene.scene.run("message"));

  console.timeEnd("Init");

  if (!urlParamHas("nostart")) intro(scene);
};

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

  scene.map.getObjectLayer("sprites").objects.forEach((spriteObject) => {
    if (spriteObject.name === "django") {
      scene.django = scene.add.django(spriteObject.x, spriteObject.y);
      scene.django.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "koko") {
      scene.koko = scene.add.koko(spriteObject.x, spriteObject.y);
      scene.koko.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "sleepingGuy") {
      scene.sleepingGuy = scene.add.sleepingGuy(spriteObject.x, spriteObject.y);
      scene.sleepingGuy.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "twoGuys") {
      scene.twoGuys = scene.add.twoGuys(spriteObject.x, spriteObject.y);
      scene.twoGuys.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "twoWomen") {
      scene.twoWomen = scene.add.twoWomen(spriteObject.x, spriteObject.y);
      scene.twoWomen.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "baby") {
      scene.baby = scene.add.baby(spriteObject.x, spriteObject.y);
      scene.baby.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "bino") {
      scene.bino = scene.add.bino(spriteObject.x, spriteObject.y);
      scene.bino.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "binoCleaningRoad") {
      scene.bino.setCleaningRoadPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "mino") {
      scene.fisherman = scene.add.fisherman(spriteObject.x, spriteObject.y);
      scene.fisherman.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "cat") {
      scene.cat = scene.add.cat(spriteObject.x, spriteObject.y);
      scene.cat.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "dog") {
      scene.dog = scene.add.dog(spriteObject.x, spriteObject.y);
      scene.dog.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "escargot") {
      scene.escargot = scene.add.escargot(spriteObject.x, spriteObject.y);
      scene.escargot.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "cow") {
      scene.cow = scene.add.cow(spriteObject.x, spriteObject.y);
      scene.cow.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "veal") {
      scene.veal = scene.add.veal(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "miner") {
      scene.miner = scene.add.miner(spriteObject.x, spriteObject.y);
      scene.miner.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "ball") {
      scene.ball = scene.add.ball(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "girl") {
      scene.girl = scene.add.girl(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "boy") {
      scene.boy = scene.add.boy(spriteObject.x, spriteObject.y);
      scene.boy.on("pointerdown", () => handleAction(scene), this);
    }

    if (spriteObject.name === "bike") {
      scene.bikes.push(scene.add.bike(spriteObject.x, spriteObject.y));
    }

    if (spriteObject.name === "boySad") {
      scene.boy.setSadPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "girlSad") {
      scene.girl.setSadPosition(spriteObject.x, spriteObject.y);
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

  addCollisionManagement(scene);
};
