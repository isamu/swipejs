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
						value: function initSwipe(data, default_page, css_id) {
									var swipe_book = new SwipeBook(data, default_page, css_id);

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