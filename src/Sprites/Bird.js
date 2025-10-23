import Phaser from "phaser";
import { randomSign } from "../Utils/randomSign";
import { playSound } from "../Utils/music";

const SPEEDX = 120;
const SPEEDY = -50;
export const COLORS = ['blue', 'purple', 'yellow'];

const Status = {
  waiting: "waiting",
  flying: "flying",
  outOfScreen: "outOfScreen",
};

const randomIdle = () => Phaser.Math.Between(1, 3);

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, null, null);
    this.color = Phaser.Math.RND.pick(COLORS);
    this.scene = scene;
    this.idleId = randomIdle();
    this.birdDirection = randomSign();
    this.scaleX = this.birdDirection;
    this.status = Status.waiting;
    this.initialX = x;
    this.initialY = y;
    this.speedX = Phaser.Math.Between(SPEEDX-10, SPEEDX+10)
    this.speedY = Phaser.Math.Between(SPEEDY-10, SPEEDY-5)
  }

  create() {
    this.reset();
  }

  isWaiting() {
    return this.status === Status.waiting;
  }

  isFlying() {
    return this.status === Status.flying;
  }

  isOutOfScreen() {
    return this.status === Status.outOfScreen;
  }

  setOffsetDependingOnDirection() {
    this.setOffset(this.scaleX === -1 ? 30 : -20, -15);
  }

  fly() {
    if (this.isFlying()) {
      return;
    }

    playSound(
      "sfx_oiseaux_volent",
      this.scene,
      true,
      Phaser.Math.Between(8, 10) / 10
    );
    this.status = Status.flying;
    this.body.checkCollision.none = true;
    this.birdDirection = this.scene.goingRight ? 1 : -1;
    this.scaleX = -1 * this.birdDirection;
    this.setOffsetDependingOnDirection();
    this.anims.play(`bird-${this.color}-flying`, true);
  }

  reset() {
    this.status = Status.waiting;
    this.setVisible(true);
    this.x = this.initialX;
    this.y = this.initialY;
    this.body.checkCollision.none = false;
    this.birdDirection = randomSign();
    this.scaleX = this.birdDirection;
    this.setOffsetDependingOnDirection();
    this.idleId = randomIdle();
    this.anims.play(`bird-${this.color}-idle-anim-${this.idleId}`, true);
  }

  hide() {
    this.setVisible(false);
    this.setActive(false);
  }

  show() {
    this.setVisible(true);
    this.setActive(true);
  }

  outOfScreen() {
    this.anims.stop();
    this.status = Status.outOfScreen;
    this.setVelocity(0, 0);
    this.setVisible(false);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.active) return;

    if (this.isOutOfScreen()) {
      const mainCamera = this.scene.cameras.main;
      const hero = this.scene.hero;

      if (
        this.initialX < hero.x - mainCamera.width / 2 ||
        this.initialX > hero.x + mainCamera.width / 2 ||
        this.initialY < hero.y - mainCamera.height / 2 ||
        this.initialY > hero.y + mainCamera.height / 2
      ) {
        this.reset();
      }
      return;
    }

    if (this.isWaiting()) {
      this.setVelocity(0, 0);
      this.anims.play(`bird-${this.color}-idle-anim-${this.idleId}`, true);
      return;
    }

    if (this.isFlying()) {
      this.anims.play(`bird-${this.color}-flying`, true);
      this.setVelocity(this.speedX * this.birdDirection, this.speedY);
      const worldView = this.scene.cameras.main.worldView;

      if (
        this.x > worldView.x + worldView.width ||
        this.x < worldView.x ||
        this.y > worldView.y + worldView.height ||
        this.y < worldView.y
      ) {
        this.outOfScreen();
      }
      return;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register("bird", function (x, y) {
  const sprite = new Bird(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(50, 50);
  sprite.setOffsetDependingOnDirection();
  sprite.setImmovable(true);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
