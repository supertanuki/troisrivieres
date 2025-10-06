import Game from "../Game";
import { playMiniGameTheme } from "../Utils/music";

/** @param {Game} scene  */
export const goToMine = function (scene) {
  scene.isCinematic = true;
  window.setTimeout(() => playMiniGameTheme(scene), 1);
  scene.cameras.main.fadeOut(scene.isBonus ? 1000 : 3000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    scene.scene.launch("mine");
    scene.sleepGame();
  });
};

/** @param {Game} scene  */
export const goToFactory = function (scene) {
  scene.isCinematic = true;
  window.setTimeout(() => playMiniGameTheme(scene), 1);
  scene.cameras.main.fadeOut(scene.isBonus ? 1000 : 3000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    scene.scene.launch("factory");
    scene.sleepGame();
  });
};

/** @param {Game} scene  */
export const goToRecycling = function (scene) {
  scene.isCinematic = true;
  window.setTimeout(() => playMiniGameTheme(scene), 1);
  scene.cameras.main.fadeOut(scene.isBonus ? 1000 : 3000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    scene.scene.launch("recyclingCentre");
    scene.sleepGame();
  });
};
