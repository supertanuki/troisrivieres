export const toggleSpritesVisibility = function (
  scene,
  state,
  withDjango = false,
  withMiners = false
) {
  [
    scene.koko,
    scene.sleepingGuy,
    scene.twoGuys,
    scene.baby,
    scene.twoWomen,
    scene.bino,
    scene.fisherman,
    scene.dog,
    scene.escargot,
    scene.cat,
    scene.boy,
    scene.girl,
    scene.ball,
    ...(withDjango ? [scene.django] : []),
    ...(withMiners
      ? [
          scene.miner,
          scene?.minerChief,
          scene?.minerDirty2,
          scene?.minerDirty3,
          scene?.minerDirty4,
        ]
      : []),
  ].forEach((sprite) => {
    if (!sprite) return;
    sprite.setVisible(state);
    sprite.setActive(state);
    sprite.body.checkCollision.none = !state;
  });

  if (scene.isNoMoreBirds) return;

  scene.birds.forEach((bird) => state ? bird.show() : bird.hide());

  scene.butterflies.forEach((butterfly) => {
    butterfly.setVisible(state);
    butterfly.setActive(state);
  });
};
