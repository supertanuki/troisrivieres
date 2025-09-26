import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import {
  setVillageForThirdAct,
  toggleScreensVisibility,
} from "../Story/afterFactory";
import { setVillageForSecondAct } from "../Story/afterMineNightmare";
import { setVillageForFourthAct } from "../Story/afterRecycling";
import { afterFinalMessage, setVillageFinalVersion } from "../Story/final";
import { setVillageBeforeMine } from "../Story/mineAccessValidation";
import { urlParamHas } from "../Utils/debug";
import { switchNight } from "./night";
import { toggleRoadsVisibility } from "./roads";

/** @param {Game} scene  */
export const addDebugControls = function (scene) {
  if (!urlParamHas("debugcontrols")) return;

  console.log('Phaser.VERSION', Phaser.VERSION);

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

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.F)
    .on("down", () => {
      scene.setHeroPosition("heroFactory");
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
    .addKey(Phaser.Input.Keyboard.KeyCodes.E)
    .on("down", () => {
      setVillageBeforeMine(scene);
      setVillageForSecondAct(scene);
      //setVillageForThirdAct(scene);
      scene.setHeroPosition("heroRecycling");
      scene.isCinematic = false;
              sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, [
          "third_act_begin",
        ]);
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.S)
    .on("down", () => {
      scene.isCinematic = true;
      scene.time.delayedCall(2000, () => {
        scene.setHeroPosition("heroKoko");
        setVillageBeforeMine(scene);
        setVillageForSecondAct(scene);
        setVillageForThirdAct(scene);
        //setVillageForFourthAct(scene);
        //afterFinalMessage(scene);

        sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, [
          //"django_met",
          //"miner_first_met",
          //"first_sleep",
          //"pre_first_sleep",
          //"miner_ask_for_card",
          //"mine_after",
          //"second_act_begin",
          //"factory_after",
          //"third_act_begin",
          "fourth_act_begin",
          //"strike_begin",
          //"strike_end",
          //"after_final_message",
        ]);
      });
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.W)
    .on("down", () => {
      scene.isCinematic = true;
      scene.time.delayedCall(2000, () => {
        scene.setHeroPosition("heroKoko");
        setVillageBeforeMine(scene);
        setVillageForSecondAct(scene);
        setVillageForThirdAct(scene);
        setVillageForFourthAct(scene);
        scene.isCinematic = false;

        sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, [
          //"django_met",
          //"miner_first_met",
          //"first_sleep",
          //"pre_first_sleep",
          //"miner_ask_for_card",
          //"mine_after",
          //"second_act_begin",
          //"factory_after",
          //"third_act_begin",
          //"fourth_act_begin",
          //"strike_begin",
          "strike_end",
        ]);
      });
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.Y)
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
    .addKey(Phaser.Input.Keyboard.KeyCodes.T)
    .on("down", () => {
      toggleRoadsVisibility(scene);
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.O)
    .on("down", () => {
      sceneEventsEmitter.emit(sceneEvents.PreEventsUnlocked, [
        "mine_access_validation",
      ]);
      scene.setHeroPosition("heroMine");
    });

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.A)
    .on("down", () => toggleRoadsVisibility(scene));

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.L)
    .on("down", () => switchNight(scene));

  scene.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.E)
    .on("down", () => toggleScreensVisibility(scene));

  scene.input.on("pointerdown", (pointer) =>
    console.log({
      pointer: [pointer.x, pointer.y],
      hero: [scene.hero.x, scene.hero.y],
    })
  );
};
