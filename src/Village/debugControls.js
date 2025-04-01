import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { switchNight } from "./night";
import { toggleRoadsVisibility } from "./roads";
import { secondRiverLessWater } from "./secondRiverLessWater";

/** @param {Game} scene  */
export const addDebugControls = function (scene) {
  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.F)
    .on("down", () => {
      scene.setHeroPosition("hero");
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.K)
    .on("down", () => {
      scene.setHeroPosition("heroKoko");
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.B)
    .on("down", () => {
      scene.setHeroPosition("heroMiner");
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.D)
    .on("down", () => {
      scene.setHeroPosition("heroDjango");
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.N)
    .on("down", () => {
      scene.setHeroPosition("heroNono");
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.S)
    .on("down", () => {
      sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, [
        "django_met",
        "miner_first_met",
        "first_sleep",
        //"pre_first_sleep",
        //"miner_ask_for_card",
        //"mine_after",
        "second_act_begin",
      ]);
    });

    scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.E)
    .on("down", () => {
      sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, [
        "django_met",
        "pre_first_sleep",
      ]);
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.C)
    .on("down", () => {
      sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, ["card_for_mine"]);
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.M)
    .on("down", () => {
      scene.cameras.main.zoomTo(scene.cameras.main.zoom === 2 ? 1 : 0.18, 100);
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.P)
    .on("down", () => {
      scene.cameras.main.zoomTo(scene.cameras.main.zoom === 0.18 ? 1 : 2, 100);
    });

  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T).on("down", () => {
    toggleRoadsVisibility(scene);
  });

  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O).on("down", () => {
    sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, ["mine_access_validation"]);
    scene.setHeroPosition("heroMine");
  });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.A)
    .on("down", () => secondRiverLessWater(scene));

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.L)
    .on("down", () => switchNight(scene));

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    .on("down", () => {
      if (!scene.screens) {
        scene.screens = scene.map
          .createLayer("screens", scene.tileset)
          .setDepth(49)
          .setVisible(false);
        scene.ads = scene.map
          .createLayer("ads", scene.tileset)
          .setDepth(50)
          .setVisible(false);
      }
      scene.screens.setVisible(!scene.screens.visible);
      scene.ads.setVisible(!scene.ads.visible);
    });
};
