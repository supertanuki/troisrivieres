import Game from "../Game";
import "../Sprites/MinerChief";
import "../Sprites/MinerDirty";
import { addMineBackground } from "../Village/mineBackgground";
import { handleAction } from "../Village/handleAction";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { createDirtyMinerAnimation } from "../Sprites/MinerDirty";

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

    createDirtyMinerAnimation(scene);
  
    for (const spriteObject of scene.map.getObjectLayer("sprites").objects) {
      if (spriteObject.name === "minerAfterCard") {
        scene.miner.unlockAccessToMine(spriteObject.x, spriteObject.y);
      }

      if (spriteObject.name === "minerChief") {
        scene.minerChief = scene.add.minerChief(spriteObject.x, spriteObject.y);
        scene.minerChief.on("pointerdown", () => handleAction(scene), this);
        scene.physics.add.collider(scene.minerChief, scene.hero, () => {
          sceneEventsEmitter.emit(sceneEvents.DiscussionReady, "minerChief");
        });
      }

      for (let i=2; i<=4; i++) {
        if (spriteObject.name === `miner${i}`) {
          scene[`minerDirty${i}`] = scene.add.minerDirty(spriteObject.x, spriteObject.y, null, null, i);
          scene[`minerDirty${i}`].on("pointerdown", () => handleAction(scene), this);
          scene.physics.add.collider(scene[`minerDirty${i}`], scene.hero, () => {
            sceneEventsEmitter.emit(sceneEvents.DiscussionReady, `minerDirty${i}`);
          });
        }
      }
    }
  
    addMineBackground(scene);

    scene.cameras.main.fadeIn(1000, 0, 0, 0);
    scene.isCinematic = false;
  });
};
