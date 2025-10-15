import { playSound, preloadSound } from "../Utils/music";

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
  
  scene.isIntro = true;
  scene.isCinematic = true;
  scene.hero.setVisible(false);
  scene.time.addEvent({
    callback: () => {
      scene.goingDown = true;
      scene.hero.animateToDown();
      scene.hero.setVisible(true);
    },
    delay: 1000,
  });

  preloadSound('sfx_tente', scene);

  scene.events.on("update", () => {
    if (!scene.isIntro) return;

    if (scene.goingDown) {
      scene.hero.slowDown();
    }

    if (scene.hero.y > scene.heroPositions["hero"].y + 5) {
      scene.isIntro = false;
      scene.goingDown = false;
      scene.tent.anims.play("tent", true);
      playSound('sfx_tente', scene)
      scene.tent.on("animationcomplete", () => {
        scene.tent.destroy();
        scene.isCinematic = false;
      });
    }
  });
};
