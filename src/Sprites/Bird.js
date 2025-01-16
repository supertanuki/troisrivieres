import Phaser from "phaser";

const SPEED = 200

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "waitingbird");
    this.scene = scene;
    this.birdDirection = 1;
    this.flying = false
  }

  fly() {
    if (this.flying) {
      return;
    }

    this.setTexture("flyingbird")
    this.birdDirection = this.scene.goingRight ? 1 : -1
    this.scaleX = this.birdDirection
    this.setOffset(this.birdDirection === -1 ? 25 : -25, -25)
    this.flying = true
  }

  move() {
    const worldView = this.scene.cameras.main.worldView;
    this.x += 8 * this.birdDirection;
    this.y -= 1;

    if (this.x > worldView.x + worldView.width || this.x < worldView.x) {
      this.setActive(false);
      this.setVisible(false);

      this.scene.time.addEvent({
        callback: () => {
          this.reset();
        },
        delay: Phaser.Math.Between(2000, 5000),
      });
    }
  }

  reset() {
    this.birdDirection = this.scene.goingRight ? 1 : -1;
    this.setActive(true);
    this.setVisible(true);
    this.y = this.scene.hero.y;
    this.x = this.scene.hero.x + 30 * this.birdDirection;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.flying) {
      return
    }

    this.setVelocity(SPEED * this.birdDirection, -50);
  }
}

Phaser.GameObjects.GameObjectFactory.register("bird", function (x, y) {
  const sprite = new Bird(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(50, 50)
  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
