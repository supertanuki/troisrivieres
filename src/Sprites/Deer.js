import Phaser from "phaser";

export default class Deer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "deer-1");
    scene.anims.create({
      key: "deer",
      frames: [
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
          duration: 200,
        },
      ],
      repeat: -1,
      duration: 3000,
      yoyo: true,
    });
    this.anims.play("deer");
    this.depth = 99;
  }
}

Phaser.GameObjects.GameObjectFactory.register("deer", function (x, y) {
  const sprite = new Deer(this.scene, x, y);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  return sprite;
});
