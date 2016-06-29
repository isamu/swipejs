class SwipeElement {

    constructor (info, css_id) {
	this.info = info;

	this.x = 0;
	this.y = 0;

	if (info["pos"]) {
	    this.x = info["pos"][0];
	    this.y = info["pos"][1];
	} else {
	    if (info["x"]){
		this.x = info["x"];
	    }
	    if (info["y"]){
		this.y = info["y"];
	    }
	}

	if (info["size"]) {
	    this.w = info["size"][0];
	    this.h = info["size"][1];
	} else {
	    if (info["w"]){
		this.w = info["w"];
	    } else {
		this.w = $("#" + css_id).attr("__default_width");
	    }
	    if (info["h"]){
		console.log("AAA1");
		this.h = info["h"];
	    } else {
		console.log("AAA2");
		console.log($("#" + css_id).attr("__default_height"));
		this.h = $("#" + css_id).attr("__default_height");
	    }
	}

	this.opacity = 1.0;
	// console.log(info["to"]);

	if(info["to"] && (info["to"]["opacity"] != null) ){
	    this.opacity = info["to"]["opacity"];
	} else if (info["opacity"] != null) {
	    this.opacity = info["opacity"];
	}
    }

    resourceUrl(){
	if (this.urls != null) {
	    return this.urls;
	}
	
    }
    
}
