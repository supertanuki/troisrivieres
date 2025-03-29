import Game from "../Game";

/** @param {Game} scene  */
export const addMineBackground = function (scene) {
  scene.add
    .image(0, 0, "mineLand", "background")
    .setOrigin(0, 0)
    .setScrollFactor(0.05, 0.1);

  scene.add
    .image(400, 0, "mineLand", "background")
    .setOrigin(0, 0)
    .setScrollFactor(0.05, 0.1);

  scene.add
    .image(180, 100, "mineLand", "mine-mount")
    .setOrigin(0, 0)
    .setScrollFactor(0.1, 0.25);

  scene.add
    .image(340, 124, "mineLand", "mine")
    .setOrigin(0, 0)
    .setScrollFactor(0.18, 0.32);

  scene.add
    .image(1692, 240, "mineLand", "mine-machine")
    .setOrigin(0, 0)
    .setScrollFactor(0.7, 0.7);
}
