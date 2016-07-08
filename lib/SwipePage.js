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
									return elems.join("");
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
						key: "show",
						value: function show(duration) {
									this.elements.forEach(function (element, elem_index) {
												element.show(duration);
									});

									var instance = this;
									setTimeout(function () {
												instance.speech(instance);
									}, duration);
						}
			}, {
						key: "delayShow",
						value: function delayShow(duration) {
									this.elements.forEach(function (element, elem_index) {
												element.delayShow(duration);
									});
									var instance = this;
									setTimeout(function () {
												instance.speech(instance);
									}, duration);
						}
			}, {
						key: "back",
						value: function back(duration) {
									this.elements.forEach(function (element, elem_index) {
												element.back(duration);
									});
									var instance = this;
									setTimeout(function () {
												instance.speech(instance);
									}, duration);
						}
			}, {
						key: "finShow",
						value: function finShow() {
									this.elements.forEach(function (element, elem_index) {
												element.finShow();
									});
						}
			}, {
						key: "getScene",
						value: function getScene() {
									return this.scene;
						}
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
									this.elements.forEach(function (element, elem_index) {
												element.inactive(duration);
									});
						}
			}]);

			return SwipePage;
}();