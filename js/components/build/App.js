'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Flux = require('flux');
var update = require('react-addons-update');
var videojs = require('video.js');
var screenfull = require('screenfull');

var dispatcher = new Flux.Dispatcher();

var STATE_IDLE = 0,
    STATE_BEGINNING = 1,
    STATE_PLAYING = 2,
    STATE_WIN = 3;

var App = React.createClass({
	displayName: 'App',

	render: function render() {
		var loaded = this.state.loaded;
		return React.createElement(
			'div',
			null,
			React.createElement(App.Audio, { ref: 'audio' }),
			React.createElement(App.Content, { ref: 'content', step: this.state.step }),
			React.createElement(App.Overlay, { ref: 'overlay', step: this.state.step }),
			React.createElement(App.LoadingScreen, { loaded: loaded })
		);
	},
	getInitialState: function getInitialState() {
		return { loaded: false, step: 'main-page' };
	},
	componentDidMount: function componentDidMount() {
		this.listenerID = dispatcher.register((function (payload) {
			switch (payload.type) {
				case 'goto':
					this.setState({ step: payload.step });
					break;
				case 'restart':
					this.restart();
					break;
				case 'videoLoaded':
					this.setState({ loaded: true });
					break;
			}
		}).bind(this));
	},
	componentWillUnmount: function componentWillUnmount() {
		dispatcher.unregister(this.listenerID);
	}
});

App.Audio = React.createClass({
	displayName: 'Audio',

	render: function render() {
		return React.createElement(
			'audio',
			{ autoPlay: true, loop: true },
			React.createElement('source', { src: 'audio.ogg', type: 'audio/ogg' }),
			React.createElement('source', { src: 'audio.mp3', type: 'audio/mpeg' }),
			React.createElement('source', { src: 'audio.wav', type: 'audio/wave' }),
			React.createElement('source', { src: 'audio.wav', type: 'audio/x-wav' }),
			React.createElement('source', { src: 'audio.flac', type: 'audio/flac' })
		);
	}
});

App.Content = React.createClass({
	displayName: 'Content',

	render: function render() {
		return React.createElement(
			'div',
			{ style: this.styles.container },
			React.createElement(App.Content.MainPage, this.props),
			React.createElement(App.Content.Instruction, this.props),
			React.createElement(App.Content.Game, this.props),
			React.createElement(App.Content.End, this.props)
		);
	},
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		},
		inner: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		}
	}
});

App.Content.MainPage = React.createClass({
	displayName: 'MainPage',

	render: function render() {
		return React.createElement(
			'div',
			{ style: m(this.styles.container, this.props.step == 'main-page' && this.styles.show) },
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign-top' },
					React.createElement(
						'h2',
						null,
						'THE SCREAM SAVER'
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign-top text-center' },
					React.createElement(
						'h2',
						null,
						'Harper\'s Bazaar',
						React.createElement('br', null),
						'Presents'
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign text-center' },
					React.createElement(
						'h1',
						null,
						'The Scream Saver'
					),
					React.createElement(
						'h2',
						null,
						'Interactive Film by Kissinger Twins'
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign-bottom text-center' },
					React.createElement(
						'button',
						{ onClick: this.handleStart },
						'START >'
					),
					React.createElement(
						'h2',
						null,
						'Produced by BSL'
					)
				)
			)
		);
	},
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			opacity: 0,
			transition: 'opacity .2s',
			pointerEvents: 'none'
		},
		inner: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		},
		show: {
			opacity: 1,
			pointerEvents: 'auto'
		}
	},
	handleStart: function handleStart(event) {
		event.preventDefault();
		dispatcher.dispatch({ type: 'goto', step: 'instruction' });
	}
});

App.Content.Instruction = React.createClass({
	displayName: 'Instruction',

	render: function render() {
		return React.createElement(
			'div',
			{ style: m(this.styles.container, this.props.step == 'instruction' && this.styles.show) },
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign-top' },
					React.createElement(
						'h2',
						null,
						'THE SCREAM SAVER'
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign text-center' },
					React.createElement(
						'h2',
						null,
						'Instruction Copy'
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign-bottom text-center' },
					React.createElement(
						'button',
						{ onClick: this.handleGo },
						'GO! >'
					)
				)
			)
		);
	},
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			opacity: 0,
			transition: 'opacity .2s',
			pointerEvents: 'none'
		},
		inner: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		},
		show: {
			opacity: 1,
			pointerEvents: 'auto'
		}
	},
	handleGo: function handleGo() {
		dispatcher.dispatch({ type: 'goto', step: 'game' });
	}
});

App.Content.Game = React.createClass({
	displayName: 'Game',

	render: function render() {
		return React.createElement(
			'div',
			{ style: m(this.styles.container, this.props.step == 'game' && this.styles.show) },
			React.createElement(
				'video',
				{ ref: 'video', className: 'video-js vjs-default-skin', width: '100%', height: '100%', 'data-setup': '{"controls": false, "preload": "auto"}', style: this.styles.inner },
				React.createElement('source', { src: 'video.mp4', type: 'video/mp4' }),
				React.createElement('source', { src: 'video.webm', type: 'video/webm' }),
				React.createElement('source', { src: 'video.ogv', type: 'video/ogg' })
			),
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign-top' },
					React.createElement(
						'h2',
						null,
						'THE SCREAM SAVER'
					)
				)
			)
		);
	},
	ACCEL: 0.033,
	sensitivity: 0.5,
	speed: 1,
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			opacity: 0,
			transition: 'opacity .2s',
			pointerEvents: 'none'
		},
		inner: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		},
		show: {
			opacity: 1
		}
	},
	getInitialState: function getInitialState() {
		return { game: STATE_IDLE };
	},
	componentDidMount: function componentDidMount() {
		this.video = videojs(this.refs.video);

		// Check getUserMedia
		if (!hasGetUserMedia()) {
			alert('getUserMedia() is not supported in your browser');
			return;
		}

		// initialize microphone
		navigator.getUserMedia({
			'audio': {
				'mandatory': {
					'googEchoCancellation': 'false',
					'googAutoGainControl': 'false',
					'googNoiseSuppression': 'false',
					'googHighpassFilter': 'false'
				},
				'optional': []
			}
		}, this.onMicrophoneReady, function (err) {
			alert('User blocked live input :(');
			return;
		});

		var storedSensitivity = localStorage.getItem('sensitivity');
		var storedSpeed = localStorage.getItem('speed');
		if (storedSensitivity) {
			//this.sensitivity = storedSensitivity;
			//this.refs.settings.sensitivity((this.sensitivity * 100).toFixed(0));
			this.sensitivity = 0.04;
		}
		if (storedSpeed) {
			//this.speed = storedSpeed;
			//this.refs.settings.speed((this.speed * 100).toFixed(0));
		}

		this.listenerID = dispatcher.register((function (payload) {
			switch (payload.type) {
				case 'sensitivityChanged':
					this.sensitivity = payload.sensitivity / 100;
					localStorage.setItem('sensitivity', this.sensitivity);
					break;
				case 'speedChanged':
					this.speed = payload.speed / 100;
					localStorage.setItem('speed', this.speed);
					break;
			}
		}).bind(this));

		this.start();
	},
	componentDidUpdate: function componentDidUpdate() {
		if (this.state.game == STATE_IDLE && this.props.step == 'game') {
			this.setState({ game: STATE_BEGINNING });
		}
	},
	componentWillUnmount: function componentWillUnmount() {
		this.video = null;
		dispatcher.unregister(this.listenerID);
	},
	onMicrophoneReady: function onMicrophoneReady(stream) {
		// Initialize Web Audio
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContext();
		} catch (e) {
			alert('Web Audio API is not supported in this browser');
			return;
		}

		// retrieve the current sample rate to be used for WAV packaging
		this.sampleRate = this.audioContext.sampleRate;

		// creates a gain node
		this.volume = this.audioContext.createGain();

		// creates an audio node from the microphone incoming stream
		this.audioInput = this.audioContext.createMediaStreamSource(stream);

		// connect the stream to the gain node
		this.audioInput.connect(this.volume);

		// creates analyzer
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 2048;
		this.bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Uint8Array(this.bufferLength);
		this.analyser.getByteFrequencyData(this.dataArray);

		// connect gain to analyzer node
		this.volume.connect(this.analyser);

		this.init();
	},
	init: function init() {
		this.video.load();
		this.video.on('loadeddata', (function (e) {
			dispatcher.dispatch({ type: 'videoLoaded' });
		}).bind(this));
	},
	draw: function draw() {
		requestAnimationFrame(this.draw);

		// Calc elapsed time since last loop
		var now = Date.now();
		this.elapsed = now - this.then;

		if (this.elapsed > this.fpsInterval) {
			this.then = now - this.elapsed % this.fpsInterval;

			switch (this.state.game) {
				case STATE_IDLE:
					break;
				case STATE_BEGINNING:
					var nextTime = this.video.currentTime() + 0.033;
					this.video.currentTime(nextTime);
					if (this.video.currentTime() > 5) {
						this.setState({ game: STATE_PLAYING });
					}
					break;
				case STATE_PLAYING:
					var avg = 0;
					this.analyser.getByteFrequencyData(this.dataArray);
					for (var i = 0; i < this.bufferLength; i++) {
						var v = this.dataArray[i] / 128.0;
						avg += v;
					}
					avg /= this.bufferLength;

					var currentTime = this.video.currentTime();
					if (avg > 0.1) {
						this.video.currentTime(currentTime - 0.033);
					} else {
						this.video.currentTime(currentTime + 0.033);
					}

					if (currentTime < 3.5) {
						console.log('win');
						this.video.currentTime(13.98);
						this.setState({ game: STATE_WIN });
					} else if (currentTime >= 13.92) {
						console.log('lose');
						dispatcher.dispatch({ type: 'goto', step: 'lose' });
						this.setState({ game: STATE_IDLE });
						this.video.currentTime(0);
					}
					break;
				case STATE_WIN:
					this.video.currentTime(this.video.currentTime() + 0.033);
					if (this.video.currentTime() >= this.video.duration()) {
						dispatcher.dispatch({ type: 'goto', step: 'win' });
						this.setState({ game: STATE_IDLE });
						this.video.currentTime(0);
					}
					break;
			}
		}
	},
	start: function start() {
		this.fps = 30;
		this.fpsInterval = 1000 / this.fps;
		this.then = Date.now();
		this.startTime = this.then;
		this.draw();
	},
	restart: function restart() {
		this.video.currentTime(0);
		this.start();
	}
});

App.Content.End = React.createClass({
	displayName: 'End',

	render: function render() {
		var step = this.props.step;
		var bShouldShow = step === 'win' || step === 'lose';
		return React.createElement(
			'div',
			{ style: m(this.styles.container, bShouldShow && this.styles.show) },
			React.createElement(
				'div',
				{ className: 'valign-container', style: this.styles.inner },
				React.createElement(
					'div',
					{ className: 'valign text-center' },
					React.createElement(
						'h1',
						null,
						step === 'win' ? 'Happy' : 'Unhappy',
						' Ending Copy'
					),
					React.createElement(
						'button',
						{ onClick: this.handleRestart },
						'Restart'
					),
					React.createElement(
						'button',
						{ onClick: this.handleShare },
						'Share'
					)
				)
			)
		);
	},
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			opacity: 0,
			transition: 'opacity .2s',
			pointerEvents: 'none'
		},
		inner: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		},
		show: {
			opacity: 1,
			pointerEvents: 'auto'
		}
	},
	handleRestart: function handleRestart() {
		dispatcher.dispatch({ type: 'goto', step: 'game' });
	},
	handleShare: function handleShare() {
		dispatcher.dispatch({ type: 'showShare' });
	}
});

App.Overlay = React.createClass({
	displayName: 'Overlay',

	render: function render() {
		var showCredits = this.state.showCredits;
		var showShare = this.state.showShare;
		return React.createElement(
			'div',
			{ className: 'no-pointer-events', style: this.styles.container },
			React.createElement(
				'div',
				{ className: 'valign-container', style: m(this.styles.container, this.styles.credits, showCredits && this.styles.showCredits) },
				React.createElement(
					'div',
					{ className: 'valign text-center' },
					React.createElement(
						'h1',
						null,
						'Credits'
					),
					React.createElement('br', null),
					React.createElement(
						'h1',
						null,
						'Names'
					),
					React.createElement(
						'h1',
						null,
						'Names'
					),
					React.createElement(
						'h1',
						null,
						'Names'
					),
					React.createElement(
						'h1',
						null,
						'Names'
					),
					React.createElement(
						'h1',
						null,
						'...'
					),
					React.createElement('br', null),
					React.createElement(
						'button',
						{ style: m(this.styles.closeCredits, showCredits && { pointerEvents: 'auto' }), onClick: this.handleCloseCredits },
						'Close'
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'valign-container', style: m(this.styles.container, this.styles.credits, showShare && this.styles.showCredits) },
				React.createElement(
					'div',
					{ className: 'valign text-center' },
					React.createElement(
						'h1',
						null,
						'Share'
					),
					React.createElement('br', null),
					React.createElement(
						'a',
						{ href: 'https://twitter.com/share', className: 'twitter-share-button pointer-events', 'data-url': 'http://screamsaver.bbhmakerlab.io', 'data-text': 'Hello, World!' },
						'Tweet'
					),
					React.createElement('br', null),
					React.createElement('div', { className: 'fb-share-button pointer-events', 'data-href': 'http://screamsaver.bbhmakerlab.io', 'data-layout': 'button_count' }),
					React.createElement('br', null),
					React.createElement(
						'button',
						{ style: m(this.styles.closeCredits, showShare && { pointerEvents: 'auto' }), onClick: this.handleCloseShare },
						'Close'
					)
				)
			),
			React.createElement(
				'div',
				{ style: this.styles.container, className: 'valign-container' },
				React.createElement(
					'div',
					{ className: 'valign-bottom text-left' },
					React.createElement(
						'button',
						{ className: 'pointer-events', onClick: this.handleCredits },
						'Credits'
					)
				)
			),
			React.createElement(
				'div',
				{ style: this.styles.container, className: 'valign-container' },
				React.createElement(
					'div',
					{ className: 'valign-bottom text-right' },
					React.createElement(
						'button',
						{ className: 'pointer-events', onClick: this.handleShare },
						'Share'
					)
				)
			),
			React.createElement(
				'div',
				{ style: this.styles.container, className: 'text-right' },
				React.createElement(
					'button',
					{ className: 'pointer-events', onClick: this.handleFullscreen },
					this.state.fullscreen ? 'Exit Fullscreen' : 'Fullscreen'
				)
			)
		);
	},
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			pointerEvents: 'none'
		},
		credits: {
			display: 'none',
			background: 'black',
			opacity: 0,
			transition: 'opacity .3s'
		},
		showCredits: {
			display: 'table',
			opacity: 1
		},
		closeCredits: {
			pointerEvents: 'none'
		}
	},
	getInitialState: function getInitialState() {
		return { showCredits: false, showShare: false, fullscreen: false };
	},
	componentDidMount: function componentDidMount() {
		this.listenerID = dispatcher.register((function (payload) {
			switch (payload.type) {
				case 'showShare':
					this.setState({ showShare: true });
					break;
			}
		}).bind(this));
	},
	componentWillUnmount: function componentWillUnmount() {
		dispatcher.unregister(this.listenerID);
	},
	handleSettings: function handleSettings(evt) {
		dispatcher.dispatch({ type: 'settings' });
	},
	handleCredits: function handleCredits(evt) {
		this.setState({ showCredits: true });
	},
	handleShare: function handleShare(evt) {
		this.setState({ showShare: true });
	},
	handleFullscreen: function handleFullscreen(evt) {
		var fullscreen = this.state.fullscreen;
		if (screenfull.enabled) {
			screenfull.toggle();
			this.setState({ fullscreen: !fullscreen });
		}
	},
	handleCloseCredits: function handleCloseCredits(evt) {
		this.setState({ showCredits: false });
	},
	handleCloseShare: function handleCloseShare(evt) {
		this.setState({ showShare: false });
	}
});

App.Settings = React.createClass({
	displayName: 'Settings',

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'text-center', style: m(this.styles.container, this.state.showSettings && this.styles.show) },
			React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					null,
					React.createElement(
						'label',
						{ style: this.styles.label },
						'Threshold'
					),
					React.createElement('input', { style: this.styles.input, ref: 'sensitivity', type: 'range', onChange: this.handleSensitivity })
				),
				React.createElement(
					'div',
					null,
					React.createElement(
						'label',
						{ style: this.styles.label },
						'Speed'
					),
					React.createElement('input', { style: this.styles.input, ref: 'speed', type: 'range', onChange: this.handleSpeed })
				),
				React.createElement(
					'button',
					{ onClick: this.handleClose, style: this.styles.close },
					'Close'
				)
			)
		);
	},
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			background: 'rgba(0,0,0,0.5)',
			transition: 'opacity .2s',
			display: 'none',
			opacity: 0
		},
		show: {
			display: 'block',
			opacity: 1
		},
		label: {
			display: 'inline-block',
			minWidth: '128px'
		},
		input: {
			width: '200px'
		},
		close: {
			margin: '16px'
		}
	},
	getInitialState: function getInitialState() {
		return { showSettings: false };
	},
	componentDidMount: function componentDidMount() {
		this.listenerID = dispatcher.register((function (payload) {
			switch (payload.type) {
				case 'settings':
					var showSettings = this.state.showSettings;
					this.setState({ showSettings: !showSettings });
					break;
			}
		}).bind(this));
	},
	componentWillUnmount: function componentWillUnmount() {
		dispatcher.unregister(this.listenerID);
	},
	handleClose: function handleClose(evt) {
		this.setState({ showSettings: false });
	},
	handleSensitivity: function handleSensitivity(evt) {
		dispatcher.dispatch({ type: 'sensitivityChanged', sensitivity: evt.target.value });
	},
	handleSpeed: function handleSpeed(evt) {
		dispatcher.dispatch({ type: 'speedChanged', speed: evt.target.value });
	},
	sensitivity: function sensitivity(value) {
		this.refs.sensitivity.value = value;
	},
	speed: function speed(value) {
		this.refs.speed.value = value;
	}
});

App.LoadingScreen = React.createClass({
	displayName: 'LoadingScreen',

	render: function render() {
		return React.createElement(
			'div',
			{ style: m(this.styles.container, this.props.loaded && this.styles.hide), className: 'valign-wrapper' },
			React.createElement(
				'div',
				{ className: 'valign sk-circle', style: this.styles.spinner },
				React.createElement('div', { className: 'sk-circle1 sk-child' }),
				React.createElement('div', { className: 'sk-circle2 sk-child' }),
				React.createElement('div', { className: 'sk-circle3 sk-child' }),
				React.createElement('div', { className: 'sk-circle4 sk-child' }),
				React.createElement('div', { className: 'sk-circle5 sk-child' }),
				React.createElement('div', { className: 'sk-circle6 sk-child' }),
				React.createElement('div', { className: 'sk-circle7 sk-child' }),
				React.createElement('div', { className: 'sk-circle8 sk-child' }),
				React.createElement('div', { className: 'sk-circle9 sk-child' }),
				React.createElement('div', { className: 'sk-circle10 sk-child' }),
				React.createElement('div', { className: 'sk-circle11 sk-child' }),
				React.createElement('div', { className: 'sk-circle12 sk-child' })
			)
		);
	},
	styles: {
		container: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			background: 'black',
			pointerEvents: 'none',
			transition: 'opacity 1s',
			opacity: 1
		},
		spinner: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			margin: '0 auto'
		},
		hide: {
			opacity: 0
		}
	}
});

function m(a, b, c) {
	a = a ? a : {};
	b = b ? b : {};
	c = c ? c : {};
	var ab = update(a, { $merge: b });
	return update(ab, { $merge: c });
}

function hasGetUserMedia() {
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	return !!navigator.getUserMedia;
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
/*
<div style={this.styles.container}>
<button onClick={this.handleSettings}>Settings</button>
</div>
*/ /*
   <div style={this.styles.container} className='valign-container'>
   <div className='valign-bottom text-center'>
   	<a href='https://twitter.com/share' className='twitter-share-button' data-url='http://reykjavik.bbhmakerlab.io' data-text='Hello, World!'>Tweet</a>
   	<div className='fb-share-button' data-href='http://reykjavik.bbhmakerlab.io' data-layout='button_count'></div>
   </div>
   </div>
   */