import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";

export const addCollisionManagement = function (scene) {
  scene.physics.add.collider(scene.miner, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "miner");
  });

  scene.physics.add.collider(scene.bino, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "bino");
  });

  scene.physics.add.collider(scene.django, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
  });

  scene.physics.add.collider(scene.koko, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "koko");
  });

  scene.physics.add.collider(scene.sleepingGuy, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "sleepingGuy");
  });

  scene.physics.add.collider(scene.twoWomen, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "twoWomen");
  });

  scene.physics.add.collider(scene.baby, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "baby");
  });

  scene.physics.add.collider(scene.twoGuys, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "twoGuys");
  });

  scene.physics.add.collider(scene.fisherman, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "fisherman");
  });

  scene.physics.add.collider(scene.cat, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "cat");
  });

  scene.physics.add.collider(scene.dog, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "dog");
  });

  scene.physics.add.collider(scene.escargot, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "escargot");
  });

  scene.physics.add.collider(scene.cow, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "cow");
  });

  scene.physics.add.collider(scene.veal, scene.hero);

  scene.physics.add.collider(scene.boy, scene.hero, () => {
    sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "boy");
  });

  scene.physics.add.collider(scene.bikes, scene.hero);

  scene.physics.add.collider(scene.hero, scene.water);
  scene.physics.add.collider(scene.hero, scene.land);
  scene.physics.add.collider(scene.hero, scene.obstacles);
  scene.physics.add.collider(scene.hero, scene.topObjects);
  scene.physics.add.collider(scene.hero, scene.potagerTop);
  scene.physics.add.collider(scene.hero, scene.bottomObjects);
  scene.physics.add.collider(scene.hero, scene.pointsCollider);
};
