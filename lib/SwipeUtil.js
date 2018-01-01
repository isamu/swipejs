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