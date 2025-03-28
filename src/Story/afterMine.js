import Game from "../Game";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";

/** @param {Game} scene  */
export const afterMine = function (scene) {
  scene.wakeGame();
  scene.isCinematic = true;
  scene.cameras.main.fadeIn(1000, 0, 0, 0);

  scene.currentDiscussionStatus = DiscussionStatus.NONE;
  setNightState(scene, true);

  scene.setHeroPosition("heroMine");
  scene.hero.slowLeft();
  scene.hero.animateToLeft();
  toggleSpritesVisibility(scene, false, true, true);

  scene.time.delayedCall(2000, () => {
    scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      scene.setHeroPosition("heroAfterMine");
      scene.cameras.main.fadeIn(1000, 0, 0, 0);

      scene.time.delayedCall(2200, () => {
        scene.hero.slowUp();
        scene.hero.animateToUp();

        scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
          if (progress !== 1) return;
          scene.time.delayedCall(2000, () => {
            scene.scene.launch("mine-nightmare");
            scene.sleepGame();
          });
        });
      });
    });
  });
};
