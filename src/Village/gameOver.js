import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { FONT_RESOLUTION, FONT_SIZE } from "../UI/Message";
import { fadeOutMusic, playVillageTheme } from "../Utils/music";

/** @param {Game} scene  */
export const gameOver = function (scene) {
  sceneEventsEmitter.emit(sceneEvents.DiscussionAbort);
  scene.isCinematic = true;
  scene.hero.stopAndWait();
  scene.twoGuys.disableChatIcon();
  scene.twoWomen.disableChatIcon();

  scene.time.delayedCall(1000, () => {
    scene.cameras.main.stopFollow();
    scene.tweens.add({
      targets: scene.cameras.main,
      scrollY: 1300,
      ease: "Sine.easeIn",
      duration: 8000,
    });
    fadeOutMusic(scene, scene.djangoTheme, 4000);

    scene.cameras.main.fadeOut(4000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;

      scene.cameras.main.setBounds(
        0,
        0,
        scene.map.widthInPixels,
        scene.map.heightInPixels - 8
      );
      playVillageTheme(scene);

      const darkScreen = scene.add
        .rectangle(0, 0, 450, 250, 0x000000)
        .setAlpha(0.7)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(2000);

      const fadeOutDarkScreen = () =>
        scene.tweens.add({
          targets: darkScreen,
          alpha: 1,
          duration: 1000,
        });

      const fadeInDarkScreen = () =>
        scene.tweens.add({
          targets: darkScreen,
          alpha: 0.7,
          duration: 1000,
        });

      scene.cameras.main.setScroll(1, 700);
      scene.cameras.main.fadeIn(1000, 0, 0, 0);
      let fadeOut = false;

      const messageEnd = scene.add
        .text(
          50,
          120,
          "L'extraction minière est l'industrie la plus polluante au monde.",
          {
            fontFamily: "DefaultFont",
            fontSize: FONT_SIZE,
            fill: "#ffffff",
            resolution: FONT_RESOLUTION,
          }
        )
        .setWordWrapWidth(250)
        .setScrollFactor(0)
        .setAlpha(0)
        .setDepth(2000);

      const fadeInMessageEnd = () => {
        messageEnd.setY(120);
        scene.tweens.add({
          targets: messageEnd,
          alpha: 1,
          y: 100,
          ease: "Sine.easeOut",
          duration: 1000,
        });
      };

      const fadeOutMessageEnd = (nextMessage) => {
        scene.tweens.add({
          targets: messageEnd,
          alpha: 0,
          y: 80,
          ease: "Sine.easeIn",
          duration: 1000,
          onComplete: () => {
            if (!nextMessage) return;

            messageEnd.setText(nextMessage);
            fadeInMessageEnd();
          },
        });
      };

      scene.time.delayedCall(1000, () => fadeInMessageEnd());
      scene.time.delayedCall(5000, () =>
        fadeOutMessageEnd(
          "La mine a des conséquences éternelles sur les habitants et les écosystèmes."
        )
      );
      scene.time.delayedCall(10000, () =>
        fadeOutMessageEnd(
          "La production d'objets numériques épuise les ressources… et les ouvriers."
        )
      );
      scene.time.delayedCall(15000, () =>
        fadeOutMessageEnd("Le recyclage n'est pas une solution miracle…")
      );
      scene.time.delayedCall(20000, () =>
        fadeOutMessageEnd(
          "Collectivement, il faut réduire le nombre et allonger la durée de vie des objets numériques."
        )
      );
      scene.time.delayedCall(25000, () =>
        fadeOutMessageEnd("Et se mobiliser pour des luttes qui ont du sens.")
      );
      scene.time.delayedCall(29000, () =>
        fadeOutMessageEnd(
          "Ce jeu est dédié au vivant, humains compris, qui chaque jour paye de plus en plus cher, l'escalade technologique."
        )
      );
      scene.time.delayedCall(37000, () =>
        fadeOutMessageEnd("Merci d'avoir joué.")
      );
      scene.time.delayedCall(40000, () => fadeOutMessageEnd());

      scene.tweens.add({
        targets: scene.cameras.main,
        scrollX: 1000,
        scrollY: 500,
        ease: "Sine.linear",
        duration: 25000,
        onUpdate: (event) => {
          if (!fadeOut && event.progress > 0.95) {
            fadeOutDarkScreen();
            fadeOut = true;
          }
        },
        onComplete: () => {
          fadeOut = false;
          // Django home
          scene.cameras.main.setScroll(1100, 1100);
          fadeInDarkScreen();
          scene.tweens.add({
            targets: scene.cameras.main,
            scrollY: 500,
            ease: "Sine.linear",
            duration: 16000,
            onUpdate: (event) => {
              if (!fadeOut && event.progress > 0.95) {
                fadeOutDarkScreen();
                fadeOut = true;
              }
            },
            onComplete: () => {
              fadeOut = false;
              fadeInDarkScreen();
              scene.cameras.main.setScroll(1500, 500);

              const creditsText = scene.add
                .text(
                  20,
                  300,
                  "Idée originale, game design et programmation\n\n  Richard Hanna\n\nGame design, level design\n\n  Philippe Salib\n\nGame design, musiques et effets sonores\n\n  David Fonteix.",
                  {
                    fontFamily: "DefaultFont",
                    fontSize: FONT_SIZE,
                    fill: "#ffffff",
                    resolution: FONT_RESOLUTION,
                  }
                )
                .setWordWrapWidth(300)
                .setScrollFactor(0)
                .setDepth(2000);
              scene.tweens.add({
                targets: creditsText,
                y: 20,
                ease: "Sine.easeOut",
                duration: 15000,
              });

              scene.tweens.add({
                targets: scene.cameras.main,
                scrollY: 1100,
                ease: "Sine.linear",
                duration: 24000,
                onUpdate: (event) => {
                  if (!fadeOut && event.progress > 0.95) {
                    fadeOut = true;
                    fadeOutMusic(scene, scene.villageTheme); // @todo whatever theme to fadeout
                    scene.cameras.main.fadeOut(2000, 0, 0, 0, (cam, progress) => {
                      if (progress !== 1) return;
                      window.setTimeout(() => window.location.href = "?bonus", 2000);
                    });
                  }
                },
              });
            },
          });
        },
      });
    });
  });
};
