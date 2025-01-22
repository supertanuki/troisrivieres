import Phaser from "phaser";

const SPEEDX = 300
const SPEEDY = -50

const Status = {
  waiting: 'waiting',
  flying: 'flying',
  outOfScreen: 'outOfScreen',
};

const randomSign = () => Math.random() < 0.5 ? -1 : 1;

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "waitingbird");
    this.scene = scene;
    this.birdDirection = randomSign();
    this.scaleX = this.birdDirection
    this.status = Status.waiting
    this.initialX = x
    this.initialY = y
  }

  isFlying() {
    return this.status === Status.flying
  }

  isOutOfScreen() {
    return this.status === Status.outOfScreen
  }

  fly() {
    if (this.isFlying()) {
      return;
    }

    this.body.checkCollision.none = true
    this.setTexture("flyingbird")
    this.birdDirection = this.scene.goingRight ? 1 : -1
    this.scaleX = this.birdDirection
    this.setOffset(this.birdDirection === -1 ? 25 : -25, -25)
    this.status = Status.flying
  }

  reset() {
    this.setTexture("waitingbird")
    this.setVisible(true);
    this.x = this.initialX
    this.y = this.initialY;
    this.setOffset(-17, -19)
    this.body.checkCollision.none = false
    this.birdDirection = randomSign();
    this.scaleX = this.birdDirection
    this.setOffset(this.birdDirection === -1 ? 25 : -25, -25)
    this.status = Status.waiting
  }

  outOfScreen() {
    this.status = Status.outOfScreen
    this.setVelocity(0, 0)
    this.setVisible(false)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)

    if (this.isOutOfScreen()) {
      const mainCamera = this.scene.cameras.main
      const hero = this.scene.hero

      if (this.initialX < hero.x - mainCamera.width / 2 || this.initialX > hero.x + mainCamera.width / 2) {
        this.reset()
      }

      return
    }

    if (!this.isFlying()) {
      this.setVelocity(0, 0)
      return
    }

    this.setVelocity(SPEEDX * this.birdDirection, SPEEDY)
    const worldView = this.scene.cameras.main.worldView

    if (this.x > worldView.x + worldView.width || this.x < worldView.x) {
      this.outOfScreen()
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register("bird", function (x, y) {
  const sprite = new Bird(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(50, 50)
  sprite.setOffset(sprite.birdDirection === -1 ? 25 : -25, -25)

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
