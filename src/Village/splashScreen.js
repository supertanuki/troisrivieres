import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { goToMine, goToFactory, goToRecycling } from "../Story/goToGame";
import { urlParamHas } from "../Utils/debug";
import { eventsHas } from "../Utils/events";

/** @param {Game} scene  */
export const splashScreen = function (scene) {
  if (urlParamHas("nostart")) {
    scene.resetGameSize();
    scene.startGame();
    return;
  }

  scene.isBonus = urlParamHas("bonus");
  let goingSomewhere = false;

  scene.scale.setGameSize(550, 300);

  scene.anims.create({
    key: "mai",
    frames: scene.anims.generateFrameNames("splash", {
      start: 1,
      end: 4,
      prefix: "mai-",
    }),
    repeat: -1,
    frameRate: 4,
  });

  scene.anims.create({
    key: "rock",
    frames: scene.anims.generateFrameNames("splash", {
      start: 1,
      end: 2,
      prefix: "rock-",
    }),
    repeat: -1,
    frameRate: 2,
  });

  scene.anims.create({
    key: "smoke-big",
    frames: scene.anims.generateFrameNames("splash", {
      start: 1,
      end: 5,
      prefix: "smoke-big-",
    }),
    repeat: -1,
    frameRate: 5,
  });

  scene.anims.create({
    key: "smoke-small",
    frames: scene.anims.generateFrameNames("splash", {
      start: 1,
      end: 5,
      prefix: "smoke-small-",
    }),
    repeat: -1,
    frameRate: 5,
  });

  const colorBackground = scene.add
    .rectangle(0, 0, 550, 300, 0xa0cfb0)
    .setOrigin(0, 0);

  const cloudTop = scene.add.image(0, 0, "splash", "cloud-top").setOrigin(0, 0);

  const cloudTwo = scene.add
    .image(260, 30, "splash", "cloud-two")
    .setOrigin(0, 0);
  const moveCloudTwo = (duration) =>
    scene.tweens.add({
      targets: cloudTwo,
      x: 600,
      duration,
      onComplete: () => completeMoveCloudTwo(),
    });
  const completeMoveCloudTwo = () => {
    cloudTwo.x = -cloudTwo.width;
    moveCloudTwo(90000);
  };
  moveCloudTwo(25000);

  const cloudMiddle = scene.add
    .image(400, 60, "splash", "cloud-middle")
    .setOrigin(0, 0);
  const moveCloudMiddle = (duration) =>
    scene.tweens.add({
      targets: cloudMiddle,
      x: 600,
      duration,
      onComplete: () => completeMoveCloudMiddle(),
    });
  const completeMoveCloudMiddle = () => {
    cloudMiddle.x = -cloudMiddle.width;
    moveCloudMiddle(70000);
  };
  moveCloudMiddle(9000);

  const moveCloudBig = (duration) =>
    scene.tweens.add({
      targets: cloudBig,
      x: 600,
      duration,
      onComplete: () => completeMoveCloudBig(),
    });
  const completeMoveCloudBig = () => {
    cloudBig.x = -cloudBig.width;
    moveCloudBig(200000);
  };
  const cloudBig = scene.add
    .image(30, 70, "splash", "cloud-big")
    .setOrigin(0, 0);
  moveCloudBig(100000);

  const background = scene.add
    .sprite(0, 137, "splash", "background")
    .setOrigin(0, 0);

  const rock = scene.add.sprite(0, 212, "splash", "rock-1").setOrigin(0, 0);
  rock.play("rock");

  const mai = scene.add.sprite(60, 118, "splash", "mai-1").setOrigin(0, 0);
  mai.play("mai");

  const title = scene.add
    .bitmapText(275, 130, "FreePixel-16", "Trois-Rivières", 32)
    .setOrigin(0.5, 0.5)
    .setTintFill(0x307f6d);

  const smokeBig = scene.add
    .sprite(372, 97, "splash", "smoke-big-1")
    .setOrigin(0, 0);
  smokeBig.play("smoke-big");

  const smokeSmall = scene.add
    .sprite(413, 153, "splash", "smoke-small-1")
    .setOrigin(0, 0);
  smokeSmall.play("smoke-small");

  const mouseOver = (target, color = 0x000000) => target.setTintFill(color);
  const mouseOut = (target) => target.setTintFill(0xffffff);

  const textStart = scene.add
    .bitmapText(
      275,
      164,
      "FreePixel-16",
      scene.isBonus ? "Nouvelle partie" : "Jouer",
      16
    )
    .setOrigin(0.5, 0.5)
    .setTintFill(0xffffff)
    .setInteractive({ useHandCursor: true });

  const startGame = () => {
    scene.isBonus = false;
    textStart.disableInteractive(true);
    textStart.setText("Chargement...");
    document.body.style.cursor = "none";

    scene.cameras.main.fadeOut(500, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;

      scene.resetGameSize();
      scene.startGame();
      colorBackground.destroy();
      textStart.destroy();
      title.destroy();
      mai.destroy();
      rock.destroy();
      background.destroy();
      cloudTop.destroy();
      cloudBig.destroy();
      cloudTwo.destroy();
      cloudMiddle.destroy();
      smokeBig.destroy();
      smokeSmall.destroy();
    });
  };

  const clickBonusGame = (textObject) => {
    goingSomewhere = true;
    textObject.disableInteractive(true);
    textObject.setTintFill(0x333333);
    document.body.style.cursor = "none";
  };

  textStart.on("pointerdown", () => {
    if (goingSomewhere) return;
    goingSomewhere = true;
    startGame();
  });

  textStart.on("pointerover", () => mouseOver(textStart, 0x307f6d));
  textStart.on("pointerout", () => mouseOut(textStart));

  const credits = scene.add
    .bitmapText(
      510,
      290,
      "FreePixel-16",
      "Crédits",
      16
    )
    .setOrigin(0.5, 0.5)
    .setTintFill(0xffffff)
    .setInteractive({ useHandCursor: true });

  credits.on("pointerdown", () => window.location.href = 'credits.html');
  credits.on("pointerover", () => mouseOver(credits, 0x000000));
  credits.on("pointerout", () => mouseOut(credits));

  if (scene.isBonus) {
    const textMine = scene.add
      .bitmapText(275, 230, "FreePixel-16", "La mine", 16)
      .setOrigin(0.5, 0.5)
      .setTintFill(0xffffff)
      .setInteractive({ useHandCursor: true });
    textMine.on("pointerover", () => mouseOver(textMine));
    textMine.on("pointerout", () => mouseOut(textMine));
    textMine.on("pointerdown", () => {
      if (goingSomewhere) return;
      clickBonusGame(textMine);
      goToMine(scene);
    });

    const textFactory = scene.add
      .bitmapText(275, 250, "FreePixel-16", "L'usine", 16)
      .setOrigin(0.5, 0.5)
      .setTintFill(0xffffff)
      .setInteractive({ useHandCursor: true });
    textFactory.on("pointerover", () => mouseOver(textFactory));
    textFactory.on("pointerout", () => mouseOut(textFactory));
    textFactory.on("pointerdown", () => {
      if (goingSomewhere) return;
      clickBonusGame(textFactory);
      goToFactory(scene);
    });

    const textRecycling = scene.add
      .bitmapText(275, 270, "FreePixel-16", "Le recyclage", 16)
      .setOrigin(0.5, 0.5)
      .setTintFill(0xffffff)
      .setInteractive({ useHandCursor: true });
    textRecycling.on("pointerover", () => mouseOver(textRecycling));
    textRecycling.on("pointerout", () => mouseOut(textRecycling));
    textRecycling.on("pointerdown", () => {
      if (goingSomewhere) return;
      clickBonusGame(textRecycling);
      goToRecycling(scene);
    });
  }

  sceneEventsEmitter.on(sceneEvents.EventsUnlocked, (data) => {
    console.log("EventsUnlocked screen", data);
    if (!scene.isBonus) return;

    if (
      eventsHas(data, "factory_after") ||
      eventsHas(data, "mine_after") ||
      eventsHas(data, "recycling_after")
    ) {
      window.location.href = "?bonus";
    }
  });
};
