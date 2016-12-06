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
									console.log("push");
									console.log(this.current_page);

									this.media[this.current_page][key] = media;
									return this;
						}
			}, {
						key: "play",
						value: function play() {
									if (this.current_playing != this.current_page) {
												this.stop();
												if (this.media[this.current_page]) {
															var page = this.media[this.current_page];
															Object.keys(page).forEach(function (key) {
																		var player = page[key].media;
																		var start = 0;
																		if (page[key] && page[key].videoStart) {
																					start = page[key].videoStart;
																					player.setCurrentTime(start);
																		}
																		player.play();
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