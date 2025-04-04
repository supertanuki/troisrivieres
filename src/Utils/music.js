import { Loader } from "phaser";
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
    console.log('playIndustryTheme', scene.industryTheme?.isPlaying)
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

/** @param {Game} scene  */
export const playMiniGameTheme = function (scene) {
    console.log("playMiniGameTheme")
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
        console.log("loaded minigame-theme")
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

  console.log("fadeInMusic" + music)

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
