import Phaser from "phaser";
import { dispatchUnlockEvents } from "../Utils/events";
import { getUiMessage } from "../Workflow/messageWorkflow";

export default class FinalMessage extends Phaser.Scene {
  constructor() {
    super("final-message");
  }

  create() {
    this.cameras.main.fadeIn(2000, 0, 0, 0);

    const text = this.add
      .bitmapText(225, 100, "FreePixel-16", getUiMessage("final.later"), 16)
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setTintFill(0xffffff);

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
