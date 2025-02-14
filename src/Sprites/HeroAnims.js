const params = new URLSearchParams(window.location.search);
const moveframerate = params.get("moveframerate") || 10
const idleframerate = params.get("idleframerate") || 4

export const createHeroAnims = function(anims) {
	anims.create({
		key: 'mai-walk-down',
		frames: anims.generateFrameNames('mai', { start: 1, end: 3, prefix: 'walk-down-' }),
		repeat: -1,
		frameRate: moveframerate,
	})
	.addFrame(anims.generateFrameNames('mai', { start: 2, end: 2, prefix: 'walk-down-' }));

	anims.create({
		key: 'mai-walk-up',
		frames: anims.generateFrameNames('mai', { start: 1, end: 3, prefix: 'walk-up-' }),
		repeat: -1,
		frameRate: moveframerate,
	})
	.addFrame(anims.generateFrameNames('mai', { start: 2, end: 2, prefix: 'walk-up-' }));

	anims.create({
		key: 'mai-walk-side',
		frames: anims.generateFrameNames('mai', { start: 1, end: 3, prefix: 'walk-right-' }),
		repeat: -1,
		frameRate: moveframerate,
	})
	.addFrame(anims.generateFrameNames('mai', { start: 2, end: 2, prefix: 'walk-right-' }));

	anims.create({
		key: 'mai-idle-down',
		frames: anims.generateFrameNames('mai', { start: 1, end: 3, prefix: 'idle-down-' }),
		repeat: 0,
		frameRate: idleframerate,
	})
	.addFrame(anims.generateFrameNames('mai', { start: 1, end: 2, prefix: 'idle-down-' }));

	anims.create({
		key: 'mai-idle-up',
		frames: anims.generateFrameNames('mai', { start: 1, end: 3, prefix: 'idle-up-' }),
		repeat: 0,
		frameRate: idleframerate,
	});

	anims.create({
		key: 'mai-idle-side',
		frames: anims.generateFrameNames('mai', { start: 1, end: 3, prefix: 'idle-right-' }),
		repeat: 0,
		frameRate: idleframerate,
	})
	.addFrame(anims.generateFrameNames('mai', { start: 1, end: 2, prefix: 'idle-right-' }));
}
