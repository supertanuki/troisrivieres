import Phaser from "phaser";

const SPEEDX = 120;
const SPEEDY = -50;

const Status = {
  waiting: "waiting",
  flying: "flying",
  outOfScreen: "outOfScreen",
};

const randomSign = () => (Math.random() < 0.5 ? -1 : 1);
const randomIdle = () => Phaser.Math.Between(1, 3);

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "bird-idle-1");
    this.scene = scene;
    this.idleId = randomIdle();
    this.birdDirection = randomSign();
    this.scaleX = this.birdDirection;
    this.status = Status.waiting;
    this.initialX = x;
    this.initialY = y;

    const anims = scene.anims;

    anims
      .create({
        key: "bird-idle-anim-1",
        frames: anims.generateFrameNames("sprites", {
          start: 1,
          end: 4,
          prefix: "bird-idle-",
        }),
        repeat: -1,
        frameRate: 1,
      })
      .addFrame(anims.generateFrameNames("sprites", {
        start: 3,
        end: 2,
        prefix: "bird-idle-",
      }));

    anims.create({
      key: "bird-idle-anim-2",
      frames: [
        {
          key: "sprites",
          frame: "bird-idle-2",
        },
        {
          key: "sprites",
          frame: "bird-idle-3",
        },
        {
          key: "sprites",
          frame: "bird-idle-4",
        },
        {
          key: "sprites",
          frame: "bird-idle-3",
        },
        {
          key: "sprites",
          frame: "bird-idle-2",
        },
      ],
      repeat: -1,
      frameRate: 1,
    });

    anims.create({
      key: "bird-idle-anim-3",
      frames: [
        {
          key: "sprites",
          frame: "bird-idle-3",
        },
        {
          key: "sprites",
          frame: "bird-idle-4",
        },
        {
          key: "sprites",
          frame: "bird-idle-3",
        },
        {
          key: "sprites",
          frame: "bird-idle-2",
        },
        {
          key: "sprites",
          frame: "bird-idle-1",
        },
      ],
      repeat: -1,
      frameRate: 1,
    });

    anims
      .create({
        key: "bird-flying",
        frames: anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "bird-flying-",
        }),
        repeat: -1,
        frameRate: 10,
      });
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

    this.status = Status.flying;
    this.body.checkCollision.none = true;
    this.birdDirection = this.scene.goingRight ? 1 : -1;
    this.scaleX = -1 * this.birdDirection;
    this.setOffsetDependingOnDirection();
    this.anims.play("bird-flying", true);
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
    this.anims.play(`bird-idle-anim-${this.idleId}`, true);
  }

  outOfScreen() {
    this.anims.stop()
    this.status = Status.outOfScreen;
    this.setVelocity(0, 0);
    this.setVisible(false);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

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
      this.anims.play(`bird-idle-anim-${this.idleId}`, true);
      return;
    }

    if (this.isFlying()) {
      this.anims.play("bird-flying", true);
      this.setVelocity(SPEEDX * this.birdDirection, SPEEDY);
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

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
