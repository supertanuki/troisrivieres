import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { handleAction } from "../Village/handleAction";
import { switchNight } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";

/** @param {Game} scene  */
export const firstSleep = function (scene) {
  scene.isCinematic = true;
  scene.cameras.main.fadeOut(1000, 0, 0, 0);
  scene.time.delayedCall(1000, () => endFirstSleep(scene));
};

/** @param {Game} scene  */
export const endFirstSleep = function (scene) {
  scene.isCinematic = true;
  scene.hero.slowRight();
  scene.hero.animateToRight();
  scene.setHeroPosition("heroDjango");
  switchNight(scene);

  villageStateAfterFirstSleep(scene);

  sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, ["first_sleep"]);
  sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");

  scene.time.delayedCall(1000, () => {
    scene.cameras.main.fadeIn(1000, 0, 0, 0);
    scene.time.delayedCall(800, () => {
      scene.isCinematic = false;
      handleAction(scene);
    });
  });
};

/** @param {Game} scene  */
export const villageStateAfterFirstSleep = function (scene) {
  showRiverPolluted(scene);
  toggleSpritesVisibility(scene, true);
  scene.boy.setSad();
  scene.girl.setSad();
  scene.fisherman.setSad();
  scene.nono.setVisible(true);
  scene.nono.body.checkCollision.none = false;
};

/** @param {Game} scene  */
export const showRiverPolluted = function (scene) {
  if (scene.riverPolluted) return;
  scene.riverPolluted = scene.map.createLayer("riverPolluted", scene.tileset).setDepth(45);
  scene.landUpRiverPolluted = scene.map.createLayer("landUpRiverPolluted", scene.tileset).setDepth(46);
  scene.bridgesShadowPolluted = scene.map.createLayer("bridgesShadowPolluted", scene.tileset).setDepth(51);
}