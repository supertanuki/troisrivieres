import Game from "../Game";
import { playSound, preloadSound } from "../Utils/music";

/** @param {Game} scene  */
export const intro = function (scene) {
  scene.anims.create({
    key: "tent",
    frames: scene.anims.generateFrameNames("sprites", {
      start: 1,
      end: 6,
      prefix: "tent-",
    }),
    repeat: 0,
    frameRate: 10,
  });

  preloadSound("sfx_tente", scene);

  scene.isIntro = true;
  scene.isCinematic = true;
  scene.hero.setVisible(false);

  const sceneUpdate = () => {
    if (!scene.isIntro) return;

    if (scene.howToPlay) return;

    if (scene.goingUp || scene.goingLeft || scene.goingRight) {
      scene.goingUp = false;
      scene.goingLeft = false;
      scene.goingRight = false;
      scene.goingDown = true;
    }

    if (scene.goingDown) {
      scene.isCinematic = true;
      scene.hero.slowDown();
      scene.hero.animateToDown();
      scene.hero.setVisible(true);
    }

    if (scene.hero.y > scene.heroPositions["hero"].y + 20) {
      scene.hero.animateToUp();
      scene.hero.stopAndWait();
      scene.events.off("update", sceneUpdate);
      scene.isIntro = false;
      scene.goingDown = false;
      scene.tent.anims.play("tent", true);
      playSound("sfx_tente", scene);
      scene.tent.on("animationcomplete", () => {
        scene.tent.destroy();
        scene.isCinematic = false;
      });
    }
  };

  scene.time.delayedCall(1000, () => {
    scene.isCinematic = false;
    scene.events.on("update", sceneUpdate);
  });
};
