import Game from "../Game";

/** @param {Game} scene  */
export const toggleRoadsVisibility = function (scene) {
  if (!scene.roads) {
    scene.roadsBottom = scene.map
      .createLayer("roadsBottom", scene.tileset)
      .setDepth(69)
      .setVisible(false);

    scene.roads = scene.map
      .createLayer("roads", scene.tileset)
      .setDepth(70)
      .setVisible(false);

    scene.roadsTop = scene.map
      .createLayer("roadsTop", scene.tileset)
      .setDepth(97)
      .setVisible(false);

    scene.carsBottom = scene.map
      .createLayer("carsBottom", scene.tileset)
      .setDepth(98)
      .setVisible(false);

    scene.carsTop = scene.map
      .createLayer("carsTop", scene.tileset)
      .setCollisionByProperty({ collide: true })
      .setDepth(120)
      .setVisible(false);

    scene.carsTop.forEachTile((tile) => {
      if (tile.properties?.pointCollide === true) {
        scene.pointsCollider.push(
          scene.physics.add
            .sprite(tile.getCenterX(), tile.getCenterY(), null)
            .setSize(10, 1)
            .setImmovable(true)
            .setVisible(false)
        );
      }
    });

    scene.carsTopCollider = scene.physics.add.collider(scene.hero, scene.carsTop);

    // smooth collision management
    scene.carsBottomCollides = [];
    scene.carsTop.forEachTile((tile) => {
      if (tile.properties?.bottomCollide === true) {
        scene.carsBottomCollides.push(
          scene.physics.add
            .sprite(tile.getCenterX(), tile.getCenterY()+8, null)
            .setSize(16, 1)
            .setImmovable(true)
            .setVisible(false)
        );
      }
    });
    scene.carsBottomCollider = scene.physics.add.collider(scene.hero, scene.carsBottomCollides);
  }

  const enabled = scene.roads.visible;
  scene.roads.setVisible(!enabled);
  scene.roadsBottom.setVisible(!enabled);
  scene.roadsTop.setVisible(!enabled);
  scene.carsTop.setVisible(!enabled);
  scene.carsBottom.setVisible(!enabled);

  scene.bridgesShadow.setVisible(enabled);
  scene.bridges.setVisible(enabled);
  scene.bridgesTop.setVisible(enabled);
};
