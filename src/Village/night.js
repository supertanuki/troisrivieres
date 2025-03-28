const nightColor = 0x000055;

export const switchNight = function (scene) {
  initNight(scene);

  if (scene.night) {
    setNightState(scene, false);
    return;
  }

  scene.night = true;
  scene.darkOverlay.setAlpha(0);
  scene.darkOverlay.setVisible(true);
  scene.tweens.add({
    targets: scene.darkOverlay,
    alpha: 0.3,
    duration: 3000,
    ease: "Sine.easeInOut",
  });

  scene.nightOverlays.forEach((nightOverlay) => {
    nightOverlay.setAlpha(0);
    nightOverlay.setVisible(true);
    scene.tweens.add({
      targets: nightOverlay,
      alpha: 1,
      duration: 3000,
      ease: "Sine.easeInOut",
    });
  });
};

export const updateNightPosition = function (scene) {
  const noX = scene.hero.x - scene.scale.width;
  const noY = scene.hero.y - scene.scale.height;

  scene.nightOverlays.forEach((nightOverlay) =>
    nightOverlay.setPosition(noX, noY)
  );
  scene.maskNightOverlays.forEach((maskNightOverlay) =>
    maskNightOverlay.setPosition(noX, noY)
  );
  scene.darkOverlay.setPosition(scene.hero.x, scene.hero.y);
};

export const setNightState = function (scene, state) {
  initNight(scene);
  scene.night = state;
  scene.darkOverlay.setVisible(state);
  if (state) scene.darkOverlay.setAlpha(0.3);
  scene.maskNightOverlays.forEach((maskNightOverlay) =>
    maskNightOverlay.setVisible(state)
  );
  scene.nightOverlays.forEach((nightOverlay) => nightOverlay.setVisible(state));
};

const addNightCircle = function (scene, radius) {
  const nightOverlay = scene.add.graphics();
  nightOverlay.fillStyle(nightColor, 0.3);
  nightOverlay.fillRect(0, 0, scene.scale.width * 2, scene.scale.height * 2);
  nightOverlay.setVisible(false);
  nightOverlay.setDepth(1000);

  const maskGraphics = scene.make.graphics();
  maskGraphics.fillStyle(0xffffff);
  maskGraphics.fillCircle(scene.scale.width, scene.scale.height, radius);

  const mask = maskGraphics.createGeometryMask();
  mask.invertAlpha = true;
  nightOverlay.setMask(mask);
  scene.maskNightOverlays.push(maskGraphics);
  scene.nightOverlays.push(nightOverlay);
};

const initNight = function (scene) {
  if (scene.darkOverlay) {
    return;
  }

  addNightCircle(scene, 50);
  addNightCircle(scene, 80);
  addNightCircle(scene, 100);

  scene.darkOverlay = scene.add
    .rectangle(
      scene.scale.width / 4,
      scene.scale.height / 4,
      scene.scale.width * 2,
      scene.scale.height * 2,
      nightColor
    )
    .setOrigin(0.5, 0.5)
    .setVisible(false)
    .setDepth(1000);
};
