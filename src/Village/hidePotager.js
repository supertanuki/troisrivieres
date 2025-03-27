import Game from "../Game";

/** @param {Game} scene  */
export const hidePotager = function (scene) {
  scene.potagerBottom.setVisible(false);
  scene.potagerTop.setVisible(false);
  scene.potagerTop.forEachTile((tile) => {
    tile.setCollision(false, false, false, false);
  });

  scene.potagerNoMore = scene.map
    .createLayer("potagerNoMore", scene.tileset)
    .setDepth(80);
};
