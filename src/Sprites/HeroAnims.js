export const createHeroAnims = function(anims) {
	anims.create({
		key: 'mai-idle-down',
		frames: [{ key: 'mai', frame: 'front' }]
	});

	anims.create({
		key: 'mai-idle-up',
		frames: [{ key: 'mai', frame: 'back' }]
	});

	anims.create({
		key: 'mai-idle-side',
		frames: [{ key: 'mai', frame: 'side' }]
	});

	/*
	anims.create({
		key: 'hero-run-down',
		frames: anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-down-' }),
		repeat: -1,
		frameRate: 14
	});

	anims.create({
		key: 'hero-run-up',
		frames: anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-up-' }),
		repeat: -1,
		frameRate: 14
	});

	anims.create({
		key: 'hero-run-side',
		frames: anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-side-' }),
		repeat: -1,
		frameRate: 14
	});

	anims.create({
		key: 'hero-die',
		frames: anims.generateFrameNames('hero', { start: 1, end: 4, prefix: 'faint-' }),
		repeat: 0,
		frameRate: 14
	});
	*/
}
