import Game from "../Game";
import { dispatchUnlockEvents } from "../Utils/events";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import "../Sprites/Screen";
import { playIndustryTheme, playVillageTheme } from "../Utils/music";
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
  playVillageTheme(scene);
  setVillageForFourthAct(scene);
  scene.cameras.main.fadeIn(1000, 0, 0, 0);
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
  console.log("setVillageForFourthAct");
  setNightState(scene, false);
  toggleSpritesVisibility(scene, true, true);

  scene.dcBottomLayer = scene.map
    .createLayer("dcBottom", scene.tileset)
    .setDepth(120)
    //.setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.dcBarriersFrontLayer = scene.map
    .createLayer("dcBarriersFront", scene.tileset)
    .setDepth(120)
    //.setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.dcBarriersSideLayer = scene.map
    .createLayer("dcBarriersSide", scene.tileset)
    .setDepth(120)
    //.setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.obstacleDcLayer = scene.map
    .createLayer("obstacleDc", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);

  scene.obstacleDcLayerCollider = scene.physics.add.collider(
    scene.hero,
    scene.obstacleDcLayer
  );

  // delete trees from DC space
  scene.treesOfDc.forEach((treeObject) => {
    treeObject.treeBase.setVisible(false);
    treeObject.treeTop.setVisible(false);
  });

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
