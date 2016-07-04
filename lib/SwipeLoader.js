"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeLoader = function () {
	function SwipeLoader(data) {
		var defaultPage = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		_classCallCheck(this, SwipeLoader);

		this.step = defaultPage;
		this.data = data;
		this.pages = [];
		this.load();
		this.domLoad();
	}

	_createClass(SwipeLoader, [{
		key: "load",
		value: function load() {
			var _this = this;

			SwipeScreen.init(this.data.dimension[0], this.data.dimension[1]);

			$(".swipe").css({
				height: SwipeScreen.virtualheight(),
				width: SwipeScreen.virtualwidth()
			});
			$(".right").css({
				position: "absolute",
				top: 0,
				left: SwipeScreen.virtualwidth(),
				height: SwipeScreen.virtualheight(),
				width: $(window).width(),
				display: "inline-block",
				"z-index": 100,
				"background-color": "white"
			});

			$.each(this.data["pages"], function (index, page) {
				var scene;
				if (page["scene"] && (scene = _this.data["scenes"][page["scene"]])) {
					scene = _this.data["scenes"][page["scene"]];
				}
				var pageInstance = new SwipePage(page, scene, index);

				_this.pages.push(pageInstance);
			});
		}
	}, {
		key: "resize",
		value: function resize() {
			SwipeScreen.init(this.data.dimension[0], this.data.dimension[1]);
			this.show(this.step);
		}
	}, {
		key: "domLoad",
		value: function domLoad() {
			var pages = [];
			var instance = this;
			this.pages.forEach(function (page, page_index) {
				page.loadElement();

				// todo snbinder
				var page_html = "<div id='page_" + page_index + "' class='page'>" + page.getHtml() + "</div>";

				pages.push(page_html);
			});

			$(".swipe").html(pages.join(""));

			for (var i = 0; i < this.pages.length; i++) {
				if (this.step != i) {
					$("#page_" + i).css("opacity", 0);
				}
			}

			$(".element").load(function () {
				$(this).attr("__default_width", $(this).width());
				$(this).attr("__default_height", $(this).height());
				instance.initData($(this).attr("__page_id"), $(this).attr("__element_id"));
				SwipeCounter.decrease();

				if (SwipeCounter.getCounter() == 0) {
					instance.show(instance.step);
				}
			});

			$(".page").css({ "position": "absolute" });
			$(".boxelement").each(function (index, element) {
				instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));

				SwipeCounter.decrease();
				console.log(SwipeCounter.getCounter());

				if (SwipeCounter.getCounter() == 0) {
					instance.show(instance.step);
				}
			});
		}
	}, {
		key: "initData",
		value: function initData(page_id, element_id) {
			this.pages[page_id].initElement(element_id);
		}
	}, {
		key: "next",
		value: function next() {
			if (this.step < this.pages.length - 1) {
				this.show(this.step + 1);
			}
		}
	}, {
		key: "show",
		value: function show(nextStep) {
			var currentStep = this.step;
			var mode = nextStep >= currentStep ? "forward" : "back";
			var same_scene = this.pages[nextStep] && this.pages[nextStep].getScene() == this.pages[currentStep].getScene();

			this.pages[currentStep].inactive();
			this.pages[nextStep].active();

			if (mode == "forward") {
				if (same_scene) {
					this.pages[nextStep].show();
					$("#page_" + currentStep).css("opacity", 0);
					$("#page_" + nextStep).css("opacity", 1);
				} else {
					setTimeout(function () {
						$("#page_" + currentStep).css({
							"opacity": 0
						});
					}, 500);
					this.pageSlide("in", nextStep);
					this.pages[nextStep].delayShow();
				}
			} else {
				// in case back
				if (same_scene) {
					this.pages[currentStep].back();
					// todo more smooth.
					setTimeout(function () {
						$("#page_" + currentStep).css({ "opacity": 0 });
						$("#page_" + nextStep).css({ "opacity": 1 });
					}, 500);
				} else {
					$("#page_" + nextStep).css({ "opacity": 1 });

					this.pageSlide("out", currentStep);
					setTimeout(function () {
						$("#page_" + currentStep).css({ "opacity": 0 });
					}, 500);
				}
			}

			this.step = nextStep;
			location.hash = nextStep;
		}
	}, {
		key: "getStep",
		value: function getStep() {
			return this.step;
		}
	}, {
		key: "pageSlide",
		value: function pageSlide(mode, step) {
			$(".boxelement-" + step).each(function (index, element) {
				console.log("box");

				if (mode == "in") {
					// todo not use css top. use virtual x.
					var orgTop = $("#" + this.css_id).attr("__x");
					var fromTop = orgTop + SwipeScreen.virtualheight();
				} else {
					var fromTop = $("#" + this.css_id).attr("__x");
					var orgTop = fromTop + SwipeScreen.virtualheight();
				}

				$(element).css("top", fromTop);
				$(element).animate({
					"top": orgTop
				}, {
					duration: 500
				});
			});

			if (mode == "in") {
				$("#page_" + step).css("top", SwipeScreen.virtualheight());
				$("#page_" + step).css("opacity", 1);
				$("#page_" + step).animate({
					"top": 0,
					"opacity": 1
				}, {
					duration: 500
				});
			} else {
				$("#page_" + step).css("top", 0);
				$("#page_" + step).animate({
					"top": SwipeScreen.virtualheight()
				}, {
					duration: 500
				});
			}
		}
	}]);

	return SwipeLoader;
}();