import { getUiMessage } from "../Workflow/messageWorkflow";

export const saveProgression = (id) => localStorage.setItem("progression", id);

export const getProgression = () => localStorage.getItem("progression");

export const showMessageSavedProgression = (scene) => {
  if (!scene.messageSavedProgression) {
    scene.messageSavedProgression = scene.add
      .bitmapText(
        225,
        260,
        "FreePixelStrokeShadow-16",
        getUiMessage("progression.saved"),
        16
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(10000)
      .setAlpha(0);
  } else {
    scene.messageSavedProgression.setVisible(true).setAlpha(0);
  }

  scene.tweens.add({
    targets: scene.messageSavedProgression,
    alpha: 1,
    y: 240,
    ease: "Sine.easeOut",
    duration: 500,
    onComplete: () =>
      scene.tweens.add({
        delay: 2000,
        targets: scene.messageSavedProgression,
        alpha: 0,
        y: 260,
        ease: "Sine.easeIn",
        duration: 500,
        onComplete: () => scene.messageSavedProgression.setVisible(false),
      }),
  });
};
