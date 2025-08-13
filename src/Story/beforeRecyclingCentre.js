import Game from "../Game";

/** @param {Game} scene  */
export const beforeRecyclingCentre = function (scene) {
  scene.cameras.main.setBounds(
    470, // left is disabled
    0,
    2144 - 470, // mine on the right is disabled
    scene.map.heightInPixels - 8
  );

  scene.landRecyclingLayer = scene.map
    .createLayer("landRecycling", scene.tileset)
    .setDepth(70)
    .setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.bottomRecyclingLayer = scene.map
    .createLayer("bottomRecycling", scene.tileset)
    .setDepth(70)
    .setCollisionByProperty({ collide: true });

  scene.riverLessWaterRecyclingLayer = scene.map
    .createLayer("riverLessWaterRecycling", scene.tileset)
    .setDepth(70)
    .setCollisionByProperty({ collide: true });

  scene.topRecyclingLayer = scene.map
    .createLayer("topRecycling", scene.tileset)
    .setDepth(119)
    .setCollisionByProperty({ collide: true });
  scene.physics.add.collider(scene.hero, scene.topRecyclingLayer);

  scene.topRecyclingObjectsLayer = scene.map
    .createLayer("topRecyclingObjects", scene.tileset)
    .setDepth(119)
    .setCollisionByProperty({ collide: true });

  scene.obstacleRecyclingLayer.setCollisionByProperty({ collide: false });
  scene.obstacleRecyclingLayer.destroy();
  scene.obstacleRecyclingCollider.destroy();
};
