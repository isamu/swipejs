"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeCounter = function () {
	function SwipeCounter() {
		_classCallCheck(this, SwipeCounter);
	}

	_createClass(SwipeCounter, null, [{
		key: "increase",
		value: function increase() {
			if (window.counter === undefined) {
				window.counter = 1;
			} else {
				window.counter++;
			}
			return window.counter;
		}
	}, {
		key: "decrease",
		value: function decrease() {
			if (window.counter === undefined) {
				window.counter = -1;
			} else {
				window.counter--;
			}
			return window.counter;
		}
	}, {
		key: "getCounter",
		value: function getCounter() {
			return window.counter;
		}
	}]);

	return SwipeCounter;
}();

exports.default = SwipeCounter;
module.exports = exports.default;