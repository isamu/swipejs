
class SwipeParser {
    constructor (_handlers = {}) {
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
	    $.each(tempClone, (keyString, tempValue) => {
		var ret_val = SwipeParser.clone(tempValue);

		if (ret[keyString] == null){
		    ret[keyString] = ret_val;
		} else if(ret[keyString] && ( SwipeParser.is("Array", ret[keyString]) || SwipeParser.is("object", ret[keyString])) ) {
		    idMap = {};

                    $.each(ret_val, (index, tempItem) => {
			if (SwipeParser.is("String", tempItem["id"])) {
			    idMap[tempItem["id"]] = index;
			}
		    });
		    ret[keyString].forEach((objItem, key) => {
			if ((SwipeParser.is("String", objItem["id"]) && ((key = idMap[objItem["id"]]) != null))) {
			    
			    ret_val[key] = SwipeParser.inheritProperties(objItem, ret_val[key]);
			} else {
			    ret_val.push(objItem);
			}
		    });
		    ret[keyString] = ret_val;
		}
	    });
	}
	return ret;
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
