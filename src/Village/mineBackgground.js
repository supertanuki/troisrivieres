import { Loader } from "phaser";
import Game from "../Game";

/** @param {Game} scene  */
export const addMineBackground = function (scene) {
  const loader = new Loader.LoaderPlugin(scene);
  loader.atlas("mineLand", "sprites/mineLand.png", "sprites/mineLand.json");
  loader.once("complete", () => addMineBackgroundAfterLoading(scene));
  loader.start();
};

export const removeMineBackground = function (scene) {
  if (!scene.mineBackgground1) return;
  scene.mineBackgground1.destroy();
  scene.mineBackgground2.destroy();
  scene.mineMount.destroy();
  scene.mineMine.destroy();
  scene.mineMachine.destroy();
};

const addMineBackgroundAfterLoading = function (scene) {
  scene.mineBackgground1 = scene.add
    .image(0, 0, "mineLand", "background")
    .setOrigin(0, 0)
    .setScrollFactor(0.05, 0.1);

  scene.mineBackgground2 = scene.add
    .image(400, 0, "mineLand", "background")
    .setOrigin(0, 0)
    .setScrollFactor(0.05, 0.1);

  scene.mineMount = scene.add
    .image(180, 100, "mineLand", "mine-mount")
    .setOrigin(0, 0)
    .setScrollFactor(0.1, 0.25);

  scene.mineMine = scene.add
    .image(340, 124, "mineLand", "mine")
    .setOrigin(0, 0)
    .setScrollFactor(0.18, 0.32);

  scene.mineMachine = scene.add
    .image(1692, 240, "mineLand", "mine-machine")
    .setOrigin(0, 0)
    .setScrollFactor(0.7, 0.7);
};
