import Phaser from "phaser";
import Chat from "../UI/Chat";

export default class Boy extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "boy-water-1", 0, 0, true);
    this.scene = scene;

    this.scene.anims
      .create({
        key: "boy-water",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "boy-water-",
        }),
        repeat: -1,
        frameRate: 3,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "boy-water-",
        })
      );

    this.anims.play("boy-water", true);

    this.sadPosition = { x: 0, y: 0 };
  }

  move() {
    // nothing
  }

  setSadPosition(x, y) {
    this.sadPosition = { x, y };
  }

  setSad() {
    this.setPosition(this.sadPosition.x, this.sadPosition.y);
    this.anims.stop();
    this.setTexture("sprites", "boy-sad");

    // group boy and girl
    this.body.setSize(this.width + 2, this.height + 18);
    this.body.setOffset(0, 0)
  }
}

Phaser.GameObjects.GameObjectFactory.register("boy", function (x, y) {
  const sprite = new Boy(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  // group boy and girl
  sprite.body.setSize(sprite.width + 18, sprite.height + 20);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
