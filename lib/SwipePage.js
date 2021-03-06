"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SwipeParser = _interopRequireDefault(require("./SwipeParser"));

var _SwipeElement = _interopRequireDefault(require("./SwipeElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SwipePage =
/*#__PURE__*/
function () {
  function SwipePage(page, scene, index) {
    _classCallCheck(this, SwipePage);

    if (scene) {
      page = _SwipeParser.default.inheritProperties(page, scene);
    }

    this.page = page;
    this.scene = scene;
    this.index = index;
    this.elements = [];
    this.duration = this.page["duration"] ? this.page["duration"] * 1000 : 200;
    this.bc = this.page["bc"] || "#ffffff";
    this.play_style = this.page["play"] || "auto";
    this.transition = this.page["transition"] || (this.play_style == "scroll" ? "replace" : "scroll");
  }

  _createClass(SwipePage, [{
    key: "loadElement",
    value: function loadElement() {
      var instance = this;
      var elems = [];

      if (this.page["elements"]) {
        this.page["elements"].forEach(function (element, elem_index) {
          instance.elements.push(new _SwipeElement.default(element, instance.index, elem_index, instance.play_style, instance.duration));
        });
      }
    }
  }, {
    key: "elementLoad",
    value: function elementLoad(element) {
      var ret = [];
      var instance = this;
      ret.push(element);

      if (element["elements"]) {
        element["elements"].forEach(function (elem, elem_index) {
          instance.elementLoad(elem).forEach(function (elem2, elem_index2) {
            var copy_obj = Object.assign({}, element);
            delete copy_obj.elements;
            ret.push($.extend(true, copy_obj, elem2));
          });
        });
      }

      return ret;
    }
  }, {
    key: "getHtml",
    value: function getHtml() {
      var instance = this;
      var elems = [];
      this.elements.forEach(function (element, elem_index) {
        elems.push(element.html());
      }); // todo snbinder

      return "<div id='page_" + this.index + "' class='page' __page_id='" + this.index + "'>" + elems.join("") + "</div>";
    }
  }, {
    key: "getBc",
    value: function getBc() {
      return this.bc;
    }
  }, {
    key: "getTransition",
    value: function getTransition() {
      return this.transition;
    }
  }, {
    key: "getPlayStyle",
    value: function getPlayStyle() {
      return this.play_style;
    }
  }, {
    key: "initElement",
    value: function initElement(index) {
      var indexes = index.split("-");

      if (indexes.length == 1) {
        this.elements[index].initData();
      } else {
        this.elements[indexes.shift()].initData(indexes.join("-"));
      }
    }
  }, {
    key: "getElement",
    value: function getElement(index) {
      var indexes = index.split("-");

      if (indexes.length == 1) {
        return this.elements[index].getElement();
      } else {
        return this.elements[indexes.shift()].getElement(indexes.join("-"));
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.elements.forEach(function (element, elem_index) {
        element.resize();
      });
    }
  }, {
    key: "justShow",
    value: function justShow() {
      this.elements.forEach(function (element, elem_index) {
        element.justShow();
      });
    }
  }, {
    key: "show",
    value: function show() {
      var instance = this;
      this.elements.forEach(function (element, elem_index) {
        element.show();
      });
      setTimeout(function () {
        instance.speech(instance);
      }, this.duration);
    }
  }, {
    key: "animateShow",
    value: function animateShow() {
      this.elements.forEach(function (element, elem_index) {
        element.animateShow();
      });
    }
  }, {
    key: "animateShowBack",
    value: function animateShowBack() {
      this.elements.forEach(function (element, elem_index) {
        element.animateShowBack();
      });
    }
  }, {
    key: "delayShow",
    value: function delayShow() {
      var instance = this;
      this.elements.forEach(function (element, elem_index) {
        element.delayShow();
      });
      setTimeout(function () {
        instance.speech(instance);
      }, this.duration);
    }
  }, {
    key: "back",
    value: function back() {
      var instance = this;
      this.elements.forEach(function (element, elem_index) {
        element.back();
      });
      setTimeout(function () {
        instance.speech(instance);
      }, this.duration);
    }
  }, {
    key: "finShow",
    value: function finShow() {
      var instance = this;
      this.elements.forEach(function (element, elem_index) {
        element.finShow();
      });
    }
  }, {
    key: "prevShow",
    value: function prevShow() {
      this.elements.forEach(function (element, elem_index) {
        element.prevShow();
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this.elements.forEach(function (element, elem_index) {
        element.pause();
      });
    }
  }, {
    key: "doLoopProcess",
    value: function doLoopProcess() {
      this.elements.forEach(function (element, elem_index) {
        element.doLoopProcess();
      });
    }
  }, {
    key: "getScene",
    value: function getScene() {
      return this.scene;
    } // todo locale

  }, {
    key: "speech",
    value: function speech(instance) {
      var userAgent = window.navigator.userAgent.toLowerCase();

      if (userAgent.indexOf('chrome') != -1 || userAgent.indexOf('safari') != -1) {
        if (instance.page["speech"]) {
          speechSynthesis.speak(new SpeechSynthesisUtterance(instance.page["speech"]["text"]));
        }
      }
    }
  }, {
    key: "active",
    value: function active() {
      this.elements.forEach(function (element, elem_index) {
        element.active();
      });
    }
  }, {
    key: "inactive",
    value: function inactive() {
      var instance = this;
      this.elements.forEach(function (element, elem_index) {
        element.inactive();
      });
    }
  }]);

  return SwipePage;
}();

exports.default = SwipePage;
module.exports = exports.default;