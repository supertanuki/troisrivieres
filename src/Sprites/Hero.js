import { createHeroAnims } from "./HeroAnims";

const SPEED = 100

class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene
    createHeroAnims(this.scene.anims)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  resetVelocity() {
    this.setVelocity(0);
  }

  goLeft() {
    this.setVelocityX(-SPEED)
    this.scaleX = -1
    this.body.offset.x = 24
    this.body.offset.y = 4
  }

  goRight() {
    this.setVelocityX(SPEED)
    this.scaleX = 1
    this.body.offset.x = 8
    this.body.offset.y = 4
  }

  goUp() {
    this.setVelocityY(-SPEED)
    this.body.offset.y = 4
  }

  goDown() {
    this.setVelocityY(SPEED);
    this.body.offset.y = 4
  }

  animateToLeft() {
    this.anims.play("hero-run-side", true);
  }

  animateToRight() {
    this.anims.play("hero-run-side", true);
  }

  animateToUp() {
    this.anims.play("hero-run-up", true);
  }

  animateToDown() {
    this.anims.play("hero-run-down", true);
  }

  stopAndWait() {
    if (null === this.anims.currentAnim) {
      return
    }

    const parts = this.anims.currentAnim.key.split("-");
    parts[1] = "idle";
    this.anims.play(parts.join("-"));
    this.setVelocity(0, 0);
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "hero",
  function (x, y, texture, frame) {
    const sprite = new Hero(this.scene, x, y, texture, frame);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
