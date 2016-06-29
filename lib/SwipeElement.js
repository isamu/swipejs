"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeElement = function () {
	function SwipeElement(info, css_id) {
		_classCallCheck(this, SwipeElement);

		this.info = info;

		this.x = 0;
		this.y = 0;

		if (info["pos"]) {
			this.x = info["pos"][0];
			this.y = info["pos"][1];
		} else {
			if (info["x"]) {
				this.x = info["x"];
			}
			if (info["y"]) {
				this.y = info["y"];
			}
		}

		if (info["size"]) {
			this.w = info["size"][0];
			this.h = info["size"][1];
		} else {
			if (info["w"]) {
				this.w = info["w"];
			} else {
				this.w = $("#" + css_id).attr("__default_width");
			}
			if (info["h"]) {
				console.log("AAA1");
				this.h = info["h"];
			} else {
				console.log("AAA2");
				console.log($("#" + css_id).attr("__default_height"));
				this.h = $("#" + css_id).attr("__default_height");
			}
		}

		this.opacity = 1.0;
		// console.log(info["to"]);

		if (info["to"] && info["to"]["opacity"] != null) {
			this.opacity = info["to"]["opacity"];
		} else if (info["opacity"] != null) {
			this.opacity = info["opacity"];
		}
	}

	_createClass(SwipeElement, [{
		key: "resourceUrl",
		value: function resourceUrl() {
			if (this.urls != null) {
				return this.urls;
			}
		}
	}]);

	return SwipeElement;
}();