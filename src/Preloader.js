import Phaser from "phaser";

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
      function (value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(0, screenHeight / 2, screenWidth * value, 30);
      },
      this
    );

    this.load.on(
      "complete",
      function () {
        this.progressBar.destroy();
      },
      this
    );

    this.load.image("tiles", "tiles/Asset_Atlas_01.png");
    this.load.tilemapTiledJSON("map", "tiles/3rivers.json");

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "plugins/rexvirtualjoystickplugin.min.js",
      true
    );

    this.load.atlas("mai", "sprites/mai.png", "sprites/mai.json");
    this.load.atlas("trees", "sprites/trees.png", "sprites/trees.json");
    this.load.atlas("sprites", "sprites/sprites.png", "sprites/sprites.json");
    this.load.atlas("ui", "sprites/ui.png", "sprites/ui.json");

    this.load.image("ui-chat", "img/ui/chat.png");
    /*
    this.load.image("background-middle", "img/Parallax/Middle.png");
    this.load.image("background-mountains", "img/Parallax/Mountains.png");
    this.load.image("background-sky", "img/Parallax/Sky.png");
    */

    this.load.plugin(
      "AnimatedTiles",
      "plugins/rexvirtualjoystickplugin.min.js"
    );

    this.load.audio("village-theme", "sounds/village_theme_compressed.mp3");
    this.load.font("DefaultFont", "fonts/FreePixel.ttf");
  }

  create() {
    this.scene.start("game");
  }
}
