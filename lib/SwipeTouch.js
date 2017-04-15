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