import { Loader, Scene } from "phaser";
import Game from "../Game";
import { urlParamHas } from "./debug";

let loadingVillageTheme = false;
let loadingIndustryTheme = false;
let loadingMiniGameTheme = false;
let loadingDjangoTheme = false;
let loadingNightmareTheme = false;
let loadingVillageAmbianceV1 = false;
let loadingVillageAmbianceV2 = false;
let loadingNightAmbiance = false;

/** @param {Game} scene  */
export const playVillageTheme = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingVillageTheme ||
    (scene.villageTheme && scene.villageTheme.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.industryTheme);
  fadeOutMusic(scene, scene.miniGameTheme);
  fadeOutMusic(scene, scene.djangoTheme);
  fadeOutMusic(scene, scene.nightAmbiance);
  fadeOutMusic(scene, scene.nightmareTheme);

  if (scene.villageTheme && scene.sound.get("village-theme")) {
    fadeInMusic(scene, scene.villageTheme);
    return;
  }

  loadingVillageTheme = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("village-theme", "sounds/village_theme_compressed.mp3");
  loader.once("complete", () => {
    scene.villageTheme = scene.sound.add("village-theme");
    fadeInMusic(scene, scene.villageTheme);
    loadingVillageTheme = false;
  });
  loader.start();
};

/** @param {Game} scene  */
export const playIndustryTheme = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingIndustryTheme ||
    (scene.industryTheme && scene.industryTheme.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.villageTheme);
  fadeOutMusic(scene, scene.miniGameTheme);
  fadeOutMusic(scene, scene.villageAmbianceV1);
  fadeOutMusic(scene, scene.villageAmbianceV2);

  if (scene.industryTheme && scene.sound.get("industry-theme")) {
    fadeInMusic(scene, scene.industryTheme);
    return;
  }

  loadingIndustryTheme = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("industry-theme", "sounds/industry_theme_compressed.mp3");
  loader.once("complete", () => {
    scene.industryTheme = scene.sound.add("industry-theme");
    loadingIndustryTheme = false;
    fadeInMusic(scene, scene.industryTheme);
  });
  loader.start();
};

/** @param {Scene} scene  */
export const playMiniGameTheme = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingMiniGameTheme ||
    (scene.miniGameTheme && scene.miniGameTheme.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.industryTheme);

  if (scene.miniGameTheme && scene.sound.get("minigame-theme")) {
    fadeInMusic(scene, scene.miniGameTheme);
    return;
  }

  loadingMiniGameTheme = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("minigame-theme", "sounds/minigame_theme_compressed.mp3");
  loader.once("complete", () => {
    scene.miniGameTheme = scene.sound.add("minigame-theme");
    fadeInMusic(scene, scene.miniGameTheme);
    loadingMiniGameTheme = false;
  });
  loader.start();
};

/** @param {Game} scene  */
export const playDjangoTheme = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingDjangoTheme ||
    (scene.djangoTheme && scene.djangoTheme.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.villageTheme);
  if (scene.djangoTheme && scene.sound.get("django-theme")) {
    fadeInMusic(scene, scene.djangoTheme);
    return;
  }

  loadingDjangoTheme = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("django-theme", "sounds/django_theme.mp3");
  loader.once("complete", () => {
    scene.djangoTheme = scene.sound.add("django-theme");
    fadeInMusic(scene, scene.djangoTheme);
    loadingDjangoTheme = false;
  });
  loader.start();
};

/** @param {Game} scene  */
export const playNightmareTheme = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingNightmareTheme ||
    (scene.nightmareTheme && scene.nightmareTheme.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.nightAmbiance);
  fadeOutMusic(scene, scene.industryTheme);
  if (scene.nightmareTheme && scene.sound.get("nightmare-theme")) {
    fadeInMusic(scene, scene.nightmareTheme);
    return;
  }

  loadingNightmareTheme = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("nightmare-theme", "sounds/reve_theme_compressed.mp3");
  loader.once("complete", () => {
    scene.nightmareTheme = scene.sound.add("nightmare-theme");
    fadeInMusic(scene, scene.nightmareTheme);
    loadingNightmareTheme = false;
  });
  loader.start();
};

/** @param {Game} scene  */
export const playVillageAmbiance = function (scene) {
  if (scene.isNoMoreBirds) playVillageAmbianceV2(scene);
  else playVillageAmbianceV1(scene);
};

/** @param {Game} scene  */
export const playVillageAmbianceV1 = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingVillageAmbianceV1 ||
    (scene.villageAmbianceV1 && scene.villageAmbianceV1.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.villageAmbianceV2);

  if (scene.villageAmbianceV1 && scene.sound.get("village-ambiance-v1")) {
    fadeInMusic(scene, scene.villageAmbianceV1, 0.3);
    return;
  }

  loadingVillageAmbianceV1 = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("village-ambiance-v1", "sounds/sfx/sfx_ambiance_jour_v1.mp3");
  loader.once("complete", () => {
    scene.villageAmbianceV1 = scene.sound.add("village-ambiance-v1");
    fadeInMusic(scene, scene.villageAmbianceV1, 0.3);
    loadingVillageAmbianceV1 = false;
  });
  loader.start();
};

/** @param {Game} scene  */
export const playVillageAmbianceV2 = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingVillageAmbianceV2 ||
    (scene.villageAmbianceV2 && scene.villageAmbianceV2.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.villageAmbianceV1);

  if (scene.villageAmbianceV2 && scene.sound.get("village-ambiance-v2")) {
    fadeInMusic(scene, scene.villageAmbianceV2, 0.6);
    return;
  }

  loadingVillageAmbianceV2 = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("village-ambiance-v2", "sounds/sfx/sfx_ambiance_jour_v2.mp3");
  loader.once("complete", () => {
    scene.villageAmbianceV2 = scene.sound.add("village-ambiance-v2");
    fadeInMusic(scene, scene.villageAmbianceV2, 0.6);
    loadingVillageAmbianceV2 = false;
  });
  loader.start();
};

/** @param {Game} scene  */
export const playNightAmbiance = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingNightAmbiance ||
    (scene.nightAmbiance && scene.nightAmbiance.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.industryTheme);
  fadeOutMusic(scene, scene.miniGameTheme);
  fadeOutMusic(scene, scene.villageTheme);
  fadeOutMusic(scene, scene.villageAmbianceV1);
  fadeOutMusic(scene, scene.villageAmbianceV2);

  if (scene.nightAmbiance && scene.sound.get("night-ambiance")) {
    fadeInMusic(scene, scene.nightAmbiance, 0.3);
    return;
  }

  loadingNightAmbiance = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("night-ambiance", "sounds/sfx/sfx_ambiance_nuit_raccourci.mp3");
  loader.once("complete", () => {
    scene.nightAmbiance = scene.sound.add("night-ambiance");
    fadeInMusic(scene, scene.nightAmbiance, 0.3);
    loadingNightAmbiance = false;
  });
  loader.start();
};

export const fadeOutMusic = function (scene, music, duration = 2000) {
  if (!music || !music.isPlaying) return;

  scene.tweens.add({
    targets: music,
    volume: 0,
    duration,
    ease: "Linear",
    onComplete: () => {
      music.stop();
    },
  });
};

export const fadeInMusic = function (scene, music, volume = 1) {
  if (music.isPlaying) return;

  music.volume = 0;
  music.loop = true;
  music.play();

  scene.tweens.add({
    targets: music,
    volume,
    duration: 2000,
    ease: "Linear",
  });
};

export const preloadSound = function (soundName, scene) {
  if (!scene?.sounds || scene?.sounds[soundName]) return;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio(soundName, `sounds/sfx/${soundName}.mp3`);
  loader.once("complete", () => {
    scene.sounds[soundName] = scene.sound.add(soundName);
  });
  loader.start();
};

export const playSound = function (
  soundName,
  scene,
  simultaneous = false,
  volume = 1,
  loop = false
) {
  if (!scene?.sounds || !scene.sounds[soundName]) return;

  if (simultaneous) {
    scene.sound.play(soundName, { volume, loop });
    return;
  }

  if (scene.sounds[soundName].isPlaying) return;

  console.log(soundName, scene.sounds[soundName].isPlaying);

  scene.sounds[soundName].play({ volume, loop });
};

export const stopSound = function (soundName, scene) {
  if (!scene?.sounds || !scene.sounds[soundName]) return;
  if (!scene.sounds[soundName].isPlaying) return;

  scene.sounds[soundName].stop();
};
