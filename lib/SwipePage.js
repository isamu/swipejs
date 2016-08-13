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
						this.duration = this.page["duration"] ? this.page["duration"] * 1000 : 500;
						this.bc = this.page["bc"] || "#ffffff";
						this.transition = this.page["transition"] || "scroll";
			}

			_createClass(SwipePage, [{
						key: "loadElement",
						value: function loadElement() {
									var instance = this;
									var elems = [];
									this.page["elements"].forEach(function (element, elem_index) {
												instance.elements.push(new SwipeElement(element, instance.index, elem_index));
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
						key: "show",
						value: function show(duration) {
									var instance = this;
									this.elements.forEach(function (element, elem_index) {
												element.show(instance.duration);
									});

									setTimeout(function () {
												instance.speech(instance);
									}, this.duration);
						}
			}, {
						key: "delayShow",
						value: function delayShow(duration) {
									var instance = this;
									this.elements.forEach(function (element, elem_index) {
												element.delayShow(instance.duration);
									});
									setTimeout(function () {
												instance.speech(instance);
									}, this.duration);
						}
			}, {
						key: "back",
						value: function back(duration) {
									var instance = this;
									this.elements.forEach(function (element, elem_index) {
												element.back(instance.duration);
									});
									setTimeout(function () {
												instance.speech(instance);
									}, this.duration);
						}
			}, {
						key: "finShow",
						value: function finShow(duration) {
									var instance = this;
									this.elements.forEach(function (element, elem_index) {
												element.finShow(instance.duration);
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
						value: function inactive(duration) {
									var instance = this;
									this.elements.forEach(function (element, elem_index) {
												element.inactive(instance.duration);
									});
						}
			}]);

			return SwipePage;
}();