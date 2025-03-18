import Phaser from "phaser";
import isMobileOrTablet from "../Utils/isMobileOrTablet";
import MiniGameUi from "../UI/MiniGameUi";

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
const accelerationStep = 5;
const initialSpeed = 0.75;
const acceleration = 0.5;
const userLeftHandInitialPosition = { x: 255, y: 310 };

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
  }

  preload() {
    this.load.atlas("factory", "sprites/factory.png", "sprites/factory.json");
    this.load.image("water", "img/rain.png");
  }

  create() {
    super.create();
    this.cameras.main.setBackgroundColor(0x000000);
    this.scale.setGameSize(550, 300);

    this.anims.create({
      key: "select-component-anim",
      frames: this.anims.generateFrameNames("factory", {
        start: 1,
        end: 3,
        prefix: "select-",
      }),
      repeat: -1,
      frameRate: 10,
    }).addFrame(this.anims.generateFrameNames("factory", {
      start: 2,
      end: 2,
      prefix: "select-",
    }));

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

    this.add.image(0, 234, "factory", "ground").setOrigin(0, 0)

    // back
    this.add.tileSprite(-4, -36, 554, 135, "factory", "sol").setOrigin(0, 0);
    this.conveyorInBack = this.add
      .tileSprite(0, -10, 550, 96, "factory", "tapis")
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    this.add.tileSprite(0, 99, 550, 135, "factory", "sol").setOrigin(0, 0)//.setAlpha(0.5)
    this.conveyor = this.add
      .tileSprite(0, 105, 550, 96, "factory", "tapis")
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);
    this.add.image(30, 104, "factory", "rouleaugauche").setOrigin(0, 0);
    this.add
      .image(30, 104, "factory", "rouleaugauche")
      .setOrigin(0, 0)
      .setScale(-1, 1);
    this.add.tileSprite(45, 201, 450, 11, "factory", "rouleaubas").setOrigin(0, 0);

    this.addBackHands();

    this.add.tileSprite(0, 0, 150, 99, "factory", "glass-repeat").setOrigin(0, 0);
    this.add.tileSprite(150, 0, 67, 99, "factory", "vitre").setOrigin(0, 0);
    this.add
      .tileSprite(217, 0, 350, 99, "factory", "glass-repeat")
      .setOrigin(0, 0);

    // front
    this.tube = this.add
      .rectangle(510, 100, 1, 1, 0x000000)
      .setOrigin(0.5, 1);

    this.water = this.add
      .particles(0, 0, "water", {
        speed: { min: 200, max: 300 },
        angle: { min: 70, max: 110 },
        gravityY: 300,
        lifespan: 500,
        quantity: 100,
        scale: { start: 0.5, end: 0 },
        emitting: false,
      })
      .setDepth(1);
    this.water.addParticleBounds(0, 0, 550, 150);

    for (let i = 0; i < 50; i++) {
      this.conveyorRollings.push(
        this.add
          .sprite(38 + i * 8, 202, "factory", "roulement-1")
          .setOrigin(0, 0)
          .anims.play("rolling", true)
      );
    }

    
    this.initMotherboard();
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

    this.createControls();
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
    this.rightHand = this.add.image(330, -10, "factory", "gant").setOrigin(0, 0);
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

    this.leftHand2 = this.add.image(200, -12, "factory", "gant").setOrigin(0, 0);
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
    this.rightHand2 = this.add.image(100, -12, "factory", "gant").setOrigin(0, 0);
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

  initMotherboard() {
    const x = -150;
    const componentsNumber = this.getComponentsNumber();
    const stepBetweenComponents = 90 / componentsNumber;
    this.componentValidated = 0;
    this.isMotherboardValidated = false;
    this.motherBoardComponents = [];
    this.motherBoard = [];
    this.motherBoard.push(this.add.image(x, 150, "factory", "motherboard"));

    for (let i = 0; i < componentsNumber; i++) {
      const name = Phaser.Math.RND.pick(Object.keys(COMPONENTS));
      const component = this.add
        .image(
          x - 24 + stepBetweenComponents * i,
          150,
          "factory",
          COMPONENTS[name]
        )
        .setAlpha(0, 0.4, 0.6, 0.6);
      this.motherBoardComponents.push({ name, component, validated: false });
      this.motherBoard.push(component);
    }

    this.enableComponentsControl = true;
  }

  initSelectedComponent() {
    const selectedComponent = this.add.sprite(275, 263, "factory", "select-1");
    selectedComponent.anims.play("select-component-anim")
    return
    this.graphics = this.add.graphics({
      lineStyle: {
        width: 2,
        color: 0xffff55,
      },
    });
    this.graphics.strokeRect(250, 240, 50, 50);
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
          this.setComponent();
        } else if (event.key === "ArrowDown") {
          //this.down()
        } else if (event.key === "ArrowLeft") {
          this.left();
        } else if (event.key === "ArrowRight") {
          this.right();
        } else if (event.keyCode === 32) {
          this.setComponent();
        }
      },
      this
    );

    if (isMobileOrTablet()) {
      const screenWidth = Number(this.sys.game.config.width);
      const delta = 100;

      this.input.on(
        "pointerdown",
        (pointer) => {
          if (pointer.x < screenWidth / 2 - delta) {
            this.left();
            return;
          }

          if (pointer.x > screenWidth / 2 + delta) {
            this.right();
            return;
          }

          this.setComponent();
        },
        this
      );
    }
  }

  refreshComponentsLine() {
    let i = 0;
    this.componentsLine.forEach((component) => {
      const x = initialX + this.componentsLinePosition * step + step * i;
      component.image.x = x
      component.tray.x = x
      component.image.y = initialY;
      i++;
    });
  }

  right() {
    if (
      !this.enableComponentsControl ||
      this.componentsLinePosition - 1 < -1 * this.componentsLine.length + 1
    ) {
      return;
    }
    this.componentsLinePosition--;
    this.refreshComponentsLine();

    if (this.handAnimation) {
      this.handAnimation.destroy()
    }

    this.resetUserHand()
    // right hand
    this.userLeftHand.scaleX = 1
    this.movingHand = true
    this.userLeftHand.setX(450)
    this.userLeftHand.setVisible(true);

    this.handAnimation = this.tweens.add({
      targets: this.userLeftHand,
      x: 350,
      y: 330,
      angle: -30,
      alpha: 1,
      yoyo: true,
      ease: "Sine.easeInOut",
      duration: 200,
      onComplete: () => {
        this.resetUserHand()
      },
    });
  }

  left() {
    if (!this.enableComponentsControl || this.componentsLinePosition + 1 > 0) {
      return;
    }
    this.componentsLinePosition++;
    this.refreshComponentsLine();

    if (this.movingHand) {
      //return
    }
    
    if (this.handAnimation) {
      this.handAnimation.destroy()
    }

    this.resetUserHand()
    // left hand
    this.userLeftHand.scaleX = -1
    this.movingHand = true
    this.userLeftHand.setX(100)
    this.userLeftHand.setVisible(true);

    this.handAnimation = this.tweens.add({
      targets: this.userLeftHand,
      x: 200,
      y: 330,
      angle: 30,
      alpha: 1,
      yoyo: true,
      ease: "Sine.easeInOut",
      duration: 200,
      onComplete: () => {
        this.resetUserHand()
      },
    });
  }

  getSelectedComponent() {
    return this.componentsLine[-1 * this.componentsLinePosition];
  }

  getValidatedComponent() {
    const selectedComponent = this.getSelectedComponent();

    for (const component of this.motherBoardComponents) {
      if (component.name === selectedComponent.name && !component.validated) {
        this.componentValidated++;
        this.validateComponent(component.component);
        component.validated = true;
        return component;
      }
    }

    return null;
  }

  resetUserHand() {
    this.movingHand = false
    this.userLeftHand.scaleX = 1
    this.userLeftHand.setAlpha(0);
    this.userLeftHand.setVisible(false);
    this.userLeftHand.setRotation(0)
    this.userLeftHand.setPosition(userLeftHandInitialPosition.x, userLeftHandInitialPosition.y)
  }

  setComponent() {
    if (!this.enableComponentsControl) return;

    this.enableComponentsControl = false;

    const selectedComponent = this.getSelectedComponent().image;
    selectedComponent.setDepth(1);
    const initialPosition = { x: selectedComponent.x, y: selectedComponent.y };

    const validatedComponent = this.getValidatedComponent();

    this.resetUserHand()
    this.userLeftHand.setVisible(true);
    const animDuration = 200

    if (this.handAnimation) {
      this.handAnimation.destroy()
    }

    if (validatedComponent) {
      this.tweens.add({
        targets: selectedComponent,
        x: validatedComponent.component.x + 10,
        y: validatedComponent.component.y,
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
        x: validatedComponent.component.x,
        y: 230,
        alpha: 1,
        angle: (validatedComponent.component.x - 275) / 10,
        yoyo: true,
        ease: "Sine.easeInOut",
        duration: animDuration,
        onComplete: () => {
          this.enableComponentsControl = true;
          this.resetUserHand()
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
          this.resetUserHand()
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
    this.motherBoard[0].fillColor = 0xffffff;
    this.numberValidated++;

    const isFaster = 1 === this.numberValidated % accelerationStep;

    if (isFaster) {
      this.motherboardSpeed += acceleration;
    }

    this.updateMessage(
      isFaster
        ? "Validé ! Plus vite maintenant !!!"
        : "C'est bien, tu es productive !"
    );
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
      this.updateMessage("C'est quoi ce boulot ? Ressaisis-toi la nouvelle !");
      this.destroyMotherboard();

      this.time.delayedCall(1000, () => {
        this.initMotherboard();
      });

      return;
    }

    this.destroyMotherboard();
    this.initMotherboard();
  }

  validateComponent(component) {
    component.setAlpha(1);
  }

  update() {
    this.conveyorBackPosition += 1;
    this.conveyorInBack.setTilePosition(this.conveyorBackPosition, 0);

    if (!this.motherBoard.length) {
      this.conveyorRollings.forEach((element) => element.anims.stop());
      return;
    }

    if (this.isMotherboardValidated) {
      this.water.emitParticleAt(this.tube.x, this.tube.y);
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

    if (this.motherBoard.length && this.motherBoard[0].x > 700) {
      this.endMotherboard();
    }
  }
}
