import { switchNight } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";

export const minerFirstMet = function (scene) {
  toggleSpritesVisibility(scene, false);
  switchNight(scene);
};
