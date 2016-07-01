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

									SwipeScreen.init(this.data.dimension[0], this.data.dimension[1]);

									$.each(this.data["pages"], function (index, page) {
												var scene = null;
												if (page["scene"] && (scene = _this.data["scenes"][page["scene"]])) {
															scene = _this.data["scenes"][page["scene"]];
												}
												var page_instance = new SwipePage(page, scene, index);

												/*
            if (scene_name != page["scene"]) {
            scene_index += 1;
            scene_name = page["scene"];
            page_index = 0;
            }
            page["scene_index"] = scene_index;
            page["page_index"] = page_index;	
            page_index += 1;
            */

												_this.pages.push(page_instance);
									});
						}
			}, {
						key: "domLoad",
						value: function domLoad() {
									var pages = [];
									var instance = this;
									this.pages.forEach(function (page, page_index) {
												page.loadElement();

												// todo snbinder
												var page_html = "<div id='page_" + page_index + "' class='page'>" + page.getHtml() + "</div>";

												pages.push(page_html);
									});

									$(".swipe").html(pages.join(""));

									// hide page
									for (var i = 1; i < this.pages.length; i++) {
												$("#page_" + i).css("opacity", 0);
									}

									$(".element").load(function () {
												$(this).attr("__default_width", $(this).width());
												$(this).attr("__default_height", $(this).height());
												instance.initData($(this).attr("__page_id"), $(this).attr("__element_id"));
									});

									$(".page").css({ "position": "absolute" });
									$(".boxelement").each(function (index, element) {
												instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));
									});
									// add load event
						}
			}, {
						key: "steps",
						value: function steps() {}
			}, {
						key: "initData",
						value: function initData(page_id, element_id) {
									this.pages[page_id].initElement(element_id);
						}
			}, {
						key: "next",
						value: function next() {
									this.show(this.step + 1);
						}
			}, {
						key: "show",
						value: function show(step) {
									this.pages[step].show();
									if (this.pages[step].getScene() == this.pages[this.step].getScene()) {
												$("#page_" + this.step).css("opacity", 0);
												$("#page_" + step).css("opacity", 1);
									} else {
												$("#page_" + this.step).animate({
															"opacity": 0
												}, {
															duration: 500
												});
												this.pageSlideIn(step);
									}
									this.step = step;
									location.hash = this.step;
						}
			}, {
						key: "getStep",
						value: function getStep() {
									return this.step;
						}
			}, {
						key: "pageSlideIn",
						value: function pageSlideIn(step) {
									$(".boxelement-" + step).each(function (index, element) {
												var org_top = parseInt($(element).css("top"));
												var from_top = org_top + SwipeScreen.virtualheight();

												$(element).css("top", from_top);
												$(element).animate({
															"top": org_top
												}, {
															duration: 500
												});
									});

									$("#page_" + step).css("top", SwipeScreen.virtualheight());
									$("#page_" + step).css("opacity", 1);
									$("#page_" + step).animate({
												"top": 0
									}, {
												duration: 500
									});
						}
			}]);

			return SwipeLoader;
}();