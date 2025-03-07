import Phaser from "phaser";

export default class Chat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, chatIconDeltaX, chatIconDeltaY, disableChatIcon) {
    super(scene, x, y, texture, frame);

    this.chatIconDeltaX = chatIconDeltaX || 0
    this.chatIconDeltaY = chatIconDeltaY || 0
    this.disableChatIcon = disableChatIcon

    this.chatImageUi = scene.add.image(this.x + this.chatIconDeltaX, this.y - 13 + this.chatIconDeltaY, 'sprites', 'exclam-3');
    this.chatImageUi.setVisible(false)
    this.chatImageUi.setDepth(1000)
  }
  
  stopChatting() {
    this.chatImageUi.setVisible(false)
  }

  readyToChat() {
    this.chatImageUi.setVisible(!this.disableChatIcon)
  }
}