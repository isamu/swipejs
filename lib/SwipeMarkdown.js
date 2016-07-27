"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeMarkdown = function () {
	function SwipeMarkdown(info) {
		_classCallCheck(this, SwipeMarkdown);

		this.info = info;

		this.setMdStyle();
		if (this.info["styles"]) {
			// not well
			this.md_style = $.extend(true, this.md_style, this.info["styles"]);
		}
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
				if (instance.prefixes(style)) {
					body = instance.prefixes(style) + body;
				}

				htmls.push(instance.conv_html(body, css_prefix, elem_index));
				csses.push(instance.conv_css(style));
			});

			return [htmls.join(""), csses];
		}
	}, {
		key: "conv_html",
		value: function conv_html(body, css_prefix, index) {
			var text = body.replace(/\s/g, '&nbsp;');
			return "<div class='markdown_line' id='" + css_prefix + "-" + index + "'>" + text + "</div>";
		}
	}, {
		key: "conv_css",
		value: function conv_css(style) {
			var my_style = this.md_style[style];
			var fontSize = 10;
			var lineHeight = 10;
			var fontname = "";
			var textAlign = "left";
			var info = {};

			if (my_style) {
				if (my_style["font"]) {
					if (my_style["font"]["name"]) {
						fontname = SwipeParser.parseFontName(my_style["font"], true);
					}
					if (my_style["font"]["size"]) {
						fontSize = SwipeParser.parseFontSize(my_style["font"], SwipeScreen.swipeheight(), 10, true);
						lineHeight = fontSize;
					}
				}
				if (my_style["alignment"]) {
					textAlign = my_style["alignment"];
				}
				if (my_style["spacing"]) {
					lineHeight = lineHeight + SwipeParser.parseSize(my_style["spacing"], SwipeScreen.swipeheight(), 0);
				}
			}

			return {
				position: "relative",
				"font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
				"line-height": String(SwipeScreen.virtualY(lineHeight)) + "px",
				"font-family": fontname,
				"textAlign": textAlign,
				"color": SwipeParser.parseColor(my_style, "#000")
			};
		}
	}, {
		key: "setMdStyle",
		value: function setMdStyle() {
			var _md_style;

			this.md_style = (_md_style = {
				"###": { "color": "#800", "font": { "size": "4%", "name": "Helvetica" } },
				"#": { "font": { "size": 32 }, "spacing": 16 },
				"##": { "font": { "size": 28 }, "spacing": 14 }
			}, _defineProperty(_md_style, "###", { "font": { "size": 24 }, "spacing": 12 }), _defineProperty(_md_style, "####", { "font": { "size": 22 }, "spacing": 10 }), _defineProperty(_md_style, "*", { "font": { "size": 20 }, "spacing": 10 }), _defineProperty(_md_style, "-", { "font": { "size": 20 }, "spacing": 5 }), _defineProperty(_md_style, "```", { "font": { "size": 14, "name": "Courier" }, "spacing": 0 }), _defineProperty(_md_style, "```+", { "font": { "size": 7, "name": "Courier" }, "spacing": 0 }), _md_style);
		}
	}, {
		key: "getMdStyle",
		value: function getMdStyle() {
			return this.md_style;
		}
	}, {
		key: "getMdSymbol",
		value: function getMdSymbol(element) {
			var md_style = this.getMdStyle();
			var words = element.split(" ");

			if (words.length > 1 && md_style[words[0]]) {
				var symbol = words.shift();
				return [symbol, words.join(" ")];
			}
			return ["*", element];
		}
	}, {
		key: "prefixes",
		value: function prefixes(style) {
			var my_style = this.md_style[style];
			if (my_style && my_style["prefix"]) {
				return my_style["prefix"];
			}

			var arr = {
				"-": "• ", // bullet (U+2022), http://graphemica.com/%E2%80%A2
				"```": " "
			};
			if (style) {
				if (arr.hasOwnProperty(style)) {
					return arr[style];
				}
			}
			return null;
		}
	}]);

	return SwipeMarkdown;
}();