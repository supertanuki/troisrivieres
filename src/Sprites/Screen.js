import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";

export default class Screen extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    screenIndex
  ) {
    super(scene, x, y, "sprites", "screen-off-1");
    this.scene = scene;
    this.setDepth(250);

    this.spriteId = 'screen' + screenIndex;
    this.heroNearMe = false;
    this.previousChatImageUiVisibility = false;

    sceneEventsEmitter.on(sceneEvents.screenShutdown, this.screenShutdown, this);
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

    this.scene.time.delayedCall(200, () => sceneEventsEmitter.emit(sceneEvents.DiscussionEnded, payload.sprite));
    this.setVisible(true);
    this.anims.play("screen-off", true);
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
