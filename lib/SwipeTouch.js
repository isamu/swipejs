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
									var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

									this.startY = 0;
									this.currentY = 0;
									this.diff = 0;
									this.ration = 0;
									this.options = options;
									this.status = "stop";

									var dom = options.dom ? options.dom : window;

									var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

									var self = this;
									$(window).on("scrollstart", function (e) {
												self.currentY = e.originalEvent.clientY;
												self.startY = e.originalEvent.clientY;
												SwipeTouch.start_event(e);
									}).on(scroll_event, function (e) {
												e.preventDefault();

												var delta = e.originalEvent.deltaY ? -e.originalEvent.deltaY : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -e.originalEvent.detail;
												self.currentY = self.currentY - delta;
												self.diff = self.currentY - self.startY;
												self.ration = self.diff / $(window).innerHeight();

												if (self.ration > 1) {
															self.ration = 1;
												}
												if (self.ration < -1) {
															self.ration = -1;
												}

												SwipeTouch.scroll_event_handler(e);
									}).on("scrollstop", function (e) {
												SwipeTouch.stop_event(e);
									}).on("touchstart", function (e) {
												self.startY = e.originalEvent.pageY;
												SwipeTouch.start_event(e);
									}).on('touchmove.noScroll', function (e) {
												e.preventDefault();

												self.diff = self.startY - e.originalEvent.pageY;
												self.ration = self.diff / $(window).innerHeight();

												SwipeTouch.scroll_event_handler(e);
									}).on("touchend", function (e) {
												self.diff = self.startY - e.originalEvent.pageY;
												SwipeTouch.stop_event(e);
									});
						}
			}, {
						key: 'scroll_event_handler',
						value: function scroll_event_handler(event) {
									console.log("scroll");
									this.status = "scroll";
									if (this.options.scroll_callback) {
												this.options.scroll_callback(event, this.ration);
									}
						}
			}, {
						key: 'stop_event',
						value: function stop_event(event) {
									console.log("stop");
									this.status = "stop";
									if (this.options.stop_callback) {
												this.options.stop_callback(event, this.ration);
									}
						}
			}, {
						key: 'getRation',
						value: function getRation() {
									return this.ration;
						}
			}, {
						key: 'setRation',
						value: function setRation(ration) {
									this.ration = ration;
						}
			}, {
						key: 'start_event',
						value: function start_event() {
									this.ration = 0;
									console.log("start");
									this.status = "start";
									if (this.options.start_callback) {
												this.options.start_callback(event, this.ration);
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