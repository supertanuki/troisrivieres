import Game from "../Game";
import { dispatchUnlockEvents } from "../Utils/events";

/** @param {Game} scene  */
export const strike = function (scene) {
  scene.isCinematic = true;
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
  scene.setHeroPosition("heroStrike");
  scene.hero.slowUp();
  scene.hero.animateToUp();

  scene.map.getObjectLayer("sprites").objects.forEach((spriteObject) => {
    if (spriteObject.name === "djangoStrike") {
      scene.django.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "girlStrike") {
      scene.girl.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "boyStrike") {
      scene.boy.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "binoStrike") {
      scene.bino.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "minoStrike") {
      scene.fisherman.setOnStrike(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "babyStrike") {
      scene.baby.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "dogStrike") {
      scene.dog.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "catStrike") {
      scene.cat.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "nonoStrike") {
      scene.nono.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "twoGuysStrike") {
      scene.twoGuys.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "twoWomenStrike") {
      scene.twoWomen.setPosition(spriteObject.x, spriteObject.y);
    }

    if (spriteObject.name === "sleepingGuyStrike") {
      scene.sleepingGuy.setPosition(spriteObject.x, spriteObject.y);
    }
  });
};
