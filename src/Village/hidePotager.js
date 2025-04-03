import Game from "../Game";

/** @param {Game} scene  */
export const hidePotager = function (scene) {
  scene.potagerBottom.setVisible(false);
  scene.potagerTop.setVisible(false);
  scene.potagerTop.forEachTile((tile) => {
    tile.setCollision(false, false, false, false);
  });

  scene.cow.setVisible(false);
  scene.cow.setActive(false);
  scene.cow.body.checkCollision.none = true;

  scene.veal.setVisible(false);
  scene.veal.setActive(false);
  scene.veal.body.checkCollision.none = true;
};
