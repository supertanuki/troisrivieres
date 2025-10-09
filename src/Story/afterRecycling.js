import Game from "../Game";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import "../Sprites/Screen";
import "../Sprites/DcWorkerChief";
import {
  playIndustryTheme,
  playVillageAmbiance,
  playVillageTheme,
} from "../Utils/music";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { handleAction } from "../Village/handleAction";

/** @param {Game} scene  */
export const afterRecycling = function (scene) {
  scene.wakeGame();
  playIndustryTheme(scene);
  scene.isCinematic = true;
  scene.cameras.main.fadeIn(1000, 0, 0, 0);

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
  playVillageTheme(scene);
  playVillageAmbiance(scene);
  setVillageForFourthAct(scene);
  scene.cameras.main.fadeIn(1000, 0, 0, 0);
  scene.datacentreThemeEnabled = true;
  scene.setHeroPosition("heroDjango");
  scene.hero.slowRight();
  scene.hero.animateToRight();
  scene.time.delayedCall(1200, () => {
    scene.isCinematic = false;
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
    handleAction(scene);
  });
};

/** @param {Game} scene  */
export const setVillageForFourthAct = function (scene) {
  scene.cameras.main.setBounds(
    1000, // left is disabled
    400, // top of the village is disabled
    2144 - 1000, // mine on the right is disabled
    scene.map.heightInPixels - 408
  );
  console.log("setVillageForFourthAct");
  setNightState(scene, false);
  toggleSpritesVisibility(scene, true, true);

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

  // Add screens off
  scene.anims.create({
    key: "screen-off",
    frames: scene.anims.generateFrameNames("sprites", {
      start: 1,
      end: 3,
      prefix: "screen-off-",
    }),
    repeat: 0,
    frameRate: 10,
  });

  let screenIndex = 1;
  scene.screens.forEachTile((tile) => {
    if (tile.properties?.screen === true) {
      scene.screenOffSprites.push(
        scene.add.screen(
          tile.getCenterX() + 1,
          tile.getCenterY() - 3,
          screenIndex
        )
      );
      screenIndex++;
    }
  });
};
