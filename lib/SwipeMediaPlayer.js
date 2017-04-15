"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeMediaPlayer = function () {
	_createClass(SwipeMediaPlayer, null, [{
		key: "getInstance",
		value: function getInstance() {
			if (this.instance) {
				return this.instance;
			}
			this.instance = new SwipeMediaPlayer();
			return this.instance;
		}
	}]);

	function SwipeMediaPlayer() {
		_classCallCheck(this, SwipeMediaPlayer);

		this.current_page = 0;
		this.current_playing = null;
		this.media = {};
	}

	_createClass(SwipeMediaPlayer, [{
		key: "page",
		value: function page(num) {
			this.current_page = num;
			return this;
		}
	}, {
		key: "push",
		value: function push(key, media) {
			if (!this.media[this.current_page]) {
				this.media[this.current_page] = {};
			}
			this.media[this.current_page][key] = media;
			return this;
		}
	}, {
		key: "play",
		value: function play() {
			var page = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

			if (page) {
				this.current_page = page;
			}
			var instance = this;
			if (this.current_playing != this.current_page) {
				this.stop();
				if (this.media[this.current_page]) {
					var page = this.media[this.current_page];
					Object.keys(page).forEach(function (key) {
						var data = page[key];
						var player = data.media;
						var start = 0;
						if (page[key] && page[key].videoStart) {
							start = page[key].videoStart;
							player.setCurrentTime(start);
						}
						if (data["canPlay"]) {
							player.play();
							player.addEventListener('ended', function () {
								instance.current_playing = null;
							});
						} else {
							data["waitPlay"] = true;
							instance.media[instance.current_page][key] = data;
						}
						if (page[key] && page[key].videoDuration) {
							var duration = page[key].videoDuration;
							setTimeout(function () {
								// accuracy of settimeout is not good. so I add  a second.
								if (player.currentTime + 1 > Number(start) + Number(duration)) {
									player.stop();
								}
							}, duration * 1000);
						}
					});
				}
				this.current_playing = this.current_page;
			}
			return this;
		}
	}, {
		key: "playing",
		value: function playing(ratio) {
			if (ratio < 0) {
				ratio = 1 + ratio;
			}
			var instance = this;
			if (this.media[this.current_page]) {
				var page = this.media[this.current_page];
				Object.keys(page).forEach(function (key) {
					var data = page[key];
					var player = data.media;
					var dom = page[key].dom;
					var start = start = page[key] && page[key].videoStart ? page[key].videoStart : 0;
					var duration = page[key] && page[key].videoDuration ? page[key].videoDuration : 1.0;

					var currentTime = start + ratio * duration;
					//player.setCurrentTime(currentTime);
					if (Math.abs(data["currentTime"] - currentTime) > 0.05) {
						dom.currentTime = currentTime;
						data["currentTime"] = currentTime;
						instance.media[instance.current_page][key] = data;
					}
				});
			}
		}
	}, {
		key: "load",
		value: function load() {
			var instance = this;
			Object.keys(this.media).forEach(function (key) {
				var page = instance.media[key];
				Object.keys(page).forEach(function (key2) {
					var data = page[key2];
					var player = page[key2].media;
					player.addEventListener('loadeddata', function () {
						if (instance.media[key][key2]["waitPlay"]) {
							player.play();
						}
						data["canPlay"] = true;
						instance.media[key][key2] = data;
					}, false);
					player.load();
				});
			});
		}
	}, {
		key: "media",
		value: function media() {
			return this.media[this.current_page];
		}
	}, {
		key: "stop",
		value: function stop() {
			if (this.current_playing !== null) {
				if (this.media[this.current_playing]) {
					var page = this.media[this.current_playing];
					Object.keys(page).forEach(function (key) {
						page[key].media.stop();
					});
				}
			}
			this.current_playing = null;
		}
	}]);

	return SwipeMediaPlayer;
}();