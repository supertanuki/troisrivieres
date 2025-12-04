import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import Game from "../Game";
import { goToMine, goToFactory, goToRecycling } from "../Story/goToGame";
import { urlParamHas } from "../Utils/debug";
import { eventsHas } from "../Utils/events";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import { saveLocale } from "../Utils/locale";
import { playVillageAmbiance } from "../Utils/music";
import { getProgression } from "../Utils/progression";
import { getUiMessage } from "../Workflow/messageWorkflow";

/** @param {Game} scene  */
export const splashScreen = function (scene) {
  if (urlParamHas("nostart")) {
    scene.resetGameSize();
    scene.startGame();
    return;
  }

  scene.isBonus = urlParamHas("bonus");
  if (scene.isBonus) {
    afterLocaleSelected(scene);
    return;
  }

  if (isMobileOrTablet()) {
    const orientationMessage = scene.add
      .bitmapText(
        225,
        50,
        "FreePixel-16",
        "Tournez votre appareil en mode paysage",
        32
      )
      .setMaxWidth(400)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
      .setDepth(10000);
    const checkOrientation = (orientation) => {
      if (!orientation?.type) return;
      if (orientation.type.includes("landscape")) {
        orientationMessage.setVisible(false);
        return;
      }
      orientationMessage.setVisible(true);
    };
    checkOrientation(screen.orientation);
    screen.orientation.addEventListener("change", (event) =>
      checkOrientation(event.target)
    );
  }

  const chooseLocale = (locale) => {
    saveLocale(locale);
    frText.destroy();
    enText.destroy();
    afterLocaleSelected(scene);
  };

  const frText = scene.add
    .bitmapText(150, 125, "FreePixel-16", "Français", 16)
    .setOrigin(0.5, 0.5)
    .setTintFill(0xffffff)
    .setInteractive({ useHandCursor: true });

  frText.input.hitArea.setTo(-30, -30, frText.width + 60, frText.height + 60);

  frText.on("pointerdown", () => chooseLocale("fr"));
  frText.on("pointerover", () => mouseOver(frText, 0x307f6d));
  frText.on("pointerout", () => mouseOut(frText));

  const enText = scene.add
    .bitmapText(300, 125, "FreePixel-16", "English", 16)
    .setOrigin(0.5, 0.5)
    .setTintFill(0xffffff)
    .setInteractive({ useHandCursor: true });

  enText.input.hitArea.setTo(-30, -30, enText.width + 60, enText.height + 60);

  enText.on("pointerdown", () => chooseLocale("en"));
  enText.on("pointerover", () => mouseOver(enText, 0x307f6d));
  enText.on("pointerout", () => mouseOut(enText));
};

const afterLocaleSelected = function (scene) {
  scene.cameras.main.fadeIn(1000);
  const progression = getProgression();

  let goingSomewhere = false;
  let continueplay = null;

  scene.scale.setGameSize(550, 300);
  playVillageAmbiance(scene);

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
    .bitmapText(
      275,
      130 + (progression && -50),
      "FreePixel-16",
      "Trois-Rivières",
      32
    )
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

  const textStart = scene.add
    .bitmapText(
      275,
      164,
      "FreePixel-16",
      scene.isBonus || progression
        ? getUiMessage("game.newGame")
        : getUiMessage("game.play"),
      16
    )
    .setOrigin(0.5, 0.5)
    .setTintFill(0xffffff)
    .setInteractive({ useHandCursor: true });

  textStart.input.hitArea.setTo(
    -20,
    -10,
    textStart.width + 40,
    textStart.height + 20
  );

  const startGame = (continueplaying = false) => {
    scene.isBonus = false;
    goingSomewhere = true;

    if (continueplaying) {
      continueplay.disableInteractive(true);
      continueplay.setText(getUiMessage("game.loading"));
      textStart.destroy();
    } else {
      textStart.disableInteractive(true);
      textStart.setText(getUiMessage("game.loading"));
      continueplay?.destroy();
    }

    document.body.style.cursor = "none";

    scene.cameras.main.fadeOut(500, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;

      scene.resetGameSize();
      scene.startGame(continueplaying);
      colorBackground.destroy();
      textStart?.destroy();
      continueplay?.destroy();
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
    startGame();
  });
  textStart.on("pointerover", () => mouseOver(textStart, 0x307f6d));
  textStart.on("pointerout", () => mouseOut(textStart));

  if (progression) {
    continueplay = scene.add
      .bitmapText(
        275,
        124,
        "FreePixel-16",
        getUiMessage("game.continueGame"),
        16
      )
      .setOrigin(0.5, 0.5)
      .setTintFill(0xffffff)
      .setInteractive({ useHandCursor: true });

    continueplay.input.hitArea.setTo(
      -20,
      -10,
      continueplay.width + 40,
      continueplay.height + 20
    );

    continueplay.on("pointerdown", () => {
      if (goingSomewhere) return;
      startGame(true);
    });

    continueplay.on("pointerover", () => mouseOver(continueplay, 0x307f6d));
    continueplay.on("pointerout", () => mouseOut(continueplay));
  }

  const credits = scene.add
    .bitmapText(510, 285, "FreePixel-16", getUiMessage("game.credits"), 16)
    .setOrigin(0.5, 0.5)
    .setTintFill(0xffffff)
    .setInteractive({ useHandCursor: true });

  credits.input.hitArea.setTo(
    -20,
    -10,
    credits.width + 40,
    credits.height + 20
  );
  credits.on("pointerdown", () => (window.location.href = "credits.html"));
  credits.on("pointerover", () => mouseOver(credits, 0x000000));
  credits.on("pointerout", () => mouseOut(credits));

  if (scene.isBonus) {
    const textMine = scene.add
      .bitmapText(160, 210, "FreePixel-16", getUiMessage("game.mine"), 16)
      .setOrigin(0.5, 0.5)
      .setTintFill(0xffffff)
      .setInteractive({ useHandCursor: true });
    textMine.input.hitArea.setTo(
      -20,
      -10,
      textMine.width + 40,
      textMine.height + 20
    );
    textMine.on("pointerover", () => mouseOver(textMine));
    textMine.on("pointerout", () => mouseOut(textMine));
    textMine.on("pointerdown", () => {
      if (goingSomewhere) return;
      clickBonusGame(textMine);
      goToMine(scene);
    });

    const textFactory = scene.add
      .bitmapText(260, 240, "FreePixel-16", getUiMessage("game.factory"), 16)
      .setOrigin(0.5, 0.5)
      .setTintFill(0xffffff)
      .setInteractive({ useHandCursor: true });
    textFactory.input.hitArea.setTo(
      -20,
      -10,
      textFactory.width + 40,
      textFactory.height + 20
    );
    textFactory.on("pointerover", () => mouseOver(textFactory));
    textFactory.on("pointerout", () => mouseOut(textFactory));
    textFactory.on("pointerdown", () => {
      if (goingSomewhere) return;
      clickBonusGame(textFactory);
      goToFactory(scene);
    });

    const textRecycling = scene.add
      .bitmapText(400, 260, "FreePixel-16", getUiMessage("game.recycling"), 16)
      .setOrigin(0.5, 0.5)
      .setTintFill(0xffffff)
      .setInteractive({ useHandCursor: true });
    textRecycling.input.hitArea.setTo(
      -20,
      -10,
      textRecycling.width + 40,
      textRecycling.height + 20
    );
    textRecycling.on("pointerover", () => mouseOver(textRecycling));
    textRecycling.on("pointerout", () => mouseOut(textRecycling));
    textRecycling.on("pointerdown", () => {
      if (goingSomewhere) return;
      clickBonusGame(textRecycling);
      goToRecycling(scene);
    });
  }

  sceneEventsEmitter.on(sceneEvents.EventsUnlocked, (data) => {
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

const mouseOver = (target, color = 0x000000) => target.setTintFill(color);
const mouseOut = (target) => target.setTintFill(0xffffff);
