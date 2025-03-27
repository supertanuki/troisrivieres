import Game from "../Game";
import { createHeroAnims } from "../Sprites/HeroAnims";
import { urlParamHas } from "../Utils/isDebug";
import { addBirds } from "./birds";
import { addButterflies } from "./butterflies";
import { addCollisionManagement } from "./collisionManagement";
import { addJoystickForMobile, createControls } from "./controls";
import { addDebugControls } from "./debugControls";
import { createTrees } from "./trees";

import "../Sprites/Hero";
import "../Sprites/Django";
import "../Sprites/Koko";
import "../Sprites/SleepingGuy";
import "../Sprites/TwoWomen";
import "../Sprites/Baby";
import "../Sprites/Nono";
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
import { intro } from "../Story/intro";
import { handleAction } from "./handleAction";

/** @param {Game} scene  */
export const init = function (scene) {
  // Fade init
  scene.cameras.main.fadeIn(1000, 0, 0, 0);

  // parallax mine backgrounds // @todo : load it when mine access is unlocked
  scene.add
    .image(0, 0, "mineLand", "background")
    .setOrigin(0, 0)
    .setScrollFactor(0.05, 0.1);

  scene.add
    .image(400, 0, "mineLand", "background")
    .setOrigin(0, 0)
    .setScrollFactor(0.05, 0.1);

  scene.add
    .image(270, 120, "mineLand", "mine")
    .setOrigin(0, 0)
    .setScrollFactor(0.14, 0.32);

  scene.add
    .image(1692, 231, "mineLand", "mine-machine")
    .setOrigin(0, 0)
    .setScrollFactor(0.7, 0.7);

  scene.map = scene.make.tilemap({ key: "map" });
  scene.tileset = scene.map.addTilesetImage("Atlas_01", "tiles");
  scene.map.createLayer("waterUp", scene.tileset).setDepth(10);

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

  scene.anims.create({
    key: "tent",
    frames: scene.anims.generateFrameNames("sprites", {
      start: 1,
      end: 5,
      prefix: "tent-",
    }),
    repeat: 0,
    frameRate: 10,
  });

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

    if (spriteObject.name === "nono") {
      scene.nono = scene.add.nono(spriteObject.x, spriteObject.y);
      scene.nono.on("pointerdown", () => handleAction(scene), this);
      scene.nono.setVisible(false);
      scene.nono.body.checkCollision.none = true;
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

  scene.obstacles = scene.map
    .createLayer("obstacles", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);

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

  addBirds(scene);
  addButterflies(scene);

  scene.animatedTiles.init(scene.map);

  scene.cameras.main.setBounds(
    0,
    0,
    scene.map.widthInPixels,
    scene.map.heightInPixels
  );
  scene.cameras.main.startFollow(scene.hero, true);

  addDebugControls(scene);
  addCollisionManagement(scene);
  createControls(scene);
  addJoystickForMobile(scene);
  scene.addEventsListeners();

  if (!urlParamHas("nomusic")) {
    scene.music = scene.sound.add("village-theme");
    scene.music.loop = true;
    scene.music.play();
  }

  if (!urlParamHas("nostart")) intro(scene);
};
