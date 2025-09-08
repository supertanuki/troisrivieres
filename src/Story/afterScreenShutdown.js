import Game from "../Game";

/** @param {Game} scene  */
export const afterScreenShutdown = function (scene) {
  scene.isCinematic = true;
  scene.hero.stopAndWait();
  scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    scene.setHeroPosition("heroKoko");
    scene.cameras.main.fadeIn(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      scene.isCinematic = false;
    });
  });
};
