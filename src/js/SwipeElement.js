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
	
	if (this.type() == "div") {
	    if (!this.parent) {
		$("#" + this.css_id).css("position", "absolute");
	    }
	}
	
	this.setSize();
	this.setPosition();
	this.setOpacity();

	// for debug
	$("#" + this.css_id).attr("__x", this.x);
	$("#" + this.css_id).attr("__y", this.y);	

	$("#" + this.css_id).attr("__w", this.w);
	$("#" + this.css_id).attr("__h", this.h);

	this.setPrevPos();
    }


    setOpacity() {
	this.opacity = 1.0;

	if (this.info["opacity"] != null) {
	    this.opacity = this.info["opacity"];
	}
    }	
    
    setSize() {
    	if (this.info["size"]) {
	    this.w = this.info["size"][0];
	    this.h = this.info["size"][1];
	} else {
	    if (this.info["w"]){
		this.w = this.info["w"];
	    } else {
		if (this.info.img) {
		    this.w = $("#" + this.css_id).attr("__default_width");
		} else {
		    this.w = this.parentWidth();
		}
	    }
	    if (this.info["h"]){
		this.h = this.info["h"];
	    } else {
		if (this.info.img) {
		    this.h = $("#" + this.css_id).attr("__default_height");
		} else {
		    this.h =  this.parentHeight();
		}
	    }
	}
    }

    setPosition() {
	if (this.info["pos"]) {
	    this.x = this.info["pos"][0];
	    this.y = this.info["pos"][1];
	} else {
	    if (this.info["x"] == "right"){
		this.x = this.parentWidth() - this.w;
		
	    } else if (this.info["x"] == "left"){
		this.x = 0;
	    } else if (this.info["x"] == "center"){
		this.x = (this.parentWidth() - this.w) / 2.0;
	    } else if (this.info["x"]){
		this.x = this.info["x"];
	    }

	    if (this.info["y"] == "bottom"){
		this.y = this.parentHeight() - this.h;
	    } else if (this.info["y"] == "top"){
		this.y = 0;
	    } else if (this.info["y"] == "center"){
		this.y = (this.parentHeight() - this.h) / 2.0;
	    } else if (this.info["y"]){
		this.y = this.info["y"];
	    }
	}
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
    
    getPrevPos(){
	var leftPosN = SwipeScreen.virtualX(this.x);
	var topPosN = SwipeScreen.virtualY(this.y);
	
	var widthN = SwipeScreen.virtualX(this.w);
	var heightN = SwipeScreen.virtualY(this.h);

	if (this.info["translate"]) {
	    leftPosN = leftPosN + SwipeScreen.virtualX(this.info["translate"][0]);
	    topPosN = topPosN +  SwipeScreen.virtualY(this.info["translate"][1]);
	}
	return {
	    'left': leftPosN + 'px',
	    'top': topPosN + 'px',
	    'width': widthN + 'px',
	    'height': heightN + 'px',
	    'opacity' : this.opacity
	}
    }
    setPrevPos(){
	$("#" + this.css_id).css(this.getPrevPos());
    }
    animatePrevPos(){
	console.log("animate");
	$("#" + this.css_id).animate(this.getPrevPos(), {
		duration: 500
	});
    }

    getFinPos() {
	var leftPosN = SwipeScreen.virtualX(this.x);
	var topPosN = SwipeScreen.virtualY(this.y);
	
	var widthN = SwipeScreen.virtualX(this.w);
	var heightN = SwipeScreen.virtualY(this.h);
	
	this.fin_opacity = this.opacity;
	if (this.info["to"]) {
	    
	    if(this.info["to"]["opacity"] != null) {
		this.fin_opacity = this.info["to"]["opacity"];
	    }
	    
	    if (this.info["to"]["translate"]) {
		leftPosN = leftPosN + this.info["to"]["translate"][0];
		topPosN = topPosN + this.info["to"]["translate"][1];
	    }
	}
	return {
	    'left': leftPosN + 'px',
	    'top': topPosN + 'px',
	    'width': widthN + 'px',
	    'height': heightN + 'px',
	    'opacity' : this.fin_opacity
	}
    }
    animateFinPos(){
	console.log("fin");
	if (this.info["to"]) {
	    $("#" + this.css_id).animate(this.getFinPos(), {
		duration: 500
	    });
	}
    }

    setFinPos() {
	$("#" + this.css_id).css(this.getFinPos());
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

    type() {
	if (this.info.img) {
	    return "image";
	} else {
	    return "div";
	} 
    }

    html() {
	if (this.type() == "image") {
	    return "<img src='" + this.info.img + "' class='element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' />";
	} else if (this.type() == "div") {
	    var html = this.elements.map(function(element, key){
		return element.html();
	    });
	    return "<div class='boxelement boxelement-" + this.page_id + "' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + html.join("") + "</div>" ;
	} else {
	    return "";
	}
    }

    show(){
	console.log("show");
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.show();
	    });
	}
	this.setPrevPos();
	this.animateFinPos();
    }

    delayShow(){
	console.log("delayShow");
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.delayShow();
	    });
	}
	this.setPrevPos();
	var instance = this;
	setTimeout(function(){
	    instance.animateFinPos();
	}, 500);
    }
    
    back(){
	console.log("back");
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.back();
	    });
	}
	this.setFinPos();
	this.animatePrevPos();
    }

    finShow(){
	console.log("finShow");
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.finShow();
	    });
	}
	this.setFinPos();
    }
    
}
