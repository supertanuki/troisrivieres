import { AUTO, Game, Scale } from 'phaser';

import { isDebug } from "./Utils/isDebug";
import Preloader from "./Preloader";
import MainScene from "./Game";
import Message from "./UI/Message";
import Workflow from "./Workflow/Workflow";
import Factory from "./Factory/Factory";
import MineNightmare from "./Mine/MineNightmare";
import Mine from "./Mine/Mine";

const config = {
  type: AUTO,
  parent: "game",
  pixelArt: true,
  render: { pixelArt: true },
  width: 450,
  height: 250,
  backgroundColor: '#000000',
  physics: {
    default: "arcade",
    arcade: {
      debug: isDebug(),
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, MainScene, MineNightmare, Mine, Factory, Message, Workflow],
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};

export default new Game(config);
