import Phaser from "phaser";
import { FONT_RESOLUTION, FONT_SIZE } from "./Message";
import { dispatchUnlockEvents } from "../Utils/events";
import { getUiMessage } from "../Workflow/messageWorkflow";

export default class FinalMessage extends Phaser.Scene {
  constructor() {
    super("final-message");
  }

  create() {
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    
    const text = this.add
      .text(225, 100, getUiMessage("final.later"), {
        fontFamily: "DefaultFont",
        fontSize: FONT_SIZE,
        fill: "#ffffff",
      })
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5)
      .setResolution(FONT_RESOLUTION)
      .setDepth(10000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      ease: "Sine.easeInOut",
      delay: 2000,
      duration: 2000,
      onComplete: () => this.endScene()
    });
  }

  endScene() {
    this.scene.stop();
    dispatchUnlockEvents(["after_final_message"]);
  }
}
