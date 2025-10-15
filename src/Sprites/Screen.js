import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { playSound, preloadSound } from "../Utils/music";

const INITIAL_DEPTH = 99;
export default class Screen extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, screenIndex) {
    super(scene, x, y, "sprites", "screen-off-1");
    this.scene = scene;
    this.setDepth(INITIAL_DEPTH);
    this.delta = 20;

    this.spriteId = "screen" + screenIndex;

    this.heroBehindMe = false;
    this.previousChatImageUiVisibility = false;
    this.isShutDown = false;
    this.isShutDownable = false;

    sceneEventsEmitter.on(
      sceneEvents.ScreenShutdown,
      this.screenShutdown,
      this
    );

    this.anims.play("ads", true);
    preloadSound("sfx_extinction_ecrans", scene);
  }

  isHeroBehindMe() {
    const hero = this.scene.hero;
    return (
      hero.x > this.x - 10 &&
      hero.x < this.x + 10 &&
      hero.y > this.y - 20 &&
      hero.y < this.y - 15
    );
  }

  isHeroNearMe() {
    const hero = this.scene.hero;
    return (
      hero.x > this.x - this.delta &&
      hero.x < this.x + this.delta &&
      hero.y > this.y - this.delta &&
      hero.y < this.y + this.delta
    );
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.isShutDownable) {
      const isHeroBehindMe = this.isHeroBehindMe();
      if (this.heroBehindMe !== isHeroBehindMe) {
        this.heroBehindMe = isHeroBehindMe;

        if (this.spriteId && !this.isShutDown) {
          sceneEventsEmitter.emit(
            isHeroBehindMe
              ? sceneEvents.DiscussionReady
              : sceneEvents.DiscussionAbort,
            this.spriteId
          );
        }
      }
    }

    if (this.isHeroNearMe()) {
      this.setDepth(
        this.y < this.scene.hero.y ? INITIAL_DEPTH : this.scene.hero.depth + 1
      );
    }
  }

  enableShutdown() {
    this.isShutDownable = true;
  }

  screenShutdown(payload) {
    if (this.spriteId !== payload.sprite) return;

    this.scene.time.delayedCall(200, () =>
      sceneEventsEmitter.emit(sceneEvents.DiscussionEnded, payload.sprite)
    );
    this.isShutDown = true;
    this.setVisible(true);
    this.anims.play("screen-off", true);
    playSound("sfx_extinction_ecrans", this.scene, true, 0.5);
  }

  shutdown() {
    this.isShutDown = true;
    this.setVisible(true);
    this.anims.stop();
    this.setTexture("sprites", "screen-off-3");
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "screen",
  function (x, y, screenIndex) {
    const sprite = new Screen(this.scene, x, y, screenIndex);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.setImmovable(true);
    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
