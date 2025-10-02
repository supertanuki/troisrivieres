import Game from "../Game";
import { goToFactory, goToRecycling } from "../Story/goToGame";
import { goToMine } from "../Story/goToMine";
import { FONT_RESOLUTION, FONT_SIZE } from "../UI/Message";
import { urlParamHas } from "../Utils/debug";

/** @param {Game} scene  */
export const splashScreen = function (scene) {
  if (urlParamHas("nostart")) {
    scene.resetGameSize();
    scene.startGame();
    return;
  }

  const isBonus = urlParamHas("bonus");
  let goingSomewhere = false;

  scene.scale.setGameSize(550, 300);
  scene.add.image(0, 0, "splash").setOrigin(0, 0);

  const textStart = scene.add
    .text(275, 164, "Démarrer", {
      fontFamily: "DefaultFont",
      fontSize: FONT_SIZE,
      fill: "#ffffff",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  const startGame = () => {
    textStart.disableInteractive(true);
    textStart.setText("Chargement...");

    scene.time.delayedCall(100, () => {
      scene.resetGameSize();
      scene.startGame();
      textStart.destroy();
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

  if (!isBonus) {
    const callback = () => {
      if (goingSomewhere) return;
      goingSomewhere = true;
      scene.input.off("pointerdown");
      startGame();
    };
    scene.input.on("pointerdown", callback);

    return;
  }

  title.on("pointerdown", () => {
    if (goingSomewhere) return;
    goingSomewhere = true;
    title.off("pointerdown");
    textStart.off("pointerdown");
    startGame();
  });

  textStart.on("pointerdown", () => {
    if (goingSomewhere) return;
    goingSomewhere = true;
    title.off("pointerdown");
    textStart.off("pointerdown");
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
    goingSomewhere = true;
    textMine.disableInteractive(true);
    textMine.setColor("#000000");
    textMine.off("pointerdown");
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
    goingSomewhere = true;
    textFactory.disableInteractive(true);
    textFactory.setColor("#000000");
    textFactory.off("pointerdown");
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
    goingSomewhere = true;
    textRecycling.disableInteractive(true);
    textRecycling.setColor("#000000");
    textRecycling.off("pointerdown");
    goToRecycling(scene);
  });
};
