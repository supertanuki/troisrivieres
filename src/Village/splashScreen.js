import { FONT_RESOLUTION, FONT_SIZE } from "../UI/Message";
import { urlParamHas } from "../Utils/debug";

export const splashScreen = function (scene) {
  scene.resetGameSize();

  if (urlParamHas("nostart")) {
    scene.startGame();
    return;
  }

  const text = scene.add
    .text(225, 125, "Démarrer", {
      fontFamily: "DefaultFont",
      fontSize: FONT_SIZE,
      fill: "#ffffff",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  const callback = () => {
    scene.input.off("pointerdown", callback);

    text.disableInteractive(true);
    text.setText("Dans une forêt paisible,\nloin du fracas des villes.");

    const loadingText = scene.add
      .text(225, 220, "Chargement...", {
        fontFamily: "DefaultFont",
        fontSize: FONT_SIZE,
        fill: "#aaaaaa",
      })
      .setOrigin(0.5, 0.5)
      .setResolution(FONT_RESOLUTION);

    scene.time.delayedCall(500, () => {
      scene.startGame();
      text.destroy();
      loadingText.destroy();
    });
  };

  scene.input.on("pointerdown", callback);
};
