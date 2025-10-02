import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { FONT_RESOLUTION, FONT_SIZE } from "../UI/Message";

/** @param {Game} scene  */
export const gameOver = function (scene) {
  sceneEventsEmitter.emit(sceneEvents.DiscussionAbort);
  scene.isCinematic = true;
  scene.hero.stopAndWait();

  scene.time.delayedCall(1000, () => {
    scene.cameras.main.stopFollow();
    scene.tweens.add({
      targets: scene.cameras.main,
      scrollY: 1300,
      ease: "Sine.easeIn",
      duration: 8000,
    });

    scene.cameras.main.fadeOut(4000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      scene.cameras.main.setBounds(
        0,
        400,
        2144, // mine on the right is disabled
        scene.map.heightInPixels - 408
      );

      const darkScreen = scene.add
        .rectangle(0, 0, 450, 250, 0x000000)
        .setAlpha(0.7)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(2000);

      const creditsText = scene.add
        .text(
          10,
          300,
          "Idée originale et programmation\n\n  Ricardo Hannou\n\nGraphisme\n\n  Filipo Saliba\n\nNarration, musiques et effets sonores\n\n  David Fonta",
          {
            fontFamily: "DefaultFont",
            fontSize: FONT_SIZE,
            fill: "#ffffff",
            resolution: FONT_RESOLUTION,
          }
        )
        .setWordWrapWidth(200)
        .setScrollFactor(0)
        .setDepth(2000);

      scene.cameras.main.setScroll(1, 700);
      scene.cameras.main.fadeIn(1000, 0, 0, 0);
      let fadeOut = false;

      scene.tweens.add({
        targets: scene.cameras.main,
        scrollX: 1000,
        scrollY: 500,
        ease: "Sine.linear",
        duration: 20000,
        onUpdate: (event) => {
          if (!fadeOut && event.progress > 0.95) {
            scene.tweens.add({
              targets: darkScreen,
              alpha: 1,
              duration: 1000,
            });
            fadeOut = true;
          }
        },
        onComplete: () => {
          fadeOut = false;
          // Django home
          scene.cameras.main.setScroll(1100, 1100);
          scene.tweens.add({
            targets: darkScreen,
            alpha: 0.7,
            duration: 1000,
          });
          scene.tweens.add({
            targets: scene.cameras.main,
            scrollY: 500,
            ease: "Sine.linear",
            duration: 12000,
            onUpdate: (event) => {
              if (!fadeOut && event.progress > 0.95) {
                scene.tweens.add({
                  targets: darkScreen,
                  alpha: 1,
                  duration: 1000,
                });
                fadeOut = true;
              }
            },
            onComplete: () => {
              fadeOut = false;
              scene.tweens.add({
                targets: darkScreen,
                alpha: 0.7,
                duration: 1000,
              });
              scene.cameras.main.setScroll(1500, 500);
              scene.tweens.add({
                targets: scene.cameras.main,
                scrollY: 1100,
                ease: "Sine.linear",
                duration: 12000,
                onUpdate: (event) => {
                  if (!fadeOut && event.progress > 0.8) {
                    fadeOut = true;
                    scene.cameras.main.fadeOut(2000, 0, 0, 0);
                  }
                },
                onComplete: () => {
                  window.location.href = "?bonus";
                },
              });
            },
          });
        },
      });

      scene.tweens.add({
        targets: creditsText,
        y: 10,
        ease: "Sine.easeOut",
        duration: 15000,
      });
    });
  });
};
