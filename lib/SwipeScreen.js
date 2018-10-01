"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SwipeScreen =
/*#__PURE__*/
function () {
  function SwipeScreen() {
    _classCallCheck(this, SwipeScreen);
  }

  _createClass(SwipeScreen, null, [{
    key: "getSize",
    value: function getSize() {
      if (window.swipe_screen_size) {
        return window.swipe_screen_size[1];
      } else {
        return 100;
      }
    }
  }, {
    key: "setSize",
    value: function setSize(size) {
      window.swipe_screen_size = [size, size];
    }
  }, {
    key: "setSizes",
    value: function setSizes(width, height) {
      window.swipe_screen_size = [width, height];
    }
  }, {
    key: "init",
    value: function init(width, height) {
      window.swipe_screen_width = width;
      window.swipe_screen_height = height;

      if (window.swipe_screen_width == 0) {
        window.swipe_screen_width = window.swipe_screen_height * $(window).width() / $(window).height();
      }

      if (window.swipe_screen_height == 0) {
        window.swipe_screen_height = window.swipe_screen_width * $(window).height() / $(window).width();
      }

      SwipeScreen.setOriginalSize();
      SwipeScreen.setVirtualSize();
    }
  }, {
    key: "setOriginalSize",
    value: function setOriginalSize() {
      window.swipe_screen_window_width = $(window).width();
      window.swipe_screen_window_height = $(window).height();
    } // todo
    //  set vertical and horizontal mode

  }, {
    key: "setVirtualSize",
    value: function setVirtualSize() {
      var size = window.swipe_screen_size || [100, 100];
      var real_ratio = window.swipe_screen_window_width * size[0] / (window.swipe_screen_window_height * size[1]);
      var virtual_ratio = window.swipe_screen_width / window.swipe_screen_height;
      window.swipe_screen_ratio = 1.0;

      if (real_ratio / virtual_ratio >= 1) {
        window.swipe_screen_virtual_height = $(window).height() * size[1] / 100;
        window.swipe_screen_virtual_width = window.swipe_screen_width / window.swipe_screen_height * window.swipe_screen_virtual_height;
      } else {
        window.swipe_screen_virtual_width = $(window).width() * size[0] / 100;
        window.swipe_screen_virtual_height = window.swipe_screen_height / window.swipe_screen_width * window.swipe_screen_virtual_width;
      }

      window.swipe_screen_ratio = window.swipe_screen_virtual_width / window.swipe_screen_width;
    }
  }, {
    key: "getRatio",
    value: function getRatio() {
      return window.swipe_screen_ratio;
    }
  }, {
    key: "swipewidth",
    value: function swipewidth() {
      return window.swipe_screen_width;
    }
  }, {
    key: "swipeheight",
    value: function swipeheight() {
      return window.swipe_screen_height;
    }
  }, {
    key: "virtualwidth",
    value: function virtualwidth() {
      return window.swipe_screen_virtual_width;
    }
  }, {
    key: "virtualheight",
    value: function virtualheight() {
      return window.swipe_screen_virtual_height;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      SwipeScreen.setOriginalSize();
      SwipeScreen.setVirtualSize();
    } // width

  }, {
    key: "virtualX",
    value: function virtualX(x) {
      if (x == undefined) {
        return window.swipe_screen_virtual_width;
      }

      if (window.swipe_screen_width) {
        return x / window.swipe_screen_width * window.swipe_screen_virtual_width;
      }

      return x;
    }
  }, {
    key: "virtualY",
    value: function virtualY(y) {
      if (y == undefined) {
        return window.swipe_screen_virtual_height;
      }

      if (window.swipe_screen_height) {
        return y / window.swipe_screen_height * window.swipe_screen_virtual_height;
      }

      return y;
    }
  }]);

  return SwipeScreen;
}();

exports.default = SwipeScreen;
module.exports = exports.default;