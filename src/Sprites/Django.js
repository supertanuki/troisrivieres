import Phaser from "phaser";
import Chat from "../UI/Chat";

export const SPRITE_ID = "django";

export default class Django extends Chat {
  constructor(scene, x, y) {
    super(scene, x, y, "sprites", "django-1", -2, -2);
    this.spriteId = SPRITE_ID;

    scene.anims
      .create({
        key: "django-idle",
        frames: this.anims.generateFrameNames("sprites", {
          start: 1,
          end: 3,
          prefix: "django-",
        }),
        repeat: -1,
        frameRate: 6,
      })
      .addFrame(
        this.anims.generateFrameNames("sprites", {
          start: 2,
          end: 2,
          prefix: "django-",
        })
      );

    this.anims.play("django-idle", true);
    this.hasUnreadMessage(this.spriteId);
  }

  afterStopChatting() {
    this.anims.play("django-idle", true);
  }

  afterReadyToChat() {
    this.anims.stop();
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
