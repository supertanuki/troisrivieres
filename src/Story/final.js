import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { playDjangoTheme, playVillageAmbianceV1 } from "../Utils/music";
import { showBirds } from "../Village/birds";
import { handleAction } from "../Village/handleAction";
import { showBikes } from "../Village/hideBikes";

/** @param {Game} scene  */
export const beforeFinal = function (scene) {
  scene.isCinematic = true;
  scene.isBeforeFinal = true;
  playVillageAmbianceV1(scene);

  scene.cameras.main.stopFollow();
  scene.tweens.add({
    targets: scene.cameras.main,
    scrollY: scene.cameras.main.scrollY - 50,
    ease: "Sine.easeIn",
    duration: 2000,
  });

  scene.cameras.main.fadeOut(2000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    scene.sleepGame();
    scene.scene.launch("final-message");
  });
};

/** @param {Game} scene  */
export const afterFinalMessage = function (scene) {
  scene.isCinematic = true;
  scene.wakeGame();
  setVillageFinalVersion(scene);

  scene.cameras.main.fadeIn(2000, 0, 0, 0, (cam, progress) => {
    // force slow right
    scene.hero.slowRight();
    if (progress !== 1) return;
    scene.isCinematic = false;
    scene.hero.stopAndWait();
  });

  scene.cameras.main.startFollow(scene.hero, true);
  scene.setHeroPosition("heroFinal");
  scene.hero.slowRight();
  scene.hero.animateToRight();
};

/** @param {Game} scene  */
export const setVillageFinalVersion = function (scene, debug = false) {
  scene.cameras.main.setBounds(
    470, // left is disabled
    400, // top is disabled
    2144 - 470, // mine on the right is disabled
    scene.map.heightInPixels - 408
  );
  scene.checkDjangoDoor = false;
  scene.datacentreThemeEnabled = false;

  showBikes(scene);
  showBirds(scene);

  scene.obstacleDcLayer.destroy();
  scene.obstacleDcLayerCollider.destroy();

  scene.carsTopCollider.destroy();
  scene.roads.destroy();
  scene.roadsTop.destroy();
  scene.carsTop.destroy();
  scene.carsBottom.destroy();

  scene.carsBottomCollides.forEach((e) => e.destroy());
  scene.carsBottomCollider.destroy();

  scene.dcBottomLayer.destroy();
  scene.dcBarriersFrontLayer.destroy();
  scene.dcBarriersSideLayer.destroy();
  scene.obstacleDcLayer.destroy();

  scene.potagerBottom.setVisible(true);
  scene.potagerTop.setVisible(true);
  scene.physics.add.collider(scene.hero, scene.potagerTop);

  scene.riverPolluted.destroy();
  scene.landUpRiverPolluted.destroy();
  scene.bridgesShadowPolluted.destroy();

  const riverFinalLayer = scene.map
    .createLayer("riverFinal", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setDepth(45);
  scene.physics.add.collider(scene.hero, riverFinalLayer);
  scene.map.createLayer("riverFinalTop", scene.tileset).setDepth(45);

  scene.topRecyclingCollider.destroy();
  scene.topRecyclingLayer.destroy();
  scene.topRecyclingObjectsLayer.destroy();
  scene.landRecyclingLayer.destroy();
  scene.bottomRecyclingLayer.destroy();
  scene.riverRecyclingPollutedLayer.destroy();

  scene.screens.destroy();
  scene.screensTop.destroy();

  scene.screenOffSprites.forEach((screen) => screen.destroy());
  scene.map.createLayer("screensDamaged", scene.tileset).setDepth(49);
  scene.map.createLayer("screensDamagedTop", scene.tileset).setDepth(149);
  scene.map.createLayer("carsDamagedBottom", scene.tileset).setDepth(98);

  scene.obstacleRecyclingLayer.setCollisionByProperty({ collide: true });
  scene.obstacleRecyclingCollider = scene.physics.add.collider(
    scene.hero,
    scene.obstacleRecyclingLayer
  );

  scene.obstaclesFactoryLayer.setCollisionByProperty({ collide: true });
  scene.obstaclesFactoryCollider = scene.physics.add.collider(
    scene.hero,
    scene.obstaclesFactoryLayer
  );

  const carsTop = scene.map
    .createLayer("carsDamagedTop", scene.tileset)
    .setDepth(120);

  carsTop.forEachTile((tile) => {
    if (tile.properties?.bottomCollide === true) {
      scene.pointsCollider.push(
        scene.physics.add
          .sprite(tile.getCenterX(), tile.getCenterY() + 8, null)
          .setSize(16, 1)
          .setImmovable(true)
          .setVisible(false)
      );
    }
  });

  scene.map.createLayer("roadsDamaged", scene.tileset).setDepth(96);

  scene.dcWorkerChief.disableChatIcon();
  scene.dcWorkerChief.destroy();
  for (let i = 2; i <= 4; i++) {
    const spriteId = `dcWorker${i}`;
    scene[spriteId].disableChatIcon();
    scene[spriteId].destroy();
  }

  scene.miner.destroy();
  for (let i = 2; i <= 4; i++) {
    scene[`minerDirty${i}`].destroy();
  }

  scene.whiteWorker1.destroy();
  scene.whiteWorker2.destroy();
  scene.whiteWorkerChief.destroy();

  scene.blueWorker1.destroy();
  scene.blueWorker2.destroy();

  scene.baby.disableChatIcon();
  scene.baby.destroy();

  scene.map.getObjectLayer("sprites").objects.forEach((o) => {
    if (o.name === "binoFinal")
      scene.bino.setPosition(o.x, o.y).disableChatIcon();

    if (o.name === "minoFinal") scene.fisherman.setFinal(o.x, o.y);

    if (o.name === "kokoFinal")
      scene.koko.setPosition(o.x, o.y).disableChatIcon();

    if (o.name === "nonoFinal")
      scene.nono.setPosition(o.x, o.y).disableChatIcon();

    if (o.name === "djangoFinal") scene.django.setFinal(o.x, o.y);

    if (o.name === "girlFinal") scene.girl.setFinal(o.x, o.y);

    if (o.name === "boyFinal") scene.boy.setFinal(o.x, o.y);

    if (o.name === "dogFinal") scene.dog.setPosition(o.x, o.y);

    if (o.name === "catFinal") scene.cat.setPosition(o.x, o.y);

    if (o.name === "twoGuysFinal") {
      scene.twoGuys.enableChatIcon();
      scene.twoGuys.setPosition(o.x, o.y);
    }

    if (o.name === "twoWomenFinal") {
      scene.twoWomen.enableChatIcon();
      scene.twoWomen.setPosition(o.x, o.y);
    }

    if (o.name === "deerFinal")
      scene.deer.setPosition(o.x, o.y).setVisible(true);

    if (o.name === "owlFinal") scene.owl.setPosition(o.x, o.y).setVisible(true);

    if (o.name === "cowFinal") {
      scene.cow.setPosition(o.x, o.y);
      scene.cow.setVisible(true);
      scene.cow.setActive(true);
      scene.cow.toRight();
      scene.cow.body.checkCollision.none = false;
    }

    if (o.name === "cowHiddenFinal") {
      scene.cowHidden.setPosition(o.x, o.y);
      scene.cowHidden.setVisible(true);
      scene.cowHidden.setActive(true);
      scene.cowHidden.body.checkCollision.none = false;
    }

    if (o.name === "vealFinal") {
      scene.veal.setPosition(o.x, o.y);
      scene.veal.setVisible(true);
      scene.veal.setActive(true);
      scene.veal.body.checkCollision.none = false;
    }

    if (o.name === "sleepingGuyFinal") scene.sleepingGuy.setPosition(o.x, o.y);
  });

  scene.landZad.destroy();
  scene.upLandZad.destroy();
  scene.bottomZad.destroy();
  scene.topZad.destroy();
  scene.forestZad.destroy();
  scene.minerZad1.destroy();
  scene.minerZad2.destroy();

  sceneEventsEmitter.on(sceneEvents.EventsUnlocked, (data) => {
    if (eventsHas(data, "django_final_end")) {
      scene.time.delayedCall(200, () => {
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "bino");
        handleAction(scene);
      });
    }
  });

  if (debug) return;

  const updateCallback = () => {
    const djangoDoor = scene.heroPositions["heroDjangoDoor"];
    const delta = 130;
    // hero next to django
    if (
      scene.hero.x > scene.django.x - delta &&
      scene.hero.y > scene.django.y - delta &&
      scene.hero.y < scene.django.y + delta
    ) {
      scene.events.off("update", updateCallback);
      dispatchUnlockEvents(["django_final"]);
      scene.isFinal = true;
      playDjangoTheme(scene);
      scene.isCinematic = true;
      scene.cameras.main.fadeOut(500, 0, 0, 0, (cam, progress) => {
        if (progress !== 1) return;

        scene.setHeroPosition("heroDjangoFinal");
        scene.hero.slowUp();
        scene.hero.animateToUp();

        scene.cameras.main.fadeIn(500, 0, 0, 0, (cam, progress) => {
          if (progress !== 1) return;
          scene.stopMoving();
          scene.isCinematic = false;
          sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
          handleAction(scene);
        });
      });
    }
  };

  scene.events.on("update", updateCallback);
};
