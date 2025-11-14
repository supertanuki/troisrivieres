import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { DiscussionStatus } from "../Utils/discussionStatus";
import {
  playNightAmbiance,
  playNightmareTheme,
  playVillageAmbiance,
  playVillageTheme,
} from "../Utils/music";
import { noMoreBirds } from "../Village/birds";
import { noMoreButterflies } from "../Village/butterflies";
import { handleAction } from "../Village/handleAction";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import "../Sprites/BlueWorkerChief";
import "../Sprites/BlueWorker";
import "../Sprites/Screen";
import { createBlueWorkerAnimation } from "../Sprites/BlueWorker";
import { fadeOutMessageLater } from "./afterMineNightmare";

/** @param {Game} scene  */
export const afterFactory = function (scene) {
  scene.wakeGame();
  playNightAmbiance(scene);
  scene.isCinematic = true;
  scene.cameras.main.fadeIn(1000, 0, 0, 0);

  scene.currentDiscussionStatus = DiscussionStatus.NONE;
  setNightState(scene, true);
  toggleSpritesVisibility(scene, false, true);

  scene.whiteWorker1.setVisible(false);
  scene.whiteWorker2.setVisible(false);
  scene.whiteWorkerChief.destroy();

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
      playNightmareTheme(scene);
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
  scene.isCinematic = true;
  setVillageForThirdAct(scene);
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

export const setVillageForThirdAct = function (scene) {
  console.log("setVillageForThirdAct");
  setNightState(scene, false);

  // important here for village ambiance
  scene.isNoMoreBirds = true;
  playVillageTheme(scene);
  playVillageAmbiance(scene);

  toggleSpritesVisibility(scene, true, true);
  toggleScreensVisibility(scene);

  // after toggleSpritesVisibility
  scene.time.delayedCall(1, () => {
    noMoreBirds(scene);
    noMoreButterflies(scene);
  });

  scene.cameras.main.setBounds(
    470, // left is disabled
    0,
    2144 - 470, // mine on the right is disabled
    scene.map.heightInPixels - 8
  );

  scene.obstacleBridgeLayer.setCollisionByProperty({ collide: false });
  scene.obstacleBridgeLayer.destroy();
  scene.obstacleBridgeLayerCollider.destroy();

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
    .setDepth(69)
    .setCollisionByProperty({ collide: true });

  scene.riverRecyclingPollutedLayer = scene.map
    .createLayer("riverRecyclingPolluted", scene.tileset)
    .setDepth(70);

  scene.topRecyclingLayer = scene.map
    .createLayer("topRecycling", scene.tileset)
    .setDepth(119)
    .setCollisionByProperty({ collide: true });
  scene.topRecyclingCollider = scene.physics.add.collider(
    scene.hero,
    scene.topRecyclingLayer
  );

  scene.topRecyclingObjectsLayer = scene.map
    .createLayer("topRecyclingObjects", scene.tileset)
    .setDepth(119)
    .setCollisionByProperty({ collide: true });

  scene.obstacleRecyclingLayer.setCollisionByProperty({ collide: false });
  scene.obstacleRecyclingCollider.destroy();

  createBlueWorkerAnimation(scene);

  for (const o of scene.map.getObjectLayer("sprites").objects) {
    if (o.name === "boyThirdAct") {
      scene.boy.setThirdAct(o.x, o.y);
    }

    if (o.name === "girlThirdAct") {
      scene.girl.setThirdAct(o.x, o.y);
    }

    if (o.name === "babyThirdAct") {
      scene.baby.setPosition(o.x, o.y);
    }

    if (o.name === "afterFactoryWhiteWorker1") {
      scene.whiteWorker1.setPosition(o.x, o.y);
      scene.whiteWorker1.scaleX = 1;
      scene.whiteWorker1.setOffset(0, scene.whiteWorker1.height / 2);
      scene.whiteWorker1.setVisible(true);
      scene.whiteWorker1.disableChatIcon();
    }

    if (o.name === "afterFactoryWhiteWorker2") {
      scene.whiteWorker2.setPosition(o.x, o.y);
      scene.whiteWorker2.setVisible(true);
      scene.whiteWorker2.disableChatIcon();
    }

    if (o.name === "twoGuysRecycling") {
      scene.twoGuys.enableChatIcon();
      scene.twoGuys.setPosition(o.x, o.y);
    }

    if (o.name === "blueWorkerChief") {
      scene.blueWorkerChief = scene.add.blueWorkerChief(o.x, o.y);
      scene.blueWorkerChief.on("pointerdown", () => handleAction(scene), scene);
      scene.physics.add.collider(scene.blueWorkerChief, scene.hero, () => {
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "blueWorkerChief");
      });
    }

    if (o.name === "blueWorker1") {
      scene.blueWorker1 = scene.add.blueWorker(o.x, o.y, null, null, 1);
      scene.blueWorker1.on("pointerdown", () => handleAction(scene), scene);
      scene.physics.add.collider(scene.blueWorker1, scene.hero, () => {
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "blueWorker1");
      });
    }

    if (o.name === "blueWorker2") {
      scene.blueWorker2 = scene.add.blueWorker(o.x, o.y, null, null, 2);
      scene.blueWorker2.on("pointerdown", () => handleAction(scene), scene);
      scene.physics.add.collider(scene.blueWorker2, scene.hero, () => {
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "blueWorker2");
      });
    }
  }
};

export const toggleScreensVisibility = function (scene) {
  // Add screens off anim
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

  // Add ads anim
  // @todo: stay more on the fourth frame of each ads
  scene.anims.create({
    key: "ads",
    frames: scene.anims.generateFrameNames("sprites", {
      start: 1,
      end: 13,
      prefix: "ads-",
    }),
    repeat: -1,
    frameRate: 2,
  });

  if (!scene.screens) {
    scene.screens = scene.map
      .createLayer("screens", scene.tileset)
      .setDepth(49)
      .setVisible(false);

    let screenIndex = 1;
    scene.screens.forEachTile((tile) => {
      if (tile.properties?.screen === true) {
        scene.pointsCollider.push(
          scene.physics.add
            .sprite(tile.getCenterX() + 1, tile.getCenterY() - 8, null)
            .setSize(18, 1)
            .setImmovable(true)
            .setVisible(false)
        );

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

    scene.screensTop = scene.map
      .createLayer("screensTop", scene.tileset)
      .setDepth(149)
      .setVisible(false);
  }

  const state = !scene.screens.visible;

  scene.screensTop.setVisible(state);
  scene.screens.setVisible(state);
};
