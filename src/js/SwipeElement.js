class SwipeElement {

    constructor (info, page_id, element_id) {
	var css_id = "element-" + page_id + "-" + element_id;

	this.info = info;
	this.css_id = css_id;
	this.page_id = page_id;
	this.element_id = element_id;
	
	this.x = 0;
	this.y = 0;
    }

    initData() {
	var info = this.info;
	
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
		this.w = $("#" + this.css_id).attr("__default_width");
	    }
	    if (info["h"]){
		this.h = info["h"];
	    } else {
		this.h = $("#" + this.css_id).attr("__default_height");
	    }
	}

	this.opacity = 1.0;

	if(info["to"] && (info["to"]["opacity"] != null) ){
	    this.opacity = info["to"]["opacity"];
	} else if (info["opacity"] != null) {
	    this.opacity = info["opacity"];
	}

	this.setInitPos();
    }

    setInitPos(){
	var leftPosN = SwipeScreen.virtualX(this.x);
	var topPosN = SwipeScreen.virtualY(this.y);
	
	var widthN = SwipeScreen.virtualX(this.w);
	var heightN = SwipeScreen.virtualY(this.h);
	
	console.log(this.css_id);
	$("#" + this.css_id).css({
	    'left': leftPosN + 'px',
	    'top': topPosN + 'px',
	    'width': widthN + 'px',
	    'height': heightN + 'px',
	    'opacity' : this.opacity
	});
	
    }

    data() {
	return this.info;
    }

    html() {
	if (this.info.img) {
	    return "<img src='" + this.info.img + "' class='element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' />";
	} else {
	    return "";
	}
    }
    
}
