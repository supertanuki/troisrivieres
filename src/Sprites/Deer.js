import Phaser from "phaser";

export default class Deer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "deer-1");
    scene.anims.create({
      key: "deer",
      frames: [
        {
          key: "sprites",
          frame: "deer-3",
          duration: 1000,
        },
        {
          key: "sprites",
          frame: "deer-2",
          duration: 500,
        },
        {
          key: "sprites",
          frame: "deer-1",
          duration: 1000,
        },
        {
          key: "sprites",
          frame: "deer-2",
          duration: 200,
        },
        {
          key: "sprites",
          frame: "deer-3",
          duration: 200,
        },
        {
          key: "sprites",
          frame: "deer-4",
          duration: 200,
        },
        {
          key: "sprites",
          frame: "deer-5",
          duration: 2000,
        },
      ],
      repeat: -1,
      yoyo: true,
    });
    this.anims.play("deer");
    this.depth = 99;

    this.shadow = scene.add
      .ellipse(x + 2, y + 8, 16, 6, 0x000000, 0.1)
      .setDepth(98);
  }

  setPosition(x, y) {
    super.setPosition(x, y);
    this.shadow?.setPosition(x + 2, y + 8);
    return this;
  }

  setVisible(value) {
    super.setVisible(value);
    this.shadow?.setVisible(value);
  }
}

Phaser.GameObjects.GameObjectFactory.register("deer", function (x, y) {
  const sprite = new Deer(this.scene, x, y);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  return sprite;
});
