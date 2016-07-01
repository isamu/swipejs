"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeElement = function () {
	function SwipeElement(info, page_id, element_id) {
		var parent = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

		_classCallCheck(this, SwipeElement);

		var css_id = "element-" + page_id + "-" + element_id;

		this.info = info;
		this.css_id = css_id;
		this.page_id = page_id;
		this.element_id = element_id;
		this.parent = parent;

		this.x = 0;
		this.y = 0;

		this.elements = [];
		var instance = this;
		if (this.info["elements"]) {
			this.info["elements"].forEach(function (element, elem_index) {
				var e_id = element_id + "-" + elem_index;
				instance.elements.push(new SwipeElement(element, page_id, e_id, instance));
			});
		}
	}

	_createClass(SwipeElement, [{
		key: "initData",
		value: function initData(index) {
			if (index !== undefined) {
				var indexes = index.split("-");
				if (indexes.length == 1) {
					this.elements[index].initData();
				} else {
					this.elements[indexes.shift()].initData(indexes.join("-"));
				}
				return;
			}

			var info = this.info;

			if (this.type() == "div") {
				if (!this.parent) {
					$("#" + this.css_id).css("position", "fixed");
				}
			}

			if (info["size"]) {
				this.w = info["size"][0];
				this.h = info["size"][1];
			} else {
				if (info["w"]) {
					this.w = info["w"];
				} else {
					if (info.img) {
						this.w = $("#" + this.css_id).attr("__default_width");
					} else {
						this.w = this.parentWidth();
					}
				}
				if (info["h"]) {
					this.h = info["h"];
				} else {
					if (info.img) {
						this.h = $("#" + this.css_id).attr("__default_height");
					} else {
						this.h = this.parentHeight();
					}
				}
			}

			if (info["pos"]) {
				this.x = info["pos"][0];
				this.y = info["pos"][1];
			} else {
				if (info["x"] == "right") {
					this.x = this.parentWidth() - this.w;
				} else if (info["x"] == "left") {
					this.x = 0;
				} else if (info["x"] == "center") {
					this.x = (this.parentWidth() - this.w) / 2.0;
				} else if (info["x"]) {
					this.x = info["x"];
				}

				if (info["y"] == "bottom") {
					this.y = this.parentHeight() - this.h;
				} else if (info["y"] == "top") {
					this.y = 0;
				} else if (info["y"] == "center") {
					this.y = (this.parentHeight() - this.h) / 2.0;
				} else if (info["y"]) {
					this.y = info["y"];
				}
			}

			this.opacity = 1.0;

			if (info["opacity"] != null) {
				this.opacity = info["opacity"];
			}

			// for debug
			$("#" + this.css_id).attr("__x", this.x);
			$("#" + this.css_id).attr("__y", this.y);

			$("#" + this.css_id).attr("__w", this.w);
			$("#" + this.css_id).attr("__h", this.h);

			//this.setInitPos();
			this.setPrevPos();
			// this.setFinPos();
		}
	}, {
		key: "getWidth",
		value: function getWidth() {
			if (this.w) {
				return this.w;
			}
			if (this.parent) {
				return this.parent.getWidth();
			}
			return SwipeScreen.swipewidth();
		}
	}, {
		key: "getHeight",
		value: function getHeight() {
			if (this.h) {
				return this.h;
			}
			if (this.parent) {
				return this.parent.getHeight();
			}
			return SwipeScreen.swipeheight();
		}
	}, {
		key: "parentWidth",
		value: function parentWidth() {
			var width;
			if (this.parent) {
				width = this.parent.getWidth();
			}
			if (width) {
				return width;
			}
			return SwipeScreen.swipewidth();
		}
	}, {
		key: "parentHeight",
		value: function parentHeight() {
			var height;

			if (this.parent) {
				height = this.parent.getHeight();
			}
			if (height) {
				return height;
			}
			return SwipeScreen.swipeheight();
		}
	}, {
		key: "setPrevPos",
		value: function setPrevPos() {
			var leftPosN = SwipeScreen.virtualX(this.x);
			var topPosN = SwipeScreen.virtualY(this.y);

			var widthN = SwipeScreen.virtualX(this.w);
			var heightN = SwipeScreen.virtualY(this.h);

			if (this.info["translate"]) {
				leftPosN = leftPosN + SwipeScreen.virtualX(this.info["translate"][0]);
				topPosN = topPosN + SwipeScreen.virtualY(this.info["translate"][1]);
			}

			$("#" + this.css_id).css({
				'left': leftPosN + 'px',
				'top': topPosN + 'px',
				'width': widthN + 'px',
				'height': heightN + 'px',
				'opacity': this.opacity
			});
		}
	}, {
		key: "setFinPos",
		value: function setFinPos() {
			if (this.info["to"]) {
				this.fin_opacity = this.opacity;

				if (this.info["to"]["opacity"] != null) {
					this.fin_opacity = this.info["to"]["opacity"];
					console.log(this.fin_opacity);
				}

				var leftPosN = SwipeScreen.virtualX(this.x);
				var topPosN = SwipeScreen.virtualY(this.y);

				var widthN = SwipeScreen.virtualX(this.w);
				var heightN = SwipeScreen.virtualY(this.h);

				if (this.info["to"]["translate"]) {
					leftPosN = leftPosN + this.info["to"]["translate"][0];
					topPosN = topPosN + this.info["to"]["translate"][1];
				}

				$("#" + this.css_id).animate({
					'left': leftPosN + 'px',
					'top': topPosN + 'px',
					'width': widthN + 'px',
					'height': heightN + 'px',
					'opacity': this.fin_opacity
				}, {
					duration: 500
				});
			}
		}
	}, {
		key: "setInitPos",
		value: function setInitPos() {
			var leftPosN = SwipeScreen.virtualX(this.x);
			var topPosN = SwipeScreen.virtualY(this.y);

			var widthN = SwipeScreen.virtualX(this.w);
			var heightN = SwipeScreen.virtualY(this.h);

			$("#" + this.css_id).css({
				'left': leftPosN + 'px',
				'top': topPosN + 'px',
				'width': widthN + 'px',
				'height': heightN + 'px',
				'opacity': this.opacity
			});
		}
	}, {
		key: "data",
		value: function data() {
			return this.info;
		}
	}, {
		key: "type",
		value: function type() {
			if (this.info.img) {
				return "image";
			} else {
				return "div";
			}
		}
	}, {
		key: "html",
		value: function html() {
			if (this.type() == "image") {
				return "<img src='" + this.info.img + "' class='element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' />";
			} else if (this.type() == "div") {
				var html = this.elements.map(function (element, key) {
					return element.html();
				});
				return "<div class='boxelement boxelement-" + this.page_id + "' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + html.join("") + "</div>";
			} else {
				return "";
			}
		}
	}, {
		key: "show",
		value: function show() {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.show();
				});
			}
			this.setFinPos();
		}
	}]);

	return SwipeElement;
}();