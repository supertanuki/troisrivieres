import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { playSound, preloadSound } from "../Utils/music";

export default class Screen extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, screenIndex) {
    super(scene, x, y, "sprites", "screen-off-1");
    this.scene = scene;
    this.setDepth(250);

    this.spriteId = "screen" + screenIndex;
    this.heroNearMe = false;
    this.previousChatImageUiVisibility = false;
    this.isShutDown = false;

    sceneEventsEmitter.on(
      sceneEvents.ScreenShutdown,
      this.screenShutdown,
      this
    );

    preloadSound('sfx_extinction_ecrans', scene);
  }

  isHeroNearMe() {
    const hero = this.scene.hero;
    return (
      hero.x > this.x - 10 &&
      hero.x < this.x + 10 &&
      hero.y > this.y - 20 &&
      hero.y < this.y - 15
    );
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.isShutDown) return;

    const isHeroNearMe = this.isHeroNearMe();
    if (this.heroNearMe !== isHeroNearMe) {
      this.heroNearMe = isHeroNearMe;

      if (this.spriteId) {
        sceneEventsEmitter.emit(
          isHeroNearMe
            ? sceneEvents.DiscussionReady
            : sceneEvents.DiscussionAbort,
          this.spriteId
        );
      }
    }
  }

  screenShutdown(payload) {
    if (this.spriteId !== payload.sprite) return;

    this.scene.time.delayedCall(200, () =>
      sceneEventsEmitter.emit(sceneEvents.DiscussionEnded, payload.sprite)
    );
    this.isShutDown = true;
    this.setVisible(true);
    this.anims.play("screen-off", true);
    playSound('sfx_extinction_ecrans', this.scene, true, 0.5);
  }

  shutdown() {
    this.isShutDown = true;
    this.setVisible(true);
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

    sprite.setImmovable(true).setVisible(false);
    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
