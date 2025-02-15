import Phaser from "phaser";
import isMobile from "./Utils/isMobile";

const COMPONENTS = {
  bleu: "img/factory/bleu.png",
  bleuge: "img/factory/bleuge.png",
  jaune: "img/factory/jaune.png",
  rouge: "img/factory/rouge.png",
  //roune: "img/factory/roune.png",
  vert: "img/factory/vert.png",
};

const initialY = 265;
const initialX = 275;
const step = 70;
const motherboardValidatedSpeed = 10;
const accelerationStep = 5
const initialSpeed = 0.75
const acceleration = 0.5

export default class Factory extends Phaser.Scene {
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
    this.numberValidated = 0
    this.enableComponentsControl = true
  }

  preload() {
    this.load.image("tapis", "img/factory/tapisroulant.jpg");

    for (const [key, value] of Object.entries(COMPONENTS)) {
      this.load.image(key, value);
    }
  }

  create() {
    this.add.image(0, 0, "tapis").setOrigin(0, 0);
    this.initSelectedComponent();
    this.initMotherboard();
    this.initComponents();
    this.createControls();

    const config = this.sys.game.config;
    this.textObject = this.add.text(config.width / 2, 50, "", {
      font: "14px Arial",
      fill: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.9)",
      padding: 6,
      alpha: 0,
    })
    this.textObject
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(1000)
      .setWordWrapWidth(300)
      .setActive(false)
      .setVisible(false)

    // Fade init
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  initComponents() {
    let i = 0;
    for (const name in COMPONENTS) {
      this.componentsLine.push({
        name,
        image: this.add.image(initialX + step * i, initialY, name),
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
    const step = 160 / componentsNumber;
    this.componentValidated = 0;
    this.isMotherboardValidated = false;
    this.motherBoardComponents = [];
    this.motherBoard = [];
    this.motherBoard.push(this.add.rectangle(x, 150, 200, 100, 0x555555));

    for (let i = 0; i < componentsNumber; i++) {
      const name = Phaser.Math.RND.pick(Object.keys(COMPONENTS));
      const component = this.add
        .image(x - 40 + step * i, 150, name)
        .setAlpha(0, 0.4, 0.6, 0.6);
      this.motherBoardComponents.push({ name, component, validated: false });
      this.motherBoard.push(component);
    }

    this.enableComponentsControl = true;
  }

  initSelectedComponent() {
    this.graphics = this.add.graphics({
      lineStyle: {
        width: 2,
        color: 0x555555,
      },
    });
    this.graphics.strokeRect(250, 240, 50, 50);

    // to remove ???
    const style = { color: "0x000000" };
    this.upText = this.add.text(275, 230, "🢁", style).setOrigin(0.5, 0.5).setVisible(false);
    this.leftText = this.add.text(235, 235, "🢀", style).setOrigin(0.5, 0.5).setVisible(false)
    this.rightText = this.add.text(315, 235, "🢂", style).setOrigin(0.5, 0.5).setVisible(false)
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
          this.handleAction();
        }
      },
      this
    );

    if (isMobile()) {
      const screenWidth = Number(this.sys.game.config.width);
      const delta = 100;

      this.input.on('pointerdown', (pointer) => {
        if (pointer.x < (screenWidth/2 - delta)) {
          this.left()
          return
        }

        if (pointer.x > (screenWidth/2 + delta)) {
          this.right()
          return
        }

        this.setComponent()
      }, this);
    }
  }

  refreshComponentsLine() {
    let i = 0;
    this.componentsLine.forEach((component) => {
      component.image.x =
        initialX + this.componentsLinePosition * step + step * i;
      i++;
      component.image.y = initialY
    });
  }

  right() {
    if (!this.enableComponentsControl || this.componentsLinePosition - 1 < -1 * this.componentsLine.length + 1) {
      return;
    }
    this.hightLightCommand(this.rightText);
    this.componentsLinePosition--;
    this.refreshComponentsLine();
  }

  left() {
    if (!this.enableComponentsControl || this.componentsLinePosition + 1 > 0) {
      return;
    }
    this.hightLightCommand(this.leftText);
    this.componentsLinePosition++;
    this.refreshComponentsLine();
  }

  getSelectedComponent() {
    return this.componentsLine[-1 * this.componentsLinePosition];
  }

  getValidatedComponent() {
    const selectedComponent = this.getSelectedComponent()

    for (const component of this.motherBoardComponents) {
      if (component.name === selectedComponent.name && !component.validated) {
        this.componentValidated++;
        this.validateComponent(component.component);
        component.validated = true;
        return component
      }
    }

    return null
  }

  setComponent() {
    if (!this.enableComponentsControl) return

    this.enableComponentsControl = false;
    this.hightLightCommand(this.upText);

    const {image} = this.getSelectedComponent()
    image.setDepth(1)

    const validatedComponent = this.getValidatedComponent()

    if (validatedComponent) {
      const initialPosition = {x: image.x, y: image.y}
      this.tweens.add({
        targets: image,
        x: validatedComponent.component.x + 10,
        y: validatedComponent.component.y,
        ease: "Sine.easeInOut",
        duration: 200,
        onComplete: () => {
          image.x = initialPosition.x
          image.y = initialY
          this.enableComponentsControl = true;
        },
      });

    } else {
      this.tweens.add({
        targets: image,
        y: 150,
        yoyo: true,
        ease: "Sine.easeInOut",
        duration: 200,
        onComplete: () => {
          this.enableComponentsControl = true;
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
    this.numberValidated++

    const isFaster = 1 === this.numberValidated % accelerationStep

    if (isFaster) {
      this.motherboardSpeed += acceleration
    }

    this.textObject.text = isFaster ? 'Validé ! Plus vite maintenant !!!' : 'Validé !'
    this.textObject.setVisible(true)
    this.time.delayedCall(1000, () => {
      this.textObject.setVisible(false)
    });
  }

  destroyMotherboard() {
    for (const element of this.motherBoard) {
      element.destroy();
    }
    this.motherBoard = []
  }

  endMotherboard() {
    this.enableComponentsControl = false;

    if (!this.isMotherboardValidated) {
      this.textObject.text =  'Raté !!!'
      this.textObject.setVisible(true)
      this.destroyMotherboard();

      this.time.delayedCall(1000, () => {
        this.textObject.setVisible(false)  
        this.initMotherboard();
      });

      return
    }

    this.destroyMotherboard();
    this.initMotherboard();
  }

  validateComponent(component) {
    component.setAlpha(1);
  }

  hightLightCommand(text) {
    return
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 100,
      yoyo: true,
      onUpdate: (tween) => {
        const v = tween.getValue();
        const c = 150 * v;
        text.setFontSize(20 + v * 30);
        text.setColor(`rgb(${c}, ${c}, ${c})`);
      },
    });
  }

  handleAction() {}

  update() {
    for (const element of this.motherBoard) {
      element.x += this.isMotherboardValidated
        ? motherboardValidatedSpeed
        : this.motherBoard[0].x < 30 || this.motherBoard[0].x > 500 ? 10 : this.motherboardSpeed;
    }

    if (this.motherBoard.length && this.motherBoard[0].x > 700) {
      this.endMotherboard();
    }
  }
}
