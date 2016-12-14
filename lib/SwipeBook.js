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
		this.title = "Swipe";
		this.pages = [];
		this.base_css_id = base_css_id;
		this.back_css_id = back_css_id;
		if (data["type"] == "net.swipe.list") {
			(function () {
				var html = [];
				_this.data.items.forEach(function (item, item_index) {
					html.push('<li><a href="?file=' + item["url"] + '">' + item["title"] + '</li>');
				});
				$(base_css_id).html("<ul>" + html.join("") + "</ul>");
				_this.setScreen();
			})();
		} else {
			// 	"type":"net.swipe.swipe"
			this.step = defaultPage;

			SwipeBook.setTemplateElements(this.getTemplateElements());
			SwipeBook.setMarkdown(this.getMarkdown());
			this.templatePages = this.getTemplatePages();
			this.setScreen();
			this.paging = this.getPaging();
			this.isReady = false;
			this.load();
			if (this.step > this.pages.length) {
				this.step = this.pages.length - 1;
			}
			if (this.pages.length > 0) {
				this.domLoad();
			}
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
				if (_this2.templatePages["*"]) {
					scene = _this2.templatePages["*"];
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

			$("#loading").css({
				height: SwipeScreen.virtualheight(),
				width: SwipeScreen.virtualwidth(),
				"z-index": 100,
				"background-color": "#fff",
				overflow: "hidden",
				position: "absolute",
				left: x
			});

			$(this.base_css_id).css({
				height: SwipeScreen.virtualheight(),
				width: SwipeScreen.virtualwidth(),
				overflow: "hidden",
				position: "absolute",
				left: x
			});
			var height = SwipeScreen.getSize();
			$(this.back_css_id).css({
				"background-color": this.bc,
				"height": height + "vh",
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
				instance.counterDecrease();
			});

			$(".element").each(function (index, element) {
				instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));
				instance.counterDecrease();
			});

			$(".video_element").each(function (index, element) {
				var player = new MediaElement($(element).attr("id") + "-video", {
					flashName: 'flashmediaelement.swf',
					loop: true,
					success: function success(mediaElement, domObject) {
						instance.videoElement = mediaElement;
					}
				});
				var __element = instance.pages[$(element).attr("__page_id")].getElement($(element).attr("__element_id"));

				var media_player = SwipeMediaPlayer.getInstance();
				var data = { media: player };
				if (__element.videoStart) {
					data["videoStart"] = __element.videoStart;
				}
				if (__element.videoDuration) {
					data["videoDuration"] = __element.videoDuration;
				}
				media_player.page($(element).attr("__page_id")).push($(element).attr("id"), data);
				instance.counterDecrease();
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
		key: 'counterDecrease',
		value: function counterDecrease() {
			SwipeCounter.decrease();
			$("#counter").html(SwipeCounter.getCounter());

			if (SwipeCounter.getCounter() == 0) {
				this.loadFinish();
				console.log("OK!!!");
			}
			console.log(SwipeCounter.getCounter());
		}
	}, {
		key: 'loadFinish',
		value: function loadFinish() {
			$("#loading").remove();
			this.isReady = true;
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
			if (this.isReady) {
				if (this.step < this.pages.length - 1) {
					this.show(this.step + 1);
				}
			}
		}
	}, {
		key: 'back',
		value: function back() {
			if (this.isReady) {
				if (this.step > 0) {
					this.show(this.step - 1);
				}
			}
		}
	}, {
		key: 'getStep',
		value: function getStep() {
			return this.step;
		}
	}, {
		key: 'getPages',
		value: function getPages() {
			return this.pages;
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

			if (!loaded) {
				this.pages[currentStep].inactive();
				this.pages[nextStep].active();
			}
			var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();
			var currentTransition = this.pages[currentStep].getTransition();
			var nextTransition = this.pages[nextStep].getTransition();
			var instance = this;

			if (mode == "forward") {
				// transition

				if (nextTransition == "fadeIn") {
					this.pages[nextStep].finShow();
					$("#page_" + nextStep).animate({ "opacity": 1 }, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (nextTransition == "replace") {
					this.pages[nextStep].show();
					$("#page_" + nextStep).css({ "opacity": 1 });
				} else if (nextTransition == "scroll") {
					this.pageSlide("in", nextStep);
					this.pages[nextStep].delayShow();
				} else {
					console.log("wrong transition in step " + String(nextStep));
				}

				if (!loaded) {
					if (currentTransition == "fadeIn") {
						$("#page_" + currentStep).animate({ "opacity": 0 }, {
							duration: SwipeBook.pageInDuration()
						});
					} else if (currentTransition == "replace") {
						setTimeout(function () {
							$("#page_" + currentStep).css({ "opacity": 0 });
						}, SwipeBook.pageInDuration());
					} else if (currentTransition == "scroll") {
						this.pageSlide("out", currentStep);
					}
				}
			} else {
				// in case back
				console.log("back");
				// transition

				this.pages[nextStep].finShow();
				if (nextTransition == "fadeIn") {
					$("#page_" + nextStep).css({ "opacity": 0 });
					$("#page_" + nextStep).animate({ "opacity": 1 }, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (nextTransition == "replace") {
					if (currentTransition == "replace") {
						setTimeout(function () {
							$("#page_" + nextStep).css({ "opacity": 1 });
						}, SwipeBook.pageInDuration());
					} else {
						$("#page_" + nextStep).css({ "opacity": 1 });
					}
					setTimeout(function () {
						instance.pages[nextStep].doLoopProcess();
					}, SwipeBook.pageInDuration());
				} else if (nextTransition == "scroll" && currentTransition == "scroll") {
					$("#page_" + nextStep).css({ "opacity": 1 });
					this.pageSlide("out_back", nextStep);
				} else {
					$("#page_" + nextStep).css({ "top": 0, "left": 0 });
					$("#page_" + nextStep).css({ "opacity": 1 });
					setTimeout(function () {
						instance.pages[nextStep].doLoopProcess();
					}, SwipeBook.pageInDuration());
				}

				if (currentTransition == "fadeIn") {
					$("#page_" + currentStep).css({ "opacity": 1 });
					$("#page_" + currentStep).animate({ "opacity": 0 }, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (currentTransition == "replace") {
					this.pages[currentStep].back();
					setTimeout(function () {
						$("#page_" + currentStep).css({ "opacity": 0 });
					}, SwipeBook.pageInDuration());
				} else if (currentTransition == "scroll") {
					this.pageSlide("in_back", currentStep);
				}
			}
			this.pages[nextStep].play();

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
			console.log("pageSlide");

			if (mode == "in") {
				$("#page_" + step).css("opacity", 1);
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", SwipeScreen.virtualheight());
					$("#page_" + step).animate({
						"top": 0
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", SwipeScreen.virtualwidth());
					$("#page_" + step).animate({
						"left": 0
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", -SwipeScreen.virtualwidth());
					$("#page_" + step).animate({
						"left": 0
					}, {
						duration: SwipeBook.pageInDuration()
					});
				}
			} else if (mode == "out") {
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"top": -SwipeScreen.virtualheight()
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": -SwipeScreen.virtualwidth()
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": SwipeScreen.virtualwidth()
					}, {
						duration: SwipeBook.pageInDuration()
					});
				}
				setTimeout(function () {
					$("#page_" + step).css("opacity", 0);
				}, SwipeBook.pageInDuration());
			} else if (mode == "in_back") {
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
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": -SwipeScreen.virtualwidth(),
						"opacity": 1
					}, option);
				}
				setTimeout(function () {
					$("#page_" + step).css("opacity", 0);
				}, SwipeBook.pageInDuration());
			} else if (mode == "out_back") {
				$("#page_" + step).css("opacity", 1);
				var _option = {
					duration: SwipeBook.pageInDuration()
				};
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", -SwipeScreen.virtualheight());
					$("#page_" + step).animate({
						"top": 0
					}, _option);
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", -SwipeScreen.virtualwidth());
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": 0,
						"opacity": 1
					}, _option);
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", SwipeScreen.virtualwidth());
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": 0,
						"opacity": 1
					}, _option);
				}
			}
		}

		// scroll

	}, {
		key: 'view',
		value: function view(ration) {
			var nextStep = this.step + (ration > 0 ? 1 : -1);
			var currentStep = this.step;
			var mode = nextStep >= currentStep ? "forward" : "back";

			if (nextStep < 0 || nextStep >= this.pages.length) {
				return 0;
			}
			//this.pages[currentStep].inactive()
			//this.pages[nextStep].active();

			var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();
			var currentTransition = this.pages[currentStep].getTransition();
			var nextTransition = this.pages[nextStep].getTransition();
			var instance = this;

			if (mode == "forward") {
				// transition
				if (nextTransition == "fadeIn") {
					this.pages[nextStep].finShow();
					$("#page_" + nextStep).css({ "opacity": ration });
				} else if (nextTransition == "replace") {
					$("#page_" + nextStep).css({ "opacity": ration });
				} else if (nextTransition == "scroll") {
					this.pageSlide2("in", nextStep, ration);
				} else {
					console.log("wrong transition in step " + String(nextStep));
				}

				/*
    if (!loaded) {
    if (currentTransition == "fadeIn") {
     $("#page_" + currentStep ).css({ "opacity": ration });
    }else if (currentTransition == "replace") {
     //setTimeout(function(){
     //	$("#page_" + currentStep ).css({ "opacity": 0 });
     //}, SwipeBook.pageInDuration());     
    } else if (currentTransition == "scroll") {
     this.pageSlide("out", currentStep);
    }
    }
    */
			} else {
				// in case back
				console.log("back");
				// transition
				if (nextTransition == "fadeIn") {
					$("#page_" + nextStep).css({ "opacity": SwipeBook.pageInDuration() * ration });
				} else if (nextTransition == "replace") {
					if (currentTransition == "replace") {
						//setTimeout(function(){
						// $("#page_" + nextStep).css({"opacity": 1});
						// }, SwipeBook.pageInDuration());
					} else {}
						// $("#page_" + nextStep).css({"opacity": 1});

						// setTimeout(function(){
						//		    instance.pages[nextStep].doLoopProcess();
						//		}, SwipeBook.pageInDuration());
				} else if (nextTransition == "scroll" && currentTransition == "scroll") {
					$("#page_" + nextStep).css({ "opacity": 1 });
					this.pageSlide2("out_back", nextStep, ration);
				} else {
					$("#page_" + nextStep).css({ "top": 0, "left": 0 });
					$("#page_" + nextStep).css({ "opacity": 1 });
					//setTimeout(function(){
					//		    instance.pages[nextStep].doLoopProcess();
					//		}, SwipeBook.pageInDuration());
				}

				if (currentTransition == "fadeIn") {
					$("#page_" + currentStep).css({ "opacity": 1 - ration });
				} else if (currentTransition == "replace") {
					//this.pages[currentStep].back();
					//setTimeout(function(){
					//		    $("#page_" + currentStep ).css({"opacity": 0});
					//		}, SwipeBook.pageInDuration());
				} else if (currentTransition == "scroll") {
					this.pageSlide2("in_back", currentStep, ration);
				}
			}

			this.pages[nextStep].play();
		}
	}, {
		key: 'nextStart',
		value: function nextStart() {
			console.log(this.step + 1);
			$("#page_" + String(this.step + 1)).css("opacity", 1);
		}
	}, {
		key: 'prevStart',
		value: function prevStart() {
			console.log(this.step - 1);
			$("#page_" + String(this.step - 1)).css("opacity", 1);
			//this.pages[this.step - 1].finShow();
		}
	}, {
		key: 'nextEnd',
		value: function nextEnd() {
			var nextStep = this.step + 1;
			if (nextStep >= this.pages.length) {
				return 0;
			}
			$("#page_" + this.step).css("opacity", 0);
			$("#page_" + nextStep).css("top", 0);
			$("#page_" + nextStep).css("left", 0);
			$("#page_" + nextStep).css("opacity", 1);
			this.pages[nextStep].finShow();
			this.step = nextStep;
			location.hash = nextStep;
		}
	}, {
		key: 'prevEnd',
		value: function prevEnd() {
			var nextStep = this.step - 1;
			if (nextStep < 0) {
				return 0;
			}
			$("#page_" + this.step).css("opacity", 0);
			$("#page_" + nextStep).css("opacity", 1);
			$("#page_" + nextStep).css("top", 0);
			$("#page_" + nextStep).css("left", 0);
			this.pages[nextStep].finShow();
			this.step = nextStep;
			location.hash = nextStep;
		}
	}, {
		key: 'pageSlide2',
		value: function pageSlide2(mode, step, ration) {
			console.log("pageSlide2");
			console.log(mode);

			if (mode == "in") {
				$("#page_" + step).css("opacity", 1);
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", SwipeScreen.virtualheight() * (1 - ration));
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", SwipeScreen.virtualwidth() * (1 - ration));
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", -SwipeScreen.virtualwidth());
					$("#page_" + step).animate({
						"left": 0
					}, {
						duration: SwipeBook.pageInDuration()
					});
				}
			} else if (mode == "out") {
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"top": -SwipeScreen.virtualheight()
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": -SwipeScreen.virtualwidth()
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", 0);
					$("#page_" + step).css("opacity", 1);
					$("#page_" + step).animate({
						"left": SwipeScreen.virtualwidth()
					}, {
						duration: SwipeBook.pageInDuration()
					});
				}
				setTimeout(function () {
					$("#page_" + step).css("opacity", 0);
				}, SwipeBook.pageInDuration());
			} else if (mode == "in_back") {
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", -SwipeScreen.virtualheight() * ration);
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", -SwipeScreen.virtualheight() * ration);
					$("#page_" + step).css("opacity", 1);
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", SwipeScreen.virtualheight() * ration);
					$("#page_" + step).css("opacity", 1);
				}
			} else if (mode == "out_back") {
				$("#page_" + step).css("opacity", 1);
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", SwipeScreen.virtualheight() * (-ration - 1));
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", SwipeScreen.virtualwidth() * (-ration - 1));
					$("#page_" + step).css("opacity", 1);
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", SwipeScreen.virtualwidth() * (-ration - 1));
					$("#page_" + step).css("opacity", 1);
				}
			}
		}
	}]);

	return SwipeBook;
}();