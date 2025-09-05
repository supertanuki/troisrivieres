import Game from "../Game";
import { dispatchUnlockEvents } from "../Utils/events";
import { setNightState } from "../Village/night";
import { toggleSpritesVisibility } from "../Village/spritesVisibility";
import "../Sprites/Screen";

/** @param {Game} scene  */
export const afterRecycling = function (scene) {};

/** @param {Game} scene  */
export const setVillageForFourthAct = function (scene) {
  console.log("setVillageForFourthAct");
  setNightState(scene, false);
  toggleSpritesVisibility(scene, true, true);

  scene.dcBottomLayer = scene.map
    .createLayer("dcBottom", scene.tileset)
    .setDepth(120)
    //.setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.dcBarriersFrontLayer = scene.map
    .createLayer("dcBarriersFront", scene.tileset)
    .setDepth(120)
    //.setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.dcBarriersSideLayer = scene.map
    .createLayer("dcBarriersSide", scene.tileset)
    .setDepth(120)
    //.setCollisionByProperty({ collide: true })
    .setCullPadding(2, 2);

  scene.obstacleDcLayer = scene.map
    .createLayer("obstacleDc", scene.tileset)
    .setCollisionByProperty({ collide: true })
    .setVisible(false);

  scene.obstacleDcLayerCollider = scene.physics.add.collider(
    scene.hero,
    scene.obstacleDcLayer
  );

  scene.treesOfDc.forEach((treeObject) => {
    treeObject.treeBase.setVisible(false);
    treeObject.treeTop.setVisible(false);
  });


  scene.anims.create({
    key: "screen-off",
    frames: scene.anims.generateFrameNames("sprites", {
      start: 1,
      end: 3,
      prefix: "screen-off-",
    }),
    repeat: 0,
    frameRate: 10,
  });

  let screenIndex = 1;
  scene.screens.forEachTile((tile) => {
    if (tile.properties?.screen === true) {
      scene.add.screen(tile.getCenterX() + 1, tile.getCenterY() - 3, screenIndex);
      screenIndex++;
    }
  });

  dispatchUnlockEvents(["fourth_act_begin"]);
};
