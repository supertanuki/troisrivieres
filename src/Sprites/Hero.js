import { createHeroAnims } from "./HeroAnims";

const SPEED = 80

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
    this.body.offset.x = this.width
  }

  goRight() {
    this.setVelocityX(SPEED)
    this.scaleX = 1
    this.body.offset.x = 2
  }

  goUp() {
    this.setVelocityY(-SPEED)
    this.scaleX = 1
    this.body.offset.x = -2
  }

  goDown() {
    this.setVelocityY(SPEED);
    this.scaleX = 1
    this.body.offset.x = -2
  }

  animateToLeft() {
    this.anims.play("mai-walk-side", true);
  }

  animateToRight() {
    this.anims.play("mai-walk-side", true);
  }

  animateToUp() {
    this.anims.play("mai-walk-up", true);
  }

  animateToDown() {
    this.anims.play("mai-walk-down", true);
  }

  stopAndWait() {
    if (null === this.anims.currentAnim) {
      return
    }

    const parts = this.anims.currentAnim.key.split("-");
    parts[1] = "idle";
    this.anims.play(parts.join("-"), true);
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

    sprite.body.setSize(14, 22)

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
