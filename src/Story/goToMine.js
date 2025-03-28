import Game from "../Game";

/** @param {Game} scene  */
export const goToMine = function (scene) {
  scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    scene.scene.launch("mine");
    scene.sleepGame();
  });
};
