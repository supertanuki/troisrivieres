import Game from "../Game";
import { dispatchUnlockEvents } from "../Utils/events";

/** @param {Game} scene  */
export const strike = function (scene) {
  scene.isCinematic = true;
  scene.hero.stopAndWait();
  scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;
    setVillageOnStrike(scene);

    scene.cameras.main.fadeIn(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      dispatchUnlockEvents(["strike_after_begin"]);
      scene.isCinematic = false;
    });
  });
};

/** @param {Game} scene  */
const setVillageOnStrike = function (scene) {
  scene.screenOffSprites.forEach((screen) => screen.shutdown())
  scene.checkDjangoDoor = false;
  scene.setHeroPosition("heroStrike");
  scene.hero.slowUp();
  scene.hero.animateToUp();

  scene.map.getObjectLayer("sprites").objects.forEach((o) => {
    if (o.name === "djangoStrike") {
      scene.django.setPosition(o.x, o.y);
    }

    if (o.name === "girlStrike") {
      scene.girl.setPosition(o.x, o.y);
    }

    if (o.name === "boyStrike") {
      scene.boy.setPosition(o.x, o.y);
    }

    if (o.name === "binoStrike") {
      scene.bino.setPosition(o.x, o.y);
    }

    if (o.name === "minoStrike") {
      scene.fisherman.setOnStrike(o.x, o.y);
    }

    if (o.name === "babyStrike") {
      scene.baby.setPosition(o.x, o.y);
    }

    if (o.name === "dogStrike") {
      scene.dog.setPosition(o.x, o.y);
    }

    if (o.name === "catStrike") {
      scene.cat.setPosition(o.x, o.y);
    }

    if (o.name === "nonoStrike") {
      scene.nono.setPosition(o.x, o.y);
    }

    if (o.name === "twoGuysStrike") {
      scene.twoGuys.setPosition(o.x, o.y);
    }

    if (o.name === "twoWomenStrike") {
      scene.twoWomen.setPosition(o.x, o.y);
    }

    if (o.name === "sleepingGuyStrike") {
      scene.sleepingGuy.setPosition(o.x, o.y);
    }

    if (o.name === "kokoStrike") {
      scene.koko.setPosition(o.x, o.y);
    }
  });
};
