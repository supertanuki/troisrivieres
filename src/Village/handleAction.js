import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { DiscussionStatus } from "../Utils/discussionStatus";

export const handleAction = function (scene) {
  if (scene.isCinematic) return;

  console.log(scene.currentDiscussionStatus)

  if (scene.currentDiscussionStatus === DiscussionStatus.WAITING) {
    scene.currentDiscussionStatus = DiscussionStatus.STARTED;
    sceneEventsEmitter.emit(sceneEvents.DiscussionContinuing);
    return;
  }

  if (scene.currentDiscussionStatus === DiscussionStatus.READY) {
    scene.currentDiscussionStatus = DiscussionStatus.STARTED;
    sceneEventsEmitter.emit(
      sceneEvents.DiscussionStarted,
      scene.currentDiscussionSprite
    );
    return;
  }
};
