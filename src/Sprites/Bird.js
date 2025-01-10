import Phaser from "phaser";

export default class Bird extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "flyingbird");
    this.scene = scene;
    this.birdDirection = 1;
  }

  move() {
    if (!this.active) {
      return;
    }
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
  }
}

Phaser.GameObjects.GameObjectFactory.register("bird", function (x, y) {
  const sprite = new Bird(this.scene, x, y);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
