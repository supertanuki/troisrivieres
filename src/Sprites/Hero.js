import { playSound, preloadSound, stopSound } from "../Utils/music";

const SPEED = 80;
const SPEED_SLOW = 20;
const SPEED_DIAGONAL = 70;

export class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.shadow = scene.add.ellipse(x, y + 10, 12, 8, 0x000000, 0.1);
    preloadSound('sfx_bruits_de_pas', scene);
  }

  playMoveSound() {
    //playSound('sfx_bruits_de_pas', this.scene);
  }

  stopMoveSound() {
    //stopSound('sfx_bruits_de_pas', this.scene);
  }

  resetVelocity() {
    this.stopMoveSound()
    this.setVelocity(0);
  }

  goLeft() {
    this.playMoveSound();
    this.setVelocityX(-SPEED);
    this.scaleX = -1;
    this.body.offset.x = this.width;
  }

  goRight() {
    this.playMoveSound();
    this.setVelocityX(SPEED);
    this.scaleX = 1;
    this.body.offset.x = 2;
  }

  goUp() {
    this.playMoveSound();

    if (this.body.velocity.x)
      this.setVelocity(this.body.velocity.x > 0 ? SPEED_DIAGONAL : -SPEED_DIAGONAL, -SPEED_DIAGONAL);
    else
      this.setVelocityY(-SPEED);

    this.scaleX = 1;
    this.body.offset.x = -2;
  }

  goDown() {
    this.playMoveSound();

    if (this.body.velocity.x)
      this.setVelocity(this.body.velocity.x > 0 ? SPEED_DIAGONAL : -SPEED_DIAGONAL, SPEED_DIAGONAL);
    else
      this.setVelocityY(SPEED);

    this.scaleX = 1;
    this.body.offset.x = -2;
  }

  slowRight() {
    this.goRight()
    this.setVelocity(SPEED_SLOW, 0);
  }

  slowLeft() {
    this.goLeft()
    this.setVelocity(-SPEED_SLOW, 0);
  }

  slowDown() {
    this.goDown()
    this.setVelocity(0, SPEED_SLOW);
  }

  slowUp() {
    this.goUp()
    this.setVelocity(0, -SPEED_SLOW);
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
    this.playMoveSound();

    if (null === this.anims.currentAnim) {
      return;
    }

    const parts = this.anims.currentAnim.key.split("-");
    parts[1] = "idle";
    this.anims.play(parts.join("-"), true);
    this.setVelocity(0, 0);
  }

  updateShadow() {
    if (!this.shadow) return;
    this.shadow.setDepth(this.depth-1);
    this.shadow.x = this.x;
    this.shadow.y = this.y + 8;
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "hero",
  function (x, y, texture, frame) {
    const sprite = new Hero(this.scene, x, y, "mai", "idle-down-1");

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(14, 22);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
