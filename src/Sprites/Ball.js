import Phaser from "phaser";

export default class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "balloon-1");
    this.scene = scene;

    this.anims.create({
      key: "ball",
      frames: this.anims.generateFrameNames("sprites", {
        start: 1,
        end: 2,
        prefix: "balloon-",
      }),
      repeat: -1,
      frameRate: 2,
    });

    this.anims.play('ball', true)
  }
}

Phaser.GameObjects.GameObjectFactory.register("ball", function (x, y) {
  const sprite = new Ball(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width, sprite.height);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
