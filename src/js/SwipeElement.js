class SwipeElement {

    constructor (info, page_id, element_id, parent=null) {
	var css_id = "element-" + page_id + "-" + element_id;

	this.info = info;
	this.css_id = css_id;
	this.page_id = page_id;
	this.element_id = element_id;
	this.parent = parent;
	
	this.x = 0;
	this.y = 0;

	this.elements = [];
	var instance = this;
	if (this.info["elements"]) {
	    this.info["elements"].forEach(function(element, elem_index){
		var e_id = element_id + "-" + elem_index;
		instance.elements.push(new SwipeElement(element, page_id, e_id, instance));
	    });
	}
    }

    initData(index) {
	if (index !== undefined) {
	    var indexes = index.split("-");
	    if (indexes.length == 1) {
		this.elements[index].initData();
	    } else {
		this.elements[indexes.shift()].initData(indexes.join("-"));
	    }
	    return;
	}
	
	var info = this.info;
	
	if (info["size"]) {
	    this.w = info["size"][0];
	    this.h = info["size"][1];
	} else {
	    if (info["w"]){
		this.w = info["w"];
	    } else {
		if (info.img) {
		    this.w = $("#" + this.css_id).attr("__default_width");
		} else {
		    this.w = SwipeScreen.virtualwidth();
		}
	    }
	    if (info["h"]){
		this.h = info["h"];
	    } else {
		if (info.img) {
		    this.h = $("#" + this.css_id).attr("__default_height");
		} else {
		    this.h = SwipeScreen.virtualheight();
		}
	    }
	}

	if (info["pos"]) {
	    this.x = info["pos"][0];
	    this.y = info["pos"][1];
	} else {
	    if (info["x"] == "right"){
		// todo if parent, this is parent size
		this.x = this.parentWidth() - this.w;
	    } else if (info["x"] == "left"){
		this.x = 0;
	    } else if (info["x"] == "center"){
		this.x = (this.parentWidth() - this.w) / 2.0;
	    } else if (info["x"]){
		this.x = info["x"];
	    }

	    if (info["y"] == "bottom"){
		this.y = this.parentHeight() - this.h;
	    } else if (info["y"] == "top"){
		this.y = 0;
	    } else if (info["y"] == "center"){
		this.y = (this.parentHeight() - this.h) / 2.0;
	    } else if (info["y"]){
		this.y = info["y"];
	    }
	}

	this.opacity = 1.0;

	if(info["to"] && (info["to"]["opacity"] != null) ){
	    this.opacity = info["to"]["opacity"];
	} else if (info["opacity"] != null) {
	    this.opacity = info["opacity"];
	}

	//this.setInitPos();
	this.setPrevPos();
	this.setFinPos();
    }

    getWidth() {
	if (this.w) {
	    return this.w;
	}
	if (this.parent) {
	    return this.parent.getWidth();
	}
	return SwipeScreen.swipewidth();
    }

    getHeight() {
	if (this.h) {
	    return this.h;
	}
	if (this.parent) {
	    return this.parent.getHeight();
	}
	return SwipeScreen.swipeheight();
    }
    
    parentWidth(){
	var width;
	if (this.parent) {
	    width = this.parent.getWidth();
	}
	if (width) {
	    return width;
	}
	return SwipeScreen.swipewidth();
    }
    parentHeight(){
	var height;
	if (this.parent) {
	    height = this.parent.getHeight();
	}
	if (height) {
	    return height;
	}
	return SwipeScreen.swipeheight();
    }
    
    setPrevPos(){
	var leftPosN = SwipeScreen.virtualX(this.x);
	var topPosN = SwipeScreen.virtualY(this.y);
	
	var widthN = SwipeScreen.virtualX(this.w);
	var heightN = SwipeScreen.virtualY(this.h);

	if (this.info["translate"]) {
	    leftPosN = leftPosN + this.info["translate"][0];
	    topPosN = topPosN + this.info["translate"][1];
	}
	
	$("#" + this.css_id).css({
	    'left': leftPosN + 'px',
	    'top': topPosN + 'px',
	    'width': widthN + 'px',
	    'height': heightN + 'px',
	    'opacity' : this.opacity
	});
    }

    setFinPos(){
	if (this.info["to"]) {
	    var leftPosN = SwipeScreen.virtualX(this.x);
	    var topPosN = SwipeScreen.virtualY(this.y);
	
	    var widthN = SwipeScreen.virtualX(this.w);
	    var heightN = SwipeScreen.virtualY(this.h);
	    
	    if (this.info["to"]["translate"]) {
		leftPosN = leftPosN + this.info["to"]["translate"][0];
		topPosN = topPosN + this.info["to"]["translate"][1];
	    }
	    
	    $("#" + this.css_id).animate({
		'left': leftPosN + 'px',
		'top': topPosN + 'px',
		'width': widthN + 'px',
		'height': heightN + 'px',
		'opacity' : this.opacity
	    }, {
		duration: 1
	    });
	}
    }
    
    setInitPos(){
	var leftPosN = SwipeScreen.virtualX(this.x);
	var topPosN = SwipeScreen.virtualY(this.y);
	
	var widthN = SwipeScreen.virtualX(this.w);
	var heightN = SwipeScreen.virtualY(this.h);
	
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
	    var html = this.elements.map(function(element, key){
		return element.html();
	    });
	    return "<div class='boxelement' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + html + "</div>" ;
	}
    }
    
}
