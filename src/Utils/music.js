import { Loader } from "phaser";
import Game from "../Game";
import { urlParamHas } from "./debug";

let loadingVillageTheme = false;
let loadingIndustryTheme = false;

/** @param {Game} scene  */
export const playVillageTheme = function (scene) {
  if (
    urlParamHas("nomusic") ||
    loadingVillageTheme ||
    (scene.villageTheme && scene.villageTheme.isPlaying)
  )
    return;

  fadeOutMusic(scene, scene.industryTheme);
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
