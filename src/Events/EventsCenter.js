import Phaser from 'phaser'

const sceneEventsEmitter = new Phaser.Events.EventEmitter()

const sceneEvents = {
	'HEARTSCHANGED': 'HEARTSCHANGED',
	'GAMEOVER': 'GAMEOVER',
	'DiscussionReady': 'DiscussionReady',
	'DiscussionAbort': 'DiscussionAbort',
	'DiscussionStarted': 'DiscussionStarted',
	'DiscussionWaiting': 'DiscussionWaiting',
	'DiscussionInProgress': 'DiscussionInProgress',
	'DiscussionEnded': 'DiscussionEnded',
	'DiscussionContinuing': 'DiscussionContinuing',
	'HasUnreadMessage': 'HasUnreadMessage',
	'MessageSent': 'MessageSent',
	'EventsUnlocked': 'EventsUnlocked',
	'EventsDispatched': 'EventsDispatched',
	'PreEventsUnlocked': 'PreEventsUnlocked',
	'screenShutdown': 'screenShutdown',
}

export {
	sceneEventsEmitter,
	sceneEvents
}