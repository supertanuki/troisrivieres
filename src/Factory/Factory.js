import Phaser from "phaser";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import MiniGameUi from "../UI/MiniGameUi";
import { gameDuration, urlParamHas } from "../Utils/debug";
import { dispatchUnlockEvents, eventsHas } from "../Utils/events";
import { DiscussionStatus } from "../Utils/discussionStatus";
import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import { getUiMessage } from "../Workflow/messageWorkflow";
import { FONT_RESOLUTION } from "../UI/Message";
import { playMiniGameTheme } from "../Utils/music";

const COMPONENTS = {
  blue: "component-blue",
  violet: "component-violet",
  yellow: "component-yellow",
  red: "component-red",
  green: "component-green",
};

const initialY = 265;
const initialX = 275;
const step = 90;
const motherboardInitialSpeed = 10;
const motherboardValidatedSpeed = 10;
const accelerationStep = 4;
const initialSpeed = 0.75;
const acceleration = 0.5;
const userLeftHandInitialPosition = { x: 255, y: 340 };

export default class Factory extends MiniGameUi {
  constructor() {
    super({
      key: "factory",
    });
    this.componentsLine = [];
    this.motherBoard = [];
    this.componentsLinePosition = 0;
    this.componentValidated = 0;
    this.isMotherboardValidated = false;
    this.motherboardSpeed = initialSpeed;
    this.numberValidated = 0;
    this.enableComponentsControl = true;
    this.conveyorPosition = 0;
    this.conveyorRollings = [];
    this.conveyorBackPosition = 0;
    this.warnings = 0;
    this.motherBoardComponents = [];
    this.firstStep = false;
  }

  preload() {
    super.preload();
    this.load.atlas("factory", "sprites/factory.png", "sprites/factory.json");
  }

  create() {
    this.timeStart = Date.now();
    super.create();
    this.cameras.main.setBackgroundColor(0x000000);
    this.scale.setGameSize(550, 300);

    this.anims
      .create({
        key: "select-component-anim",
        frames: this.anims.generateFrameNames("factory", {
          start: 1,
          end: 3,
          prefix: "select-",
        }),
        repeat: -1,
        frameRate: 10,
      })
      .addFrame(
        this.anims.generateFrameNames("factory", {
          start: 2,
          end: 2,
          prefix: "select-",
        })
      );

    this.anims.create({
      key: "water-anim",
      frames: this.anims.generateFrameNames("factory", {
        start: 1,
        end: 2,
        prefix: "water-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: "rolling",
      frames: this.anims.generateFrameNames("factory", {
        start: 1,
        end: 4,
        prefix: "roulement-",
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.anims.create({
      key: "rolling-fast",
      frames: this.anims.generateFrameNames("factory", {
        start: 1,
        end: 4,
        prefix: "roulement-",
      }),
      repeat: -1,
      frameRate: 20,
    });

    this.add.image(0, 234, "factory", "ground").setOrigin(0, 0);

    // back
    this.add.tileSprite(-4, -36, 554, 135, "factory", "sol").setOrigin(0, 0);
    this.conveyorInBack = this.add
      .tileSprite(0, -10, 550, 96, "factory", "tapis")
      .setOrigin(0, 0);

    this.initBackMotherboard();
    this.addBackHands();

    this.add
      .tileSprite(0, 0, 150, 99, "factory", "glass-repeat")
      .setOrigin(0, 0);
    this.add.tileSprite(150, 0, 67, 99, "factory", "vitre").setOrigin(0, 0);
    this.add
      .tileSprite(217, 0, 350, 99, "factory", "glass-repeat")
      .setOrigin(0, 0);

    // front
    this.add.tileSprite(0, 99, 550, 135, "factory", "sol").setOrigin(0, 0);
    const blockY = 102;
    this.add.image(474, blockY - 5, "factory", "block-back");

    this.conveyor = this.add
      .tileSprite(0, 105, 550, 96, "factory", "tapis")
      .setOrigin(0, 0);
    this.add.image(30, 104, "factory", "rouleaugauche").setOrigin(0, 0);
    this.add
      .tileSprite(45, 201, 550, 11, "factory", "rouleaubas")
      .setOrigin(0, 0);

    // left
    this.add
      .image(30, 104, "factory", "rouleaugauche")
      .setOrigin(0, 0)
      .setScale(-1, 1);
    this.add
      .tileSprite(0, 201, 14, 11, "factory", "rouleaubas")
      .setOrigin(0, 0);

    // front
    this.tube = this.add.rectangle(510, 100, 1, 1, 0x000000).setOrigin(0.5, 1);

    for (let i = 0; i < 3; i++) {
      this.conveyorRollings.push(
        this.add
          .sprite(-3 + i * 8, 202, "factory", "roulement-1")
          .setOrigin(0, 0)
          .anims.play("rolling", true)
      );
    }

    for (let i = 0; i < 54; i++) {
      this.conveyorRollings.push(
        this.add
          .sprite(40 + i * 8, 202, "factory", "roulement-1")
          .setOrigin(0, 0)
          .anims.play("rolling", true)
      );
    }

    this.add.image(510, blockY + 38, "factory", "block").setDepth(10);
    this.add.image(476, blockY - 5, "factory", "tube-water").setDepth(10);
    this.add.image(476, blockY + 15, "factory", "tube-water").setDepth(10);
    this.add.image(476, blockY + 35, "factory", "tube-water").setDepth(10);

    this.waterCleaningAnims = [];
    for (let i = 0; i <= 2; i++) {
      const element = this.add
        .sprite(457, blockY + 22 + i * 20, "factory", "water-1")
        .setDepth(10)
        .setVisible(false);
      element.anims.play("water-anim");
      this.waterCleaningAnims.push(element);
    }

    this.initComponents();
    this.initSelectedComponent();

    this.userLeftHand = this.add
      .image(
        userLeftHandInitialPosition.x,
        userLeftHandInitialPosition.y,
        "factory",
        "gant"
      )
      .setOrigin(0, 0);
    this.userLeftHand.scaleY = -1;
    this.userLeftHand.setDepth(10).setVisible(false);

    // Fade init
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    sceneEventsEmitter.on(
      sceneEvents.EventsUnlocked,
      this.listenUnlockedEvents,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.EventsDispatched,
      this.listenDispatchedEvents,
      this
    );

    if (urlParamHas("bypassminigame")) {
      this.endGame();
      return;
    }

    this.createControls();
    this.startGame();
  }

  startGame() {
    if (urlParamHas('factory')) {
      playMiniGameTheme(this);
    }

    this.cameras.main.fadeIn(2000, 0, 0, 0);

    this.time.addEvent({
      callback: () => this.startDiscussion("factory"),
      delay: 1000,
    });
    //this.initMotherboard();
  }

  gameOver() {
    this.isCinematic = true;
    this.isGameOver = true;
    dispatchUnlockEvents(["factory_game_over"]);
    this.startDiscussion("factory");
  }

  endGame() {
    console.log("Validated", this.numberValidated);
    gameDuration("Factory", this.timeStart);
    this.cameras.main.fadeOut(1000, 0, 0, 0, (cam, progress) => {
      if (progress !== 1) return;
      this.scene.stop();
      dispatchUnlockEvents(["factory_after"]);
    });
  }

  listenDispatchedEvents(data) {
    if (eventsHas(data, "factory_tuto_begin")) {
      this.tutoBegin();
    }
  }

  listenUnlockedEvents(data) {
    if (eventsHas(data, "factory_after_tuto")) {
      this.afterTuto();
    }

    if (eventsHas(data, "factory_end")) {
      this.endGame();
    }
  }

  tutoBegin() {
    this.isCinematic = false;
    this.firstStep = true;
    this.initMotherboard();
  }

  tutoMissed() {
    dispatchUnlockEvents(["factory_tuto_missed"]);
    this.isCinematic = true;
    this.startDiscussion("factory");
  }

  tutoEnd() {
    this.isCinematic = true;
    dispatchUnlockEvents(["factory_tuto_end"]);
    this.startDiscussion("factory");
  }

  afterTuto() {
    this.isCinematic = false;
    this.firstStep = false;
    this.initMotherboard();
  }

  addBackHands() {
    this.leftHand = this.add.image(420, -10, "factory", "gant").setOrigin(0, 0);
    this.tweens.add({
      targets: this.leftHand,
      x: 300,
      y: -100,
      angle: 40,
      ease: "Sine.easeInOut",
      yoyo: true,
      loop: -1,
      delay: 200,
      duration: 1000,
    });
    this.rightHand = this.add
      .image(330, -10, "factory", "gant")
      .setOrigin(0, 0);
    this.rightHand.scaleX = -1;
    this.tweens.add({
      targets: this.rightHand,
      x: 350,
      y: -100,
      angle: -40,
      ease: "Sine.easeInOut",
      yoyo: true,
      loop: -1,
      delay: 1000,
      duration: 800,
    });

    this.leftHand2 = this.add
      .image(200, -12, "factory", "gant")
      .setOrigin(0, 0);
    this.tweens.add({
      targets: this.leftHand2,
      x: 200,
      y: -80,
      angle: 30,
      ease: "Sine.easeInOut",
      yoyo: true,
      loop: -1,
      delay: 250,
      duration: 800,
    });
    this.rightHand2 = this.add
      .image(100, -12, "factory", "gant")
      .setOrigin(0, 0);
    this.rightHand2.scaleX = -1;
    this.tweens.add({
      targets: this.rightHand2,
      x: 150,
      y: -90,
      angle: -25,
      ease: "Sine.easeInOut",
      yoyo: true,
      loop: -1,
      delay: 1000,
      duration: 900,
    });
  }

  initComponents() {
    let i = 0;
    for (const name in COMPONENTS) {
      this.componentsLine.push({
        name,
        tray: this.add.image(
          initialX + step * i,
          initialY,
          "factory",
          `tray-${name}`
        ),
        image: this.add.image(
          initialX + step * i,
          initialY,
          "factory",
          COMPONENTS[name]
        ),
      });
      i++;
    }
  }

  getComponentsNumber() {
    return this.numberValidated > 5 ? 3 : 2;
  }

  initBackMotherboard() {
    this.backMotherboards = [];
    for (let i = 0; i <= 5; i++) {
      this.backMotherboards.push(
        this.add.image(600 + i * 100, 30, "factory", "motherboard")
      );
    }
  }

  initMotherboard() {
    const x = -150;
    const componentsNumber = this.getComponentsNumber();
    const stepBetweenComponents = 70 / componentsNumber;

    this.componentValidated = 0;
    this.isMotherboardValidated = false;
    this.motherBoardComponents = [];
    this.motherBoard = [];
    this.motherBoard.push(this.add.image(x, 150, "factory", "motherboard"));

    const randomComponentNames = [];
    const componentNames = Object.keys(COMPONENTS);
    for (let i = 0; i < componentsNumber; i++) {
      const name = Phaser.Math.RND.pick(componentNames);
      randomComponentNames.push(name);
      componentNames.splice(componentNames.indexOf(name), 1);
    }

    let componentsPosition = [2, 1];

    if (componentsNumber > 2) {
      if (randomComponentNames[0] === "green") {
        componentsPosition = [1, 2];
      } else if (randomComponentNames[1] === "green") {
        const thirdName = randomComponentNames[2];
        randomComponentNames[2] = "green";
        randomComponentNames[1] = thirdName;
      }
    }

    let componentsPositionIndex = 0;
    let componentsPositionY = 0;
    const componentsPositionMissing = [...componentsPosition];

    randomComponentNames.forEach((name, index) => {
      let component;
      if (componentsNumber === 2) {
        component = this.add.image(
          x - 18 + stepBetweenComponents * index,
          150,
          "factory",
          `component-position-${name}`
        );
      } else {
        if (componentsPositionMissing[componentsPositionIndex] === 0) {
          componentsPositionIndex++;
          componentsPositionY = 0;
        }
        componentsPosition[componentsPositionIndex];

        component = this.add.image(
          x - 15 + (stepBetweenComponents + 9) * componentsPositionIndex,
          componentsPosition[componentsPositionIndex] === 1
            ? 150
            : 165 - 30 + (stepBetweenComponents + 5) * componentsPositionY,
          "factory",
          `component-position-${name}`
        );
        componentsPositionMissing[componentsPositionIndex]--;
        componentsPositionY++;
      }

      this.motherBoardComponents.push({ name, component, validated: false });
      this.motherBoard.push(component);
    });

    this.enableComponentsControl = true;
  }

  initSelectedComponent() {
    const selectedComponent = this.add.sprite(275, 263, "factory", "select-1");
    selectedComponent.anims.play("select-component-anim");
  }

  createControls() {
    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (event.key === "ArrowUp") {
          this.handleAction();
        } else if (event.key === "ArrowDown") {
          //this.down()
        } else if (event.key === "ArrowLeft") {
          this.left();
        } else if (event.key === "ArrowRight") {
          this.right();
        } else if (event.keyCode === 32) {
          this.handleAction();
        }
      },
      this
    );

    if (isMobileOrTablet()) {
      const delta = 80;
      const arrowY = 225;

      const arrowStyle = {
        fontFamily: "DefaultFont",
        fontSize: "32px",
        fill: "#ffffff",
      };

      this.add
        .text(70, arrowY, "←", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(70, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(275, arrowY, "↑", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(275, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.add
        .text(480, arrowY, "→", arrowStyle)
        .setResolution(FONT_RESOLUTION)
        .setOrigin(0.5, 0.5)
        .setDepth(10000);
      this.add.circle(480, arrowY, 30, 0xff5544, 0.3).setDepth(10000);

      this.input.on(
        "pointerdown",
        (pointer) => {
          if (pointer.x < 275 - delta) {
            this.left();
            return;
          }

          if (pointer.x > 275 + delta) {
            this.right();
            return;
          }

          this.handleAction();
        },
        this
      );
    }
  }

  handleAction() {
    super.handleAction();

    if (this.currentDiscussionStatus === DiscussionStatus.NONE) {
      this.setComponent();
    }
  }

  refreshComponentsLine() {
    let i = 0;
    this.componentsLine.forEach((component) => {
      const x = initialX + this.componentsLinePosition * step + step * i;
      component.image.x = x;
      component.tray.x = x;
      component.image.y = initialY;
      i++;
    });
  }

  right() {
    super.handleAction();

    if (
      !this.enableComponentsControl ||
      this.componentsLinePosition - 1 < -1 * this.componentsLine.length + 1
    ) {
      return;
    }
    this.componentsLinePosition--;
    this.refreshComponentsLine();

    if (this.handAnimation) {
      this.handAnimation.destroy();
    }

    this.resetUserHand();
    // right hand
    this.userLeftHand.scaleX = 1;
    this.movingHand = true;
    this.userLeftHand.setX(350).setAlpha(0.1).setVisible(true);

    this.handAnimation = this.tweens.add({
      targets: this.userLeftHand,
      x: 330,
      angle: -30,
      alpha: 1,
      yoyo: true,
      ease: "Sine.easeInOut",
      duration: 200,
      onComplete: () => {
        this.resetUserHand();
      },
    });
  }

  left() {
    super.handleAction();

    if (!this.enableComponentsControl || this.componentsLinePosition + 1 > 0) {
      return;
    }
    this.componentsLinePosition++;
    this.refreshComponentsLine();

    if (this.movingHand) {
      //return
    }

    if (this.handAnimation) {
      this.handAnimation.destroy();
    }

    this.resetUserHand();
    // left hand
    this.userLeftHand.scaleX = -1;
    this.movingHand = true;
    this.userLeftHand.setX(200).setVisible(true);

    this.handAnimation = this.tweens.add({
      targets: this.userLeftHand,
      x: 220,
      angle: 30,
      alpha: 1,
      yoyo: true,
      ease: "Sine.easeInOut",
      duration: 200,
      onComplete: () => {
        this.resetUserHand();
      },
    });
  }

  getSelectedComponent() {
    return this.componentsLine[-1 * this.componentsLinePosition];
  }

  getValidatedComponent() {
    if (!this.motherBoardComponents.length) return null;
    const selectedComponent = this.getSelectedComponent();

    for (const component of this.motherBoardComponents) {
      if (component.name === selectedComponent.name && !component.validated) {
        this.componentValidated++;
        component.validated = true;
        return component;
      }
    }

    return null;
  }

  resetUserHand() {
    this.movingHand = false;
    this.userLeftHand.scaleX = 1;
    this.userLeftHand.setAlpha(0.1);
    this.userLeftHand.setVisible(false);
    this.userLeftHand.setRotation(0);
    this.userLeftHand.setPosition(
      userLeftHandInitialPosition.x,
      userLeftHandInitialPosition.y
    );
  }

  setComponent() {
    if (!this.enableComponentsControl) return;

    this.enableComponentsControl = false;

    const selectedComponent = this.getSelectedComponent().image;
    selectedComponent.setDepth(1);
    const initialPosition = { x: selectedComponent.x, y: selectedComponent.y };

    const validatedComponent = this.getValidatedComponent();

    this.resetUserHand();
    this.userLeftHand.setVisible(true);
    const animDuration = 200;

    if (this.handAnimation) {
      this.handAnimation.destroy();
    }

    if (validatedComponent) {
      const { component, name } = validatedComponent;
      this.tweens.add({
        targets: selectedComponent,
        x: component.x + 10,
        y: component.y,
        ease: "Sine.easeInOut",
        duration: animDuration,
        onComplete: () => {
          selectedComponent.x = initialPosition.x;
          selectedComponent.y = initialY;
          this.enableComponentsControl = true;

          // ensure that the component still exists
          try {
            component.setTexture("factory", `component-${name}`);
          } catch (error) {}
        },
      });

      this.handAnimation = this.tweens.add({
        targets: this.userLeftHand,
        x: component.x,
        y: 230,
        alpha: 1,
        angle: (component.x - 275) / 10,
        yoyo: true,
        ease: "Sine.easeInOut",
        duration: animDuration,
        onComplete: () => {
          this.enableComponentsControl = true;
          this.resetUserHand();
        },
      });
    } else {
      this.tweens.add({
        targets: selectedComponent,
        y: 150,
        yoyo: true,
        ease: "Sine.easeInOut",
        duration: animDuration,
        onComplete: () => {
          selectedComponent.x = initialPosition.x;
          selectedComponent.y = initialY;
          this.enableComponentsControl = true;
        },
      });

      this.handAnimation = this.tweens.add({
        targets: this.userLeftHand,
        y: 230,
        alpha: 1,
        yoyo: true,
        ease: "Sine.easeInOut",
        duration: animDuration,
        onComplete: () => {
          this.enableComponentsControl = true;
          this.resetUserHand();
        },
      });
    }

    if (this.componentValidated === this.getComponentsNumber()) {
      this.time.delayedCall(200, () => {
        if (this.motherBoard.length) {
          this.validateMotherboard();
        }
      });
    }
  }

  validateMotherboard() {
    this.isMotherboardValidated = true;
    this.numberValidated++;
    this.waterCleaningAnims.forEach((element) => element.setVisible(true));

    this.time.delayedCall(1000, () =>
      this.waterCleaningAnims.forEach((element) => element.setVisible(false))
    );

    const isFaster = 0 === this.numberValidated % accelerationStep;

    if (isFaster) {
      this.motherboardSpeed += acceleration;
      this.updateMessage(getUiMessage("factory.faster"));
    }

    if (!this.firstStep && 1 === this.numberValidated % (accelerationStep + 1))
      this.updateMessage(getUiMessage("factory.welldone"));
  }

  destroyMotherboard() {
    for (const element of this.motherBoard) {
      element.destroy();
    }
    this.motherBoard = [];
  }

  endMotherboard() {
    this.enableComponentsControl = false;

    if (!this.isMotherboardValidated) {
      if (this.firstStep) {
        this.destroyMotherboard();
        this.tutoMissed();
        return;
      }

      this.warnings++;
      this.updateWarnings(this.warnings);
      this.updateMessage(getUiMessage("factory.error"));
      this.destroyMotherboard();

      if (this.warnings === 3) {
        this.gameOver();
        return;
      }

      this.time.delayedCall(2000, () => {
        this.initMotherboard();
      });

      return;
    }

    if (this.firstStep) {
      this.tutoEnd();
      return;
    }

    this.destroyMotherboard();
    this.initMotherboard();
  }

  update() {
    // keep back conveyor always animated
    this.conveyorBackPosition += 1;
    this.conveyorInBack.setTilePosition(this.conveyorBackPosition, 0);
    this.backMotherboards.forEach((backMotherboard) => {
      backMotherboard.x--;
      if (backMotherboard.x < -100) backMotherboard.x = 600;
    });

    if (this.isCinematic) return;

    if (!this.motherBoard.length) {
      this.conveyorRollings.forEach((element) => element.anims.stop());
      return;
    }

    const speed = this.isMotherboardValidated
      ? motherboardValidatedSpeed
      : this.motherBoard[0].x < 30 || this.motherBoard[0].x > 500
      ? motherboardInitialSpeed
      : this.motherboardSpeed;

    this.conveyorRollings.forEach((element) =>
      element.anims.play(
        [motherboardValidatedSpeed, motherboardInitialSpeed].includes(speed)
          ? "rolling-fast"
          : "rolling",
        true
      )
    );

    this.conveyorPosition -= speed;
    this.conveyor.setTilePosition(this.conveyorPosition, 0);

    for (const element of this.motherBoard) {
      element.x += speed;
    }

    if (this.motherBoard.length && this.motherBoard[0].x > 590) {
      this.endMotherboard();
    }
  }
}
