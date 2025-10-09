import Game from "../Game";
import "../Sprites/Nono";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { handleAction } from "../Village/handleAction";
import { switchNight } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import { playVillageAmbiance, playVillageTheme, preloadSound } from "../Utils/music";

/** @param {Game} scene  */
export const firstSleep = function (scene) {
  scene.isCinematic = true;
  scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    scene.time.delayedCall(2000, () => endFirstSleep(scene));
  })
};

/** @param {Game} scene  */
export const endFirstSleep = function (scene) {
  scene.isCinematic = true;
  playVillageTheme(scene);
  playVillageAmbiance(scene);
  scene.setHeroPosition("heroDjangoDoor");
  scene.hero.slowRightDown();
  scene.hero.animateToRight();
  switchNight(scene);

  villageStateAfterFirstSleep(scene);

  sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, ["first_sleep"]);
  scene.cameras.main.fadeIn(1000, 0, 0, 0);
  
  scene.time.delayedCall(1000, () => {
    scene.isCinematic = false;
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
    handleAction(scene);
  });
};

/** @param {Game} scene  */
export const villageStateAfterFirstSleep = function (scene) {
  showRiverPolluted(scene);
  toggleSpritesVisibility(scene, true);
  scene.boy.setSad();
  scene.girl.setSad();
  scene.fisherman.setSad();

  addNono(scene);
  preloadSound("sfx_objet_inventaire", scene);
};

const addNono = function (scene) {
  for (const spriteObject of scene.map.getObjectLayer("sprites").objects) {
    if (spriteObject.name === "nono") {
      scene.nono = scene.add.nono(spriteObject.x, spriteObject.y);
      scene.nono.on("pointerdown", () => handleAction(scene), this);

      scene.physics.add.collider(scene.nono, scene.hero, () => {
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "nono");
      });

      break;
    }
  }
};

/** @param {Game} scene  */
export const showRiverPolluted = function (scene) {
  if (scene.riverPolluted) return;
  scene.riverPolluted = scene.map
    .createLayer("riverPolluted", scene.tileset)
    .setDepth(45);
  scene.landUpRiverPolluted = scene.map
    .createLayer("landUpRiverPolluted", scene.tileset)
    .setDepth(46);
  scene.bridgesShadowPolluted = scene.map
    .createLayer("bridgesShadowPolluted", scene.tileset)
    .setDepth(51);
};
