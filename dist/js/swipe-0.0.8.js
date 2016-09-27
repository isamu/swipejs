'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeBook = function () {
	_createClass(SwipeBook, null, [{
		key: 'setTemplateElements',
		value: function setTemplateElements(template) {
			this.templateElements = template;
		}
	}, {
		key: 'getTemplateElements',
		value: function getTemplateElements() {
			return this.templateElements;
		}
	}, {
		key: 'setMarkdown',
		value: function setMarkdown(markdown) {
			this.markdown = markdown;
		}
	}, {
		key: 'getMarkdown',
		value: function getMarkdown() {
			return this.markdown;
		}
	}, {
		key: 'pageInDuration',
		value: function pageInDuration() {
			return 400;
		}
	}]);

	function SwipeBook(data) {
		var defaultPage = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var _this = this;

		var base_css_id = arguments[2];
		var back_css_id = arguments[3];

		_classCallCheck(this, SwipeBook);

		$('head').prepend('<meta name="viewport" content="width = 640,user-scalable=no">');

		this.data = data;
		console.log(data["type"]);
		if (data["type"] == "net.swipe.list") {
			(function () {
				var html = [];
				_this.data.items.forEach(function (item, item_index) {
					html.push('<li><a href="?file=' + item["url"] + '">' + item["title"] + '</li>');
				});
				$(base_css_id).html("<ul>" + html.join("") + "</ul>");
			})();
		} else {
			// 	"type":"net.swipe.swipe"
			this.step = defaultPage;
			this.pages = [];
			this.title = "Swipe";
			this.base_css_id = base_css_id;
			this.back_css_id = back_css_id;

			SwipeBook.setTemplateElements(this.getTemplateElements());
			SwipeBook.setMarkdown(this.getMarkdown());
			this.templatePages = this.getTemplatePages();
			this.setScreen();
			this.paging = this.getPaging();
			this.load();
			this.domLoad();
		}
	}

	_createClass(SwipeBook, [{
		key: 'setScreen',
		value: function setScreen() {
			this.dimension = this.data.dimension ? this.data.dimension : [$(window).width(), $(window).height()];
			SwipeScreen.init(this.dimension[0], this.dimension[1]);
			this.bc = this.data.bc || "#a9a9a9";
			this.setSwipeCss();
		}
	}, {
		key: 'load',
		value: function load() {
			var _this2 = this;

			$.each(this.data["pages"], function (index, page) {
				var scene;
				if (page["scene"] && (scene = _this2.templatePages[page["scene"]])) {
					scene = _this2.templatePages[page["scene"]];
				}
				if (page["template"] && (scene = _this2.templatePages[page["template"]])) {
					scene = _this2.templatePages[page["template"]];
				}
				var pageInstance = new SwipePage(page, scene, index);

				_this2.pages.push(pageInstance);
			});
			if (this.data["title"]) {
				this.title = this.data["title"];
				document.title = this.title;
			}
		}
	}, {
		key: 'getTemplatePages',
		value: function getTemplatePages() {
			if (this.data["templates"] && this.data["templates"]["pages"]) {
				return this.data["templates"]["pages"];
			} else if (this.data["scenes"]) {
				return this.data["scenes"];
			}
			return {};
		}
	}, {
		key: 'getTemplateElements',
		value: function getTemplateElements() {
			if (this.data["templates"] && this.data["templates"]["elements"]) {
				return this.data["templates"]["elements"];
			} else if (this.data["elements"]) {
				return this.data["elements"];
			}
			return {};
		}
	}, {
		key: 'getMarkdown',
		value: function getMarkdown() {
			if (this.data["markdown"]) {
				return this.data["markdown"];
			}
			return {};
		}
	}, {
		key: 'getPaging',
		value: function getPaging() {
			if (this.data["paging"] == "leftToRight" || this.data["paging"] == "vertical" || this.data["paging"] == "rightToLeft") {
				return this.data["paging"];
			}
			return "vertical";
		}
	}, {
		key: 'setSwipeCss',
		value: function setSwipeCss() {
			var x = ($(window).width() - SwipeScreen.virtualwidth()) / 2.0;
			$(this.base_css_id).css({
				height: SwipeScreen.virtualheight(),
				width: SwipeScreen.virtualwidth(),
				position: "absolute",
				left: x
			});
			$(this.back_css_id).css({
				"background-color": this.bc,
				"height": "100vh",
				"width": "100vw"
			});
		}
	}, {
		key: 'resize',
		value: function resize() {
			this.setScreen();
			for (var i = 0; i < this.pages.length; i++) {
				this.justShow(i);
			}
			this.setPageSize();
		}
	}, {
		key: 'setPageSize',
		value: function setPageSize() {
			$("svg").css("overflow", "visible");
			$(".page").css({
				"overflow": "hidden",
				"height": SwipeScreen.virtualheight(),
				"width": SwipeScreen.virtualwidth()
			});
		}
	}, {
		key: 'domLoad',
		value: function domLoad() {
			var pages = [];
			var instance = this;
			this.pages.forEach(function (page, page_index) {
				page.loadElement();
				pages.push(page.getHtml());
			});

			$(this.base_css_id).html(pages.join(""));

			this.setPageSize();
			$(".page").css("opacity", 0);
			$("#page_" + this.step).css("opacity", 1);

			this.pages[this.step].active();

			$(".image_element").load(function () {
				$(this).attr("__default_width", $(this).width());
				$(this).attr("__default_height", $(this).height());

				$("#" + $(this).attr("__base_id")).attr("__default_width", $(this).width());
				$("#" + $(this).attr("__base_id")).attr("__default_height", $(this).height());

				instance.initData($(this).attr("__page_id"), $(this).attr("__element_id"));
				SwipeCounter.decrease();

				if (SwipeCounter.getCounter() == 0) {
					instance.loadFinish();
				}
			});

			$(".element").each(function (index, element) {
				instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));

				SwipeCounter.decrease();
				if (SwipeCounter.getCounter() == 0) {
					instance.loadFinish();
				}
			});

			$(".video_element").each(function (index, element) {
				console.log("elelel");
				var player = new MediaElement($(element).attr("id") + "-video", {
					flashName: 'flashmediaelement.swf',
					loop: true,
					success: function success(mediaElement, domObject) {
						instance.videoElement = mediaElement;
					}
				});
				console.log($(element).attr("__page_id"));

				var media_player = SwipeMediaPlayer.getInstance();
				media_player.page($(element).attr("__page_id")).push(player);
			});

			this.pages.forEach(function (page, page_index) {
				var bc = page.getBc();
				$("#page_" + page_index).css({ "background-color": bc });
			});
			$(".page").css({ "position": "absolute" });
			$(".image_element").css({ "position": "absolute" });
			$(".image_box").css({ "position": "absolute" });
			$(".image_box").css({ "overflow": "hidden" });
			$(".video_element").css({ "position": "absolute" });
			$(".text_element").css({ "position": "absolute" });
			$(".svg_element").css({ "position": "absolute" });
		}
	}, {
		key: 'loadFinish',
		value: function loadFinish() {
			this.show(this.step);
		}
	}, {
		key: 'initData',
		value: function initData(page_id, element_id) {
			this.pages[page_id].initElement(element_id);
		}
	}, {
		key: 'next',
		value: function next() {
			if (this.step < this.pages.length - 1) {
				this.show(this.step + 1);
			}
		}
	}, {
		key: 'back',
		value: function back() {
			if (this.step > 0) {
				this.show(this.step - 1);
			}
		}
	}, {
		key: 'justShow',
		value: function justShow(step) {
			this.pages[step].justShow();
		}
	}, {
		key: 'show',
		value: function show(nextStep) {
			var currentStep = this.step;
			var mode = nextStep >= currentStep ? "forward" : "back";
			var loaded = nextStep == currentStep;
			var same_scene = this.pages[currentStep].getScene() && this.pages[nextStep] && this.pages[nextStep].getScene() == this.pages[currentStep].getScene();

			if (!loaded) {
				this.pages[currentStep].inactive();
				this.pages[nextStep].active();
			}
			var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();

			if (mode == "forward") {
				if (same_scene) {
					this.pages[nextStep].show();
					this.pages[nextStep].play();
					$("#page_" + currentStep).css("opacity", 0);
					$("#page_" + nextStep).css("opacity", 1);
				} else {
					// transition
					if (transition == "fadeIn") {
						this.pages[nextStep].finShow();
						$("#page_" + nextStep).animate({ "opacity": 1 }, {
							duration: SwipeBook.pageInDuration()
						});
					} else if (transition == "replace") {
						$("#page_" + currentStep).css({ "opacity": 0 });
						$("#page_" + nextStep).css({ "opacity": 1 });
						this.pages[nextStep].finShow();
					} else if (transition == "scroll") {
						setTimeout(function () {
							$("#page_" + currentStep).css({
								"opacity": 0
							});
						}, SwipeBook.pageInDuration());
						this.pageSlide("in", nextStep);
						this.pages[nextStep].delayShow();
					} else {}
				}
			} else {
				// in case back
				console.log("back");
				if (same_scene) {
					this.pages[currentStep].back();
					setTimeout(function () {
						$("#page_" + currentStep).css({ "opacity": 0 });
						$("#page_" + nextStep).css({ "opacity": 1 });
					}, SwipeBook.pageInDuration());
				} else {
					// transition
					if (transition == "fadeIn") {
						this.pages[nextStep].finShow();
						$("#page_" + currentStep).animate({ "opacity": 0 }, {
							duration: SwipeBook.pageInDuration()
						});
					} else if (transition == "replace") {
						$("#page_" + currentStep).css({ "opacity": 0 });
						$("#page_" + nextStep).css({ "opacity": 1 });
						this.pages[nextStep].finShow();
					} else if (transition == "scroll") {
						$("#page_" + nextStep).css({ "opacity": 1 });
						this.pages[currentStep].back();
						this.pageSlide("out", currentStep);
						this.pages[nextStep].finShow();
					}
				}
			}
			this.pages[nextStep].mediaPlay();

			this.step = nextStep;
			location.hash = nextStep;
		}
	}, {
		key: 'getStep',
		value: function getStep() {
			return this.step;
		}
	}, {
		key: 'pageSlide',
		value: function pageSlide(mode, step) {
			$(".boxelement-" + step).each(function (index, element) {
				console.log("box");

				if (mode == "in") {
					if (this.paging == "vertical") {
						var orgTop = $("#" + this.css_id).attr("__x");
						var fromTop = orgTop + SwipeScreen.virtualheight();
					} else if (this.paging == "leftToRight") {
						var orgLeft = $("#" + this.css_id).attr("__y");
						var fromLeft = orgLeft + SwipeScreen.virtualwidth();
					} else {
						var orgLeft = $("#" + this.css_id).attr("__y");
						var fromLeft = orgLeft - SwipeScreen.virtualwidth();
					}
				} else {
					if (this.paging == "vertical") {
						var fromTop = $("#" + this.css_id).attr("__x");
						var orgTop = fromTop + SwipeScreen.virtualheight();
					} else if (this.paging == "leftToRight") {
						var fromLeft = $("#" + this.css_id).attr("__y");
						var orgLeft = fromLeft + SwipeScreen.virtualwidth();
					} else {
						var fromLeft = $("#" + this.css_id).attr("__y");
						var orgLeft = fromLeft - SwipeScreen.virtualwidth();
					}
				}

				if (this.paging == "vertical") {
					$(element).css("top", fromTop);
					$(element).animate({
						"top": orgTop
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else {
					$(element).css("left", fromLeft);
					$(element).animate({
						"left": orgLeft
					}, {
						duration: SwipeBook.pageInDuration()
					});
				}
			});

			if (mode == "in") {
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", SwipeScreen.virtualheight());
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"top": 0,
						"opacity": 1
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", SwipeScreen.virtualwidth());
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": 0,
						"opacity": 1
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else {
					$("#page_" + step).css("left", -SwipeScreen.virtualwidth());
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": 0,
						"opacity": 1
					}, {
						duration: SwipeBook.pageInDuration()
					});
				}
			} else {
				var option = {
					duration: SwipeBook.pageInDuration(),
					complete: function complete() {
						$("#page_" + step).css({ "opacity": 0 });
					}
				};
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", 0);
					$("#page_" + step).animate({
						"top": SwipeScreen.virtualheight()
					}, option);
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": SwipeScreen.virtualwidth(),
						"opacity": 1
					}, option);
				} else {
					$("#page_" + step).css("left", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": -SwipeScreen.virtualwidth(),
						"opacity": 1
					}, option);
				}
			}
		}
	}]);

	return SwipeBook;
}();
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
		this.css_id = css_id;
		this.page_id = page_id;
		this.element_id = element_id;
		this.play_style = play;
		this.duration = duration;
		this.parent = parent;

		this.isActive = false;
		this.videoElement = null;
		this.isRepeat = Boolean(info["repeat"]);

		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.scale = [1, 1];
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

			this.originalPrevPos = this.updatePosition(this.initPosData, this.info);
			this.prevPos = this.getScreenPosition(this.originalPrevPos);

			this.originalFinPos = this.getOriginalFinPos();
			this.finPos = this.getScreenPosition(this.originalFinPos);
			if (this.isText()) {
				this.prevText = this.textLayout(this.info, this.prevPos);
				this.finText = this.textLayout(this.info, this.finPos);
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
				return this.updatePosition(pos, SwipeUtil.merge(this.info, this.info["to"]));
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
		key: "setSize",
		value: function setSize() {
			if (this.info["size"]) {
				this.w = this.info["size"][0];
				this.h = this.info["size"][1];
			} else {
				if (this.info["w"]) {
					this.w = SwipeParser.parseSize(this.info["w"], SwipeScreen.swipewidth(), SwipeScreen.swipewidth());
				} else {
					if (this.isImage()) {
						this.w = $("#" + this.css_id).attr("__default_width");
					} else {
						this.w = this.parentWidth();
						this.no_size = true;
					}
				}
				if (this.info["h"]) {
					this.h = SwipeParser.parseSize(this.info["h"], SwipeScreen.swipeheight(), SwipeScreen.swipeheight());
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
			if (this.info["rotate"]) {
				this.angle = this.info["rotate"];
			}
			this.scale = this.getScale(this.info);
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
				this.path.attr({
					d: this.prevPath.d,
					fill: this.prevPath.fill,
					transform: this.prevPath.transform,
					stroke: this.prevPath.stroke,
					strokeWidth: this.prevPath.strokeWidth
				});
			}
			if (this.isMarkdown()) {
				this.md_css.forEach(function (element, elem_index) {
					$("#" + instance.css_id + "-" + elem_index).css(element);
				});
			}
		}

		// scale and container height(is my height)

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
				return Math.round(size * scale[1]);
			}(info, data[6]);

			var containerHeight = fontSize;
			var divHeight = data[3];
			var top = 0;

			if (x == "bottom") {
				top = divHeight - containerHeight;
			} else if (x == "center") {
				top = (divHeight - containerHeight) / 2;
			}

			return {
				position: "relative",
				top: String(SwipeScreen.virtualY(top)) + "px",
				"font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
				"line-height": String(SwipeScreen.virtualY(fontSize)) + "px",
				"font-family": fontname,
				"textAlign": textAlign,
				"color": SwipeParser.parseColor(info, "#000")
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
		key: "transform",
		value: function transform(info, scale) {

			var ret = [];
			var default_scale = [SwipeScreen.getRation(), SwipeScreen.getRation()];
			if (scale) {
				default_scale = [default_scale[0] * scale[0], default_scale[1] * scale[1]];
			}
			var scale_array = [default_scale[0], default_scale[1], this.initPosData[2] / 2, this.initPosData[3] / 2];
			ret.push("scale(" + scale_array.join(",") + ")");

			var r = info.rotate ? [info.rotate[2], this.initPosData[2] / 2, this.initPosData[3] / 2].join(",") : "0,0,0";
			ret.push("rotate(" + r + ")");

			return ret.join(" ");
		}
	}, {
		key: "parsePath",
		value: function parsePath() {
			var line = this.info.lineWidth ? this.info.lineWidth : 1;
			var strokeColor = this.info.strokeColor ? this.info.strokeColor : "black";
			var fillColor = this.info.fillColor ? this.info.fillColor : "none";

			return {
				d: this.info.path,
				stroke: this.conv_rgba2rgb(strokeColor),
				transform: this.transform(this.info, this.scale),
				fill: this.conv_rgba2rgb(fillColor),
				strokeWidth: line
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
			var fillColor = info.fillColor ? info.fillColor : "none";

			var r = info.rotate ? [info.rotate[2], this.prevPos[2] / 2, this.prevPos[3] / 2].join(",") : "0,0,0";

			return {
				d: info.path,
				stroke: this.conv_rgba2rgb(strokeColor),
				transform: this.transform(info, this.getScale(info)),
				fill: this.conv_rgba2rgb(fillColor),
				strokeWidth: line
			};
		}
	}, {
		key: "animatePrevPos",
		value: function animatePrevPos() {
			$("#" + this.css_id).animate(this.convCssPos(this.prevPos), {
				duration: this.duration
			});
			if (this.hasTo()) {
				if (this.isText()) {
					$("#" + this.css_id + "-body").animate(this.prevText, {
						duration: this.duration
					});
				}
				if (this.isPath()) {
					var path = SwipeParser.clone(this.prevPath);
					delete path.stroke;
					this.path.animate(path, this.duration);
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
				var text_css = this.textLayout(this.info, this.finPos);
				$("#" + this.css_id + "-body").css(text_css);
			}
		}
	}, {
		key: "animateFinPos",
		value: function animateFinPos() {
			if (this.hasTo()) {
				this.transition_timing = this.getTiming(this.info["to"], this.duration);
				var start_duration = this.transition_timing[0];
				var do_duration = this.transition_timing[1];

				var instance = this;
				setTimeout(function () {
					$("#" + instance.css_id).animate(instance.convCssPos(instance.finPos), {
						duration: do_duration
					});
					if (instance.isText()) {
						$("#" + instance.css_id + "-body").animate(instance.finText, {
							duration: do_duration
						});
					}
					if (instance.isPath()) {
						var path = SwipeParser.clone(instance.finPath);
						delete path.stroke;
						instance.path.animate(path, do_duration);
					}
				}, start_duration);
			}
		}

		// calculate position

	}, {
		key: "updatePosition",
		value: function updatePosition(data, to) {
			var ret = Object.assign({}, data);
			if (to["opacity"] != null) {
				ret[5] = Number(to["opacity"]);
			}

			if (to["translate"]) {
				var translate = to["translate"];
				ret[0] = ret[0] + Number(translate[0]);
				ret[1] = ret[1] + Number(translate[1]);
			}
			if (!this.isPath()) {
				if (to["scale"]) {
					ret[6] = this.getScale(to);
					// todo skip path!?
					ret = this.applyScale(ret);
				}
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
				} else if (SwipeParser.is("Number", info["scale"])) {
					scale = [info["scale"], info["scale"]];
				} else if (SwipeParser.is("String", info["scale"])) {
					scale = [Number(info["scale"]), Number(info["scale"])];
				}
			}
			return scale;
		}
	}, {
		key: "applyScale",
		value: function applyScale(data) {
			var scale = data[6];
			if (scale && scale.length == 2 && scale[0] != 1 && scale[1] != 1) {
				var new_w = data[2] * scale[0];
				var new_h = data[3] * scale[1];
				var new_x = data[0] - (new_w - data[2]) / 2;
				var new_y = data[1] - (new_h - data[3]) / 2;
				data[0] = new_x;
				data[1] = new_y;
				data[2] = new_w;
				data[3] = new_h;
			}
			return data;
		}
	}, {
		key: "convCssPos",
		value: function convCssPos(data) {
			var ret = {
				'left': data[0] + 'px',
				'top': data[1] + 'px',
				'width': data[2] + 'px',
				'height': data[3] + 'px',
				'opacity': data[5]
			};
			if (data[4]) {
				var rotate = "rotate(" + data[4] + "deg)";
				ret["-moz-transform"] = rotate;
				ret["-webkit-transform"] = rotate;
				ret["-o-transform"] = rotate;
				ret["-ms-transform"] = rotate;
			}
			return ret;
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
			}
			var child_html = this.elements.map(function (element, key) {
				return element.html();
			}).join("");
			if (this.isImage()) {
				return "<div id='" + this.css_id + "' class='image_box'><div id='" + this.css_id + "_inner'>" + "<img src='" + this.info.img + "' class='image_element' id='" + this.css_id + "_image' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' __base_id='" + this.css_id + "' >" + child_html + "</img></div></div>";
			} else if (this.isSprite()) {
				return "<div id='" + this.css_id + "' class='image_box'><div id='" + this.css_id + "_inner'>" + "<img src='" + this.info.sprite + "' class='image_element' id='" + this.css_id + "_sprite' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' __base_id='" + this.css_id + "' >" + child_html + "</img></div></div>";
			} else if (this.isText()) {
				return "<div class='element text_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + "<div class='text_body' id='" + this.css_id + "-body'>" + this.parseText(this.info.text) + child_html + "</div>" + "</div>";
			} else if (this.isMarkdown()) {
				var md_array = this.parseMarkdown(this.info.markdown);
				this.md_css = md_array[1];
				return "<div class='element markdown_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + "<div class='markdown_wrap' id='md_" + this.css_id + "'>" + md_array[0] + child_html + "</div></div>";
			} else if (this.isVideo()) {
				// return  "<div class='element video_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + child_html + "</div>";
				return "<div class='element video_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + "<video id='" + this.css_id + "-video' ><source type='video/mp4' src='" + this.info.video + "'  /></video>" + child_html + "</div>";
			} else if (this.isPath()) {
				return '<svg class="element svg_element" id="' + this.css_id + '" __page_id="' + this.page_id + '" __element_id="' + this.element_id + '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"></svg>';
			} else if (this.isDiv()) {
				return "<div class='element boxelement-" + this.page_id + "' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + child_html + "</div>";
			} else {
				return "";
			}
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
				if (this.transition_timing[2] == 0) {
					loop_duration = 200;
				} else {
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
				var _repeat = instance.valueFrom(data, "repeat");
				var block = instance.info.slice[0];
				var timing = (start_duration + wait_duration) / _repeat / block;
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
	}, {
		key: "play",
		value: function play() {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.play();
				});
			}
			if (this.videoElement) {
				this.videoElement.play();
			}
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
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeMarkdown = function () {
	function SwipeMarkdown(info) {
		_classCallCheck(this, SwipeMarkdown);

		this.info = info;

		this.setMdStyle();
		if (this.info["styles"]) {
			// not well
			this.md_style = $.extend(true, this.md_style, this.info["styles"]);
		}
		if (this.info["shadow"]) {
			this.shadow = this.info["shadow"];
		}
	}

	_createClass(SwipeMarkdown, [{
		key: "parse",
		value: function parse(element, css_prefix) {
			var instance = this;
			var fCode = false;
			var prepared = element.map(function (element, elem_index) {
				if (element === '```') {
					fCode = !fCode;
					return fCode ? [null, ""] : ["```+", ""];
				} else if (fCode) {
					return ["```", element];
				}
				return instance.getMdSymbol(element);
			});
			var htmls = [];
			var csses = [];
			prepared.forEach(function (element, elem_index) {
				var style = element[0];
				var body = element[1];
				if (instance.prefixes(style)) {
					body = instance.prefixes(style) + body;
				}

				htmls.push(instance.conv_html(body, css_prefix, elem_index));
				csses.push(instance.conv_css(style));
			});

			return [htmls.join(""), csses];
		}
	}, {
		key: "conv_html",
		value: function conv_html(body, css_prefix, index) {
			var text = body.replace(/\s/g, '&nbsp;');
			return "<div class='markdown_line' id='" + css_prefix + "-" + index + "'>" + text + "</div>";
		}
	}, {
		key: "conv_css",
		value: function conv_css(style) {
			var my_style = this.md_style[style];
			var fontSize = 20;
			var lineHeight = 30;
			var fontname = ""; // todo default font
			var textAlign = "left";

			if (my_style) {
				if (my_style["font"]) {
					if (my_style["font"]["name"]) {
						fontname = SwipeParser.parseFontName(my_style["font"], true);
					}
					if (my_style["font"]["size"]) {
						fontSize = SwipeParser.parseFontSize(my_style["font"], SwipeScreen.swipeheight(), 10, true);
						lineHeight = fontSize;
					}
				}
				if (my_style["alignment"]) {
					textAlign = my_style["alignment"];
				}
				if (my_style["spacing"]) {
					lineHeight = lineHeight + SwipeParser.parseSize(my_style["spacing"], SwipeScreen.swipeheight(), 10);
				} else {
					lineHeight = lineHeight + 10;
				}
			}

			var css = {
				position: "relative",
				"font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
				"line-height": String(SwipeScreen.virtualY(lineHeight)) + "px",
				"font-family": fontname,
				"textAlign": textAlign,
				"color": SwipeParser.parseColor(my_style, "#000")
			};
			if (this.shadow) {
				css["text-shadow"] = SwipeParser.parseShadow(this.shadow);
				console.log(css["text-shadow"]);
				//"2px  2px 1px blue";//"        "shadow":{ "color":"blue", "offset":[-2,2] },
			}

			return css;
		}
	}, {
		key: "setMdStyle",
		value: function setMdStyle() {
			var _md_style;

			this.md_style = (_md_style = {
				"###": { "color": "#800", "font": { "size": "4%", "name": "Helvetica" } },
				"#": { "font": { "size": 32 }, "spacing": 16 },
				"##": { "font": { "size": 28 }, "spacing": 14 }
			}, _defineProperty(_md_style, "###", { "font": { "size": 24 }, "spacing": 12 }), _defineProperty(_md_style, "####", { "font": { "size": 22 }, "spacing": 10 }), _defineProperty(_md_style, "*", { "font": { "size": 20 }, "spacing": 10 }), _defineProperty(_md_style, "-", { "font": { "size": 20 }, "spacing": 5 }), _defineProperty(_md_style, "```", { "font": { "size": 14, "name": "Courier" }, "spacing": 0 }), _defineProperty(_md_style, "```+", { "font": { "size": 7, "name": "Courier" }, "spacing": 0 }), _md_style);
		}
	}, {
		key: "getMdStyle",
		value: function getMdStyle() {
			return this.md_style;
		}
	}, {
		key: "getMdSymbol",
		value: function getMdSymbol(element) {
			var md_style = this.getMdStyle();
			var words = element.split(" ");

			if (words.length > 1 && md_style[words[0]]) {
				var symbol = words.shift();
				return [symbol, words.join(" ")];
			}
			return ["*", element];
		}
	}, {
		key: "prefixes",
		value: function prefixes(style) {
			var my_style = this.md_style[style];
			if (my_style && my_style["prefix"]) {
				return my_style["prefix"];
			}

			var arr = {
				"-": "• ", // bullet (U+2022), http://graphemica.com/%E2%80%A2
				"```": " "
			};
			if (style) {
				if (arr.hasOwnProperty(style)) {
					return arr[style];
				}
			}
			return null;
		}
	}]);

	return SwipeMarkdown;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeMediaPlayer = function () {
			_createClass(SwipeMediaPlayer, null, [{
						key: "getInstance",
						value: function getInstance() {
									if (this.instance) {
												return this.instance;
									}
									this.instance = new SwipeMediaPlayer();
									return this.instance;
						}
			}]);

			function SwipeMediaPlayer() {
						_classCallCheck(this, SwipeMediaPlayer);

						this.current_page = 0;
						this.current_playing = null;
						this.media = {};
			}

			_createClass(SwipeMediaPlayer, [{
						key: "page",
						value: function page(num) {
									this.current_page = num;
									return this;
						}
			}, {
						key: "push",
						value: function push(media) {
									if (!this.media[this.current_page]) {
												this.media[this.current_page] = [];
									}
									console.log("push");
									console.log(this.current_page);

									this.media[this.current_page].push(media);
									return this;
						}
			}, {
						key: "play",
						value: function play() {

									if (this.current_playing != this.current_page) {
												this.stop();
												if (this.media[this.current_page]) {
															console.log("pkay");
															console.log(this.current_page);
															this.media[this.current_page].forEach(function (media, media_index) {
																		console.log("media");
																		console.log(media_index);
																		media.play();
															});
												}
												this.current_playing = this.current_page;
									}
									return this;
						}
			}, {
						key: "media",
						value: function media() {
									return this.media[this.current_page];
						}
			}, {
						key: "stop",
						value: function stop() {
									if (this.current_playing !== null) {
												console.log("stop");
												console.log(this.current_playing);
												if (this.media[this.current_playing]) {
															this.media[this.current_playing].forEach(function (media, media_index) {
																		media.stop();
															});
												}
									}
									this.current_playing = null;
						}
			}]);

			return SwipeMediaPlayer;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipePage = function () {
			function SwipePage(page, scene, index) {
						_classCallCheck(this, SwipePage);

						if (scene) {
									page = SwipeParser.inheritProperties(page, scene);
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
									this.page["elements"].forEach(function (element, elem_index) {
												instance.elements.push(new SwipeElement(element, instance.index, elem_index, instance.play_style, instance.duration));
									});
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
									});
									// todo snbinder
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
						key: "justShow",
						value: function justShow() {
									this.elements.forEach(function (element, elem_index) {
												element.justShow();
									});
						}
			}, {
						key: "mediaPlay",
						value: function mediaPlay() {
									var media_player = SwipeMediaPlayer.getInstance();
									media_player.page(this.index).play();
									// console.log(this.index);
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
						key: "play",
						value: function play() {
									this.elements.forEach(function (element, elem_index) {
												element.play();
									});
						}
			}, {
						key: "getScene",
						value: function getScene() {
									return this.scene;
						}

						// todo locale

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
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeParser = function () {
			function SwipeParser() {
						var _handlers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

						_classCallCheck(this, SwipeParser);
			}

			_createClass(SwipeParser, null, [{
						key: "parseColor",
						value: function parseColor(info, defaultColor) {

									if (info && info["color"]) {
												return info["color"];
									}
									return defaultColor;
						}
			}, {
						key: "transformedPath",
						value: function transformedPath() {
									// not implement
						}
			}, {
						key: "parseTransform",
						value: function parseTransform() {
									// not implement
						}
			}, {
						key: "is",
						value: function is(type, obj) {
									var clas = Object.prototype.toString.call(obj).slice(8, -1);
									return obj !== undefined && obj !== null && clas === type;
						}
			}, {
						key: "inheritProperties",
						value: function inheritProperties(obj, tempObj) {
									var ret = SwipeParser.clone(obj);
									var idMap = {};
									if (tempObj) {
												var tempClone = SwipeParser.clone(tempObj);
												$.each(tempClone, function (keyString, tempValue) {
															var ret_val = SwipeParser.clone(tempValue);

															if (ret[keyString] == null) {
																		ret[keyString] = ret_val;
															} else {
																		if (SwipeParser.is("Array", ret[keyString]) || SwipeParser.is("object", ret[keyString])) {
																					if (SwipeParser.is("Number", ret_val) || SwipeParser.is("String", ret_val)) {
																								ret[keyString] = ret_val;
																					} else {
																								idMap = {};

																								$.each(ret_val, function (index, tempItem) {
																											if (SwipeParser.is("String", tempItem["id"])) {
																														idMap[tempItem["id"]] = index;
																											}
																								});
																								ret[keyString].forEach(function (objItem, key) {
																											if (SwipeParser.is("String", objItem["id"]) && (key = idMap[objItem["id"]]) != null) {

																														ret_val[key] = SwipeParser.inheritProperties(objItem, ret_val[key]);
																											} else {
																														ret_val.push(objItem);
																											}
																								});
																								ret[keyString] = ret_val;
																					}
																		}
															}
												});
									}
									return ret;
						}
			}, {
						key: "localizedStringForKey",
						value: function localizedStringForKey(key) {
									// todo from page element
									var pageinfo = {};

									var strings;
									if (strings = pageinfo["strings"]) {
												var text = strings[key];
												// todo localize
												return SwipeParser.localizedString(text, "ja");
									}
									return "";
						}
			}, {
						key: "localizedString",
						value: function localizedString(params, langId) {
									if (params[langId]) {
												return params[langId];
									} else {
												return params["*"];
									}
									return "";
						}
			}, {
						key: "parseFontSize",
						value: function parseFontSize(info, full, defaultValue, markdown) {
									var key = markdown ? "size" : "fontSize";

									if (info[key]) {
												return SwipeParser.parseSize(info[key], full, defaultValue);
									}
									return defaultValue;
						}
			}, {
						key: "parseSize",
						value: function parseSize(value, full, defaultValue) {
									if (Number.isInteger(value)) {
												return value;
									}
									if (isFinite(value)) {
												return value;
									}
									return SwipeParser.parsePercent(value, full, defaultValue);
						}
			}, {
						key: "parsePercent",
						value: function parsePercent(value, full, defaultValue) {
									var reg = /^([0-9][0-9\\.]*)%$/;
									var match = value.match(reg);
									if (match) {
												return Math.floor(match[1]) / 100 * full;
									}
									return defaultValue;
						}
			}, {
						key: "parseFontName",
						value: function parseFontName(value, markdown) {
									var key = markdown ? "name" : "fontName";
									if (value) {
												var name = value[key];
												if (jQuery.type(name) === "string") {
															return name;
												} else if (jQuery.type(name) === "array") {
															return name.join(",");
												}
									}
									return "sans-serif, Helvetica";
									// return [];
						}
			}, {
						key: "parseShadow",
						value: function parseShadow(info) {
									var scale = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

									var x = SwipeParser.parseSize((info["offset"] || [])[0], SwipeScreen.swipeheight(), 1) * scale;
									x = SwipeScreen.virtualX(x);
									var y = SwipeParser.parseSize((info["offset"] || [])[1], SwipeScreen.swipewidth(), 1) * scale;
									y = SwipeScreen.virtualY(y);

									var color = info["color"] || "black";

									return x + "px " + y + "px 3px " + color;
						}
			}, {
						key: "clone",
						value: function clone(obj) {
									var copy;

									// Handle the 3 simple types, and null or undefined
									if (null == obj || "object" != (typeof obj === "undefined" ? "undefined" : _typeof(obj))) return obj;

									// Handle Date
									if (obj instanceof Date) {
												copy = new Date();
												copy.setTime(obj.getTime());
												return copy;
									}

									// Handle Array
									if (obj instanceof Array) {
												copy = [];
												for (var i = 0, len = obj.length; i < len; i++) {
															copy[i] = SwipeParser.clone(obj[i]);
												}
												return copy;
									}

									// Handle Object
									if (obj instanceof Object) {
												copy = {};
												for (var attr in obj) {
															if (obj.hasOwnProperty(attr)) copy[attr] = SwipeParser.clone(obj[attr]);
												}
												return copy;
									}

									throw new Error("Unable to copy obj! Its type isn't supported.");
						}
			}]);

			return SwipeParser;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeScreen = function () {
			function SwipeScreen() {
						_classCallCheck(this, SwipeScreen);
			}

			_createClass(SwipeScreen, null, [{
						key: "setSize",
						value: function setSize(size) {
									this.size = size;
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
									var real_ration = this.window_width / this.window_height;
									var virtual_ration = this.width / this.height;
									this.ration = 1.0;

									if (real_ration / virtual_ration >= 1) {
												this.virtual_height = $(window).height();
												this.virtual_width = this.width / this.height * this.virtual_height;
									} else {
												this.virtual_width = $(window).width();
												this.virtual_height = this.height / this.width * this.virtual_width;
									}
									if (this.size) {
												this.virtual_width = this.virtual_width * this.size / 100;
												this.virtual_height = this.virtual_height * this.size / 100;
									}
									this.ration = this.virtual_width / this.width;
						}
			}, {
						key: "getRation",
						value: function getRation() {
									return this.ration;
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
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeScreen = function () {
			function SwipeScreen() {
						_classCallCheck(this, SwipeScreen);
			}

			_createClass(SwipeScreen, null, [{
						key: "setSize",
						value: function setSize(percentage) {
									this.percentage = percentage;
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
									var real_ration = this.window_width / this.window_height;
									var virtual_ration = this.width / this.height;
									this.ration = 1.0;

									if (real_ration / virtual_ration >= 1) {
												this.virtual_height = $(window).height();
												this.virtual_width = this.width / this.height * this.virtual_height;
									} else {
												this.virtual_width = $(window).width();
												this.virtual_height = this.height / this.width * this.virtual_width;
									}
									if (this.percentage) {
												this.virtual_width = this.virtual_width * this.percentage / 100;
												this.virtual_height = this.virtual_height * this.percentage / 100;
									}

									this.ration = this.virtual_width / this.width;
						}
			}, {
						key: "getRation",
						value: function getRation() {
									return this.ration;
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
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeUtil = function () {
			function SwipeUtil() {
						_classCallCheck(this, SwipeUtil);
			}

			_createClass(SwipeUtil, null, [{
						key: "getParameterByName",
						value: function getParameterByName(name, url) {
									if (!url) url = window.location.href;
									name = name.replace(/[\[\]]/g, "\\$&");
									var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
									    results = regex.exec(url);
									if (!results) return null;
									if (!results[2]) return '';
									return decodeURIComponent(results[2].replace(/\+/g, " "));
						}
			}, {
						key: "initSwipe",
						value: function initSwipe(data, css_id, back_css_id) {
									$(document.body).css({ "margin": 0, "padding": 0, "background-color": "#fff", "font-size": "26px" });
									$('div').css({ "margin": 0, "padding": 0, "background-color": "#fff", "font-size": "26px" });

									var default_page = 0;

									if (location.hash) {
												default_page = Number(location.hash.substr(1));
									}

									var swipe_book = new SwipeBook(data, default_page, css_id, back_css_id);
									this.swipe_book = swipe_book;

									$(css_id).on("click", function () {
												swipe_book.next();
									});

									$(window).on('hashchange', function () {
												if ("#" + swipe_book.getStep() != location.hash) {
															swipe_book.show(Number(location.hash.substr(1)));
												}
									});

									$(window).resize(function () {
												clearTimeout(window.resizedFinished);
												window.resizedFinished = setTimeout(function () {
															swipe_book.resize();
												}, 250);
									});
						}
			}, {
						key: "getSwipeBook",
						value: function getSwipeBook() {
									return this.swipe_book;
						}
			}, {
						key: "merge",
						value: function merge(object1, object2) {
									var newObject = {};
									var keys = Object.keys(object1);
									for (var i = 0; i < keys.length; i++) {
												newObject[keys[i]] = object1[keys[i]];
									}
									keys = Object.keys(object2);
									for (i = 0; i < keys.length; i++) {
												newObject[keys[i]] = object2[keys[i]];
									}
									return newObject;
						}
			}]);

			return SwipeUtil;
}();