import Game from "../Game";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import "../Sprites/DcWorkerChief";
import {
  fadeOutMusic,
  playIndustryTheme,
  playNightAmbiance,
  playNightmareTheme,
  playVillageAmbiance,
} from "../Utils/music";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { handleAction } from "../Village/handleAction";
import { fadeOutMessageLater } from "./afterMineNightmare";

/** @param {Game} scene  */
export const afterRecycling = function (scene) {
  scene.wakeGame();
  playNightAmbiance(scene);
  scene.isCinematic = true;

  scene.currentDiscussionStatus = DiscussionStatus.NONE;
  setNightState(scene, true);
  toggleSpritesVisibility(scene, false, true);
  scene.blueWorkerChief.setVisible(false);
  scene.blueWorker1.setVisible(false);
  scene.blueWorker2.setVisible(false);

  scene.setHeroPosition("heroRecycling");
  scene.hero.slowDown();
  scene.hero.animateToDown();

  scene.time.delayedCall(1500, () => {
    scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      scene.setHeroPosition("heroNightComeBack");
      scene.cameras.main.fadeIn(1000, 0, 0, 0);
      scene.hero.slowLeft();
      scene.hero.animateToLeft();
    });
  });

  const updateCallback = () => {
    const djangoDoor = scene.heroPositions["heroDjangoDoor"];

    // hero x at the door
    if (scene.hero.x > djangoDoor.x - 3 && scene.hero.x < djangoDoor.x + 3) {
      scene.hero.slowUp();
      scene.hero.animateToUp();
    }

    // end at the door
    if (scene.hero.y > djangoDoor.y + 11 && scene.hero.y < djangoDoor.y + 15) {
      playNightmareTheme(scene);
      scene.cameras.main.fadeOut(1000, 0, 0, 0);
      scene.time.delayedCall(3000, () => {
        scene.scene.launch("recycling-nightmare");
        scene.sleepGame();
      });
      scene.events.off("update", updateCallback);
    }
  };

  scene.events.on("update", updateCallback);
};

/** @param {Game} scene  */
export const afterRecyclingNightmare = function (scene) {
  scene.wakeGame(true);
  scene.isCinematic = true;

  scene.datacentreThemeEnabled = true;
  playIndustryTheme(scene);
  playVillageAmbiance(scene);
  scene.time.delayedCall(5000, () => fadeOutMusic(scene, scene.villageTheme));

  setVillageForFourthAct(scene);
  scene.setHeroPosition("heroDjangoDoor");
  scene.hero.setVisible(false);
  scene.hero.animateToDown();
  scene.hero.stopAndWait();

  scene.messageLater.setAlpha(1).setVisible(true).setY(100);
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

/** @param {Game} scene  */
export const setVillageForFourthAct = function (scene) {
  scene.cameras.main.setBounds(
    660, // left is disabled
    100, // top of the village is disabled
    2144 - 660, // mine on the right is disabled
    scene.map.heightInPixels - 108
  );
  console.log("setVillageForFourthAct");
  setNightState(scene, false);
  toggleSpritesVisibility(scene, true, true);
  scene.screenOffSprites.forEach((screen) => screen.enableShutdown());

  scene.dcBottomLayer = scene.map
    .createLayer("dcBottom", scene.tileset)
    .setDepth(120)
    .setCullPadding(2, 2);

  scene.dcBarriersFrontLayer = scene.map
    .createLayer("dcBarriersFront", scene.tileset)
    .setDepth(120)
    .setCullPadding(2, 2);

  scene.dcBarriersSideLayer = scene.map
    .createLayer("dcBarriersSide", scene.tileset)
    .setDepth(120)
    .setCullPadding(2, 2);

  scene.obstacleDcLayer = scene.map
    .createLayer("obstacleDc", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);

  scene.obstacleDcLayerCollider = scene.physics.add.collider(
    scene.hero,
    scene.obstacleDcLayer
  );

  for (const o of scene.map.getObjectLayer("sprites").objects) {
    if (o.name === "afterRecyclingBlueWorker1") {
      scene.blueWorker1.setPosition(o.x, o.y);
      scene.blueWorker1.setVisible(true);
    }

    if (o.name === "afterRecyclingBlueWorker2") {
      scene.blueWorker2.setPosition(o.x, o.y);
      scene.blueWorker2.setVisible(true);
    }

    if (o.name === "twoGuysAfterRecycling") scene.twoGuys.setPosition(o.x, o.y);

    if ("dcWorker" === o.name.substring(0, 8)) {
      for (let i = 1; i <= 4; i++) {
        const spriteId = `dcWorker${i}`;
        if (o.name !== spriteId) continue;
        if (i === 1) {
          scene.dcWorkerChief = scene.add.dcWorkerChief(o.x, o.y);
          scene.dcWorkerChief.on("pointerdown", () => handleAction(scene), this);
          scene.dcWorkerChiefCollider = scene.physics.add.collider(scene.dcWorkerChief, scene.hero, () => {
            sceneEventsEmitter.emit(sceneEvents.DiscussionReady, 'dcWorkerChief');
          });
          continue;
        }

        scene[spriteId] = scene.add.minerDirty(o.x, o.y, null, null, i);
        scene[spriteId].disableChatIcon();
        scene[spriteId].setDepth(1000);
      }
    }
  }

  // delete trees from DC space
  scene.treesOfDc.forEach((treeObject) => {
    treeObject.treeBase.destroy();
    treeObject.treeTop.destroy();
  });
  scene.treesOfDcCollider.forEach((e) => e.destroy());
  scene.treesOfDcColliders.destroy();
};
