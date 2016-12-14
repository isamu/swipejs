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
	}, {
		key: "initTouchSwipe",
		value: function initTouchSwipe(data) {
			$(document.body).css({ "margin": 0, "padding": 0, "background-color": "#fff", "font-size": "26px" });
			$('div').css({ "margin": 0, "padding": 0, "background-color": "#fff", "font-size": "26px" });

			var swipe_book = new SwipeBook(data, 0, "#swipe", "#swipe_back");
			this.swipe_book = swipe_book;

			$(window).resize(function () {
				clearTimeout(window.resizedFinished);
				window.resizedFinished = setTimeout(function () {
					swipe_book.resize();
				}, 250);
			});

			function scroll_event_handler(event, ration) {
				//show_status(event, ration);
				console.log(this.status);
				var currentStatus = null;
				if (ration > 0) {
					currentStatus = "forward";
				}
				if (ration < 0) {
					currentStatus = "back";
				}

				var swipe_book = SwipeUtil.getSwipeBook();
				if (currentStatus != this.status) {
					if (currentStatus == "forward") {
						swipe_book.nextStart(ration);
					}
					if (currentStatus = "back") {
						swipe_book.prevStart(ration);
					}
					this.status = currentStatus;
				}

				swipe_book.view(ration);
			}

			function stop_event(event, ration) {
				if (ration > 0) {
					go_ration(ration, 0.1);
					this.status = null;
				} else {
					go_ration(ration, -0.1);
					this.status = null;
				}
			}

			function go_ration(ration, delta) {
				ration = ration + delta;

				var swipe_book = SwipeUtil.getSwipeBook();
				SwipeTouch.setRation(ration);

				if (ration > 1) {
					ration = 1;
					swipe_book.nextEnd();
				} else if (ration < -1) {
					ration = -1;
					swipe_book.prevEnd();
				} else {
					var swipe_book = SwipeUtil.getSwipeBook();
					swipe_book.view(ration);

					setTimeout(function () {
						go_ration(ration, delta);
					}, 10);
				}
			}

			function start_event(event, ration) {
				var swipe_book = SwipeUtil.getSwipeBook();
				this.status = null;
			}

			$.extend($.easing, {
				swipe: function swipe(x, t, b, c, d) {
					return SwipeTouch.getRation();
				}
			});

			SwipeTouch.init({
				start_callback: start_event,
				scroll_callback: scroll_event_handler,
				stop_callback: stop_event
			});
		}
	}]);

	return SwipeUtil;
}();