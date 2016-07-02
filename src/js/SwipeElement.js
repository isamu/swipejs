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
    
    // end of data parse 

    // set or animate position
    setInitPos(){
	var data = this.getInitPos();
	data = getScreenPosition(data);
	$("#" + this.css_id).css(this.convCssPos(data, this.opacity));
    }

    getPrevPos(){
	var data = this.getInitPos();

	if (this.info["translate"]) {
	    data = this.addPosition(data, this.info["translate"]);
	}
	
	data = this.getScreenPosition(data);
	return this.convCssPos(data, this.opacity);
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
	var data = this.getInitPos();

	var fin_opacity = this.opacity;
	var to = this.info["to"];
	if (to) {
	    if(to["opacity"] != null) {
		fin_opacity = to["opacity"];
	    }
	    if (to["translate"]) {
		data = this.addPosition(data, to["translate"]);
	    }
	}

	data = this.getScreenPosition(data);
	return this.convCssPos(data, fin_opacity);
    }
    setFinPos() {
	$("#" + this.css_id).css(this.getFinPos());
    }

    animateFinPos(){
	console.log("fin");
	if (this.info["to"]) {
	    $("#" + this.css_id).animate(this.getFinPos(), {
		duration: 500
	    });
	}
    }

    // calculate position
    getInitPos() {
	return [this.x, this.y, this.w, this.h];
    }

    addPosition(data, translate){
	data[0] = data[0] + translate[0];	
	data[1] = data[1] + translate[1];
	return data;
    }

    getScreenPosition(data) {
	return [
	    SwipeScreen.virtualX(data[0]),
	    SwipeScreen.virtualY(data[1]),
	    SwipeScreen.virtualX(data[2]),
	    SwipeScreen.virtualY(data[3]),
	];
    }
    convCssPos(data, opacity) {
	return {
	    'left': data[0] + 'px',
	    'top': data[1] + 'px',
	    'width': data[2] + 'px',
	    'height': data[3] + 'px',
	    'opacity' : opacity
	};
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
	if ( this.info["loop"]) {
	    this.loop(this);
	    console.log("loop2");
	}
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
	    if ( instance.info["loop"]) {
		instance.loop(instance);
	    }
	}, 500);
    }

    loop(instance){
	$("#" + instance.css_id).rotate({angle:0, animateTo: 20, duration: 100});
	setTimeout(function(){
	    $("#" + instance.css_id).rotate({angle:20, animateTo: -20, duration: 200});
	    setTimeout(function(){
		$("#" + instance.css_id).rotate({angle:-20, animateTo: 0, duration: 100});
		
	    }, 200);
	}, 100);
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
