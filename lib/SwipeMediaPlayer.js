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
						value: function push(media) {
									if (!this.media[this.current_page]) {
												this.media[this.current_page] = [];
									}
									console.log("push");
									console.log(this.current_page);

									this.media[this.current_page].push(media);
									return this;
						}
			}, {
						key: "play",
						value: function play() {

									if (this.current_playing != this.current_page) {
												this.stop();
												if (this.media[this.current_page]) {
															console.log("pkay");
															console.log(this.current_page);
															this.media[this.current_page].forEach(function (media, media_index) {
																		console.log("media");
																		console.log(media_index);
																		media.play();
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
												console.log("stop");
												console.log(this.current_playing);
												if (this.media[this.current_playing]) {
															this.media[this.current_playing].forEach(function (media, media_index) {
																		media.stop();
															});
												}
									}
									this.current_playing = null;
						}
			}]);

			return SwipeMediaPlayer;
}();