import Game from "../Game";
import { addMineBackground } from "../Village/mineBackgground";

/** @param {Game} scene  */
export const mineAccessValidation = function (scene) {
  scene.isCinematic = true;
  scene.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
    if (progress !== 1) return;

    scene.cameras.main.setBounds(
      0,
      0,
      scene.map.widthInPixels,
      scene.map.heightInPixels - 8
    );
  
    for (const spriteObject of scene.map.getObjectLayer("sprites").objects) {
      if (spriteObject.name === "minerAfterCard") {
        scene.miner.unlockAccessToMine(spriteObject.x, spriteObject.y);
        break;
      }
    }
  
    addMineBackground(scene);

    scene.cameras.main.fadeIn(1000, 0, 0, 0);
    scene.isCinematic = false;
  });
};
