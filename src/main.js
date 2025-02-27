import Phaser from "phaser";

import { isDebug } from "./Utils/isDebug";
import Preloader from "./Preloader";
import Game from "./Game";
import Message from "./Message";
import Workflow from "./Workflow";
import Cable from "./Cable";
import Factory from "./Factory";
import Mine from "./Mine";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  pixelArt: true,
  width: 550,
  height: 300,
  backgroundColor: '#37b0be',
  physics: {
    default: "arcade",
    arcade: {
      debug: isDebug(),
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, Game, Cable, Mine, Factory, Message, Workflow],
  scale: {
    zoom: 2,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    disableWebAudio: true
  }
};

export default new Phaser.Game(config);
