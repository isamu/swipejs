"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeParser = function () {
			function SwipeParser() {
						var _handlers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

						_classCallCheck(this, SwipeParser);
			}

			_createClass(SwipeParser, null, [{
						key: "parseColor",
						value: function parseColor(info, defaultColor) {
									if (info && info["color"]) {
												return info["color"];
									}
									if (info && info["textColor"]) {
												return info["textColor"];
									}
									return defaultColor;
						}
			}, {
						key: "transformedPath",
						value: function transformedPath() {
									// not implement
						}
			}, {
						key: "parseTransform",
						value: function parseTransform() {
									// not implement
						}
			}, {
						key: "is",
						value: function is(type, obj) {
									var clas = Object.prototype.toString.call(obj).slice(8, -1);
									return obj !== undefined && obj !== null && clas === type;
						}
			}, {
						key: "inheritProperties",
						value: function inheritProperties(obj, tempObj) {
									var ret = SwipeParser.clone(obj);
									var idMap = {};
									if (tempObj) {
												var tempClone = SwipeParser.clone(tempObj);
												$.each(tempClone, function (keyString, tempValue) {
															var ret_val = SwipeParser.clone(tempValue);

															if (ret[keyString] == null) {
																		ret[keyString] = ret_val;
															} else {
																		if (SwipeParser.is("Array", ret[keyString]) && ret[keyString].length > 0 && SwipeParser.is("Object", ret[keyString][0]) || SwipeParser.is("Object", ret[keyString])) {
																					if (SwipeParser.is("Number", ret_val) || SwipeParser.is("String", ret_val)) {
																								ret[keyString] = ret_val;
																					} else {
																								idMap = {};

																								$.each(ret_val, function (index, tempItem) {
																											if (SwipeParser.is("String", tempItem["id"])) {
																														idMap[tempItem["id"]] = index;
																											}
																								});
																								ret[keyString].forEach(function (objItem, key) {
																											if (SwipeParser.is("String", objItem["id"]) && (key = idMap[objItem["id"]]) != null) {

																														ret_val[key] = SwipeParser.inheritProperties(objItem, ret_val[key]);
																											} else {
																														ret_val.push(objItem);
																											}
																								});
																								ret[keyString] = ret_val;
																					}
																		}
															}
												});
									}
									return ret;
						}
			}, {
						key: "localizedStringForKey",
						value: function localizedStringForKey(key) {
									// todo from page element
									var pageinfo = {};

									var strings;
									if (strings = pageinfo["strings"]) {
												var text = strings[key];
												// todo localize
												return SwipeParser.localizedString(text, "ja");
									}
									return "";
						}
			}, {
						key: "localizedString",
						value: function localizedString(params, langId) {
									if (params[langId]) {
												return params[langId];
									} else {
												return params["*"];
									}
									return "";
						}
			}, {
						key: "parseFontSize",
						value: function parseFontSize(info, full, defaultValue, markdown) {
									var key = markdown ? "size" : "fontSize";

									if (info[key]) {
												return SwipeParser.parseSize(info[key], full, defaultValue);
									}
									return defaultValue;
						}
			}, {
						key: "parseSize",
						value: function parseSize(value, full, defaultValue) {
									if (Number.isInteger(value)) {
												return value;
									}
									if (isFinite(value)) {
												return value;
									}
									return SwipeParser.parsePercent(value, full, defaultValue);
						}
			}, {
						key: "parsePercent",
						value: function parsePercent(value, full, defaultValue) {
									var reg = /^([0-9][0-9\\.]*)%$/;
									var match = value.match(reg);
									if (match) {
												return Math.floor(match[1]) / 100 * full;
									}
									return defaultValue;
						}
			}, {
						key: "parseFontName",
						value: function parseFontName(value, markdown) {
									var key = markdown ? "name" : "fontName";
									if (value) {
												var name = value[key];
												if (jQuery.type(name) === "string") {
															return name;
												} else if (jQuery.type(name) === "array") {
															return name.join(",");
												}
									}
									return "sans-serif, Helvetica";
									// return [];
						}
			}, {
						key: "parseShadow",
						value: function parseShadow(info) {
									var scale = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

									var x = SwipeParser.parseSize((info["offset"] || [])[0], SwipeScreen.swipeheight(), 1) * scale;
									x = SwipeScreen.virtualX(x);
									var y = SwipeParser.parseSize((info["offset"] || [])[1], SwipeScreen.swipewidth(), 1) * scale;
									y = SwipeScreen.virtualY(y);

									var color = info["color"] || "black";

									return x + "px " + y + "px 3px " + color;
						}
			}, {
						key: "clone",
						value: function clone(obj) {
									var copy;

									// Handle the 3 simple types, and null or undefined
									if (null == obj || "Object" != typeof obj) return obj;

									// Handle Date
									if (obj instanceof Date) {
												copy = new Date();
												copy.setTime(obj.getTime());
												return copy;
									}

									// Handle Array
									if (obj instanceof Array) {
												copy = [];
												for (var i = 0, len = obj.length; i < len; i++) {
															copy[i] = SwipeParser.clone(obj[i]);
												}
												return copy;
									}

									// Handle Object
									if (obj instanceof Object) {
												copy = {};
												for (var attr in obj) {
															if (obj.hasOwnProperty(attr)) copy[attr] = SwipeParser.clone(obj[attr]);
												}
												return copy;
									}

									throw new Error("Unable to copy obj! Its type isn't supported.");
						}
			}]);

			return SwipeParser;
}();