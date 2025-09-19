import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { playIndustryTheme, playVillageTheme } from "../Utils/music";
import { noMoreBirds } from "../Village/birds";
import { noMoreButterflies } from "../Village/butterflies";
import { handleAction } from "../Village/handleAction";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import "../Sprites/BlueWorkerChief";

/** @param {Game} scene  */
export const afterFactory = function (scene) {
  scene.wakeGame();
  playIndustryTheme(scene);
  scene.isCinematic = true;
  scene.cameras.main.fadeIn(1000, 0, 0, 0);

  scene.currentDiscussionStatus = DiscussionStatus.NONE;
  setNightState(scene, true);
  toggleSpritesVisibility(scene, false, true);

  scene.whiteWorker1.setVisible(false);
  scene.whiteWorker2.setVisible(false);
  scene.whiteWorkerChief.setVisible(false);

  scene.setHeroPosition("heroFactory");
  scene.hero.slowDown();
  scene.hero.animateToDown();

  scene.time.delayedCall(2000, () => {
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
        scene.scene.launch("factory-nightmare");
        scene.sleepGame();
      });
      scene.events.off("update", updateCallback);
    }
  };

  scene.events.on("update", updateCallback);
};

/** @param {Game} scene  */
export const afterFactoryNightmare = function (scene) {
  scene.wakeGame(true);
  playVillageTheme(scene);
  setVillageForThirdAct(scene);
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

export const setVillageForThirdAct = function (scene) {
  console.log("setVillageForThirdAct");
  noMoreBirds(scene);
  noMoreButterflies(scene);
  setNightState(scene, false);
  toggleSpritesVisibility(scene, true, true);
  toggleScreensVisibility(scene);
  scene.ball.setVisible(false);

  scene.cameras.main.setBounds(
    470, // left is disabled
    0,
    2144 - 470, // mine on the right is disabled
    scene.map.heightInPixels - 8
  );

  scene.landRecyclingLayer = scene.map
    .createLayer("landRecycling", scene.tileset)
    .setDepth(70)
    .setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.bottomRecyclingLayer = scene.map
    .createLayer("bottomRecycling", scene.tileset)
    .setDepth(70)
    .setCollisionByProperty({ collide: true });

  scene.riverLessWaterRecyclingLayer = scene.map
    .createLayer("riverLessWaterRecycling", scene.tileset)
    .setDepth(70)
    .setCollisionByProperty({ collide: true });

  scene.topRecyclingLayer = scene.map
    .createLayer("topRecycling", scene.tileset)
    .setDepth(119)
    .setCollisionByProperty({ collide: true });
  scene.topRecyclingCollider = scene.physics.add.collider(scene.hero, scene.topRecyclingLayer);

  scene.topRecyclingObjectsLayer = scene.map
    .createLayer("topRecyclingObjects", scene.tileset)
    .setDepth(119)
    .setCollisionByProperty({ collide: true });

  scene.obstacleRecyclingLayer.setCollisionByProperty({ collide: false });
  scene.obstacleRecyclingLayer.destroy();
  scene.obstacleRecyclingCollider.destroy();

  for (const spriteObject of scene.map.getObjectLayer("sprites").objects) {
    if (spriteObject.name === "boyThirdAct") {
      scene.boy.setThirdAct(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "girlThirdAct") {
      scene.girl.setThirdAct(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "babyThirdAct") {
      scene.baby.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "afterFactoryWhiteWorker1") {
      scene.whiteWorker1.setPosition(spriteObject.x, spriteObject.y);
      scene.whiteWorker1.scaleX = 1;
      scene.whiteWorker1.setOffset(0, scene.whiteWorker1.height / 2);
      scene.whiteWorker1.setVisible(true);
      scene.whiteWorker1.disableChatIcon();
    }

    if (spriteObject.name === "afterFactoryWhiteWorker2") {
      scene.whiteWorker2.setPosition(spriteObject.x, spriteObject.y);
      scene.whiteWorker2.setVisible(true);
      scene.whiteWorker2.disableChatIcon();
    }

    if (spriteObject.name === "blueWorkerChief") {
      scene.blueWorkerChief = scene.add.blueWorkerChief(
        spriteObject.x,
        spriteObject.y
      );
      scene.blueWorkerChief.on("pointerdown", () => handleAction(scene), scene);
      scene.physics.add.collider(scene.blueWorkerChief, scene.hero, () => {
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "blueWorkerChief");
      });
    }
  }
};

export const toggleScreensVisibility = function (scene) {
  if (!scene.screens) {
    scene.screens = scene.map
      .createLayer("screens", scene.tileset)
      .setCollisionByProperty({ collide: true })
      .setDepth(49)
      .setVisible(false);

    scene.screensCollider = scene.physics.add.collider(scene.hero, scene.screens);

    scene.screensTop = scene.map
      .createLayer("screensTop", scene.tileset)
      .setDepth(149)
      .setVisible(false);

    scene.ads = scene.map
      .createLayer("ads", scene.tileset)
      .setDepth(50)
      .setVisible(false);
    scene.adsTop = scene.map
      .createLayer("adsTop", scene.tileset)
      .setDepth(150)
      .setVisible(false);
  }

  const state = !scene.screens.visible;
  console.log(scene.screens, state)

  scene.screensTop.setVisible(state);
  scene.screens.setVisible(state);
  scene.adsTop.setVisible(state);
  scene.ads.setVisible(state);

  /** @todo: to move? */
  scene.obstacleBridgeLayer.setCollisionByProperty({ collide: false });
  scene.obstacleBridgeLayer.destroy();
  scene.obstacleBridgeLayerCollider.destroy();
};
