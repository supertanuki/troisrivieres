export const intro = function (scene) {
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

  scene.events.on("update", () => {
    if (!scene.isIntro) return;

    if (scene.goingDown) {
      scene.hero.slowDown();
    }

    if (scene.hero.y > scene.heroPositions["hero"].y + 5) {
      scene.goingDown = false;
      scene.tent.anims.play("tent", true);
      scene.tent.on("animationcomplete", () => {
        scene.tent.destroy();
        scene.isCinematic = false;
        scene.isIntro = false;
      });
    }
  });
};
