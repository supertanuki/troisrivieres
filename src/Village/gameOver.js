import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { handleAction } from "./handleAction";
import { switchNight } from "./night";

export const gameOver = function (scene) {
    switchNight(scene);

    scene.time.delayedCall(1000, () => {
        sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "gameOver");
        handleAction(scene);
        scene.isCinematic = true;
        scene.hero.stopAndWait();
    });
};
