"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeScreen = function () {
	function SwipeScreen() {
		_classCallCheck(this, SwipeScreen);
	}

	_createClass(SwipeScreen, null, [{
		key: "getSize",
		value: function getSize() {
			if (this.size) {
				return this.size[1];
			} else {
				return 100;
			}
		}
	}, {
		key: "setSize",
		value: function setSize(size) {
			this.size = [size, size];
		}
	}, {
		key: "setSizes",
		value: function setSizes(width, height) {
			this.size = [width, height];
		}
	}, {
		key: "init",
		value: function init(width, height) {
			this.width = width;
			this.height = height;

			if (this.width == 0) {
				this.width = this.height * $(window).width() / $(window).height();
			}
			if (this.height == 0) {
				this.height = this.width * $(window).height() / $(window).width();
			}

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
			var real_ratio = this.window_width / this.window_height;
			var virtual_ratio = this.width / this.height;
			this.ratio = 1.0;

			if (real_ratio / virtual_ratio >= 1) {
				this.virtual_height = $(window).height();
				this.virtual_width = this.width / this.height * this.virtual_height;
			} else {
				this.virtual_width = $(window).width();
				this.virtual_height = this.height / this.width * this.virtual_width;
			}
			if (this.size) {
				this.virtual_width = this.virtual_width * this.size[0] / 100;
				this.virtual_height = this.virtual_height * this.size[1] / 100;
			}
			this.ratio = this.virtual_width / this.width;
		}
	}, {
		key: "getRatio",
		value: function getRatio() {
			return this.ratio;
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