import Phaser from "phaser";

import { isDebug } from "./Utils/isDebug";
import Preloader from "./Preloader";
import Game from "./Game";
import Message from "./UI/Message";
import Workflow from "./Workflow/Workflow";
import Cable from "./Cable";
import Factory from "./Factory";
import MineNightmare from "./Mine/MineNightmare";
import Mine from "./Mine/Mine";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  pixelArt: true,
  render: { pixelArt: true },
  width: 450,
  height: 250,
  backgroundColor: '#37b0be',
  physics: {
    default: "arcade",
    arcade: {
      debug: isDebug(),
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, Game, Cable, MineNightmare, Mine, Factory, Message, Workflow],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    disableWebAudio: true
  }
};

export default new Phaser.Game(config);
