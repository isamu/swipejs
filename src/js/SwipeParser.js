export default class SwipeParser {
  constructor (_handlers = {}) {
  }

  static parseColor(info, defaultColor){
	  if (info && info["color"]) {
	    return info["color"];
	  }
	  if (info && info["textColor"]) {
	    return info["textColor"];
	  }
	  return defaultColor;
  }

  static transformedPath() {
	  // not implement
  }

  static parseTransform() {
	  // not implement
  }
  
  static is(type, obj) {
	  var clas = Object.prototype.toString.call(obj).slice(8, -1);
	  return obj !== undefined && obj !== null && clas === type;
  }

  static inheritProperties(obj, tempObj) {
	  var ret = SwipeParser.clone(obj);
	  var idMap = {};
	  if (tempObj){
	    var tempClone = SwipeParser.clone(tempObj);
      for (let keyString in tempClone) {
        const tempValue = tempClone[keyString];
	      // $.each(tempClone, (keyString, tempValue) => {
		    var ret_val = SwipeParser.clone(tempValue);

		    if (ret[keyString] == null){
		      ret[keyString] = ret_val;
		    } else {
 		      if ((SwipeParser.is("Array", ret[keyString]) && SwipeParser.is("Array", ret_val))) {
			      idMap = {};

			      // $.each(ret_val, (index, tempItem) => {
            for (let index in ret_val) {
              const tempItem = ret_val[index];
			        if (SwipeParser.is("String", tempItem["id"])) {
				        idMap[tempItem["id"]] = index;
			        }
			      }
			      ret[keyString].forEach((objItem, key) => {
			        if ((SwipeParser.is("String", objItem["id"]) && ((key = idMap[objItem["id"]]) != null))) {
				        ret_val[key] = SwipeParser.inheritProperties(objItem, ret_val[key]);
			        } else {
				        ret_val.push(objItem);
			        }
			      });
			      ret[keyString] = ret_val;
		      }
		    }
	    }
	  }
	  return ret;
  }

  static localizedStringForKey(key) {
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
  static localizedString(params, langId) {
	  if (params[langId]) {
	    return params[langId];
	  } else {
	    return params["*"];
	  }
	  return "";
  }

  static parseFontSize(info, full, defaultValue, markdown) {
    let key = markdown ? "size" : "fontSize";

	  if (info[key]) {
      return SwipeParser.parseSize(info[key], full, defaultValue);
	  }
    return defaultValue;
  }
  static parseSize(value, full, defaultValue) {
	  if (Number.isInteger(value)) {
	    return value;
	  }
	  if (isFinite(value)) {
      return value;
    }
    return SwipeParser.parsePercent(value, full, defaultValue);
  }
  static parsePercent(value, full, defaultValue) {
	  let reg = /^([0-9][0-9\\.]*)%$/;
	  let match = value.match(reg);
	  if (match) {
	    return Math.floor(match[1]) / 100 * full;
	  }
    return defaultValue;
  }
  static parseFontName(value, markdown) {
    let key = markdown ? "name" : "fontName";
	  if (value) {
	    let name = value[key];
	    if (jQuery.type(name) === "string") {
		    return name;
	    } else if (jQuery.type(name) === "array") {
		    return name.join(",");
      }
	  }
    return "sans-serif, Helvetica"
    // return [];
  }
  
  static parseShadow(info, scale = 1) {
	  let x = SwipeParser.parseSize((info["offset"]||[])[0], SwipeScreen.swipeheight(),  1) * scale;
	  x = SwipeScreen.virtualX(x);
	  let y = SwipeParser.parseSize((info["offset"]||[])[1], SwipeScreen.swipewidth(), 1) * scale;
	  y = SwipeScreen.virtualY(y);

	  let color = info["color"] || "black";
	  
	  return x + "px " + y + "px 3px "+ color;
  }

  static clone(obj) {
	  var copy;
	  
	  // Handle the 3 simple types, and null or undefined
	  if (null == obj || "object" != typeof obj) return obj;
	  
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
}
