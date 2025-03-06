import Phaser from "phaser";

export default class MiniGameUi extends Phaser.Scene {
  preload() {
    this.load.atlas("speaker", "sprites/speaker.png", "sprites/speaker.json");
  }

  create() {
    this.anims.create({
      key: "speaker-off-anim",
      frames: [
        {
          key: "speaker",
          frame: "speaker-off",
        },
      ],
      repeat: -1,
      frameRate: 1,
    });

    this.anims.create({
      key: "speaker-on-anim",
      frames: [
        {
          key: "speaker",
          frame: "speaker-off",
        },
        {
          key: "speaker",
          frame: "speaker-on",
        },
      ],
      repeat: -1,
      frameRate: 8,
    });

    this.anims.create({
      key: "dialog-shout-anim",
      frames: [
        {
          key: "speaker",
          frame: "dialog-shout-1",
        },
        {
          key: "speaker",
          frame: "dialog-shout-2",
        },
      ],
      repeat: -1,
      frameRate: 8,
    });

    this.speaker = this.add
      .sprite(470, 0, "speaker", "speaker-off")
      .setOrigin(0, 0)
      .setDepth(2000);

    this.dialogBackground = this.add
      .sprite(325, 50, "speaker", "dialog-shout-1")
      .setOrigin(0.5, 0.5)
      .setDepth(2000)
      .setVisible(false);

    this.dialogBackground.anims.play('dialog-shout-anim', true)

    this.textObject = this.add
      .text(325, 50, "une courte qmkds klq sdmlqks dlmkqs dlkmqslm dklmkq sdlmkq skd", {
        font: "14px Arial",
        fill: "#ffffff",
        alpha: 0,
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setWordWrapWidth(250)
      .setVisible(false);
  }

  updateMessage(message) {
    this.dialogBackground.setVisible(true)
    this.speaker.anims.play("speaker-on-anim");
    this.textObject.text = message;
    this.textObject.setVisible(true);
    this.time.delayedCall(2000, () => {
      this.textObject.setVisible(false);
      this.speaker.anims.play("speaker-off-anim");
      this.dialogBackground.setVisible(false)
    });
  }
}
