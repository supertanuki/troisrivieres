export const createTrees = function (scene) {
  // Add trees
  scene.anims.create({
    key: "sapin",
    frames: scene.anims.generateFrameNames("trees", {
      start: 1,
      end: 2,
      prefix: "sapin-",
    }),
    repeat: -1,
    frameRate: 1,
  });
  scene.anims.create({
    key: "arbre",
    frames: scene.anims.generateFrameNames("trees", {
      start: 1,
      end: 2,
      prefix: "arbre-",
    }),
    repeat: -1,
    frameRate: 1,
  });
  scene.anims.create({
    key: "pin",
    frames: scene.anims.generateFrameNames("trees", {
      start: 1,
      end: 2,
      prefix: "pin-",
    }),
    repeat: -1,
    frameRate: 1,
  });

  createTreesLayer("trees", scene);

  scene.map.createLayer("bottomStaticTrees", scene.tileset).setDepth(130);
  scene.map.createLayer("staticTrees", scene.tileset).setDepth(150);
};

export const createTreesLayer = function (layerName, scene) {
  const treesLayer = scene.map.getObjectLayer(layerName);
  // sort tress in order to draw trees from top to down
  treesLayer.objects.sort((a, b) => a.y - b.y);
  // Add trees base
  treesLayer.objects.forEach((treeObject) => {
    scene.add
      .image(treeObject.x, treeObject.y - 8, "trees", `${treeObject.name}-base`)
      .setDepth(90)
      .setOrigin(0.5, 1);
  });

  // Add trees top
  treesLayer.objects.forEach((treeObject) => {
    const tree = scene.physics.add
      .sprite(
        treeObject.x,
        treeObject.y - 24,
        "trees",
        `${treeObject.name}-1`
      )
      .setOrigin(0.5, 1)
      .setImmovable(true)
      .setDepth(130);

    tree.anims.play(treeObject.name);

    scene.pointsCollider.push(
      scene.physics.add
        .sprite(treeObject.x, treeObject.y - 10, null)
        .setSize(8, 1)
        .setOrigin(0.5, 1)
        .setImmovable(true)
        .setVisible(false)
    );
  });
}