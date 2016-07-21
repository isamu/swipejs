"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeScreen = function () {
			function SwipeScreen() {
						_classCallCheck(this, SwipeScreen);
			}

			_createClass(SwipeScreen, null, [{
						key: "init",
						value: function init(width, height) {
									this.width = width;
									this.height = height;

									SwipeScreen.setOriginalSize();
									SwipeScreen.setVirtualSize();
						}
			}, {
						key: "setOriginalSize",
						value: function setOriginalSize() {
									this.window_width = $(window).width();
									this.window_height = $(window).height();
						}

						// todo
						//  set vertical and horizontal mode

			}, {
						key: "setVirtualSize",
						value: function setVirtualSize() {
									var real_ration = this.window_width / this.window_height;
									var virtual_ration = this.width / this.height;

									if (real_ration / virtual_ration >= 1) {
												this.virtual_height = $(window).height();
												this.virtual_width = this.width / this.height * this.virtual_height;
									} else {
												this.virtual_width = $(window).width();
												this.virtual_height = this.height / this.width * this.virtual_width;
									}
						}
			}, {
						key: "swipewidth",
						value: function swipewidth() {
									return this.width;
						}
			}, {
						key: "swipeheight",
						value: function swipeheight() {
									return this.height;
						}
			}, {
						key: "virtualwidth",
						value: function virtualwidth() {
									return this.virtual_width;
						}
			}, {
						key: "virtualheight",
						value: function virtualheight() {
									return this.virtual_height;
						}
			}, {
						key: "refresh",
						value: function refresh() {
									SwipeScreen.setOriginalSize();
									SwipeScreen.setVirtualSize();
						}

						// width

			}, {
						key: "virtualX",
						value: function virtualX(x) {
									if (x == undefined) {
												return this.virtual_width;
									}
									if (this.width) {
												return x / this.width * this.virtual_width;
									}
									return x;
						}
			}, {
						key: "virtualY",
						value: function virtualY(y) {
									if (y == undefined) {
												return this.virtual_height;
									}
									if (this.height) {
												return y / this.height * this.virtual_height;
									}
									return y;
						}
			}]);

			return SwipeScreen;
}();