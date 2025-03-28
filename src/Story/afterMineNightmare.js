import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { lessBirds } from "../Village/birds";
import { lessButterflies } from "../Village/butterflies";
import { handleAction } from "../Village/handleAction";
import { hideBikes } from "../Village/hideBikes";
import { hidePotager } from "../Village/hidePotager";
import { switchNight } from "../Village/night";
import { toggleRoadsVisibility } from "../Village/roads";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import { villageStateAfterFirstSleep } from "./firstSleep";

/** @param {Game} scene  */
export const afterMineNightmare = function (scene) {
    scene.wakeGame();
    scene.currentDiscussionStatus = DiscussionStatus.NONE;
    scene.hero.stopAndWait();
    scene.isCinematic = true;
    switchNight(scene);
    villageStateAfterFirstSleep(scene);
    toggleRoadsVisibility(scene);
    hideBikes(scene);
    hidePotager(scene);
    scene.bino.setCleaningRoad();
    
    scene.setHeroPosition("heroDjango");
    scene.hero.slowRight();
    scene.hero.animateToRight();

    toggleSpritesVisibility(scene, true, true, true);
    lessBirds(scene);
    lessButterflies(scene);

    scene.time.delayedCall(1200, () => {
      scene.isCinematic = false;
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
      handleAction(scene);
    });
}