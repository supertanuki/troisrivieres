import { FONT_RESOLUTION, FONT_SIZE } from "../UI/Message";
import { urlParamHas } from "../Utils/debug";

export const splashScreen = function (scene) {
  if (urlParamHas("nostart")) {
    scene.resetGameSize();
    scene.startGame();
    return;
  }

  scene.scale.setGameSize(550, 300)
  scene.add.image(0, 0, 'splash').setOrigin(0, 0)

  const title = scene.add
    .text(275, 130, "Trois-Rivières", {
      fontFamily: "DefaultFont",
      fontSize: "32px",
      fill: "#307f6d",
    })
    .setOrigin(0.5, 0.5)
    .setResolution(FONT_RESOLUTION)
    .setInteractive({ useHandCursor: true });

  const text = scene.add
    .text(275, 164, "Démarrer", {
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
    text.setText("Chargement...");

    scene.time.delayedCall(100, () => {
      scene.resetGameSize();
      scene.startGame();
      text.destroy();
    });
  };

  scene.input.on("pointerdown", callback);
};
