"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeScroll = function () {
			function SwipeScroll() {
						_classCallCheck(this, SwipeScroll);
			}

			_createClass(SwipeScroll, null, [{
						key: "init",
						value: function init(size) {
									this.size = size;
									this.functions = [];
									this.step = 0;
									this.step_next = 0;

									$(".swipe").width("100%");
									$(".swipe").height($(window).innerHeight());
									$(".swipe").css({ position: "fixed" });
									$(".back").height($(".swipe").innerHeight() * size + "px");
						}
			}, {
						key: "callback",
						value: function callback(func) {
									this.functions.push(func);
						}
			}, {
						key: "call_callback",
						value: function call_callback(index, delta, status) {
									this.functions.forEach(function (obj, idx) {
												obj(index, delta, status);
									});
						}
			}, {
						key: "scrollStart",
						value: function scrollStart() {}
			}, {
						key: "scrollStop",
						value: function scrollStop(e) {
									if (this.step == this.step_next) {
												if (!SwipeScroll.near()) {
															if ($(window).scrollTop() > $(window).innerHeight() * this.step) {
																		this.step_next = this.step_next + 1;
															} else {
																		this.step_next = this.step_next - 1;
															}
															if (this.step_next < 0) {
																		this.step_next = 0;
															}
															if (this.step_next >= this.size) {
																		this.step_next = this.size - 1;
															}
															SwipeScroll.near_or_move();
												}
									} else {
												SwipeScroll.near_or_move();
									}
									$(".swipe").html(this.step);
						}
			}, {
						key: "near_or_move",
						value: function near_or_move() {
									if (SwipeScroll.near()) {
												this.step = this.step_next;
									} else {
												$(window).scrollTop(this.step_next * $(window).innerHeight());
									}
						}
			}, {
						key: "near",
						value: function near() {
									if ($(window).scrollTop() < this.step_next * $(window).innerHeight() + 5 && $(window).scrollTop() > this.step_next * $(window).innerHeight() - 5) {
												return true;
									}
									return false;
						}
			}, {
						key: "scroll",
						value: function scroll(e) {}
			}, {
						key: "getStep",
						value: function getStep() {
									return this.step;
						}
			}, {
						key: "watch",
						value: function watch() {
									$(window).on("scrollstart", function () {
												console.log('scrollstart');
												SwipeScroll.scrollStart();
												SwipeScroll.call_callback(SwipeScroll.getStep(), 0, "start");
									}).on("scrollstop", function (e) {
												console.log('scrollstop');
												SwipeScroll.scrollStop(e);
												SwipeScroll.call_callback(SwipeScroll.getStep(), 0, "stop");
									}).on("scroll", function (e) {
												console.log('scroll');
												SwipeScroll.scroll();
												SwipeScroll.call_callback(SwipeScroll.getStep(), 0, "scroll");
									});
						}
			}]);

			return SwipeScroll;
}();