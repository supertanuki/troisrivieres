import Game from "../Game";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { playNightAmbiance, playNightmareTheme } from "../Utils/music";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";

/** @param {Game} scene  */
export const afterMine = function (scene) {
  scene.wakeGame();
  playNightAmbiance(scene);
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
      scene.setHeroPosition("heroNightComeBack");
      scene.cameras.main.fadeIn(1000, 0, 0, 0);
      scene.hero.slowLeft();
      scene.hero.animateToLeft();
    });
  });

  const updateCallback = () => {
    const djangoDoor = scene.heroPositions["heroDjangoDoor"];

    // hero x at the door
    if (
      scene.hero.x > djangoDoor.x - 3 &&
      scene.hero.x < djangoDoor.x + 3
    ) {
      scene.hero.slowUp();
      scene.hero.animateToUp();
    }

    // end at the door
    if (
      scene.hero.y > djangoDoor.y + 11 &&
      scene.hero.y < djangoDoor.y + 15
    ) {
      playNightmareTheme(scene);
      scene.cameras.main.fadeOut(1000, 0, 0, 0);
      scene.time.delayedCall(3000, () => {
        scene.scene.launch("mine-nightmare");
        scene.sleepGame();
      });
      scene.events.off("update", updateCallback);
    }
  };

  scene.events.on("update", updateCallback);
};
