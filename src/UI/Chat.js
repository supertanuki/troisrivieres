import Phaser from "phaser";

export default class Chat extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    frame,
    chatIconDeltaX,
    chatIconDeltaY,
    disableChatIcon
  ) {
    super(scene, x, y, texture, frame);

    scene.anims.create({
      key: "exclam",
      frames: this.anims.generateFrameNames("sprites", {
        start: 2,
        end: 3,
        prefix: "exclam-",
      }),
      repeat: -1,
      frameRate: 3,
    });

    this.chatIconDeltaX = chatIconDeltaX || 0;
    this.chatIconDeltaY = chatIconDeltaY || 0;
    this.disableChatIcon = disableChatIcon;

    this.chatImageUi = scene.add
      .sprite(0, 0, "sprites", "exclam-3")
      .setDepth(1000)
      .setVisible(false);
    this.chatImageUi.anims.play("exclam", true);
  }

  stopChatting() {
    this.chatImageUi.setVisible(false);
  }

  readyToChat() {
    this.chatImageUi.setPosition(
      this.x + this.chatIconDeltaX,
      this.y - 13 + this.chatIconDeltaY
    );
    this.chatImageUi.setVisible(!this.disableChatIcon);
  }
}
