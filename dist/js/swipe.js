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
		var defaultPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var base_css_id = arguments[2];
		var back_css_id = arguments[3];

		_classCallCheck(this, SwipeBook);

		$('head').prepend('<meta name="viewport" content="width = 640,user-scalable=no">');

		this.first_touch = false;
		this.data = data;
		this.title = "Swipe";
		this.pages = [];
		this.base_css_id = base_css_id;
		this.back_css_id = back_css_id;
		this.media_player = SwipeMediaPlayer.getInstance();
		this.loaded_callback = null;
		this.start_callback = null;
		this.finish_callback = null;
		if (data["type"] == "net.swipe.list") {
			var html = [];
			this.data.items.forEach(function (item, item_index) {
				html.push('<li><a href="?file=' + item["url"] + '">' + item["title"] + '</li>');
			});
			$(base_css_id).html("<ul>" + html.join("") + "</ul>");
			this.setScreen();
		} else {
			$(base_css_id).html("");
			// 	"type":"net.swipe.swipe"
			this.step = defaultPage;

			SwipeBook.setTemplateElements(this.getTemplateElements());
			SwipeBook.setMarkdown(this.getMarkdown());
			this.templatePages = this.getTemplatePages();
			this.setScreen();
			this.paging = this.getPaging();
			this.isLoaded = {};
			this.isReady = false;
			this.isFinished = false;
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
			var _this = this;

			$.each(this.data["pages"], function (index, page) {
				var scene;
				if (page["scene"] && (scene = _this.templatePages[page["scene"]])) {
					scene = _this.templatePages[page["scene"]];
				}
				if (page["template"] && (scene = _this.templatePages[page["template"]])) {
					scene = _this.templatePages[page["template"]];
				} else if (_this.templatePages["*"]) {
					scene = _this.templatePages["*"];
				}
				var pageInstance = new SwipePage(page, scene, index);

				_this.pages.push(pageInstance);
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
				this.pages[i].resize();
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
		key: 'pageLoad',
		value: function pageLoad(page_index) {
			var instance = this;
			var page = this.pages[page_index];
			page.loadElement();

			if (this.loadingBasePage > page_index) {
				$(this.base_css_id).prepend(page.getHtml());
			} else {
				$(this.base_css_id).append(page.getHtml());
			}

			if (page_index == this.loadingBasePage) {
				$("#page_" + page_index).css("opacity", 1);
				page.active();
			} else {
				$("#page_" + page_index).css("opacity", 0);
			}
			var bc = page.getBc();
			$("#page_" + page_index).css({ "background-color": bc });

			$(".image_element_page_" + page_index).load(function () {

				$(this).attr("__default_width", $(this).width());
				$(this).attr("__default_height", $(this).height());

				$("#" + $(this).attr("__base_id")).attr("__default_width", $(this).width());
				$("#" + $(this).attr("__base_id")).attr("__default_height", $(this).height());

				instance.initData($(this).attr("__page_id"), $(this).attr("__element_id"));
				instance.counterDecrease();
			});

			$(".element_page_" + page_index).each(function (index, element) {
				instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));
				instance.counterDecrease();
			});

			$(".video_element_" + page_index).each(function (index, element) {
				var __element = instance.pages[$(element).attr("__page_id")].getElement($(element).attr("__element_id"));

				var player = new MediaElement($(element).attr("id") + "-video", {
					flashName: 'flashmediaelement.swf',
					loop: true,
					success: function success(mediaElement, domObject) {
						__element.setVideoElement = mediaElement;
					}
				});

				this.media_player = SwipeMediaPlayer.getInstance();
				var data = {
					media: player,
					canPlay: false,
					currentTime: 0,
					dom: $("#" + $(element).attr("id") + "-video")[0]
				};
				if (__element.videoStart) {
					data["videoStart"] = __element.videoStart;
				}
				if (__element.videoDuration) {
					data["videoDuration"] = __element.videoDuration;
				}
				this.media_player.page($(element).attr("__page_id")).push($(element).attr("id"), data);
				instance.counterDecrease();
			});
			this.checkAndUpdateNextPage();
		}
	}, {
		key: 'domLoad',
		value: function domLoad() {
			var instance = this;
			this.loadingPage = this.step;
			this.loadingBasePage = this.step;
			this.loadingPageOffset = 0;

			this.pageLoad(this.loadingPage);

			$("#debug").css({ position: "absolute", "z-index": 100 });
			this.setPageSize();
			this.updateCss();
		}
	}, {
		key: 'updateCss',
		value: function updateCss() {
			$(".page").css({ "position": "absolute" });
			$(".image_element").css({ "position": "absolute" });
			$(".image_box").css({ "position": "absolute" });
			$(".element_inner").css({
				"position": "relative",
				"height": "100%",
				"width": "inherit"
			});

			$(".video_element").css({ "position": "absolute" });
			$(".text_element").css({ "position": "absolute" });
			$(".svg_element").css({
				"position": "absolute"
			});
		}
	}, {
		key: 'nextLoadPage',
		value: function nextLoadPage() {
			if (this.pages[this.loadingBasePage + Math.abs(this.loadingPageOffset)] === undefined && this.pages[this.loadingBasePage - Math.abs(this.loadingPageOffset)] === undefined) {
				return null;
			}

			this.loadingPageOffset = this.loadingPageOffset * -1;
			if (this.loadingPageOffset > -1) {
				this.loadingPageOffset++;
			}

			if (this.pages[this.loadingBasePage + this.loadingPageOffset]) {
				this.loadingPage = this.loadingBasePage + this.loadingPageOffset;
				return this.loadingPage;
			}
			return this.nextLoadPage();
		}
	}, {
		key: 'counterDecrease',
		value: function counterDecrease() {
			SwipeCounter.decrease();
			$("#counter").html(SwipeCounter.getCounter());
			this.checkAndUpdateNextPage();
		}
	}, {
		key: 'checkAndUpdateNextPage',
		value: function checkAndUpdateNextPage() {
			if (SwipeCounter.getCounter() == 0) {
				if (this.loadingPage == this.step) {
					$("#loading").remove();
					this.show(this.step);
				}
				this.isLoaded[this.loadingPage] = true;

				var next_page = this.nextLoadPage();
				if (next_page !== null) {
					console.log("load ", next_page);
					this.pageLoad(next_page);
					this.setPageSize();
					this.updateCss();
				} else {
					this.loadFinish();
				}
			}
			console.log(SwipeCounter.getCounter());
		}
	}, {
		key: 'loadFinish',
		value: function loadFinish() {
			this.isReady = true;
			// $("#loading").remove();
			if (this.loaded_callback) {
				this.loaded_callback();
			}
		}
	}, {
		key: 'set_loaded_callback',
		value: function set_loaded_callback(func) {
			this.loaded_callback = func;
		}
	}, {
		key: 'set_start_callback',
		value: function set_start_callback(func) {
			this.start_callback = func;
			console.log(this.start_callback);
		}
	}, {
		key: 'set_finish_callback',
		value: function set_finish_callback(func) {
			this.finish_callback = func;
		}
	}, {
		key: 'initData',
		value: function initData(page_id, element_id) {
			this.pages[page_id].initElement(element_id);
		}
	}, {
		key: 'next',
		value: function next() {
			if (this.step === this.pages.length - 1) {
				this.isFinished = true;
				if (this.finish_callback) {
					this.finish_callback(true);
				}
			}
			if (this.isLoaded[this.step + 1]) {
				if (this.step < this.pages.length - 1) {
					this.show(this.step + 1);
				}
			}
		}
	}, {
		key: 'back',
		value: function back() {
			if (this.isLoaded[this.step - 1]) {
				if (this.step > 0) {
					this.show(this.step - 1);
					if (this.isFinished) {
						if (this.finish_callback) {
							this.finish_callback(false);
						}
						this.isFinished = false;
					}
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
		key: 'getPageSize',
		value: function getPageSize() {
			return this.pages.length;
		}
	}, {
		key: 'justShow',
		value: function justShow(step) {
			this.pages[step].justShow();
		}
	}, {
		key: 'nextAnimate',
		value: function nextAnimate(nextStep) {
			var play_style = this.pages[nextStep].getPlayStyle();

			var play = null;
			if (play_style == "auto") {
				this.pages[nextStep].delayShow();
			} else if (play_style == "scroll") {
				this.pages[nextStep].show();
			} else if (play_style == "always") {
				this.pages[nextStep].delayShow();
			} else if (play_style == "pause") {
				this.pages[nextStep].finShow();
			}
		}
	}, {
		key: 'prevAnimate',
		value: function prevAnimate(prevStep) {
			var play_style = this.pages[prevStep].getPlayStyle();

			var play = null;
			if (play_style == "auto") {
				this.pages[prevStep].finShow();
			} else if (play_style == "scroll") {
				this.pages[prevStep].show();
			} else if (play_style == "always") {
				this.pages[prevStep].delayShow();
			} else if (play_style == "pause") {
				this.pages[prevStep].finShow();
			}
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
			if (!this.first_touch && this.isReady) {
				this.media_player.load();
				this.first_touch = true;
				if (this.start_callback) {
					this.start_callback();
				}
			}
			var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();
			var currentTransition = this.pages[currentStep].getTransition();
			var nextTransition = this.pages[nextStep].getTransition();
			var instance = this;

			if (mode == "forward") {
				this.nextAnimate(nextStep);
				if (nextTransition == "fadeIn") {
					$("#page_" + nextStep).animate({ "opacity": 1 }, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (nextTransition == "replace") {
					$("#page_" + nextStep).css({ "opacity": 1 });
				} else if (nextTransition == "scroll") {
					this.pageSlide("in", nextStep);
				} else if (nextTransition == "slide") {
					this.pageSlideDown("in", nextStep, loaded);
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
				this.prevAnimate(nextStep);
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
				} else if (currentTransition == "slide") {
					this.pageSlideDown("back", currentStep, loaded);
				}
			}

			if (!loaded) {
				if (this.pages[nextStep].getPlayStyle() == "auto") {
					console.log("AUTO NEXT");
					this.media_player.play(nextStep);
				}
				if (this.pages[nextStep].getPlayStyle() == "scroll") {
					console.log("scroll NEXT");
					this.media_player.play(nextStep);
				}
			}
			if (loaded) {
				if (this.pages[currentStep].getPlayStyle() == "auto") {
					this.media_player.play(currentStep);
				}
			}
			this.step = nextStep;
			location.hash = nextStep;
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
	}, {
		key: 'pageSlideDown',
		value: function pageSlideDown(mode, step, loaded) {
			console.log("pageSlideDown");

			if (mode == "in") {
				$("#page_" + step).css({ "opacity": 0 });

				var paging = this.paging;
				setTimeout(function () {
					$("#page_" + step).css({ "opacity": 1 });
					if (paging == "vertical") {
						$("#page_" + step).css("height", 0);
						$("#page_" + step).animate({
							"height": SwipeScreen.virtualheight()
						}, {
							duration: SwipeBook.pageInDuration()
						});
						console.log("in vertical slide");
					} else if (paging == "leftToRight") {
						$("#page_" + step).css({ "left": 0, "width": 0 });
						$("#page_" + step).animate({
							"width": SwipeScreen.virtualwidth()
						}, {
							duration: SwipeBook.pageInDuration()
						});
					} else if (paging == "rightToLeft") {
						// not supported
					}
				}, loaded ? 300 : 0);
			} else if (mode == "back") {
				var option = {
					duration: SwipeBook.pageInDuration(),
					complete: function complete() {
						$("#page_" + step).css({ "opacity": 0 });
					}
				};
				if (this.paging == "vertical") {
					$("#page_" + step).css("height", SwipeScreen.virtualheight());
					setTimeout(function () {
						$("#page_" + step).animate({
							"height": 0
						}, {
							duration: SwipeBook.pageInDuration()
						});
					}, loaded ? 200 : 0);
					console.log("in_back vertical slide");
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css({ "left": 0, "width": SwipeScreen.virtualwidth() });
					$("#page_" + step).animate({
						"width": 0
					}, {
						duration: SwipeBook.pageInDuration()
					});
				} else if (this.paging == "rightToLeft") {
					// not supported
				}
				setTimeout(function () {
					$("#page_" + step).css("opacity", 0);
				}, SwipeBook.pageInDuration());
			}
		}
	}, {
		key: 'pageSlideDown2',
		value: function pageSlideDown2(mode, step, ratio) {
			console.log("pageSlideDown");
			if (mode == "in") {
				$("#page_" + step).css({ "opacity": 1 });
				if (this.paging == "vertical") {
					$("#page_" + step).css({ "top": 0, "height": SwipeScreen.virtualheight() * ratio });
					console.log("in vertical slide");
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css({ "left": 0, "width": SwipeScreen.virtualwidth() * ratio });
				} else if (this.paging == "rightToLeft") {
					// not supported
				}
			} else if (mode == "back") {
				if (this.paging == "vertical") {
					$("#page_" + step).css({ "top": 0, "height": SwipeScreen.virtualheight() * (1 + ratio) });
					console.log("in_back vertical slide");
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css({ "left": 0, "width": SwipeScreen.virtualwidth() * (1 + ratio) });
				} else if (this.paging == "rightToLeft") {
					// not supported
				}
			}
		}

		// scroll

	}, {
		key: 'view',
		value: function view(ratio) {
			var nextStep = this.step + (ratio > 0 ? 1 : -1);
			var currentStep = this.step;
			var mode = nextStep >= currentStep ? "forward" : "back";

			if (nextStep < 0 || nextStep >= this.pages.length) {
				return 0;
			}
			//this.pages[currentStep].inactive()
			//this.pages[nextStep].active();

			if (mode == "forward" && this.pages[nextStep].getPlayStyle() == "scroll") {
				// for video
				this.media_player.playing(ratio);
			}
			if (mode == "back" && this.pages[currentStep].getPlayStyle() == "scroll") {
				this.media_player.playing(ratio);
			}

			if (this.pages[nextStep].getPlayStyle() == "pause") {
				// for video
				this.pages[nextStep].pause();
			}

			var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();
			var currentTransition = this.pages[currentStep].getTransition();
			var nextTransition = this.pages[nextStep].getTransition();
			var instance = this;

			if (mode == "forward") {
				// transition 
				if (nextTransition == "fadeIn") {
					$("#page_" + nextStep).css({ "opacity": ratio });
				} else if (nextTransition == "replace") {
					$("#page_" + nextStep).css({ "opacity": 1 });
				} else if (nextTransition == "scroll") {
					this.pageSlide2("in", nextStep, ratio);
				} else if (nextTransition == "slide") {
					this.pageSlideDown2("in", nextStep, ratio);
				} else {
					console.log("wrong transition in step " + String(nextStep));
				}
			} else {
				// in case back
				console.log("back");
				// transition 
				if (nextTransition == "fadeIn") {
					$("#page_" + nextStep).css({ "opacity": Math.abs(ratio) });
				}

				if (currentTransition == "fadeIn") {
					$("#page_" + currentStep).css({ "opacity": 1 - Math.abs(ratio) });
				} else if (currentTransition == "scroll") {
					this.pageSlide2("in_back", currentStep, ratio);
				} else if (currentTransition == "slide") {
					this.pageSlideDown2("back", currentStep, ratio);
				}
			}
		}
	}, {
		key: 'nextStart',
		value: function nextStart(ratio) {
			if (!this.first_touch && this.isReady) {
				this.media_player.load();
				/*
     $("video").each(( video_index, video) => {
    // todo video
    video.load();
     });
    */
				if (this.start_callback) {
					this.start_callback();
				}
				this.first_touch = true;
			}

			if (this.step + 1 >= this.pages.length) {
				this.isFinished = true;
				if (this.finish_callback) {
					this.finish_callback(true);
				}
				return 0;
			}
			var nextPlayStyle = this.pages[this.step + 1].getPlayStyle();

			this.pages[this.step + 1].prevShow();
			if (nextPlayStyle == "scroll") {
				$("#page_" + String(this.step + 1)).css("opacity", 1);
				this.pages[this.step + 1].animateShow();
			}

			if (this.pages[this.step + 1].getPlayStyle() == "auto") {
				this.media_player.play(this.step + 1);
			}
			if (this.pages[this.step + 1].getPlayStyle() == "scroll") {
				this.media_player.play(this.step + 1);
			}
			if (this.pages[this.step + 1].getPlayStyle() == "always") {
				this.media_player.play(this.step + 1);
			}
			if (this.pages[this.step + 1].getPlayStyle() == "pause") {
				this.media_player.play(this.step + 1);
				// todo
			}
		}
	}, {
		key: 'nextHide',
		value: function nextHide() {
			var nextStep = this.step + 1;
			if (nextStep >= this.pages.length) {
				return 0;
			}
			$("#page_" + nextStep).css("opacity", 0);
			this.pages[nextStep].finShow();
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
			$("#page_" + nextStep).css("width", SwipeScreen.virtualwidth());
			$("#page_" + nextStep).css("height", SwipeScreen.virtualheight());

			var nextPlayStyle = this.pages[nextStep].getPlayStyle();

			if (nextPlayStyle == "scroll") {
				this.pages[nextStep].finShow();
			} else if (nextPlayStyle == "auto" || nextPlayStyle == "always") {
				this.pages[nextStep].show();
			}
			this.step = nextStep;
			location.hash = nextStep;
		}
	}, {
		key: 'prevStart',
		value: function prevStart(ratio) {
			console.log("prevStart");
			if (this.step <= 0) {
				return 0;
			}
			if (this.isFinished) {
				if (this.finish_callback) {
					this.finish_callback(false);
				}
				this.isFinished = false;
			}

			var prevPlayStyle = this.pages[this.step - 1].getPlayStyle();
			var currentPlayStyle = this.pages[this.step].getPlayStyle();

			$("#page_" + String(this.step - 1)).css("opacity", 1);
			if (prevPlayStyle == "always") {
				this.pages[this.step - 1].prevShow();
				this.media_player.play(this.step - 1);
			} else {
				this.pages[this.step - 1].finShow();
				this.media_player.setCurrent(this.step - 1);
			}
			if (currentPlayStyle == "scroll") {
				this.pages[this.step].finShow();
				this.pages[this.step].animateShowBack();
			}
		}
	}, {
		key: 'prevHide',
		value: function prevHide() {
			var nextStep = this.step - 1;
			if (nextStep < 0) {
				return 0;
			}
			$("#page_" + nextStep).css("opacity", 0);
			this.pages[nextStep].finShow();
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
			var nextPlayStyle = this.pages[nextStep].getPlayStyle();
			if (nextPlayStyle == "always") {
				this.pages[nextStep].show();
			} else {
				this.pages[nextStep].finShow();
			}
			this.step = nextStep;
			location.hash = nextStep;
		}
	}, {
		key: 'pageSlide2',
		value: function pageSlide2(mode, step, ratio) {
			if (mode == "in") {
				$("#page_" + step).css("opacity", 1);
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", SwipeScreen.virtualheight() * (1 - ratio));
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", SwipeScreen.virtualwidth() * (1 - ratio));
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", -SwipeScreen.virtualwidth());
					$("#page_" + step).animate({
						"left": 0
					}, {
						duration: SwipeBook.pageInDuration()
					});
				}
			} else if (mode == "in_back") {
				if (this.paging == "vertical") {
					$("#page_" + step).css("top", -SwipeScreen.virtualheight() * ratio);
				} else if (this.paging == "leftToRight") {
					$("#page_" + step).css("left", -SwipeScreen.virtualheight() * ratio);
					$("#page_" + step).css("opacity", 1);
				} else if (this.paging == "rightToLeft") {
					$("#page_" + step).css("left", SwipeScreen.virtualheight() * ratio);
					$("#page_" + step).css("opacity", 1);
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeElement = function () {
	function SwipeElement(info, page_id, element_id, play, duration) {
		var parent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

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
			if (!this.isPathRoot()) {
				var elements = [];
				if (Array.isArray(this.info["elements"])) {
					elements = this.info["elements"];
				} else {
					elements = [this.info["elements"]];
				}
				elements.forEach(function (element, elem_index) {
					var e_id = element_id + "-" + elem_index;
					instance.elements.push(new SwipeElement(element, page_id, e_id, play, duration, instance));
				});
			}
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
		key: "insertBr",
		value: function insertBr(text) {
			return text.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
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
				this.snap = Snap("#" + this.css_id + "_svg");
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
				this.setImageCss();
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
		key: "setImageCss",
		value: function setImageCss() {
			var div_ratio = this.w / this.h;
			var w = $("#" + this.css_id + "_image").attr("__default_width");
			var h = $("#" + this.css_id + "_image").attr("__default_height");
			var image_ratio = w / h;

			if (div_ratio < image_ratio) {
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
			if (this.info._pathRoot) {
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
			$("#" + this.css_id + "-video").css(this.convCssPos(data, true));
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
				if (this.info["textVertical"]) {
					$("#" + this.css_id).css(this.textVertical());
				}
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
			var top = x == "bottom" ? divHeight - containerHeight : 0;

			var ret_base = {
				top: String(SwipeScreen.virtualY(top)) + "px",
				position: "relative",
				"font-size": String(Math.round(fontSize)) + "px",
				"line-height": String(Math.round(Math.abs(fontSize * 1.5))) + "px",
				"font-family": String(fontname),
				"textAlign": textAlign,
				"color": this.conv_rgba2rgb(SwipeParser.parseColor(info, "#000"))

				// todo font size
			};if (x == "center") {
				ret_base = SwipeUtil.merge(ret_base, {
					"width": "inherit",
					"height": String(SwipeScreen.virtualY(divHeight)) + "px",
					"display": "table-cell",
					"vertical-align": "middle"
				});
			}
			return ret_base;
		}
	}, {
		key: "textVertical",
		value: function textVertical() {
			return {
				"-webkit-writing-mode": "vertical-rl",
				"-ms-writing-mode": "tb-rl",
				"writing-mode": "vertical-rl"
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
			var default_scale = [SwipeScreen.getRatio(), SwipeScreen.getRatio()];
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
						if (instance.isPath()) {
							$("#" + instance.css_id).css("overflow", "visible");
						}
					}
				});
				if (this.isText()) {
					if (instance.finText["font-family"]) {
						delete instance.finText["font-family"];
					}
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
				if (this.info["textVertical"]) {
					$("#" + this.css_id).css(this.textVertical());
				}
			}
			if (this.isPath()) {
				this.path.attr(this.finPath.path);
				this.path.attr({ fill: this.finPath.fill });
			}
		}

		// transform orders are rotate, scale.
		// path is not scale here

	}, {
		key: "animateTransform",
		value: function animateTransform(ratio) {
			var transform = [];

			if (this.angle != this.to_angle) {
				var angle = this.angle * (1 - ratio) + this.to_angle * ratio;
				transform.push("rotate(" + angle + "deg)");
			} else {
				transform.push("rotate(" + this.angle + "deg)");
			}

			if (!this.isPath() && !this.isText()) {
				if (this.scale != this.to_scale) {
					var scale = [this.scale[0] * (1 - ratio) + this.to_scale[0] * ratio, this.scale[1] * (1 - ratio) + this.to_scale[1] * ratio];
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
							if (instance.isPath()) {
								$("#" + instance.css_id).css("overflow", "visible");
							}
						}
					});
					if (instance.isVideo()) {
						$("#" + instance.css_id + "-video").animate(instance.convCssPos(instance.finPos), {
							duration: do_duration
						});
					}

					if (instance.isText()) {
						if (instance.finText["font-family"]) {
							delete instance.finText["font-family"];
						}
						$("#" + instance.css_id + "-body").animate(instance.finText, {
							duration: do_duration
						});
					}
					if (instance.isPath()) {
						var path = SwipeParser.clone(instance.finPath.path);
						delete path.stroke;
						instance.path.animate(path, do_duration);
						// todo this 
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
		value: function animateShow(ratio) {
			console.log("animateShow");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.animateShow(ratio);
				});
			}

			if (this.hasTo()) {

				var instance = this;

				$("#" + instance.css_id).animate(instance.convCssPos(instance.finPos), {
					duration: 100000000,
					step: function step(s) {
						if (SwipeUtil.getStatus() == "stop") {
							$(this).stop(0);
						}
					},
					easing: "swipe",
					progress: function progress(a, b) {
						instance.animateTransform(SwipeUtil.getRatio());
						if (instance.isPath()) {
							$("#" + instance.css_id).css("overflow", "visible");
						}
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
				// todo path.
				if (instance.isPath()) {
					var path = SwipeParser.clone(instance.finPath.path);
					delete path.stroke;
					instance.path.animate(path, 100000000, function (x, t, b, c, d) {
						return Math.abs(SwipeUtil.getRatio());
					}, function () {
						if (instance.prevPath.fill != instance.finPath.fill) {
							instance.path.attr({ fill: instance.finPath.fill });
						}
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
		value: function animateShowBack(ratio) {
			console.log("animateShowBack");
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.animateShowBack(ratio);
				});
			}

			if (this.hasTo()) {
				var instance = this;

				$("#" + instance.css_id).animate(instance.convCssPos(instance.prevPos), {
					duration: 100000000,
					step: function step(s) {
						if (SwipeTouch.getStatus() == "stop") {
							$(this).stop(0);
						}
					},
					easing: "swipe",
					progress: function progress(a, b) {
						instance.animateTransform(Math.abs(1 + SwipeUtil.getRatio()));
						if (instance.isPath()) {
							$("#" + instance.css_id).css("overflow", "visible");
						}
					}
				});
				if (this.isPath()) {
					var path = SwipeParser.clone(this.prevPath.path);
					delete path.stroke;
					this.path.animate(path, 100000000, function (x, t, b, c, d) {
						return Math.abs(SwipeUtil.getRatio());
					}, function () {
						if (this.prevPath.fill != this.finPath.fill) {
							this.path.attr({ fill: this.prevPath.fill });
						}
					});
				}
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
			if (this.isText()) {
				var w_org = ret[2];
				var h_org = ret[3];
				ret[2] = ret[2] * ret[6][0];
				ret[3] = ret[3] * ret[6][1];
				ret[0] = ret[0] - (ret[2] - w_org) / 2;
				ret[1] = ret[1] - (ret[3] - h_org) / 2;
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
			var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [1.0, 1.0];

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
			var skip_transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var ret = this.convBasicCssPos(data);
			var transform = [];

			var angle = data[4];
			if (isFinite(angle)) {
				transform.push("rotate(" + angle + "deg)");
			}
			// path is not apply default transform
			if (!this.isText() && !this.isPath() && !skip_transform) {
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
			} else if (this.info._pathRoot) {
				return "pathRoot";
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
		key: "isPathRoot",
		value: function isPathRoot() {
			return this.type() == "pathRoot";
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
				return "<div id='" + this.css_id + "' class='image_box'><div id='" + this.css_id + "_inner' class='element_inner'>" + "<img src='" + this.info.img + "' class='image_element image_element_page_" + this.page_id + "' id='" + this.css_id + "_image' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' __base_id='" + this.css_id + "' >" + child_html + "</img></div></div>";
			} else if (this.isSprite()) {
				return "<div id='" + this.css_id + "' class='image_box'><div id='" + this.css_id + "_inner' class='element_inner'>" + "<img src='" + this.info.sprite + "' class='image_element image_element_page_" + this.page_id + "' id='" + this.css_id + "_sprite' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' __base_id='" + this.css_id + "' >" + child_html + "</img></div></div>";
			} else if (this.isText()) {
				var attrs = this.defaultAttr('element text_element element_page_' + this.page_id);
				var attr_str = this.getAttrStr(attrs);

				return "<div " + attr_str + "><div id='" + this.css_id + "_inner' class='element_inner'>" + "<div class='text_body' id='" + this.css_id + "-body'><span>" + this.insertBr(this.parseText(this.info.text)) + child_html + "</span></div>" + "</div></div>";
			} else if (this.isMarkdown()) {
				var md_array = this.parseMarkdown(this.info.markdown);
				this.md_css = md_array[1];
				return "<div class='element markdown_element element_page_" + this.page_id + "'  id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + "<div id='" + this.css_id + "_inner' class='element_inner'><div class='markdown_wrap' id='md_" + this.css_id + "'>" + md_array[0] + child_html + "</div></div></div>";
			} else if (this.isVideo()) {
				var attrs = this.defaultAttr('element video_element element_page_' + this.page_id + ' video_element_' + this.page_id);
				var attr_str = this.getAttrStr(attrs);
				return "<div " + attr_str + "><div id='" + this.css_id + "_inner' class='element_inner'>" + "<video id='" + this.css_id + "-video'  webkit-playsinline playsinline muted><source type='video/mp4' src='" + this.info.video + "'  /></video>" + child_html + "</div></div>";
			} else if (this.isPathRoot()) {
				var elements = [];
				if (Array.isArray(this.info["elements"])) {
					elements = this.info["elements"];
				} else {
					elements = [this.info["elements"]];
				}
				var paths = this.swipe_to_path({ element: this.info, depth: 0 });
				return '<div id="' + this.css_id + '" __page_id="' + this.page_id + '" __element_id="' + this.element_id + '" class="element svg_element element_page_' + this.page_id + '"><div id="' + this.css_id + '_inner" class="element_inner"><svg id="' + this.css_id + '_svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">' + paths + '</svg></div></div>';
			} else if (this.isPath()) {
				return '<div id="' + this.css_id + '" __page_id="' + this.page_id + '" __element_id="' + this.element_id + '" class="element svg_element element_page_' + this.page_id + '"><div id="' + this.css_id + '_inner" class="element_inner"><svg id="' + this.css_id + '_svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"></svg></div></div>';
			} else if (this.isDiv()) {
				return "<div class='element boxelement-" + this.page_id + " element_page_" + this.page_id + "' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + child_html + "</div>";
			} else {
				return "";
			}
		}
		// from studio js 

	}, {
		key: "swipe_to_path",
		value: function swipe_to_path(props) {
			var element = props.element;
			var depth = props.depth;
			var instance = this;
			var scale = SwipeScreen.getRatio();

			var ret = "";
			if (Array.isArray(element)) {
				ret = element.map(function (elem) {
					return instance.swipe_to_path({ element: elem, scale: scale, depth: depth + 1 });
				});
			} else {
				if (element.elements) {
					if (Array.isArray(element.elements)) {
						ret = element.elements.map(function (elem) {
							return instance.swipe_to_path({ element: elem, scale: scale, depth: depth + 1 });
						});
					} else {
						ret = instance.swipe_to_path({ element: element.elements, scale: scale, depth: depth + 1 });
					}
				}
				if (element.path) {
					return "<path className='svgPath' d='" + element.path + "' stroke='" + this.strokeColor(element) + "' fill='" + this.fillColor(element) + "' strokeWidth='" + this.pathLine(element) + "' >" + ret + "</path>";
				}
			}

			if (depth === 0) {
				return "<g style='transform: scale(" + scale + ", " + scale + ")'>" + ret + "</g>";
			} else {
				return ret;
			}
		}
	}, {
		key: "strokeColor",
		value: function strokeColor(elem) {
			var color = elem.strokeColor ? elem.strokeColor : "black";
			return this.convRgba2rgb(color);
		}
	}, {
		key: "fillColor",
		value: function fillColor(elem) {
			var color = elem.fillColor ? elem.fillColor === "#0000" ? "none" : elem.fillColor : "none";
			return this.convRgba2rgb(color);
		}
	}, {
		key: "pathLine",
		value: function pathLine(elem) {
			return elem.lineWidth ? elem.lineWidth : 1;
		}
	}, {
		key: "convRgba2rgb",
		value: function convRgba2rgb(color) {
			if (color) {
				var match = color.match(/^(#\w{6})(\w{2})$/);
				if (match) {
					return match[1];
				}
			}
			return color;
		}
		// end from studio

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
		key: "resize",
		value: function resize() {
			if (this.elements) {
				this.elements.forEach(function (element, elem_index) {
					element.resize();
				});
			}
			if (this.isImage()) {
				this.setImageCss();
			}
			this.initAllData();
			if (this.isPath()) {
				this.prevPath = this.parsePath();
				this.finPath = this.parseFinPath();
			}
			// set md wrap
			this.markdown_position();
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
			var repeat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var wait_duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

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

			var target_id = "#" + instance.css_id + "_inner";
			setTimeout(function () {
				switch (data["style"]) {
					case "vibrate":
						var delta = instance.valueFrom(data, "delta", 10);
						var orgPos = instance.originalFinPos;
						var timing = duration / defaultRepeat / 4;
						$(target_id).animate({
							left: parseInt(SwipeScreen.virtualX(-delta)) + "px"
						}, {
							duration: timing,
							complete: function complete() {
								$(target_id).animate({
									left: parseInt(SwipeScreen.virtualX(delta)) + "px"
								}, {
									duration: timing * 2,
									complete: function complete() {
										$(target_id).animate({
											left: "0px"
										}, {
											duration: timing,
											complete: function complete() {
												repeat--;
												if (repeat > 0) {
													instance.loop(instance, repeat);
												} else if (instance.isRepeat && instance.isActive) {
													repeat = defaultRepeat;
													instance.loop(instance, repeat);
												}
											}
										});
									}
								});
							}
						});
						break;
					case "shift":
						var dir;
						var orgPos = instance.originalFinPos;
						switch (data["direction"]) {
							case "n":
								dir = { top: SwipeScreen.virtualY(-instance.h) + "px" };break;
							case "e":
								dir = { left: parseInt(SwipeScreen.virtualX(instance.w)) + "px" };break;
							case "w":
								dir = { left: parseInt(SwipeScreen.virtualX(-instance.w)) + "px" };break;
							default:
								dir = { top: SwipeScreen.virtualY(instance.h) + "px" };break;
						}
						var timing = duration / defaultRepeat;

						instance.setPrevPos();

						$(target_id).animate(dir, { duration: timing,
							complete: function complete() {
								$(target_id).animate(instance.convCssPos(orgPos), { duration: 0,
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
						$(target_id).css({ opacity: 1 });
						setTimeout(function () {
							$(target_id).css({ opacity: 0 });
							setTimeout(function () {
								$(target_id).css({ opacity: 1 });
								setTimeout(function () {
									instance.moreloop(instance, repeat, defaultRepeat);
								}, timing);
							}, timing * 2);
						}, timing);
						break;
					case "spin":
						console.log("spin");
						var timing = duration / defaultRepeat;
						$(target_id).rotate({
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
						$(target_id).rotate({
							angle: 0, animateTo: angle, duration: timing,
							callback: function callback() {
								$(target_id).rotate({
									angle: angle, animateTo: -angle, duration: timing * 2,
									callback: function callback() {
										$(target_id).rotate({
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
				"-": "\u2022 ", // bullet (U+2022), http://graphemica.com/%E2%80%A2
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
		value: function push(key, media) {
			if (!this.media[this.current_page]) {
				this.media[this.current_page] = {};
			}
			this.media[this.current_page][key] = media;
			return this;
		}
	}, {
		key: "setCurrent",
		value: function setCurrent() {
			var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (page) {
				this.current_page = page;
			}
			var instance = this;
			if (this.current_playing != this.current_page) {
				this.stop();
			}
			if (this.media[this.current_page]) {
				var page = this.media[this.current_page];
				Object.keys(page).forEach(function (key) {
					var data = page[key];
					var player = data.media;
					var duration = page[key] && page[key].videoDuration ? page[key].videoDuration : player.duration;
					var start = page[key] && page[key].videoStart ? page[key].videoStart : 0;
					var last = start + duration;
					player.setCurrentTime(last);
				});
			}
		}
	}, {
		key: "play",
		value: function play() {
			var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (page) {
				this.current_page = page;
			}
			var instance = this;
			if (this.current_playing != this.current_page) {
				this.stop();
				if (this.media[this.current_page]) {
					var page = this.media[this.current_page];
					Object.keys(page).forEach(function (key) {
						var data = page[key];
						var player = data.media;
						var start = 0;
						if (page[key] && page[key].videoStart) {
							start = page[key].videoStart;
							player.setCurrentTime(start);
						}
						if (data["canPlay"]) {
							player.currentTime = 0;
							player.play();
							player.addEventListener('ended', function () {
								instance.current_playing = null;
							});
						} else {
							data["waitPlay"] = true;
							instance.media[instance.current_page][key] = data;
						}
						if (page[key] && page[key].videoDuration) {
							var duration = page[key].videoDuration;
							setTimeout(function () {
								// accuracy of settimeout is not good. so I add  a second.
								if (player.currentTime + 1 > Number(start) + Number(duration)) {
									player.stop();
									instance.current_playing = null;
								}
							}, duration * 1000);
						}
					});
				}
				this.current_playing = this.current_page;
			}
			return this;
		}
	}, {
		key: "playing",
		value: function playing(ratio) {
			if (ratio < 0) {
				ratio = 1 + ratio;
			}
			var instance = this;
			if (this.media[this.current_page]) {
				var page = this.media[this.current_page];
				Object.keys(page).forEach(function (key) {
					var data = page[key];
					var player = data.media;
					var dom = page[key].dom;
					var start = start = page[key] && page[key].videoStart ? page[key].videoStart : 0;
					var duration = page[key] && page[key].videoDuration ? page[key].videoDuration : 1.0;

					var currentTime = start + ratio * duration;
					//player.setCurrentTime(currentTime);
					if (Math.abs(data["currentTime"] - currentTime) > 0.05) {
						dom.currentTime = currentTime;
						data["currentTime"] = currentTime;
						instance.media[instance.current_page][key] = data;
					}
				});
			}
		}
	}, {
		key: "load",
		value: function load() {
			var instance = this;
			Object.keys(this.media).forEach(function (key) {
				var page = instance.media[key];
				Object.keys(page).forEach(function (key2) {
					var data = page[key2];
					var player = page[key2].media;
					player.addEventListener('loadeddata', function () {
						if (instance.media[key][key2]["waitPlay"]) {
							player.play();
						}
						data["canPlay"] = true;
						instance.media[key][key2] = data;
					}, false);
					player.load();
				});
			});
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
				if (this.media[this.current_playing]) {
					var page = this.media[this.current_playing];
					Object.keys(page).forEach(function (key) {
						page[key].media.stop();
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
			if (this.page["elements"]) {
				this.page["elements"].forEach(function (element, elem_index) {
					instance.elements.push(new SwipeElement(element, instance.index, elem_index, instance.play_style, instance.duration));
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeParser = function () {
	function SwipeParser() {
		var _handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SwipeParser);
	}

	_createClass(SwipeParser, null, [{
		key: "parseColor",
		value: function parseColor(info, defaultColor) {
			if (info && info["color"]) {
				return info["color"];
			}
			if (info && info["textColor"]) {
				return info["textColor"];
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
						if (SwipeParser.is("Array", ret[keyString]) && SwipeParser.is("Array", ret_val)) {
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
			var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

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
		key: "getSize",
		value: function getSize() {
			if (this.size) {
				return this.size[1];
			} else {
				return 100;
			}
		}
	}, {
		key: "setSize",
		value: function setSize(size) {
			this.size = [size, size];
		}
	}, {
		key: "setSizes",
		value: function setSizes(width, height) {
			this.size = [width, height];
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
			var size = this.size || [100, 100];
			var real_ratio = this.window_width * this.size[0] / (this.window_height * this.size[1]);
			var virtual_ratio = this.width / this.height;
			this.ratio = 1.0;

			if (real_ratio / virtual_ratio >= 1) {
				this.virtual_height = $(window).height() * this.size[1] / 100;
				this.virtual_width = this.width / this.height * this.virtual_height;
			} else {
				this.virtual_width = $(window).width() * this.size[0] / 100;
				this.virtual_height = this.height / this.width * this.virtual_width;
			}
			this.ratio = this.virtual_width / this.width;
		}
	}, {
		key: "getRatio",
		value: function getRatio() {
			return this.ratio;
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeTouch = function () {
	function SwipeTouch() {
		_classCallCheck(this, SwipeTouch);
	}

	_createClass(SwipeTouch, null, [{
		key: 'init',
		value: function init() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.startY = 0;
			this.currentY = 0;
			this.diff = 0;
			this.ratio = 0;
			this.options = options;
			this.status = "stop";

			var dom = options.dom ? options.dom : window;

			var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

			var self = this;
			$(window).on("scrollstart", function (e) {
				var current = e.originalEvent.clientY ? e.originalEvent.clientY : event.changedTouches[0].pageY;

				self.currentY = current;
				self.startY = current;
				SwipeTouch.start_event(e);
				//$("#debug").html("start" + current);
			}).on(scroll_event, function (e) {
				e.preventDefault();

				var delta = e.originalEvent.deltaY ? -e.originalEvent.deltaY : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -e.originalEvent.detail;
				if (delta || delta === 0) {
					self.currentY = self.currentY - delta;
				} else {
					self.currentY = event.changedTouches[0].pageY;
				}
				//$("#debug").html("scroll" + self.currentY );
				self.diff = self.currentY - self.startY;
				self.ratio = self.diff / $(window).innerHeight();

				if (self.ratio > 1) {
					self.ratio = 1;
				}
				if (self.ratio < -1) {
					self.ratio = -1;
				}

				SwipeTouch.scroll_event_handler(e, self.ratio);
			}).on("scrollstop", function (e) {
				//$("#debug").html("scroll stop");
				SwipeTouch.stop_event(e);
			}).on("touchstart", function (e) {
				var current = e.originalEvent.clientY ? e.originalEvent.clientY : event.changedTouches[0].pageY;
				self.startY = current;
				SwipeTouch.start_event(e);
			}).on('touchmove.noScroll', function (e) {
				e.preventDefault();

				var current = e.originalEvent && e.originalEvent.pageY ? e.originalEvent.pageY : event.changedTouches[0].pageY;
				self.diff = self.startY - current;
				self.ratio = self.diff / $(window).innerHeight();
				//$("#debug").html("touchmove" + self.startY +":" + current );
				SwipeTouch.scroll_event_handler(e, self.ratio);
			}).on("touchend", function (e) {
				//$("#debug").html("touchend");
				SwipeTouch.stop_event(e);
			});
		}
	}, {
		key: 'scroll_event_handler',
		value: function scroll_event_handler(event, ratio) {
			console.log("scroll");
			this.status = "scroll";
			if (this.options.scroll_callback) {
				this.options.scroll_callback(event, ratio);
			}
		}
	}, {
		key: 'stop_event',
		value: function stop_event(event) {
			console.log("stop");
			this.status = "stop";
			if (this.options.stop_callback) {
				this.options.stop_callback(event, this.ratio);
			}
		}
	}, {
		key: 'getRatio',
		value: function getRatio() {
			return this.ratio;
		}
	}, {
		key: 'start_event',
		value: function start_event() {
			this.ratio = 0;
			console.log("start");
			this.status = "start";
			if (this.options.start_callback) {
				this.options.start_callback(event, this.ratio);
			}
		}
	}, {
		key: 'getStatus',
		value: function getStatus() {
			return this.status;
		}
	}]);

	return SwipeTouch;
}();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
		key: "reloadSwipe",
		value: function reloadSwipe(data, css_id, back_css_id) {
			var default_page = 0;

			if (location.hash) {
				// default_page = Number(location.hash.substr(1));
			}
			var swipe_book = new SwipeBook(data, default_page, css_id, back_css_id);
			this.swipe_book = swipe_book;
		}
	}, {
		key: "initSwipe",
		value: function initSwipe(data, css_id, back_css_id) {
			var skip_init = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

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
				var nextStep = Number(location.hash.substr(1));
				if ("#" + swipe_book.getStep() != location.hash) {
					if (swipe_book.getStep() > nextStep) {
						swipe_book.back();
					} else {
						swipe_book.next();
					}
					// swipe_book.show(Number(location.hash.substr(1)));
				}
			});

			$(window).resize(function () {
				clearTimeout(window.resizedFinished);
				window.resizedFinished = setTimeout(function () {
					swipe_book.resize();
				}, 250);
			});

			if (SwipeUtil.getParameterByName("autoplay") === "1") {
				var autoplayDuration = SwipeUtil.getParameterByName("autoplayDuration") || 1000;
				console.log("duatio " + autoplayDuration);
				var autoplay = function autoplay() {
					setTimeout(function () {
						swipe_book.next();
						var current = Number(location.hash.substr(1));
						console.log(swipe_book.getPageSize());
						if (swipe_book.getPageSize() > current + 1) {
							autoplay();
						} else if (SwipeUtil.getParameterByName("autoloop") === "1") {
							setTimeout(function () {
								swipe_book.show(0);
								autoplay();
							}, autoplayDuration);
						}
					}, autoplayDuration);
				};
				autoplay();
			}
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
	}, {
		key: "initTouchSwipe",
		value: function initTouchSwipe(data) {
			var css_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#swipe";
			var back_css_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#swipe_back";

			$(document.body).css({ "margin": 0, "padding": 0, "background-color": "#fff", "font-size": "26px" });
			$('div').css({ "margin": 0, "padding": 0, "background-color": "#fff", "font-size": "26px" });
			$(back_css_id).css({ "touch-action": "none" });

			var swipe_book = new SwipeBook(data, 0, css_id, back_css_id);
			this.swipe_book = swipe_book;
			this.ratio = null;
			$(window).resize(function () {
				clearTimeout(window.resizedFinished);
				window.resizedFinished = setTimeout(function () {
					swipe_book.resize();
				}, 250);
			});

			$.extend($.easing, {
				swipe: function swipe(x, t, b, c, d) {
					return Math.abs(SwipeUtil.getRatio());
				},
				swipeangle: function swipeangle(x, t, b, c, d) {
					return b + Math.abs(SwipeUtil.getRatio()) * c;
				}

			});

			SwipeTouch.init({
				start_callback: SwipeUtil.start_event,
				scroll_callback: SwipeUtil.scroll_event_handler,
				stop_callback: SwipeUtil.stop_event
			});
		}
	}, {
		key: "getRatio",
		value: function getRatio() {
			return this.ratio;
		}
	}, {
		key: "setRatio",
		value: function setRatio(ratio) {
			this.ratio = ratio;
		}
	}, {
		key: "getStatus",
		value: function getStatus() {
			return this.status;
		}
	}, {
		key: "setStatus",
		value: function setStatus(status) {
			this.status = status;
		}
	}, {
		key: "start_event",
		value: function start_event(event, ratio) {
			var swipe_book = SwipeUtil.getSwipeBook();
			if (SwipeUtil.getStatus() == "stopping") {
				SwipeUtil.stop();
			}
			this.ratio = 0;
			console.log("start ratio " + String(ratio));
			SwipeUtil.setStatus("start");
		}
	}, {
		key: "scroll_event_handler",
		value: function scroll_event_handler(event, ratio) {
			var currentStatus = "start";
			SwipeUtil.setRatio(ratio);
			if (ratio > 0) {
				currentStatus = "forward";
			}
			if (ratio < 0) {
				currentStatus = "back";
			}

			var swipe_book = SwipeUtil.getSwipeBook();
			if (currentStatus != SwipeUtil.getStatus()) {
				if (currentStatus == "forward") {
					if (SwipeUtil.getStatus() == "back") {
						swipe_book.prevHide();
					}
					swipe_book.nextStart(ratio);
				}
				if (currentStatus == "back") {
					if (SwipeUtil.getStatus() == "forward") {
						swipe_book.nextHide();
					}
					swipe_book.prevStart(ratio);
				}
				SwipeUtil.setStatus(currentStatus);
			}

			swipe_book.view(ratio);
		}
	}, {
		key: "stop_event",
		value: function stop_event(event, ratio) {
			SwipeUtil.setRatio(ratio);
			if (ratio > 0) {
				SwipeUtil.setStatus("stopping");
				SwipeUtil.go_ratio(0.03);
			} else {
				SwipeUtil.setStatus("stopping");
				SwipeUtil.go_ratio(-0.03);
			}
		}
	}, {
		key: "stop",
		value: function stop() {
			var swipe_book = SwipeUtil.getSwipeBook();
			SwipeUtil.setStatus("stop");
			if (this.ratio > 0) {
				SwipeUtil.setRatio(1);
				swipe_book.nextEnd();
			} else if (this.ratio < 0) {
				SwipeUtil.setRatio(-1);
				swipe_book.prevEnd();
			}
		}
	}, {
		key: "go_ratio",
		value: function go_ratio(delta) {
			if (SwipeUtil.getStatus() != "stopping") {
				return;
			}
			this.ratio = this.ratio + delta;

			var swipe_book = SwipeUtil.getSwipeBook();
			if (Math.abs(this.ratio) > 1) {
				SwipeUtil.stop();
			} else {
				var swipe_book = SwipeUtil.getSwipeBook();
				SwipeUtil.setRatio(this.ratio);
				swipe_book.view(this.ratio);

				setTimeout(function () {
					SwipeUtil.go_ratio(delta);
				}, 2);
			}
		}
	}, {
		key: "replaceObject",
		value: function replaceObject(obj, key, replace) {
			if (Array.isArray(obj)) {
				obj = obj.map(function (elem) {
					return SwipeUtil.replaceObject(elem, key, replace);
				});
				return obj;
			} else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj !== null) {
				Object.keys(obj).map(function (obj_key) {
					obj[obj_key] = SwipeUtil.replaceObject(obj[obj_key], key, replace);
				});
				return obj;
			} else if (obj === key) {
				return replace;
			} else {
				return obj;
			}
		}
	}]);

	return SwipeUtil;
}();