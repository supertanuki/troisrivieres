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
import { villageStateAfterFirstSleep } from "./firstSleep";
import { playVillageTheme } from "../Utils/music";
import { createTreesLayer } from "../Village/trees";

/** @param {Game} scene  */
export const afterMineNightmare = function (scene) {
  scene.wakeGame(true);
  playVillageTheme(scene);
  scene.currentDiscussionStatus = DiscussionStatus.NONE;
  setVillageForSecondAct(scene);
  scene.setHeroPosition("heroDjango");
  scene.hero.slowRight();
  scene.hero.animateToRight();

  // @todo ? remove delayedcall and check when mai is near django ?
  scene.time.delayedCall(1200, () => {
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
  scene.hero.stopAndWait();
  scene.isCinematic = true;
  switchNight(scene);

  removeMineBackground(scene);
  villageStateAfterFirstSleep(scene);
  toggleRoadsVisibility(scene);
  secondRiverLessWater(scene);
  hideBikes(scene);
  hidePotager(scene);
  scene.bino.setCleaningRoad();

  toggleSpritesVisibility(scene, true, true, true);
  lessBirds(scene);
  lessButterflies(scene);
  scene.deer.setVisible(false);
  scene.owl.destroy();

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
  }
};
