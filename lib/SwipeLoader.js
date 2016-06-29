"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeLoader = function () {
			function SwipeLoader(data) {
						_classCallCheck(this, SwipeLoader);

						this.data = data;
						this.pages = [];
						this.load();
						this.domLoad();
						this.step = 0;
			}

			_createClass(SwipeLoader, [{
						key: "load",
						value: function load() {
									var _this = this;

									var scene_name = this.data["pages"][0]["scene"];
									var scene_index = 0;
									var page_index = 0;

									$.each(this.data["pages"], function (index, page) {
												var scene;
												if (page["scene"] && (scene = _this.data["scenes"][page["scene"]])) {
															page = SwipeParser.inheritProperties(page, scene);
												}
												if (scene_name != page["scene"]) {
															scene_index += 1;
															scene_name = page["scene"];
															page_index = 0;
												}
												page["scene_index"] = scene_index;
												page["page_index"] = page_index;
												page_index += 1;
												_this.pages.push(page);
									});
						}
			}, {
						key: "domLoad",
						value: function domLoad() {
									var pages = [];
									var instance = this;
									console.log(this.pages);
									this.pages.forEach(function (page, page_index) {
												var elems = [];

												page["elements"].forEach(function (element, elem_index) {
															elems.push(instance.elementLoad(element));
												});

												elems = Array.prototype.concat.apply([], elems);

												// todo snbinder
												var page_html = "<div id='page_" + page_index + "'>" + elems.join("<br/>") + "</div>";

												pages.push(page_html);
									});

									$(".swipe").html(pages.join(""));
									for (var i = 1; i < this.pages.length; i++) {
												$("#page_" + i).hide();
									}
						}
			}, {
						key: "elementLoad",
						value: function elementLoad(element) {
									var ret = [];
									var instance = this;

									ret.push(this.element2html(element));
									if (element["elements"]) {
												element["elements"].forEach(function (elem, elem_index) {
															ret.push(instance.elementLoad(elem));
												});
									}
									return ret;
						}
			}, {
						key: "element2html",
						value: function element2html(element) {
									if (element.img) {
												return "<img src='" + element.img + "' class='element'/>";
									} else {
												return "";
									}
						}
			}, {
						key: "steps",
						value: function steps() {}
			}, {
						key: "next",
						value: function next() {
									this.show(this.step + 1);
						}
			}, {
						key: "show",
						value: function show(step) {
									$("#page_" + this.step).hide();
									$("#page_" + step).show();
									this.step = step;
						}
			}]);

			return SwipeLoader;
}();