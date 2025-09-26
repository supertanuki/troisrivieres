import Phaser from "phaser";
import Chat from "../UI/Chat";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";

export const SPRITE_ID = "django";

export default class Django extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "django-1", -2, -2);
    this.spriteId = SPRITE_ID;
    this.status = "idle";

    scene.anims.create({
      key: "django-idle",
      frames: this.anims.generateFrameNames("sprites", {
        start: 1,
        end: 3,
        prefix: "django-",
      }),
      repeat: -1,
      yoyo: true,
      frameRate: 6,
    });

    scene.anims.create({
      key: "django-before-strike",
      frames: [
        {
          key: "sprites",
          frame: "django-before-strike-1",
          duration: 1200,
        },
        {
          key: "sprites",
          frame: "django-before-strike-2",
          duration: 200,
        },
      ],
      repeat: -1,
    });

    scene.anims.create({
      key: "django-strike",
      frames: this.anims.generateFrameNames("sprites", {
        start: 1,
        end: 3,
        prefix: "django-strike-",
      }),
      repeat: -1,
      yoyo: true,
      frameRate: 6,
    });

    this.anims.play("django-idle", true);
    this.hasUnreadMessage(this.spriteId);

    sceneEventsEmitter.on(sceneEvents.DiscussionStarted, this.discussionStarted, this);
  }

  discussionStarted(spriteId) {
    if (this.spriteId !== spriteId) return;
    if (this.status !== "before-strike") return;
    this.onStrike();
  }

  afterStopChatting() {
    if (this.status !== "idle") return;
    this.anims.play("django-idle", true);
  }

  afterReadyToChat() {
    if (this.status !== "idle") return;
    this.anims.stop();
  }

  beforeStrike() {
    this.status = "before-strike";
    this.anims.play("django-before-strike", true);
  }

  onStrike() {
    this.status = "strike";
    this.anims.play("django-strike", true);
  }

  setFinal(x, y) {
    this.setPosition(x, y);
    this.disableChatIcon();
    this.idle();
  }

  idle() {
    this.status = "idle";
    this.anims.play("django-idle", true);
  }
}

Phaser.GameObjects.GameObjectFactory.register(SPRITE_ID, function (x, y) {
  const sprite = new Django(this.scene, x, y);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width + 2, 1);
  sprite.setImmovable(true);
  sprite.setInteractive();

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  return sprite;
});
