import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";

export const eventsHas = (data, eventName) =>
  data.newUnlockedEvents.includes(eventName);

export const dispatchUnlockEvents = (events) =>
  sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, events);
