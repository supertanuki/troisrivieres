import { Loader, Scene } from "phaser";
import Game from "../Game";
import { urlParamHas } from "./debug";

let loadingVillageTheme = false;
let loadingIndustryTheme = false;
let loadingMiniGameTheme = false;

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
  if (scene.industryTheme && scene.sound.get("industry-theme")) {
    fadeInMusic(scene, scene.industryTheme);
    return;
  }

  loadingIndustryTheme = true;
  const loader = new Loader.LoaderPlugin(scene);
  loader.audio("industry-theme", "sounds/industry_theme_compressed.mp3");
  loader.once("complete", () => {
    scene.industryTheme = scene.sound.add("industry-theme");
    fadeInMusic(scene, scene.industryTheme);
    loadingIndustryTheme = false;
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
  fadeOutMusic(scene, scene.villageTheme);
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

const fadeOutMusic = function (scene, music) {
  if (!music || !music.isPlaying) return;

  scene.tweens.add({
    targets: music,
    volume: 0,
    duration: 2000,
    ease: "Linear",
    onComplete: () => {
      music.stop();
    },
  });
};

const fadeInMusic = function (scene, music) {
  if (music.isPlaying) return;

  music.volume = 0;
  music.loop = true;
  music.play();

  scene.tweens.add({
    targets: music,
    volume: 1,
    duration: 2000,
    ease: "Linear",
  });
};

export const preloadSound = function (soundName, scene) {
  if (scene?.sounds[soundName]) return;
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
  if (!scene.sounds[soundName]) return;

  if (simultaneous) {
    scene.sound.play(soundName, { volume, loop });
    return;
  }

  if (scene.sounds[soundName].isPlaying) return;

  console.log(soundName, scene.sounds[soundName].isPlaying);

  scene.sounds[soundName].play({ volume, loop });
};

export const stopSound = function (soundName, scene) {
  if (!scene.sounds[soundName]) return;
  if (!scene.sounds[soundName].isPlaying) return;

  scene.sounds[soundName].stop();
};
