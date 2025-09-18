import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { dispatchUnlockEvents } from "../Utils/events";
import { handleAction } from "../Village/handleAction";

/** @param {Game} scene  */
export const beforeStrike = function (scene) {
  scene.isCinematic = true;
  scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;

    scene.screenOffSprites.forEach((screen) => screen.shutdown());
    scene.setHeroPosition("heroDjangoRight");
    scene.hero.slowLeft();
    scene.hero.animateToLeft();

    scene.cameras.main.fadeIn(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      scene.isCinematic = false;
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "django");
      handleAction(scene);
    });
  });
};

/** @param {Game} scene  */
export const strike = function (scene) {
  scene.isCinematic = true;
  scene.hero.stopAndWait();
  scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    setVillageOnStrike(scene);

    scene.cameras.main.fadeIn(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      dispatchUnlockEvents(["strike_begin"]);
      scene.isCinematic = false;
    });
  });
};

/** @param {Game} scene  */
const setVillageOnStrike = function (scene) {
  scene.checkDjangoDoor = false;
  scene.setHeroPosition("heroStrike");
  scene.hero.slowUp();
  scene.hero.animateToUp();
  scene.dcWorker3.scaleX = 1;

  scene.map.getObjectLayer("sprites").objects.forEach((o) => {
    if (o.name === "strikeDcWorker1") {
      scene.dcWorker1.setPosition(o.x, o.y);
      scene.dcWorker1.disableChatIcon();
      scene.dcWorker1.setDepth(1000);
    }

    if (o.name === "strikeDcWorker4") {
      scene.dcWorker4.setPosition(o.x, o.y);
      scene.dcWorker4.scaleX = 1;
    }    

    if (o.name === "djangoStrike") {
      scene.django.setPosition(o.x, o.y);
    }

    if (o.name === "girlStrike") {
      scene.girl.setPosition(o.x, o.y);
      scene.girl.disableChatIcon();
    }

    if (o.name === "boyStrike") {
      scene.boy.setPosition(o.x, o.y);
      scene.boy.disableChatIcon();
      scene.boy.scaleX = -1;
    }

    if (o.name === "binoStrike") {
      scene.bino.setPosition(o.x, o.y);
      scene.bino.disableChatIcon();
    }

    if (o.name === "minoStrike") {
      scene.fisherman.setOnStrike(o.x, o.y);
      scene.fisherman.disableChatIcon();
    }

    if (o.name === "babyStrike") {
      scene.baby.setPosition(o.x, o.y);
      scene.baby.disableChatIcon();
    }

    if (o.name === "dogStrike") {
      scene.dog.setPosition(o.x, o.y);
    }

    if (o.name === "catStrike") {
      scene.cat.setPosition(o.x, o.y);
      scene.cat.scaleX = 1;
    }

    if (o.name === "nonoStrike") {
      scene.nono.setPosition(o.x, o.y);
      scene.nono.disableChatIcon();
    }

    if (o.name === "twoGuysStrike") {
      scene.twoGuys.setPosition(o.x, o.y);
      scene.twoGuys.disableChatIcon();
    }

    if (o.name === "twoWomenStrike") {
      scene.twoWomen.setPosition(o.x, o.y);
      scene.twoWomen.disableChatIcon();
    }

    if (o.name === "sleepingGuyStrike") {
      scene.sleepingGuy.setPosition(o.x, o.y);
    }

    if (o.name === "kokoStrike") {
      scene.koko.setPosition(o.x, o.y);
    }
  });
};
