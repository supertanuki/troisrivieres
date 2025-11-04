import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import "../Sprites/WhiteWorker";
import "../Sprites/WhiteWorkerChief";
import { createWhiteWorkerAnimation } from "../Sprites/WhiteWorker";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { lessBirds } from "../Village/birds";
import { lessButterflies } from "../Village/butterflies";
import { handleAction } from "../Village/handleAction";
import { hideBikes } from "../Village/hideBikes";
import { hidePotager } from "../Village/hidePotager";
import { removeMineBackground } from "../Village/mineBackgground";
import { switchNight } from "../Village/night";
import { toggleRoadsVisibility } from "../Village/roads";
import { secondRiverLessWater } from "../Village/secondRiverLessWater";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import { playVillageAmbiance, playVillageTheme } from "../Utils/music";
import { createTreesLayer } from "../Village/trees";
import { getUiMessage } from "../Workflow/messageWorkflow";

/** @param {Game} scene  */
export const afterMineNightmare = function (scene) {
  scene.wakeGame(true);
  scene.isCinematic = true;
  playVillageTheme(scene);
  playVillageAmbiance(scene);
  scene.currentDiscussionStatus = DiscussionStatus.NONE;
  setVillageForSecondAct(scene);
  scene.setHeroPosition("heroDjangoDoor");
  scene.hero.setVisible(false);
  scene.hero.animateToDown();
  scene.hero.stopAndWait();

  scene.messageLater.setVisible(true);
  scene.time.delayedCall(3000, () => fadeOutMessageLater(scene));

  scene.time.delayedCall(2500, () => {
    scene.hero.setVisible(true);
    scene.hero.slowRightDown();
    scene.hero.animateToRight();
  });

  // @todo ? remove delayedcall and check when mai is near django ?
  scene.time.delayedCall(3500, () => {
    scene.isCinematic = false;
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
    handleAction(scene);
  });
};

export const setVillageForSecondAct = function (scene) {
  scene.cameras.main.setBounds(
    0,
    0,
    2144, // mine on the right is disabled
    scene.map.heightInPixels - 8
  );

  scene.messageLater = scene.add
    .bitmapText(
      225,
      100,
      "FreePixelStrokeShadow-16",
      getUiMessage("betweenActs.later"),
      16
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0)
    .setDepth(10000)
    .setVisible(false);

  switchNight(scene);

  removeMineBackground(scene);
  toggleRoadsVisibility(scene);
  secondRiverLessWater(scene);
  hideBikes(scene);
  hidePotager(scene);
  scene.bino.setCleaningRoad();

  toggleSpritesVisibility(scene, true, true, true);
  lessBirds(scene);
  lessButterflies(scene);
  scene.deer.setVisible(false);
  scene.owl.setVisible(false);

  scene.ball.destroy();
  scene.ball = null;

  scene.obstacleBridgeLayer = scene.map
    .createLayer("obstacleBridge", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);
  scene.obstacleBridgeLayerCollider = scene.physics.add.collider(
    scene.hero,
    scene.obstacleBridgeLayer
  );

  scene.obstaclesFactoryLayer.setCollisionByProperty({ collide: false });
  scene.obstaclesFactoryCollider.destroy();

  createTreesLayer("treesLimitForest", scene);
  scene.obstaclesForestLayer = scene.map
    .createLayer("obstaclesForest", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);
  scene.physics.add.collider(scene.hero, scene.obstaclesForestLayer);

  createWhiteWorkerAnimation(scene);

  for (const o of scene.map.getObjectLayer("sprites").objects) {
    if (o.name === `minerAfterMine`) {
      scene.miner.setPositionAfterMine(o.x, o.y);
      scene.miner.disableChatIcon();
    }

    if (o.name === `minoAfterMine`) {
      scene.fisherman.setPosition(o.x, o.y);
    }

    for (let i = 2; i <= 4; i++) {
      if (o.name === `afterMineMiner${i}`) {
        const miner = scene[`minerDirty${i}`];
        miner.setPosition(o.x, o.y);
        miner.disableChatIcon();
        miner.scaleX = 1;
      }
    }

    if (o.name === "whiteWorkerChief") {
      scene.whiteWorkerChief = scene.add.whiteWorkerChief(o.x, o.y);
      scene.whiteWorkerChief.on(
        "pointerdown",
        () => handleAction(scene),
        scene
      );
      scene.physics.add.collider(scene.whiteWorkerChief, scene.hero, () => {
        sceneEventsEmitter.emit(
          sceneEvents.DiscussionReady,
          "whiteWorkerChief"
        );
      });
    }

    if (o.name === "boyFactory") {
      scene.boy.setPosition(o.x, o.y);
      scene.boy.setSize(scene.boy.width, 1);
    }

    if (o.name === "girlFactory") {
      scene.girl.setPosition(o.x, o.y);
    }

    for (let i = 1; i <= 2; i++) {
      if (o.name === `whiteWorker${i}`) {
        scene[`whiteWorker${i}`] = scene.add.whiteWorker(
          o.x,
          o.y,
          null,
          null,
          i
        );
        scene[`whiteWorker${i}`].on(
          "pointerdown",
          () => handleAction(scene),
          scene
        );
        scene.physics.add.collider(scene[`whiteWorker${i}`], scene.hero, () => {
          sceneEventsEmitter.emit(
            sceneEvents.DiscussionReady,
            `whiteWorker${i}`
          );
        });
      }
    }

    if (o.name === "minerZad1") {
      scene[o.name] = scene.add.miner(o.x, o.y);
      scene[o.name].spriteId = o.name;
      scene[o.name].moveAndUnlock(o.x, o.y);
      scene[o.name].on("pointerdown", () => handleAction(scene), this);
      scene.physics.add.collider(scene[o.name], scene.hero, () =>
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, o.name)
      );
    }

    if (o.name === "minerZad2") {
      scene[o.name] = scene.add.minerDirty(o.x, o.y);
      scene[o.name].setSpriteNumber(3);
      scene[o.name].enableChatIcon();
      scene[o.name].spriteId = o.name;
      scene[o.name].on("pointerdown", () => handleAction(scene), this);
      scene.physics.add.collider(scene[o.name], scene.hero, () =>
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, o.name)
      );
    }
  }

  // ZAD
  scene.landZad = scene.map.createLayer("landZad", scene.tileset).setDepth(20);
  scene.upLandZad = scene.map
    .createLayer("upLandZad", scene.tileset)
    .setDepth(21);
  scene.bottomZad = scene.map
    .createLayer("bottomZad", scene.tileset)
    .setDepth(70);
  scene.topZad = scene.map.createLayer("topZad", scene.tileset).setDepth(120);
  scene.forestZad = scene.map
    .createLayer("forestZad", scene.tileset)
    .setDepth(119);
};

export const fadeOutMessageLater = (scene) => {
  scene.tweens.add({
    targets: scene.messageLater,
    alpha: 0,
    y: 80,
    ease: "Sine.easeIn",
    duration: 1000,
    onComplete: () => scene.messageLater.setVisible(false),
  });
};
