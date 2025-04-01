import Game from "../Game";

/** @param {Game} scene  */
export const secondRiverLessWater = function (scene) {
  if (!scene.riverLessWater) {
    scene.riverLessWater = scene.map
      .createLayer("riverLessWater", scene.tileset)
      .setDepth(40)
      .setVisible(false);
  }
  const visible = !scene.riverLessWater.visible
  scene.riverLessWater.setVisible(visible);
};
