import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { messageWorkflow } from "./messageWorkflow";

export default class Workflow {
  constructor() {
    this.currentSprite = null;
    this.unlockedEvents = [];

    this.spritePosition = {}

    sceneEventsEmitter.on(
      sceneEvents.DiscussionStarted,
      this.startDiscussion,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionContinuing,
      this.continueDiscussion,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.EventsUnlocked,
      this.unlockMessages,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.PreEventsUnlocked,
      this.saveUnlockedEvent,
      this
    );
  }

  initSpriteThreadIfNeeded(sprite) {
    if (!this.spritePosition?.[sprite]) {
      this.spritePosition[sprite] = {
        currentThread: 0,
        currentMessagePosition: 0,
        threadRead: [],
      };
    }
  }

  setCurrentThread(sprite, currentThread) {
    this.initSpriteThreadIfNeeded(sprite);
    this.spritePosition[sprite].currentThread = currentThread;
  }

  getCurrentThread(sprite) {
    const thisSprite = sprite || this.currentSprite;
    this.initSpriteThreadIfNeeded(thisSprite);
    return this.spritePosition[thisSprite].currentThread;
  }

  getCurrentMessage() {
    const currentThread = this.getCurrentThread();
    const currentMessagePosition = this.spritePosition?.[this.currentSprite]?.currentMessagePosition

    if (undefined == currentThread || undefined == currentMessagePosition) return

    const dependingOn = messageWorkflow[this.currentSprite][currentThread]?.dependingOn;
    if (!this.isValidDependingOn(this.currentSprite, dependingOn)) return

    if (this.spritePosition[this.currentSprite].threadRead.includes(currentThread)) {
      const repeat = messageWorkflow[this.currentSprite][currentThread]?.repeat
      if (!!repeat)         return repeat?.[currentMessagePosition];
      
    }

    return messageWorkflow[this.currentSprite][currentThread]?.messages?.[currentMessagePosition];
  }

  startDiscussion(sprite) {
    this.initSpriteThreadIfNeeded(sprite);
    this.currentSprite = sprite;
    const nextAvailableThread = this.getNextAvailableThread(sprite, this.getCurrentThread())
    
    if (undefined !== nextAvailableThread) {
      this.setCurrentThread(sprite, nextAvailableThread);
      this.resetMessagePosition(sprite);
    }

    // last thread or repeat
    this.resetMessagePosition(sprite);
    this.sendMessage();
  }

  resetMessagePosition(sprite) {
    this.spritePosition[sprite].currentMessagePosition = 0;
  }

  getNextAvailableThread(sprite, currentThread) {
    if (!messageWorkflow[sprite][currentThread]) return;

    const dependingOn = messageWorkflow[sprite][currentThread]?.dependingOn;

    if (this.isValidDependingOn(sprite, dependingOn) &&
      !this.spritePosition[sprite].threadRead.includes(currentThread)
    ) return currentThread;

    return this.getNextAvailableThread(sprite, currentThread + 1);
  }

  continueDiscussion() {
    this.spritePosition[this.currentSprite].currentMessagePosition++;
    this.sendMessage();
  }

  sendMessage() {
    let message = this.getCurrentMessage();

    if (!message) {
      this.endThread();

      // next thread ?
      const nextAvailableThread = this.getNextAvailableThread(this.currentSprite, this.getCurrentThread() + 1)
      if (undefined == nextAvailableThread) {
        this.endDiscussion();
        return;
      }

      this.setCurrentThread(this.currentSprite, nextAvailableThread);
      this.resetMessagePosition(this.currentSprite);
      message = this.getCurrentMessage();
    }

    sceneEventsEmitter.emit(sceneEvents.DiscussionInProgress);
    sceneEventsEmitter.emit(sceneEvents.MessageSent, {
      sprite: this.currentSprite,
      message,
    });
  }

  endThread() {
    this.spritePosition[this.currentSprite].threadRead.push(this.getCurrentThread())
    this.preSaveUnlockedEvent();
  }

  endDiscussion() {
    sceneEventsEmitter.emit(sceneEvents.DiscussionEnded, this.currentSprite);
  }

  preSaveUnlockedEvent() {
    const currentThread = this.getCurrentThread();
    const unlockedEvents =
      messageWorkflow[this.currentSprite][currentThread]?.unlockEvents;

    this.saveUnlockedEvent(unlockedEvents);
  }

  saveUnlockedEvent(unlockedEvents) {
    if (!unlockedEvents) return
    if (!unlockedEvents.filter(event => !this.unlockedEvents.includes(event)).length) return;

    sceneEventsEmitter.emit(sceneEvents.EventsUnlocked, {
      newUnlockedEvents: unlockedEvents,
      unlockedEvents: [...unlockedEvents, ...this.unlockedEvents],
    });
  }

  isValidDependingOn(sprite, dependingOn) {
    if (!dependingOn) return true;

    return dependingOn.every((event) => {
      return (event[0] !== "!") === this.unlockedEvents.includes(event);
    });
  }

  unlockMessages(data) {
    for (const sprite in messageWorkflow) {
      this.initSpriteThreadIfNeeded(sprite);
      for (const threadIndex in messageWorkflow[sprite]) {
        const dependingOn = messageWorkflow[sprite][threadIndex]?.dependingOn

        if (!dependingOn) {
          continue;
        }

        const missingEvents = dependingOn.filter(event => !this.unlockedEvents.includes(event))

        if (missingEvents.length > 0 && missingEvents.every(event => data.newUnlockedEvents.includes(event))) {
          this.spritePosition[sprite].currentThread = threadIndex * 1 - 1
          this.spritePosition[sprite].currentMessagePosition = 0
        }
      }
    }

    this.unlockedEvents.push(...data.newUnlockedEvents);
  }
}
