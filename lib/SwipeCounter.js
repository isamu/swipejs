"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeCounter = function () {
			function SwipeCounter() {
						_classCallCheck(this, SwipeCounter);
			}

			_createClass(SwipeCounter, null, [{
						key: "increase",
						value: function increase() {
									if (this.counter === undefined) {
												this.counter = 1;
									} else {
												this.counter++;
									}
									return this.counter;
						}
			}, {
						key: "decrease",
						value: function decrease() {
									if (this.counter === undefined) {
												this.counter = -1;
									} else {
												this.counter--;
									}
									return this.counter;
						}
			}, {
						key: "getCounter",
						value: function getCounter() {
									return this.counter;
						}
			}]);

			return SwipeCounter;
}();