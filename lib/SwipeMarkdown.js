"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeMarkdown = function () {
			function SwipeMarkdown() {
						var _handlers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

						_classCallCheck(this, SwipeMarkdown);
			}

			_createClass(SwipeMarkdown, [{
						key: "parse",
						value: function parse(element, css_prefix) {
									var instance = this;
									var fCode = false;
									var prepared = element.map(function (element, elem_index) {
												if (element === '```') {
															fCode = !fCode;
															return fCode ? [null, ""] : ["```+", ""];
												} else if (fCode) {
															return ["```", element];
												}
												return instance.getMdSymbol(element);
									});
									var htmls = [];
									var csses = [];
									prepared.forEach(function (element, elem_index) {
												var style = element[0];
												var body = element[1];
												if (instance.prefixes(element[0])) {
															body = instance.prefixes(element[0]) + body;
												}

												htmls.push(instance.conv_html(body, css_prefix, elem_index));
												csses.push(instance.conv_css(style));
									});

									return [htmls.join(""), csses];
						}
			}, {
						key: "conv_html",
						value: function conv_html(body, css_prefix, index) {
									return "<div class='markdown_line' id='" + css_prefix + "-" + index + "'>" + body + "</div>";
						}
			}, {
						key: "conv_css",
						value: function conv_css(style) {
									var fontSize = 10;
									var fontname = "";
									var textAlign = "center";
									var info = {};
									return {
												position: "relative",
												"font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
												"line-height": String(SwipeScreen.virtualY(fontSize)) + "px",
												"font-family": fontname,
												"textAlign": textAlign,
												"color": SwipeParser.parseColor(info, "#000")
									};
						}
			}, {
						key: "getMdSymbol",
						value: function getMdSymbol(element) {
									var md_attr = {
												"#": "1",
												"##": "2",
												"###": "3",
												"####": "4",
												"*": "5",
												"-": "6",
												"```": "7",
												"```+": "7"
									};

									var words = element.split(" ");

									if (words.length > 1 && md_attr[words[0]]) {
												var symbol = md_attr[words.shift()];
												return [symbol, words.join(" ")];
									}
									return ["*", element];
						}
			}, {
						key: "prefixes",
						value: function prefixes(param) {
									var arr = {
												"-": "• ", // bullet (U+2022), http://graphemica.com/%E2%80%A2
												"```": " "
									};
									if (param) {
												if (arr.hasOwnProperty(param)) {
															return arr[param];
												}
									}
									return null;
						}
			}]);

			return SwipeMarkdown;
}();