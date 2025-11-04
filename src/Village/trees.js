export const createTrees = function (scene) {
  ['sapin', 'pin', 'arbre'].forEach((name) => {
    for (let i=1; i<=10; i++) {
      scene.anims.create({
        key: `${name}-${i}`,
        frames: scene.anims.generateFrameNames("trees", {
          start: 1,
          end: 2,
          prefix: `${name}-`,
        }),
        duration: Phaser.Math.Between(1900, 2200),
        repeat: -1,
      });
    }
  });

  scene.map.createLayer("bottomStaticTrees", scene.tileset).setDepth(130);
  scene.map.createLayer("staticTrees", scene.tileset).setDepth(150);
  createTreesLayer("trees", scene);
};

export const createTreesLayer = function (layerName, scene) {
  const treesLayer = scene.map.getObjectLayer(layerName);
  // sort tress in order to draw trees from top to down
  treesLayer.objects.sort((a, b) => a.y - b.y);

  treesLayer.objects.forEach((treeObject) => {
    // Add trees base
    const treeBase = scene.add
      .image(treeObject.x, treeObject.y - 8, "trees", `${treeObject.name}-base`)
      .setDepth(90)
      .setOrigin(0.5, 1);

    // Add trees top
    const treeTop = scene.physics.add
      .sprite(treeObject.x, treeObject.y - 24, "trees", `${treeObject.name}-1`)
      .setOrigin(0.5, 1)
      .setImmovable(true)
      .setDepth(130);

    treeTop.anims.play(`${treeObject.name}-${Phaser.Math.Between(1, 10)}`);

    const collider = scene.physics.add.sprite(treeObject.x, treeObject.y - 10, null)
      .setSize(8, 1)
      .setOrigin(0.5, 1)
      .setImmovable(true)
      .setVisible(false);

    // DC zone ?
    if (
      treeObject.x > 1097 &&
      treeObject.x < 1336 &&
      treeObject.y > 1000 &&
      treeObject.y < 1220
    ) {
      scene.treesOfDc.push({ treeBase, treeTop });
      scene.treesOfDcCollider.push(collider);
    } else {
      scene.pointsCollider.push(collider);
    }
  });
};
