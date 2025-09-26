import Phaser from "phaser";

export default class Owl extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "owl-1");
    scene.anims.create({
      key: "owl",
      frames:       scene.anims.generateFrameNames("sprites", {
        start: 1,
        end: 3,
        prefix: "owl-",
      }),
      repeat: -1,
      yoyo: true,
      frameRate: 1,
    });
    this.anims.play("owl");
    this.depth = 1000;
  }
}

Phaser.GameObjects.GameObjectFactory.register("owl", function (x, y) {
  const sprite = new Owl(this.scene, x, y);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  return sprite;
});
