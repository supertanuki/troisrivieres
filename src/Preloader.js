import Phaser from "phaser";
import isMobileOrTablet from "./Utils/isMobileOrTablet";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
    this.progressBar = null;
  }

  preload() {
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    this.progressBar = this.add.graphics();

    this.load.on(
      "progress",
      (value) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(0, screenHeight / 2, screenWidth * value, 30);
      },
      this
    );

    this.load.on("complete", () => this.progressBar.destroy(), this);

    this.load.image("tiles", "tiles/Asset_Atlas_01.png");
    this.load.tilemapTiledJSON("map", "tiles/3rivers.json");

    this.load.image("splash", "img/Splash_Art.webp");

    this.load.atlas("mai", "sprites/mai.png", "sprites/mai.json");
    this.load.atlas("trees", "sprites/trees.png", "sprites/trees.json");
    this.load.atlas("sprites", "sprites/sprites.png", "sprites/sprites.json");

    if (isMobileOrTablet)
      this.load.plugin(
        "rexvirtualjoystickplugin",
        "plugins/rexvirtualjoystickplugin.min.js",
        true
      );

    this.load.font("DefaultFont", "fonts/FreePixel.ttf");
  }

  create() {
    this.scene.start("game");
  }
}
