import Phaser from "phaser";

import { isDebug } from "./Utils/isDebug";
import Preloader from "./Preloader";
import Game from "./Game";
import Message from "./Message";
import Workflow from "./Workflow";
import Cable from "./Cable";
import Factory from "./Factory";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  pixelArt: true,
  width: 550,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      debug: isDebug(),
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, Game, Cable, Factory, Message, Workflow],
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
