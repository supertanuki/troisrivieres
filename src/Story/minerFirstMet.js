import { switchNight } from "../Village/night";

export const minerFirstMet = function (scene) {
  scene.toggleSprites(false);
  switchNight(scene);
};
