import Game from "../Game";

/** @param {Game} scene  */
export const hideBikes = function (scene) {
  scene.bikes.forEach((bike) => {
    bike.setVisible(false);
    bike.body.checkCollision.none = true;
  });
};

/** @param {Game} scene  */
export const showBikes = function (scene) {
  scene.bikes.forEach((bike) => {
    bike.setVisible(true);
    bike.body.checkCollision.none = false;
  });
};
