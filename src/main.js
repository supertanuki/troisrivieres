import Phaser from 'phaser'

import Preloader from './Preloader'
import Game from './Game'
import Message from './Message'
import Workflow from './Workflow'

const params = new URLSearchParams(window.location.search);

const config = {
	type: Phaser.AUTO,
	parent: 'game',
	pixelArt: true,
	width: 550,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			debug: params.has('debug'),
			gravity: { y: 0 },
		},
	},
	scene: [Preloader, Game, Message, Workflow],
	scale: {
		zoom: 2,
		mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
