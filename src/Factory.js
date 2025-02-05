import Phaser from "phaser";
import { isDebug } from "./Utils/isDebug";

const COMPONENTS = {
  bleu: "img/factory/bleu.png",
  bleuge: "img/factory/bleuge.png",
  jaune: "img/factory/jaune.png",
  rouge: "img/factory/rouge.png",
  roune: "img/factory/roune.png",
  vert: "img/factory/vert.png",
};

const initialY = 265;
const initialX = 275;
const step = 70;
const motherboardValidatedSpeed = 10;

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
    this.motherboardSpeed = 2;
    this.numberValidated = 0
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

  initMotherboard() {
    this.componentValidated = 0;
    this.isMotherboardValidated = false;
    this.motherBoardComponents = [];
    this.motherBoard = [];
    const x = -150;
    this.motherBoard.push(this.add.rectangle(x, 150, 200, 100, 0x555555));

    for (let i = 0; i < 2; i++) {
      const name = Phaser.Math.RND.pick(Object.keys(COMPONENTS));
      const component = this.add
        .image(x - 40 + 80 * i, 150, name)
        .setAlpha(0, 0.4, 0.6, 0.6);
      this.motherBoardComponents.push({ name, component, validated: false });
      this.motherBoard.push(component);
    }
  }

  initSelectedComponent() {
    this.graphics = this.add.graphics({
      lineStyle: {
        width: 2,
        color: 0x555555,
      },
    });
    this.graphics.strokeRect(250, 240, 50, 50);
    const style = { color: "0x000000" };
    this.upText = this.add.text(275, 230, "🢁", style).setOrigin(0.5, 0.5);
    this.leftText = this.add.text(235, 235, "🢀", style).setOrigin(0.5, 0.5);
    this.rightText = this.add.text(315, 235, "🢂", style).setOrigin(0.5, 0.5);
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
          this.up();
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
  }

  refreshComponentsLine() {
    let i = 0;
    this.componentsLine.forEach((component) => {
      component.image.x =
        initialX + this.componentsLinePosition * step + step * i;
      i++;
    });
  }

  right() {
    if (this.componentsLinePosition - 1 < -1 * this.componentsLine.length + 1) {
      return;
    }
    this.hightLightCommand(this.rightText);
    this.componentsLinePosition--;
    this.refreshComponentsLine();
  }

  left() {
    if (this.componentsLinePosition + 1 > 0) {
      return;
    }
    this.hightLightCommand(this.leftText);
    this.componentsLinePosition++;
    this.refreshComponentsLine();
  }

  up() {
    this.hightLightCommand(this.upText);
    const selectedComponent =
      this.componentsLine[-1 * this.componentsLinePosition];

    for (const component of this.motherBoardComponents) {
      console.log(component);
      if (component.name === selectedComponent.name && !component.validated) {
        this.componentValidated++;
        this.validateComponent(component.component);
        component.validated = true;
        break;
      }
    }

    if (this.componentValidated === 2) {
      this.validateMotherboard();
    }
  }

  validateMotherboard() {
    this.isMotherboardValidated = true;
    this.motherBoard[0].fillColor = 0xffffff;
    this.numberValidated++

    const isFaster = 1 === this.numberValidated % 3

    if (isFaster) {
      this.motherboardSpeed += 1
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
  }

  endMotherboard() {
    if (!this.isMotherboardValidated) {
      this.textObject.text =  'Raté !!!'
      this.textObject.setVisible(true)
      this.time.delayedCall(1000, () => {
        this.textObject.setVisible(false)
      });
    }

    this.destroyMotherboard();
    this.initMotherboard();
  }

  validateComponent(component) {
    component.setAlpha(1);
  }

  hightLightCommand(text) {
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
        : this.motherboardSpeed;
    }

    if (this.motherBoard[0].x > 700) {
      this.endMotherboard();
    }
  }
}
