import "../Sprites/Butterfly";

export const addButterflies = function (scene) {
  createButterfliesAnims(scene);

  scene.map.getObjectLayer("butterflies").objects.forEach((flyPosition) => {
    scene.butterflies.push(
      scene.add.butterfly(flyPosition.x, flyPosition.y).setDepth(160)
    );
  });
};

export const lessButterflies = function (scene) {
  scene.butterflies.forEach((butterfly, index) => {
    if (Phaser.Math.Between(0, 1)) {
      scene.butterflies.splice(index, 1);
      butterfly.destroy();
    }
  });
};

export const noMoreButterflies = function (scene) {
  scene.butterflies.forEach((butterfly) => butterfly.destroy());
  scene.butterflies = [];
};

const createButterfliesAnims = function (scene) {
  const anims = scene.anims;
};
