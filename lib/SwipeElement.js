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

			if (this.type() == "div") {
				if (!this.parent) {
					$("#" + this.css_id).css("position", "absolute");
				}
			}

			this.setSize();
			this.setPosition();
			this.setOpacity();

			$("#" + this.css_id).attr("__x", this.x);
			$("#" + this.css_id).attr("__y", this.y);

			$("#" + this.css_id).attr("__w", this.w);
			$("#" + this.css_id).attr("__h", this.h);

			this.setPrevPos();
		}
	}, {
		key: "setOpacity",
		value: function setOpacity() {
			this.opacity = 1.0;

			if (this.info["opacity"] != null) {
				this.opacity = this.info["opacity"];
			}
		}
	}, {
		key: "setSize",
		value: function setSize() {
			if (this.info["size"]) {
				this.w = this.info["size"][0];
				this.h = this.info["size"][1];
			} else {
				if (this.info["w"]) {
					this.w = this.info["w"];
				} else {
					if (this.info.img) {
						this.w = $("#" + this.css_id).attr("__default_width");
					} else {
						this.w = this.parentWidth();
					}
				}
				if (this.info["h"]) {
					this.h = this.info["h"];
				} else {
					if (this.info.img) {
						this.h = $("#" + this.css_id).attr("__default_height");
					} else {
						this.h = this.parentHeight();
					}
				}
			}
		}
	}, {
		key: "setPosition",
		value: function setPosition() {
			if (this.info["pos"]) {
				this.x = this.info["pos"][0];
				this.y = this.info["pos"][1];
			} else {
				if (this.info["x"] == "right") {
					this.x = this.parentWidth() - this.w;
				} else if (this.info["x"] == "left") {
					this.x = 0;
				} else if (this.info["x"] == "center") {
					this.x = (this.parentWidth() - this.w) / 2.0;
				} else if (this.info["x"]) {
					this.x = this.info["x"];
				}

				if (this.info["y"] == "bottom") {
					this.y = this.parentHeight() - this.h;
				} else if (this.info["y"] == "top") {
					this.y = 0;
				} else if (this.info["y"] == "center") {
					this.y = (this.parentHeight() - this.h) / 2.0;
				} else if (this.info["y"]) {
					this.y = this.info["y"];
				}
			}
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

		// end of data parse

		// set or animate position

	}, {
		key: "setInitPos",
		value: function setInitPos() {
			var data = this.getInitPos();
			data = getScreenPosition(data);
			$("#" + this.css_id).css(this.convCssPos(data, this.opacity));
		}
	}, {
		key: "getOriginalPrevPos",
		value: function getOriginalPrevPos() {
			var data = this.getInitPos();

			if (this.info["translate"]) {
				data = this.addPosition(data, this.info["translate"]);
			}
			return data;
		}
	}, {
		key: "getPrevPos",
		value: function getPrevPos() {
			var data = this.getOriginalPrevPos();
			data = this.getScreenPosition(data);
			return this.convCssPos(data, this.opacity);
		}
	}, {
		key: "setEffect",
		value: function setEffect() {
			if (this.info["rotate"]) {
				$("#" + this.css_id).rotate({ angle: this.info["rotate"] });
			}
		}
	}, {
		key: "setPrevPos",
		value: function setPrevPos() {
			$("#" + this.css_id).css(this.getPrevPos());
			this.setEffect();
		}
	}, {
		key: "animatePrevPos",
		value: function animatePrevPos() {
			console.log("animate");
			$("#" + this.css_id).animate(this.getPrevPos(), {
				duration: 500
			});
		}
	}, {
		key: "getFinPos",
		value: function getFinPos() {
			var data = this.getInitPos();

			var fin_opacity = this.opacity;
			var to = this.info["to"];
			if (to) {
				if (to["opacity"] != null) {
					fin_opacity = to["opacity"];
				}
				if (to["translate"]) {
					data = this.addPosition(data, to["translate"]);
				}
			}

			console.log(fin_opacity);
			data = this.getScreenPosition(data);
			return this.convCssPos(data, fin_opacity);
		}
	}, {
		key: "setFinPos",
		value: function setFinPos() {
			$("#" + this.css_id).css(this.getFinPos());
		}
	}, {
		key: "animateFinPos",
		value: function animateFinPos() {
			console.log("fin");
			if (this.info["to"]) {
				$("#" + this.css_id).animate(this.getFinPos(), {
					duration: 500
				});
			}
		}

		// calculate position

	}, {
		key: "getInitPos",
		value: function getInitPos() {
			return [this.x, this.y, this.w, this.h];
		}
	}, {
		key: "addPosition",
		value: function addPosition(data, translate) {
			data[0] = data[0] + translate[0];
			data[1] = data[1] + translate[1];
			return data;
		}
	}, {
		key: "getScreenPosition",
		value: function getScreenPosition(data) {
			return [SwipeScreen.virtualX(data[0]), SwipeScreen.virtualY(data[1]), SwipeScreen.virtualX(data[2]), SwipeScreen.virtualY(data[3])];
		}
	}, {
		key: "convCssPos",
		value: function convCssPos(data, opacity) {
			return {
				'left': data[0] + 'px',
				'top': data[1] + 'px',
				'width': data[2] + 'px',
				'height': data[3] + 'px',
				'opacity': opacity
			};
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
			console.log("show");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.show();
				});
			}
			this.setPrevPos();
			this.animateFinPos();
			if (this.info["loop"]) {
				this.loop(this);
			}
		}
	}, {
		key: "delayShow",
		value: function delayShow() {
			console.log("delayShow");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.delayShow();
				});
			}
			this.setPrevPos();
			var instance = this;
			setTimeout(function () {
				instance.animateFinPos();
				if (instance.info["loop"]) {
					instance.loop(instance);
				}
			}, 500);
		}
	}, {
		key: "loop",
		value: function loop(instance) {
			var repeat = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			console.log("loop");
			var data = instance.info["loop"];
			var dulation = this.valueFrom(data, "dulation", 50);

			var defaultRepeat;
			if (data["repeat"]) {
				defaultRepeat = data["repeat"];
			} else {
				defaultRepeat = 1;
			}
			if (repeat == null) {
				repeat = defaultRepeat;
			}

			switch (data["style"]) {
				case "vibrate":
					var delta = this.valueFrom(data, "delta", 10);
					var data = this.getOriginalPrevPos();
					var timing = dulation / repeat / 4;
					$("#" + instance.css_id).animate({
						left: parseInt(SwipeScreen.virtualX(data[0] - delta)) + "px", top: SwipeScreen.virtualY(data[1]) + "px"
					}, { duration: timing });
					setTimeout(function () {
						$("#" + instance.css_id).animate({
							left: parseInt(SwipeScreen.virtualX(data[0] + delta)) + "px", top: SwipeScreen.virtualY(data[1]) + "px"
						}, { duration: timing * 2 });
						setTimeout(function () {
							$("#" + instance.css_id).animate({
								left: parseInt(SwipeScreen.virtualX(data[0])) + "px", top: SwipeScreen.virtualY(data[1]) + "px"
							}, { duration: timing });

							setTimeout(function () {
								repeat--;
								if (repeat > 0) {
									instance.loop(instance, repeat);
								}
							}, timing);
						}, timing * 2);
					}, timing);
					break;
				// not yet
				case "shift":
				case "blink":
					var timing = dulation / defaultRepeat;
					$("#" + instance.css_id).css({ opacity: 1 });
					setTimeout(function () {
						$("#" + instance.css_id).css({ opacity: 0 });
						setTimeout(function () {
							$("#" + instance.css_id).css({ opacity: 1 });
							setTimeout(function () {
								repeat--;
								if (repeat > 0) {
									instance.loop(instance, repeat);
								}
							}, timing);
						}, timing * 2);
					}, timing);
				case "spin":
					var timing = dulation / defaultRepeat;
					$("#" + instance.css_id).rotate({ angle: 0, animateTo: 360, duration: timing });
					setTimeout(function () {
						repeat--;
						if (repeat > 0) {
							instance.loop(instance, repeat);
						}
					}, timing);
					break;
				case "wiggle":
					var angle = this.valueFrom(data, "delta", 15);
					$("#" + instance.css_id).rotate({ angle: 0, animateTo: angle, duration: dulation });
					setTimeout(function () {
						$("#" + instance.css_id).rotate({ angle: angle, animateTo: -angle, duration: dulation * 2 });
						setTimeout(function () {
							$("#" + instance.css_id).rotate({ angle: -angle, animateTo: 0, duration: dulation });
							setTimeout(function () {
								repeat--;
								if (repeat > 0) {
									instance.loop(instance, repeat);
								}
							}, dulation);
						}, dulation * 2);
					}, dulation);
					break;
				case "path":
				case "sprite":

			}
		}
	}, {
		key: "valueFrom",
		value: function valueFrom(data, key, defaultValue) {
			var ret = defaultValue;
			if (data[key]) {
				ret = data[key];
			}
			return ret;
		}
	}, {
		key: "back",
		value: function back() {
			console.log("back");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.back();
				});
			}
			this.setFinPos();
			this.animatePrevPos();
		}
	}, {
		key: "finShow",
		value: function finShow() {
			console.log("finShow");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.finShow();
				});
			}
			this.setFinPos();
		}
	}]);

	return SwipeElement;
}();