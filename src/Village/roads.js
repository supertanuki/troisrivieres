import Game from "../Game";

/** @param {Game} scene  */
export const toggleRoadsVisibility = function (scene) {
  if (!scene.roads) {
    scene.roadsBottom = scene.map
      .createLayer("roadsBottom", scene.tileset)
      .setDepth(95)
      .setVisible(false);
    scene.roads = scene.map
      .createLayer("roads", scene.tileset)
      .setDepth(96)
      .setVisible(false);
    scene.roadsTop = scene.map
      .createLayer("roadsTop", scene.tileset)
      .setDepth(97)
      .setVisible(false);
    scene.cars = scene.map
      .createLayer("cars", scene.tileset)
      .setDepth(98)
      .setVisible(false);
  }

  const enabled = scene.roads.visible;
  scene.roads.setVisible(!enabled);
  scene.roadsBottom.setVisible(!enabled);
  scene.roadsTop.setVisible(!enabled);
  scene.cars.setVisible(!enabled);

  scene.bridgesShadow.setVisible(enabled);
  scene.bridges.setVisible(enabled);
  scene.bridgesTop.setVisible(enabled);
};
