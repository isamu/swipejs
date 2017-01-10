"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeElement = function () {
	function SwipeElement(info, page_id, element_id, play, duration) {
		var parent = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

		_classCallCheck(this, SwipeElement);

		var css_id = "element-" + page_id + "-" + element_id;

		this.info = this.mergeTemplate(info);
		this.to_info = this.info["to"] ? SwipeUtil.merge(this.info, this.info["to"]) : null;

		this.css_id = css_id;
		this.page_id = page_id;
		this.element_id = element_id;
		this.play_style = play;
		this.duration = duration;
		this.parent = parent;

		this.isActive = false;
		this.videoStart = 0;
		this.videoDuration = null;
		this.isRepeat = Boolean(info["repeat"]);

		this.x = 0;
		this.y = 0;

		this.angle = this.info["rotate"] ? this.getAngle(this.info["rotate"]) : 0;
		this.to_angle = this.to_info && this.to_info["rotate"] ? this.getAngle(this.to_info["rotate"]) : 0;

		this.scale = this.getScale(this.info);
		this.to_scale = this.to_info ? this.getScale(this.to_info) : [1.0, 1.0];
		this.no_size = false;

		this.transition_timing = null;
		this.loop_timing = null;

		this.elements = [];
		var instance = this;

		this.bc = null;
		if (this.info["bc"]) {
			this.bc = this.info["bc"];
		}
		if (this.info["elements"]) {
			this.info["elements"].forEach(function (element, elem_index) {
				var e_id = element_id + "-" + elem_index;
				instance.elements.push(new SwipeElement(element, page_id, e_id, play, duration, instance));
			});
		}
	}

	_createClass(SwipeElement, [{
		key: "mergeTemplate",
		value: function mergeTemplate(info) {
			// template
			if (info["element"] || info["template"]) {
				var elementTemplate = SwipeBook.getTemplateElements();
				var elem;
				if (elem = elementTemplate[info["element"] || info["template"]]) {
					info = SwipeParser.inheritProperties(info, elem);
				}
			}
			return info;
		}
	}, {
		key: "parseText",
		value: function parseText(element) {
			if (typeof element == "string") {
				return element;
			} else if ((typeof element === "undefined" ? "undefined" : _typeof(element)) == "object") {
				if (element["ref"]) {
					return SwipeParser.localizedStringForKey(element["ref"]);
				} else {
					// todo localize
					return SwipeParser.localizedString(element, "ja");
				}
			}
			return "";
		}
	}, {
		key: "parseMarkdown",
		value: function parseMarkdown(element) {
			var info = SwipeBook.getMarkdown();
			var parser = new SwipeMarkdown(info);

			return parser.parse(element, this.css_id);
		}
	}, {
		key: "getElement",
		value: function getElement(index) {
			if (index !== undefined) {
				var indexes = index.split("-");
				if (indexes.length == 1) {
					return this.elements[index];
				} else {
					return this.elements[indexes.shift()].getElement(indexes.join("-"));
				}
				return;
			}
			return this;
		}
	}, {
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

			if (this.isDiv() || this.isMarkdown()) {
				if (!this.parent) {
					$("#" + this.css_id).css("position", "absolute");
				}
			}
			if (this.isPath()) {
				this.snap = Snap("#" + this.css_id);
				this.path = this.snap.path();
			}
			if (this.isVideo()) {
				this.initVideo();
			}
			this.setSize();
			this.setPosition();
			this.setOption();

			$("#" + this.css_id).attr("__x", this.x);
			$("#" + this.css_id).attr("__y", this.y);
			$("#" + this.css_id).attr("__w", this.w);
			$("#" + this.css_id).attr("__h", this.h);
			if (this.bc) {
				$("#" + this.css_id).css({ "background-color": this.bc });
			}

			if (this.isImage()) {
				var div_ration = this.w / this.h;
				var w = $("#" + this.css_id + "_image").attr("__default_width");
				var h = $("#" + this.css_id + "_image").attr("__default_height");
				var image_ration = w / h;

				if (div_ration < image_ration) {
					$("#" + this.css_id + "_image").css("height", "100%");
					$("#" + this.css_id + "_image").css("width", "auto");
				} else {
					$("#" + this.css_id + "_image").css("height", "auth");
					$("#" + this.css_id + "_image").css("width", "100%");
				}
				$("#" + this.css_id + "_image").css("top", "50%");
				$("#" + this.css_id + "_image").css("left", "50%");
				$("#" + this.css_id + "_image").css("transform", "translate(-50%,-50%)");
				$("#" + this.css_id + "_image").css("-webkit-transform", "translateY(-50%) translateX(-50%)");
				$("#" + this.css_id + "_image").css("-moz-transform", "translate(-50%,-50%)");
			}

			this.initAllData();
			if (this.isPath()) {
				this.prevPath = this.parsePath();
				this.finPath = this.parseFinPath();
			}

			this.setPrevPos();

			// set md wrap
			this.markdown_position();
		}
	}, {
		key: "initAllData",
		value: function initAllData() {
			this.initPosData = [Number(this.x), Number(this.y), Number(this.w), Number(this.h), Number(this.angle), Number(this.opacity), this.scale];
			if (this.isText()) {}
			this.originalPrevPos = this.updatePosition(this.initPosData, this.info);
			this.prevPos = this.getScreenPosition(this.originalPrevPos);

			this.originalFinPos = this.getOriginalFinPos();
			this.finPos = this.getScreenPosition(this.originalFinPos);
			if (this.isText()) {
				this.prevText = this.textLayout(this.info, this.originalPrevPos);
				this.finText = this.textLayout(this.info, this.originalFinPos);
			}
		}
	}, {
		key: "getOriginalFinPos",
		value: function getOriginalFinPos() {
			if (this.hasTo()) {
				var pos = this.initPosData;

				if (this.info["to"]["pos"] && this.info["to"]["pos"].match(/^M/)) {
					//let tmp_pos = this.path2pos(this.info["to"]["pos"]);
					// pos[0] = pos[0] + tmp_pos[0];
					// pos[1] = pos[1] + tmp_pos[1];
				}
				return this.updatePosition(pos, this.to_info);
			} else {
				return this.originalPrevPos;
			}
		}
	}, {
		key: "path2pos",
		value: function path2pos(pos) {
			var res = [0, 0];
			var match = pos.match(/(\w[0-9\s\.,\-]+)/g);
			$.each(match, function (index, path) {
				var cmd = path.slice(0, 1);
				var p = path.slice(1).split(",");
				if (cmd == "M") {
					res = [Number(p[0]), Number(p[1])];
				}
				if (cmd == "l") {
					res = [Number(res[0]) + Number(p[0]), Number(res[1]) + Number(p[1])];
				}
			});
			return res;
		}
	}, {
		key: "setOption",
		value: function setOption() {
			this.opacity = 1.0;

			if (this.info["opacity"] != null) {
				this.opacity = this.info["opacity"];
			}

			if (this.info["clip"] && this.info["clip"] === true) {
				$("#" + this.css_id).css("overflow", "hidden");
			}
		}
	}, {
		key: "initVideo",
		value: function initVideo() {
			this.videoStart = 0;
			if (this.info["videoStart"]) {
				this.videoStart = this.info["videoStart"];
			}
			this.videoDuration = 1;
			if (this.info["videoDuration"]) {
				this.videoDuration = this.info["videoDuration"];
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
					this.w = SwipeParser.parseSize(this.info["w"], this.getWidth(), this.getWidth());
				} else {
					if (this.isImage()) {
						this.w = $("#" + this.css_id).attr("__default_width");
					} else {
						this.w = this.parentWidth();
						this.no_size = true;
					}
				}
				if (this.info["h"]) {
					this.h = SwipeParser.parseSize(this.info["h"], this.getHeight(), this.getHeight());
				} else {
					if (this.isImage()) {
						this.h = $("#" + this.css_id).attr("__default_height");
					} else {
						this.h = this.parentHeight();
						this.no_size = true;
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
					this.x = SwipeParser.parseSize(this.info["x"], this.parentWidth(), 0);
				}

				if (this.info["y"] == "bottom") {
					this.y = this.parentHeight() - this.h;
				} else if (this.info["y"] == "top") {
					this.y = 0;
				} else if (this.info["y"] == "center") {
					this.y = (this.parentHeight() - this.h) / 2.0;
				} else if (this.info["y"]) {
					this.y = SwipeParser.parseSize(this.info["y"], this.parentHeight(), 0);
				}
			}
		}
	}, {
		key: "getAngle",
		value: function getAngle(data) {
			if (SwipeParser.is("Array", data)) {
				return data[2];
			} else if (data) {
				return data;
			}
			return 0;
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
		key: "setVideo",
		value: function setVideo(data) {
			var instance = this;
			$("#" + this.css_id + "-video").css(this.convCssPos(data));
		}
	}, {
		key: "getSpritePos",
		value: function getSpritePos() {
			var w = this.prevPos[2];
			var h = this.prevPos[3];
			return [-(w * this.info.slot[0]), -(h * this.info.slot[1]), w * this.info.slice[0], h * this.info.slice[1]];
		}
	}, {
		key: "getSpriteCss",
		value: function getSpriteCss(pos) {
			return {
				left: pos[0],
				top: pos[1],
				width: pos[2],
				height: pos[3]
			};
		}
	}, {
		key: "setSpritePos",
		value: function setSpritePos(pos) {
			$("#" + this.css_id + "_sprite").css(this.getSpriteCss(pos));
		}
	}, {
		key: "prevShow",
		value: function prevShow() {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.prevShow();
				});
			}
			this.setPrevPos();
		}
	}, {
		key: "setPrevPos",
		value: function setPrevPos() {
			var instance = this;
			$("#" + this.css_id).css(this.convCssPos(this.prevPos));

			if (this.isVideo()) {
				this.setVideo(this.prevPos);
			}
			if (this.isSprite()) {
				var sprite_pos = this.getSpritePos();
				this.setSpritePos(sprite_pos);
			}
			if (this.isText()) {
				$("#" + this.css_id + "-body").css(this.prevText);
			}
			if (this.isPath()) {
				this.path.attr(this.prevPath.path);
				this.path.attr({ fill: this.prevPath.fill });
			}
			if (this.isMarkdown()) {
				this.md_css.forEach(function (element, elem_index) {
					$("#" + instance.css_id + "-" + elem_index).css(element);
				});
			}
		}

		// scale and container height(is my height)
		// data is original data not screen converted data.

	}, {
		key: "textLayout",
		value: function textLayout(info, data) {
			var x = "center";
			var textAlign = "center";

			if (info["textAlign"]) {
				switch (info["textAlign"]) {
					case "left":
						textAlign = "left";
						break;
					case "right":
						textAlign = "right";
						break;
					case "top":
						x = "top";
						break;
					case "bottom":
						x = "bottom";
						break;
				}
			}

			var fontname = SwipeParser.parseFontName(info, false);

			var fontSize = function (info, scale) {
				var defaultSize = 20 / 480 * SwipeScreen.swipeheight();
				var size = SwipeParser.parseFontSize(info, SwipeScreen.swipeheight(), defaultSize, false);
				return Math.round(size * Math.abs(scale[1]));
			}(info, data[6]);

			var containerHeight = fontSize;
			var divHeight = data[3];
			var top = 0;

			// todo font size
			if (x == "bottom") {
				top = divHeight - containerHeight;
			} else if (x == "center") {
				// top = (divHeight - containerHeight) / 2;
				return {
					position: "relative",
					top: "0px",
					"font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
					"line-height": String(SwipeScreen.virtualY(Math.abs(fontSize * 1.5))) + "px",
					"font-family": fontname,
					"textAlign": textAlign,
					"width": "inherit",
					"display": "table-cell",
					"vertical-align": "middle",
					"height": String(SwipeScreen.virtualY(divHeight)) + "px",

					"color": this.conv_rgba2rgb(SwipeParser.parseColor(info, "#000"))
				};
			}

			return {
				position: "relative",
				top: String(SwipeScreen.virtualY(top)) + "px",
				"font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
				"line-height": String(SwipeScreen.virtualY(Math.abs(fontSize * 1.5))) + "px",
				"font-family": fontname,
				"textAlign": textAlign,
				"color": this.conv_rgba2rgb(SwipeParser.parseColor(info, "#000"))
			};
		}
	}, {
		key: "conv_rgba2rgb",
		value: function conv_rgba2rgb(color) {
			var match = void 0;
			if (match = color.match(/^(#\w{6})(\w{2})$/)) {
				return match[1];
			}
			return color;
		}
	}, {
		key: "transformPath",
		value: function transformPath(info, scale) {
			var ret = [];
			var default_scale = [SwipeScreen.getRation(), SwipeScreen.getRation()];
			var scale_array = [];

			var scale_x = Math.abs(scale[0]);
			var scale_y = Math.abs(scale[1]);
			scale_array = [default_scale[0] * scale_x, default_scale[1] * scale_y];

			var cx = 0;
			var cy = 0;
			if (scale && (scale_x != 1.0 || scale_y != 1.0)) {
				cx = (1 - scale_x) * this.prevPos[2] / 2;
				cy = (1 - scale_y) * this.prevPos[3] / 2;
				ret.push("translate(" + String(cx) + "," + String(cy) + ")");
			}
			// todo position check
			ret.push("scale(" + scale_array.join(",") + ")");
			return ret.join(" ");
		}
	}, {
		key: "parsePath",
		value: function parsePath() {
			var line = this.info.lineWidth ? this.info.lineWidth : 1;
			var strokeColor = this.info.strokeColor ? this.info.strokeColor : "black";
			// todo rpga color
			var fillColor = this.info.fillColor ? this.info.fillColor == "#0000" ? "none" : this.info.fillColor : "none";

			return {
				path: {
					d: this.info.path,
					transform: this.transformPath(this.info, this.scale),
					stroke: this.conv_rgba2rgb(strokeColor),
					strokeWidth: line
				},
				fill: this.conv_rgba2rgb(fillColor)
			};
		}
	}, {
		key: "parseFinPath",
		value: function parseFinPath() {
			if (!this.hasTo()) {
				return this.prevPath;
			}
			var info = SwipeUtil.merge(this.info, this.info["to"]);
			var line = info.lineWidth ? info.lineWidth : 1;
			var strokeColor = info.strokeColor ? info.strokeColor : "black";
			var fillColor = info.fillColor ? info.fillColor == "#0000" ? "none" : info.fillColor : "none";

			var r = info.rotate ? [info.rotate[2], this.prevPos[2] / 2, this.prevPos[3] / 2].join(",") : "0,0,0";

			return {
				path: {
					d: info.path,
					transform: this.transformPath(info, this.getScale(info)),
					stroke: this.conv_rgba2rgb(strokeColor),
					strokeWidth: line
				},
				fill: this.conv_rgba2rgb(fillColor)
			};
		}
	}, {
		key: "animatePrevPos",
		value: function animatePrevPos() {
			if (this.hasTo()) {
				var instance = this;
				$("#" + instance.css_id).animate(instance.convCssPos(instance.prevPos), {
					duration: this.duration,
					progress: function progress(a, b) {
						instance.animateTransform(1 - b);
					}
				});
				if (this.isText()) {
					$("#" + this.css_id + "-body").animate(this.prevText, {
						duration: this.duration
					});
				}
				/*
    if (this.isVideo()){
    $("#" + this.css_id + "-video").animate(this.convCssPos(this.prevPos), {
     duration: do_duration
    });
    }
    */
				if (this.isPath()) {
					var path = SwipeParser.clone(this.prevPath.path);
					delete path.stroke;
					this.path.animate(path, this.duration);
					if (this.prevPath.fill != this.finPath.fill) {
						this.path.attr({ fill: this.prevPath.fill });
					}
				}
			}
		}
	}, {
		key: "markdown_position",
		value: function markdown_position() {
			if (this.isMarkdown()) {
				var x = ($("#" + this.css_id).height() - $("#md_" + this.css_id).height()) / 2;
				$("#md_" + this.css_id).css({ top: x, position: "absolute" });
			}
		}
	}, {
		key: "setFinPos",
		value: function setFinPos() {
			$("#" + this.css_id).css(this.convCssPos(this.finPos));

			if (this.isVideo()) {
				this.setVideo(this.finPos);
			}
			if (this.isText()) {
				var text_css = this.textLayout(this.info, this.originalFinPos);
				$("#" + this.css_id + "-body").css(text_css);
			}
		}

		// transform orders are rotate, scale.
		// path is not scale here

	}, {
		key: "animateTransform",
		value: function animateTransform(ration) {
			var transform = [];

			if (this.angle != this.to_angle) {
				var angle = this.angle * (1 - ration) + this.to_angle * ration;
				transform.push("rotate(" + angle + "deg)");
			} else {
				transform.push("rotate(" + this.angle + "deg)");
			}

			if (!this.isPath()) {
				if (this.scale != this.to_scale) {
					var scale = [this.scale[0] * (1 - ration) + this.to_scale[0] * ration, this.scale[1] * (1 - ration) + this.to_scale[1] * ration];
					transform.push("scale(" + scale[0] + ", " + scale[1] + ")");
				} else {
					transform.push("scale(" + this.scale[0] + ", " + this.scale[1] + ")");
				}
			}
			$("#" + this.css_id).css(this.getTransform(transform));
		}
	}, {
		key: "animateFinPos",
		value: function animateFinPos() {
			if (this.hasTo()) {
				this.transition_timing = this.getTiming(this.info["to"], this.duration);
				var start_duration = this.transition_timing[0];
				var do_duration = this.transition_timing[1];
				console.log(do_duration);

				var instance = this;
				setTimeout(function () {
					$("#" + instance.css_id).animate(instance.convCssPos(instance.finPos), {
						duration: do_duration,
						progress: function progress(a, b) {
							instance.animateTransform(b);
						}
					});
					if (instance.isVideo()) {
						$("#" + instance.css_id + "-video").animate(instance.convCssPos(instance.finPos), {
							duration: do_duration
						});
					}

					if (instance.isText()) {
						$("#" + instance.css_id + "-body").animate(instance.finText, {
							duration: do_duration
						});
					}
					if (instance.isPath()) {
						var path = SwipeParser.clone(instance.finPath.path);
						delete path.stroke;
						instance.path.animate(path, do_duration);
						if (instance.prevPath.fill != instance.finPath.fill) {
							setTimeout(function () {
								instance.path.attr({ fill: instance.finPath.fill });
							}, do_duration);
						}
					}
				}, start_duration);
			}
		}
	}, {
		key: "animateShow",
		value: function animateShow(ration) {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.animateShow(ration);
				});
			}

			if (this.hasTo()) {

				var instance = this;

				$("#" + instance.css_id).animate(instance.convCssPos(instance.finPos), {
					duration: 100000000,
					step: function step(s) {
						if (SwipeTouch.getStatus() == "stop") {
							$(this).stop(0);
						}
					},
					easing: "swipe",
					progress: function progress(a, b) {
						instance.animateTransform(SwipeUtil.getRation());
					}
				});
				if (instance.isVideo()) {
					$("#" + instance.css_id + "-video").animate(instance.convCssPos(instance.finPos), {
						duration: 100000000,
						step: function step(s) {
							if (SwipeTouch.getStatus() == "stop") {
								$(this).stop(0);
							}
						},
						easing: "swipe"
					});
				}
				/*
    if (instance.isText()) {
    $("#" + instance.css_id + "-body").animate(instance.finText, {
     duration: do_duration
               });
    }
    if (instance.isPath()) {
    let path =  SwipeParser.clone(instance.finPath.path);
    delete path.stroke;
    instance.path.animate(path, do_duration);
    if (instance.prevPath.fill !=  instance.finPath.fill) {
     setTimeout(function(){
    instance.path.attr({fill: instance.finPath.fill});
     }, do_duration);
    }
    }
    */
			}
		}
	}, {
		key: "animateShowBack",
		value: function animateShowBack(ration) {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.animateShowBack(ration);
				});
			}

			if (this.hasTo()) {
				var instance = this;

				// todo back
				$("#" + instance.css_id).animate(instance.convCssPos(instance.prevPos), {
					duration: 100000000,
					step: function step(s) {
						//console.log(s);
						if (SwipeTouch.getStatus() == "stop") {
							$(this).stop(0);
						}
					},
					easing: "swipe",
					progress: function progress(a, b) {
						console.log(SwipeUtil.getRation());
						instance.animateTransform(Math.abs(1 + SwipeUtil.getRation()));
					}
				});
				/*
    if (instance.isVideo()){
    $("#" + instance.css_id + "-video").animate(instance.convCssPos(instance.finPos), {
     duration: do_duration
    });
    }
    
    if (instance.isText()) {
    $("#" + instance.css_id + "-body").animate(instance.finText, {
     duration: do_duration
               });
    }
    if (instance.isPath()) {
    let path =  SwipeParser.clone(instance.finPath.path);
    delete path.stroke;
    instance.path.animate(path, do_duration);
    if (instance.prevPath.fill !=  instance.finPath.fill) {
     setTimeout(function(){
    instance.path.attr({fill: instance.finPath.fill});
     }, do_duration);
    }
    }
    */
			}
		}
	}, {
		key: "pause",
		value: function pause() {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.pause();
				});
			}
			if (this.isVideo()) {
				$("#" + this.css_id + "-video")[0].pause();
			}
		}
		// calculate position

	}, {
		key: "updatePosition",
		value: function updatePosition(data, to) {
			var ret = Object.assign({}, data);
			if (to["translate"]) {
				var translate = to["translate"];
				ret[0] = ret[0] + Number(translate[0]);
				ret[1] = ret[1] + Number(translate[1]);
			}
			ret[4] = this.getAngle(to["rotate"]);
			if (to["opacity"] != null) {
				ret[5] = Number(to["opacity"]);
			}
			if (to["scale"]) {
				ret[6] = this.getScale(to);
			}
			return ret;
		}
	}, {
		key: "getScreenPosition",
		value: function getScreenPosition(data) {
			return [SwipeScreen.virtualX(data[0]), SwipeScreen.virtualY(data[1]), SwipeScreen.virtualX(data[2]), SwipeScreen.virtualY(data[3]), data[4], data[5], data[6]];
		}
	}, {
		key: "getScale",
		value: function getScale(info) {
			var scale = arguments.length <= 1 || arguments[1] === undefined ? [1.0, 1.0] : arguments[1];

			if (info["scale"]) {
				if (SwipeParser.is("Array", info["scale"]) && info["scale"].length == 2) {
					scale = info["scale"];
				} else if (SwipeParser.is("Array", info["scale"]) && info["scale"].length == 4) {
					// this might inheritProperties issue. array is not update , just pushed.
					scale = [info["scale"][2], info["scale"][3]];
				} else if (SwipeParser.is("Number", info["scale"])) {
					scale = [info["scale"], info["scale"]];
				} else if (SwipeParser.is("String", info["scale"])) {
					scale = [Number(info["scale"]), Number(info["scale"])];
				}
			}
			return scale;
		}
	}, {
		key: "convBasicCssPos",
		value: function convBasicCssPos(data) {
			return {
				'left': data[0] + 'px',
				'top': data[1] + 'px',
				'width': data[2] + 'px',
				'height': data[3] + 'px',
				'opacity': data[5]
			};
		}
	}, {
		key: "convCssPos",
		value: function convCssPos(data) {
			var ret = this.convBasicCssPos(data);
			var transform = [];

			var angle = data[4];
			if (isFinite(angle)) {
				transform.push("rotate(" + angle + "deg)");
			}
			// path is not apply default transform
			if (!this.isPath()) {
				var scale = data[6];
				if (SwipeParser.is("Array", scale) && scale.length == 2) {
					transform.push("scale(" + scale[0] + "," + scale[1] + ")");
				}
			}
			if (transform.length > 0) {
				ret = this.setTransform(ret, transform);
			}
			return ret;
		}
	}, {
		key: "setTransform",
		value: function setTransform(data, transform) {
			if (transform && transform.length > 0) {
				return SwipeUtil.merge(data, this.getTransform(transform));
			}
			return data;
		}
	}, {
		key: "getTransform",
		value: function getTransform(transform) {
			var data = {};
			var tran = transform.join(" ");
			data["transform"] = tran;
			data["-moz-transform"] = tran;
			data["-webkit-transform"] = tran;
			data["-o-transform"] = tran;
			data["-ms-transform"] = tran;
			return data;
		}
	}, {
		key: "type",
		value: function type() {
			if (this.info.img) {
				return "image";
			} else if (this.info.sprite) {
				return "sprite";
			} else if (this.info.video) {
				return "video";
			} else if (this.info.text) {
				return "text";
			} else if (this.info.markdown) {
				return "markdown";
			} else if (this.info.path) {
				return "path";
			} else {
				return "div";
			}
		}
	}, {
		key: "isImage",
		value: function isImage() {
			return this.type() == "image";
		}
	}, {
		key: "isSprite",
		value: function isSprite() {
			return this.type() == "sprite";
		}
	}, {
		key: "isVideo",
		value: function isVideo() {
			return this.type() == "video";
		}
	}, {
		key: "isText",
		value: function isText() {
			return this.type() == "text";
		}
	}, {
		key: "isMarkdown",
		value: function isMarkdown() {
			return this.type() == "markdown";
		}
	}, {
		key: "isPath",
		value: function isPath() {
			return this.type() == "path";
		}
	}, {
		key: "isDiv",
		value: function isDiv() {
			return this.type() == "div";
		}
	}, {
		key: "hasTo",
		value: function hasTo() {
			return !!this.info["to"];
		}
	}, {
		key: "html",
		value: function html() {
			if (this.type()) {
				SwipeCounter.increase();
				if (this.isVideo()) {
					SwipeCounter.increase();
				}
			}
			var child_html = this.elements.map(function (element, key) {
				return element.html();
			}).join("");
			if (this.isImage()) {
				return "<div id='" + this.css_id + "' class='image_box'><div id='" + this.css_id + "_inner'>" + "<img src='" + this.info.img + "' class='image_element' id='" + this.css_id + "_image' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' __base_id='" + this.css_id + "' >" + child_html + "</img></div></div>";
			} else if (this.isSprite()) {
				return "<div id='" + this.css_id + "' class='image_box'><div id='" + this.css_id + "_inner'>" + "<img src='" + this.info.sprite + "' class='image_element' id='" + this.css_id + "_sprite' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' __base_id='" + this.css_id + "' >" + child_html + "</img></div></div>";
			} else if (this.isText()) {
				var attrs = this.defaultAttr('element text_element');
				var attr_str = this.getAttrStr(attrs);

				return "<div " + attr_str + ">" + "<div class='text_body' id='" + this.css_id + "-body'><span>" + this.parseText(this.info.text) + child_html + "</span></div>" + "</div>";
			} else if (this.isMarkdown()) {
				var md_array = this.parseMarkdown(this.info.markdown);
				this.md_css = md_array[1];
				return "<div class='element markdown_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + "<div class='markdown_wrap' id='md_" + this.css_id + "'>" + md_array[0] + child_html + "</div></div>";
			} else if (this.isVideo()) {
				var attrs = this.defaultAttr('element video_element');
				var attr_str = this.getAttrStr(attrs);
				return "<div " + attr_str + ">" + "<video id='" + this.css_id + "-video'  webkit-playsinline playsinline><source type='video/mp4' src='" + this.info.video + "'  /></video>" + child_html + "</div>";
			} else if (this.isPath()) {
				return '<svg class="element svg_element" id="' + this.css_id + '" __page_id="' + this.page_id + '" __element_id="' + this.element_id + '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"></svg>';
			} else if (this.isDiv()) {
				return "<div class='element boxelement-" + this.page_id + "' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + child_html + "</div>";
			} else {
				return "";
			}
		}
	}, {
		key: "defaultAttr",
		value: function defaultAttr(class_name) {
			var attrs = {};
			attrs["class"] = class_name;
			attrs["id"] = this.css_id;
			attrs["__page_id"] = this.page_id;
			attrs["__element_id"] = this.element_id;
			return attrs;
		}
	}, {
		key: "getAttrStr",
		value: function getAttrStr(attrs) {
			return Object.keys(attrs).map(function (key) {
				return key + "='" + attrs[key] + "'";
			}).join(" ");
		}
	}, {
		key: "justShow",
		value: function justShow() {
			console.log("justShow");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.justShow();
				});
			}
			if (this.no_size) {
				this.setSize();
			}
			this.setFinPos();
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
			this.loopProcess();
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
				instance.loopProcess();
			}, SwipeBook.pageInDuration());
		}
	}, {
		key: "doLoopProcess",
		value: function doLoopProcess() {
			console.log("show");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.doLoopProcess();
				});
			}
			this.loopProcess();
		}
	}, {
		key: "getTiming",
		value: function getTiming(element, duration) {
			var timing = function (element) {
				if (element["timing"]) {
					var timing = element["timing"];
					if (timing.length == 2 && timing[0] > 0 && timing[1] >= timing[0] && timing[1] <= 1) {
						return timing;
					}
				}
				return [0, 1];
			}(element);
			return [timing[0], timing[1] - timing[0], 1 - timing[1]].map(function (a) {
				return a * duration;
			});
		}
	}, {
		key: "getLoopDuration",
		value: function getLoopDuration(duration) {
			var loop_duration = duration;
			if (this.transition_timing) {
				if (this.transition_timing[2] != 0) {
					loop_duration = this.transition_timing[2];
				}
			}
			return this.valueFrom(this.info["loop"], "duration", loop_duration);
		}
	}, {
		key: "loopProcess",
		value: function loopProcess() {
			if (this.info["loop"]) {
				var loop_duration = this.getLoopDuration(this.duration);
				this.loop_timing = this.getTiming(this.info["loop"], loop_duration);

				if (this.play_style == "scroll" || !this.hasTo()) {
					this.loop(this);
				} else if (this.play_style == "auto" || this.play_style == "always") {
					var duration = this.duration;
					if (this.transition_timing) {
						duration = duration - this.transition_timing[2];
					}
					var instance = this;
					instance.loop(instance, null, duration);
				} else {
					console.log("not animate because " + this.play);
				}
			}
		}
	}, {
		key: "moreloop",
		value: function moreloop(instance, repeat, defaultRepeat) {
			repeat--;
			var end_duration = this.loop_timing[2];

			setTimeout(function () {

				if (repeat > 0) {
					instance.loop(instance, repeat);
				} else if (instance.isRepeat && instance.isActive) {
					repeat = defaultRepeat;
					instance.loop(instance, repeat);
				}
			}, end_duration);
		}
	}, {
		key: "loop",
		value: function loop(instance) {
			var repeat = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
			var wait_duration = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

			console.log("loop");
			var data = instance.info["loop"];

			var start_duration = this.loop_timing[0];
			var duration = this.loop_timing[1];

			var defaultRepeat;
			if (data["count"]) {
				defaultRepeat = data["count"];
			} else {
				defaultRepeat = 1;
			}
			if (repeat == null) {
				repeat = defaultRepeat;
			}

			setTimeout(function () {
				switch (data["style"]) {
					case "vibrate":
						var delta = instance.valueFrom(data, "delta", 10);
						var orgPos = instance.originalFinPos;
						var timing = duration / defaultRepeat / 4;
						$("#" + instance.css_id).animate({
							left: parseInt(SwipeScreen.virtualX(orgPos[0] - delta)) + "px", top: SwipeScreen.virtualY(orgPos[1]) + "px"
						}, { duration: timing });
						setTimeout(function () {
							$("#" + instance.css_id).animate({
								left: parseInt(SwipeScreen.virtualX(orgPos[0] + delta)) + "px", top: SwipeScreen.virtualY(orgPos[1]) + "px"
							}, { duration: timing * 2 });
							setTimeout(function () {
								$("#" + instance.css_id).animate({
									left: parseInt(SwipeScreen.virtualX(orgPos[0])) + "px", top: SwipeScreen.virtualY(orgPos[1]) + "px"
								}, { duration: timing });

								setTimeout(function () {
									repeat--;
									if (repeat > 0) {
										instance.loop(instance, repeat);
									} else if (instance.isRepeat && instance.isActive) {
										repeat = defaultRepeat;
										instance.loop(instance, repeat);
									}
								}, timing);
							}, timing * 2);
						}, timing);
						break;

					case "shift":
						var dir;
						var orgPos = instance.originalFinPos;
						switch (data["direction"]) {
							case "n":
								dir = { left: parseInt(SwipeScreen.virtualX(data[0])) + "px", top: SwipeScreen.virtualY(data[1] - instance.h) + "px" };break;
							case "e":
								dir = { left: parseInt(SwipeScreen.virtualX(data[0] + instance.w)) + "px", top: SwipeScreen.virtualY(data[1]) + "px" };break;
							case "w":
								dir = { left: parseInt(SwipeScreen.virtualX(data[0] - instance.w)) + "px", top: SwipeScreen.virtualY(data[1]) + "px" };break;
							default:
								dir = { left: parseInt(SwipeScreen.virtualX(data[0])) + "px", top: SwipeScreen.virtualY(data[1] - instance.h) + "px" };break;
						}
						var timing = duration / defaultRepeat;

						instance.setPrevPos();

						$("#" + instance.css_id).animate(dir, { duration: timing,
							complete: function complete() {
								$("#" + instance.css_id).animate(instance.convCssPos(orgPos, 1), { duration: 0,
									complete: function complete() {
										instance.moreloop(instance, repeat, defaultRepeat);
									}
								});
							}
						});
						break;
					case "blink":
						console.log("blink");

						var timing = duration / defaultRepeat / 4;
						$("#" + instance.css_id).css({ opacity: 1 });
						setTimeout(function () {
							$("#" + instance.css_id).css({ opacity: 0 });
							setTimeout(function () {
								$("#" + instance.css_id).css({ opacity: 1 });
								setTimeout(function () {
									instance.moreloop(instance, repeat, defaultRepeat);
								}, timing);
							}, timing * 2);
						}, timing);
						break;
					case "spin":
						console.log("spin");
						var timing = duration / defaultRepeat;
						$("#" + instance.css_id).rotate({
							angle: 0, animateTo: 360, duration: timing,
							callback: function callback() {
								instance.moreloop(instance, repeat, defaultRepeat);
							}
						});
						break;
					case "wiggle":
						console.log("wiggle");
						var angle = instance.valueFrom(data, "delta", 15);
						var timing = duration / defaultRepeat / 4;
						$("#" + instance.css_id).rotate({
							angle: 0, animateTo: angle, duration: timing,
							callback: function callback() {
								$("#" + instance.css_id).rotate({
									angle: angle, animateTo: -angle, duration: timing * 2,
									callback: function callback() {
										$("#" + instance.css_id).rotate({
											angle: -angle, animateTo: 0, duration: timing,
											callback: function callback() {
												instance.moreloop(instance, repeat, defaultRepeat);
											} });
									} });
							}
						});
						break;
					case "path":

				}
			}, start_duration + wait_duration);

			if (data["style"] == "sprite") {
				console.log("sprite");
				var _repeat = instance.valueFrom(data, "repeat") || instance.valueFrom(data, "count");

				// todo in case of image array. i need sample file.
				if (instance.info.slice) {
					var block = instance.info.slice[0];
					var timing = duration / _repeat / block;
					for (var i = 0; i < _repeat; i++) {
						var _loop = function _loop(j) {
							$("#" + instance.css_id + "_sprite").delay(timing).queue(function () {
								var pos = instance.getLoopSpritePos(j);
								$(this).css(instance.getSpriteCss(pos)).dequeue();
							});
						};

						for (var j = 0; j < block; j++) {
							_loop(j);
						}
					}
				}
			}
		}
	}, {
		key: "getLoopSpritePos",
		value: function getLoopSpritePos(num) {
			var w = this.prevPos[2];
			var h = this.prevPos[3];
			return [-(w * num), -(h * this.info.slot[1]), w * this.info.slice[0], h * this.info.slice[1]];
		}
	}, {
		key: "valueFrom",
		value: function valueFrom(data, key, defaultValue) {
			if (data[key]) {
				return data[key];
			}
			return defaultValue;
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
			this.loopProcess();
		}
		// this is not work. videoElement is not set.

	}, {
		key: "setVideoElement",
		value: function setVideoElement(videoElement) {
			this.videoElement = videoElement;
		}
	}, {
		key: "inactive",
		value: function inactive() {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.inactive();
				});
			}
			this.isActive = false;
		}
	}, {
		key: "active",
		value: function active() {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.active();
				});
			}
			this.isActive = true;
		}
	}]);

	return SwipeElement;
}();