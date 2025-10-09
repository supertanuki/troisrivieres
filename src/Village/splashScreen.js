import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { goToMine, goToFactory, goToRecycling } from "../Story/goToGame";
import { FONT_RESOLUTION, FONT_SIZE } from "../UI/Message";
import { urlParamHas } from "../Utils/debug";
import { eventsHas } from "../Utils/events";

/** @param {Game} scene  */
export const splashScreen = function (scene) {
  if (urlParamHas("nostart")) {
    scene.resetGameSize();
    scene.startGame();
    return;
  }

  scene.isBonus = urlParamHas("bonus");
  let goingSomewhere = false;

  scene.scale.setGameSize(550, 300);
  const splash = scene.add.image(0, 0, "splash").setOrigin(0, 0);

  const textStart = scene.add
    .text(275, 164, scene.isBonus ? "Nouvelle partie" : "Démarrer", {
      fontFamily: "DefaultFont",
      fontSize: FONT_SIZE,
      fill: "#ffffff",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  const startGame = () => {
    scene.isBonus = false;
    textStart.disableInteractive(true);
    textStart.setText("Chargement...");
    document.body.style.cursor = 'none';

    scene.cameras.main.fadeOut(500, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      
      scene.resetGameSize();
      scene.startGame();
      splash.destroy();
      textStart.destroy();
      title.destroy();
    });
  };

  const title = scene.add
    .text(275, 130, "Trois-Rivières", {
      fontFamily: "DefaultFont",
      fontSize: "32px",
      fill: "#307f6d",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  if (!scene.isBonus) {
    const callback = () => {
      if (goingSomewhere) return;
      goingSomewhere = true;
      startGame();
    };
    scene.input.on("pointerdown", callback);

    return;
  }

  const clickBonusGame = (textObject) => {
    goingSomewhere = true;
    textObject.disableInteractive(true);
    textObject.setColor("#000000");
    document.body.style.cursor = 'none';
  }

  title.on("pointerdown", () => {
    if (goingSomewhere) return;
    goingSomewhere = true;
    startGame();
  });

  textStart.on("pointerdown", () => {
    if (goingSomewhere) return;
    goingSomewhere = true;
    startGame();
  });

  const textMine = scene.add
    .text(275, 230, "La mine", {
      fontFamily: "DefaultFont",
      fontSize: FONT_SIZE,
      fill: "#ffffff",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  textMine.on("pointerdown", () => {
    if (goingSomewhere) return;
    clickBonusGame(textMine);
    goToMine(scene);
  });

  const textFactory = scene.add
    .text(275, 250, "L'usine", {
      fontFamily: "DefaultFont",
      fontSize: FONT_SIZE,
      fill: "#ffffff",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  textFactory.on("pointerdown", () => {
    if (goingSomewhere) return;
    clickBonusGame(textFactory);
    goToFactory(scene);
  });

  const textRecycling = scene.add
    .text(275, 270, "Le recyclage", {
      fontFamily: "DefaultFont",
      fontSize: FONT_SIZE,
      fill: "#ffffff",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  textRecycling.on("pointerdown", () => {
    if (goingSomewhere) return;
    clickBonusGame(textRecycling);
    goToRecycling(scene);
  });

  const wakeScreen = () => {
    window.location.href = "?bonus";
  };

  sceneEventsEmitter.on(sceneEvents.EventsUnlocked, (data) => {
    console.log("EventsUnlocked screen", data);
    if (!scene.isBonus) return;

    if (
      eventsHas(data, "factory_after") ||
      eventsHas(data, "mine_after") ||
      eventsHas(data, "recycling_after")
    ) {
      wakeScreen();
    }
  });
};
