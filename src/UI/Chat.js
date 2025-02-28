import Phaser from "phaser";
import isMobileOrTablet from "../Utils/isMobileOrTablet";

export default class Chat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.chatImageUi = scene.add.image(this.x, this.y - 13, 'sprites', 'exclam-3');
    this.chatImageUi.setVisible(true)
    this.chatImageUi.setDepth(1000)

    this.chatTextUi = scene.add.text(this.x, this.y, isMobileOrTablet() ? 'Appuyer pour continuer': 'Appuyer sur espace', {
			font: '12px Arial',
			color: '#fff',
      backgroundColor: '#000',
      padding: 2
		})
    this.chatTextUi.setVisible(false)
    this.chatTextUi.setDepth(1000)
  }

  stopChatting() {
    this.chatTextUi.setVisible(false)
  }

  readyToChat() {
    this.chatImageUi.setVisible(true)

    this.chatTextUi.x = this.x - 50
    this.chatTextUi.y = this.y - 48
    this.chatTextUi.setVisible(true)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}