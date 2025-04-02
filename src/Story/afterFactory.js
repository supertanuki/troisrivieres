import Game from "../Game";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { dispatchUnlockEvents } from "../Utils/events";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";

/** @param {Game} scene  */
export const afterFactory = function (scene) {
  scene.wakeGame();
  scene.isCinematic = true;
  scene.cameras.main.fadeIn(1000, 0, 0, 0);

  scene.currentDiscussionStatus = DiscussionStatus.NONE;
  setNightState(scene, true);
  toggleSpritesVisibility(scene, false, true);
  scene.whiteWorker1.setVisible(false);
  scene.whiteWorker2.setVisible(false);
  scene.whiteWorkerChief.setVisible(false);
  scene.django.setVisible(false);

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
        //scene.scene.launch("mine-nightmare");
        //scene.sleepGame();
        setNightState(scene, false);
        toggleSpritesVisibility(scene, true, true);
        toggleScreensVisibility(scene)

        scene.setHeroPosition("heroDjango");
        scene.hero.animateToRight();
        scene.hero.stopAndWait();

        dispatchUnlockEvents(["third_act_begin"]);
        scene.cameras.main.fadeIn(1000, 0, 0, 0);
        scene.isCinematic = false;
      });
      scene.events.off("update", updateCallback);
    }
  };

  scene.events.on("update", updateCallback);
};

export const toggleScreensVisibility = function (scene) {
  if (!scene.screens) {
    scene.screens = scene.map
      .createLayer("screens", scene.tileset)
      .setCollisionByProperty({ collide: true })
      .setDepth(49)
      .setVisible(false);
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

    scene.physics.add.collider(scene.hero, scene.screens);
  }

  const state = !scene.screens.visible;

  scene.screensTop.setVisible(state);
  scene.screens.setVisible(state);
  scene.adsTop.setVisible(state);
  scene.ads.setVisible(state);
};
