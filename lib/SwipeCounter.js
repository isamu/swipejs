"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SwipeCounter =
/*#__PURE__*/
function () {
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