class SwipeElement {

    constructor (info, page_id, element_id, parent=null) {
	var css_id = "element-" + page_id + "-" + element_id;

	this.info = this.mergeTemplate(info);
	this.css_id = css_id;
	this.page_id = page_id;
	this.element_id = element_id;
	this.parent = parent;

	this.isActive = false;
	this.isRepeat = Boolean(info["repeat"]);
	    
	this.x = 0;
	this.y = 0;
	this.angle = 0;
	
	this.elements = [];
	var instance = this;

	if (this.info["elements"]) {
	    this.info["elements"].forEach(function(element, elem_index){
		var e_id = element_id + "-" + elem_index;
		instance.elements.push(new SwipeElement(element, page_id, e_id, instance));
	    });
	}
    }

    mergeTemplate(info){
	// template
	if (info["element"]) {
	    var elementTemplate = SwipeLoader.getTemplateElements();
	    var elem;
	    if (elem = elementTemplate[info["element"]]) {
		info = SwipeParser.inheritProperties(info, elem );
	    }
	}
	return info;
    }

    parseText(element) {
	if (typeof element == "string") {
	    return element;
	} else if (typeof element == "object"){
	    if (element["ref"]) {
		return SwipeParser.localizedStringForKey(element["ref"]);
	    } else {
		// todo localize
		return SwipeParser.localizedString(element, "ja");
	    }
	}
	return "";
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
	
	if (this.isDiv()) {
	    if (!this.parent) {
		$("#" + this.css_id).css("position", "absolute");
	    }
	}
	this.setSize();
	this.setPosition();
	this.setOption();

	$("#" + this.css_id).attr("__x", this.x);
	$("#" + this.css_id).attr("__y", this.y);
	$("#" + this.css_id).attr("__w", this.w);
	$("#" + this.css_id).attr("__h", this.h);

	this.setPrevPos();
    }


    setOption() {
	this.opacity = 1.0;

	if (this.info["opacity"] != null) {
	    this.opacity = this.info["opacity"];
	}

	if(this.info["clip"] && this.info["clip"] === true) {
	    $("#" + this.css_id).css("overflow", "hidden");
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
	if (this.info["rotate"]) {
	    this.angle = this.info["rotate"];
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
    getOriginalPrevPos(){
	var data = this.getInitPos();

	if (this.info["translate"]) {
	    data = this.updatePosition(data, this.info);
	}
	return data;
    }
    getPrevPos() {
	var data = this.getOriginalPrevPos();
	data = this.setScale(data, this.info);
	data = this.getScreenPosition(data);
	return this.convCssPos(data);
    }
    setPrevPos(){
	$("#" + this.css_id).css(this.getPrevPos());
	if (this.isVideo()) {
	    var data = this.getOriginalPrevPos();
	    data = this.setScale(data, this.info);
	    data = this.getScreenPosition(data);
	    $("#" + this.css_id).html("<video id='" + this.css_id + "-video' width='"+ data[2] + "' height='" + data[3] + "'><source type='video/mp4' src='" + this.info.video + "'  /></video>");

	    $('video').mediaelementplayer({
		flashName: 'flashmediaelement.swf',
		loop: true,
		success: function (mediaElement, domObject) { 
		    // mediaElement.play();
		}
            });
	}
	if (this.isText()) {
	    // text layout
	    this.textLayout();
    
	}
    }

    textLayout(){
	var x = "center";
	var textAlign = "center";
	
	if (this.info["textAlign"]) {
	    switch(this.info["textAlign"]){
	    case "left":
		textAlign = "left";
		break;
	    case "right":
		textAlign = "right";
		break;
	    case "top":
		x = "top";
		break;
	    case "bottom":
		x = "bottom";
		break;
	    }
	}

	var fontname = SwipeParser.parseFontName(this.info["font"], false);
	
	var fontSize = function(info) {
	    var defaultSize = 20 / 480 * SwipeScreen.swipeheight();
            let size = SwipeParser.parseFontSize(info, SwipeScreen.swipeheight(), defaultSize, false);
	    // todo scale
	    // return round(size * scale.height)
            return Math.round(size);
	}(this.info);

	var css = {
	    position: "relative",
	    "font-size": String(fontSize) + "px",
	    "font-family": fontname,
	    "textAlign": textAlign,
	    "color": SwipeParser.parseColor(this.info["font"], "#000")
	};
	
	$("#" + this.css_id + "-body").css(css);
	var containerHeight = $("#" + this.css_id + "-body").height();
	var divHeight =  $("#" + this.css_id).height();
	var top = 0;

	if (x == "bottom") {
	    top = divHeight - containerHeight;
	} else if ( x == "center") {
	    top = (divHeight - containerHeight) / 2;
	}
	$("#" + this.css_id + "-body").css({top: String(top) + "px"});
	
    }

    animatePrevPos(duration){
	console.log("animate");
	$("#" + this.css_id).animate(this.getPrevPos(), {
		duration: duration
	});
    }

    getFinPos() {
	var data = this.getInitPos();

	var to = this.info["to"];
	if (to) {
	    data = this.updatePosition(data, to);
	}

	data = this.setScale(data, this.info);
	data = this.getScreenPosition(data);
	return this.convCssPos(data);
    }
    setFinPos() {
	$("#" + this.css_id).css(this.getFinPos());
    }

    animateFinPos(duration){
	if (this.info["to"]) {
	    this.setTiming(this.info["to"], duration);
	    var start_duration = this.timing[0];
	    var do_duration = this.timing[1];
	    
	    var instance = this;
	    setTimeout(function(){
		$("#" + instance.css_id).animate(instance.getFinPos(), {
		    duration: do_duration
		});
	    }, start_duration);
	}
    }

    // calculate position
    getInitPos() {
	return [Number(this.x), Number(this.y), Number(this.w), Number(this.h), Number(this.angle), Number(this.opacity)];
    }

    updatePosition(data, to){
	if(to["opacity"] != null) {
	    data[5] = Number(to["opacity"]);
	}

	if(to["translate"]) {
	    var translate = to["translate"];
	    data[0] = data[0] + Number(translate[0]);
	    data[1] = data[1] + Number(translate[1]);
	}
	return data;
    }

    getScreenPosition(data) {
	return [
	    SwipeScreen.virtualX(data[0]),
	    SwipeScreen.virtualY(data[1]),
	    SwipeScreen.virtualX(data[2]),
	    SwipeScreen.virtualY(data[3]),
	    data[4],
	    data[5]
	];
    }
    setScale(data, info) {
	let scale;
	if (info["scale"]) {
	    if (SwipeParser.is("Array", info["scale"]) && info["scale"].length > 1){
		scale = info["scale"];
	    } else if (SwipeParser.is("Number", info["scale"])){
		scale = [info["scale"], info["scale"]];
	    } else if (SwipeParser.is("String", info["scale"])){
		scale = [Number(info["scale"]), Number(info["scale"])];
	    }
	}
	if (scale && scale.length == 2){
	    var new_w = data[2] * scale[0];
	    var new_h = data[3] * scale[1];
	    var new_x = data[0] - ( (new_w - data[2]) / 2);
	    var new_y = data[1] - ( (new_h - data[3]) / 2);
	    data[0] = new_x;
	    data[1] = new_y;
	    data[2] = new_w;
	    data[3] = new_h;
	    console.log(scale);
	}
	return data;
    }
    convCssPos(data) {
	var ret = {
	    'left': data[0] + 'px',
	    'top': data[1] + 'px',
	    'width': data[2] + 'px',
	    'height': data[3] + 'px',
	    'opacity' : data[5]
	};
	if (data[4]) {
	    var rotate = "rotate(" + data[4] +"deg)";
	    ret["-moz-transform"] = rotate;
	    ret["-webkit-transform"] = rotate;
	    ret["-o-transform"] = rotate;
	    ret["-ms-transform"] = rotate;
	}
	return ret;
    }
  
    type() {
	if (this.info.img) {
	    return "image";
	} else if (this.info.video){
	    return "video";
	} else if (this.info.text) {
	    return "text";
	} else {
	    return "div";
	}
    }

    isImage() {
	return this.type() == "image";
    }
    isVideo() {
	return this.type() == "video";
    }
    isText() {
	return this.type() == "text";
    }
    isDiv() {
	return this.type() == "div";
    }
    
    html() {
	if (this.type()){
	    SwipeCounter.increase();
	}
	if (this.isImage()) {
	    return "<img src='" + this.info.img + "' class='image_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' />";
	} else if (this.isText()) {
	    return  "<div class='element text_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" +
		"<div class='text_body' id='" + this.css_id + "-body'>" + this.parseText(this.info.text) + "</div>" +
		"</div>";
	} else if (this.isVideo()) {
	    return  "<div class='element video_element' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' ></div>";
	} else if (this.type() == "div") {
	    var html = this.elements.map(function(element, key){
		return element.html();
	    });
	    return "<div class='element boxelement-" + this.page_id + "' id='" + this.css_id + "' __page_id='" + this.page_id + "' __element_id='" + this.element_id + "' >" + html.join("") + "</div>" ;
	} else {
	    return "";
	}
    }

    show(duration){
	console.log("show");
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.show(duration);
	    });
	}
	this.setPrevPos();
	this.animateFinPos(duration);
	if ( this.info["loop"]) {
	    var duration =  this.valueFrom(this.info["loop"], "duration", 50);
	    this.setTiming(this.info["loop"], duration);
	    this.loop(this);
	}
    }

    delayShow(duration){
	console.log("delayShow");
	var du = duration;
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.delayShow(du);
	    });
	}
	this.setPrevPos();
	var instance = this;
	setTimeout(function(){
	    instance.animateFinPos(du);
	    if ( instance.info["loop"]) {
		var loop_duration =  instance.valueFrom(instance.info["loop"], "duration", 50);
		instance.setTiming(instance.info["loop"], loop_duration);
		instance.loop(instance);
	    }
	}, du);
    }

    setTiming(element, duration){
	var timing = function(element) {
	    if (element["timing"]) {
		var timing = element["timing"];
		if (timing.length == 2 && timing[0] > 0 && timing[1] >= timing[0] && timing[1] <= 1) {
		    return timing;
		}
	    }
	    return [0, 1];
	}(element);
	this.timing = [timing[0], (timing[1] - timing[0]), (1 - timing[1])].map(function(a){
	    return a * duration;
	});

    }
    moreloop(instance, repeat, defaultRepeat){
	repeat --;
	var end_duration = this.timing[2];

        setTimeout(function(){

	    if (repeat > 0) {
		instance.loop(instance, repeat);
	    } else if(instance.isRepeat && instance.isActive){
		repeat = defaultRepeat;
		instance.loop(instance, repeat);
	    }
	}, end_duration);
    }
    loop(instance, repeat=null){
	console.log("loop");
	var data = instance.info["loop"];

	var start_duration = this.timing[0];
	var duration = this.timing[1];

	
	var defaultRepeat;
	if (data["repeat"]) {
	    defaultRepeat = data["repeat"];
	} else {
	    defaultRepeat = 1;
	}
	if (repeat == null){
	    repeat = defaultRepeat;
	}

	setTimeout(function(){
	    switch(data["style"]){
	    case "vibrate" :
		var delta = instance.valueFrom(data, "delta", 10);
		var orgPos = instance.getOriginalPrevPos();
		var timing = duration / repeat / 4
		$("#" + instance.css_id).animate({
		    left: parseInt(SwipeScreen.virtualX(orgPos[0] - delta)) + "px", top: SwipeScreen.virtualY(orgPos[1]) + "px"
		}, { duration: timing });
		setTimeout(function(){
		    $("#" + instance.css_id).animate({
			left: parseInt(SwipeScreen.virtualX(orgPos[0] + delta)) + "px", top: SwipeScreen.virtualY(orgPos[1]) + "px"
		    }, { duration: timing * 2 });
		    setTimeout(function(){
			$("#" + instance.css_id).animate({
			    left: parseInt(SwipeScreen.virtualX(orgPos[0])) + "px", top: SwipeScreen.virtualY(orgPos[1]) + "px"
			}, { duration: timing });

			setTimeout(function(){
			    repeat --;
			    if (repeat > 0) {
				instance.loop(instance, repeat);
			    } else if(instance.isRepeat && instance.isActive){
				repeat = defaultRepeat;
				instance.loop(instance, repeat);
			    }
			}, timing);
		    }, timing * 2);
		}, timing);
		break;

            case "shift":
		var dir;
		var orgPos = instance.getOriginalPrevPos();
		switch(data["direction"]){
		case "n" :
		    dir = { left: parseInt(SwipeScreen.virtualX(data[0])) + "px", top: SwipeScreen.virtualY(data[1] - instance.h) + "px" }; break;
		case "e" :
		    dir = { left: parseInt(SwipeScreen.virtualX(data[0] + instance.w)) + "px", top: SwipeScreen.virtualY(data[1]) + "px" }; break;
		case "w" :
		    dir = { left: parseInt(SwipeScreen.virtualX(data[0] - instance.w)) + "px", top: SwipeScreen.virtualY(data[1]) + "px" }; break;
		default :
		    dir = { left: parseInt(SwipeScreen.virtualX(data[0])) + "px", top: SwipeScreen.virtualY(data[1] - instance.h) + "px" }; break;
		}
		var timing = duration / repeat;

		instance.setPrevPos();

		setTimeout(function(){
		    $("#" + instance.css_id).animate(
			dir,
			{ duration: timing,
			  complete: function(){
			      $("#" + instance.css_id).animate(
				  instance.convCssPos(orgPos, 1),
				  { duration: 10,
				    complete: function(){
					instance.moreloop(instance, repeat, defaultRepeat);
				    }
				  }
			      );  
			  }
			});
		}, 50);
		break;
            case "blink":
		console.log("blink");
		var timing = duration / defaultRepeat;
		$("#" + instance.css_id).css({opacity: 1});
		setTimeout(function(){
		    $("#" + instance.css_id).css({opacity: 0});
		    setTimeout(function(){
			$("#" + instance.css_id).css({opacity: 1});
			setTimeout(function(){
			    instance.moreloop(instance, repeat, defaultRepeat);
			}, timing);
		    }, timing * 2);
		}, timing);
		break;
            case "spin":
		console.log("spin");
		var timing = duration / defaultRepeat;
		$("#" + instance.css_id).rotate({
		    angle:0, animateTo: 360, duration: timing,
		    callback: function(){
			instance.moreloop(instance, repeat, defaultRepeat);
		    }
		});
		break;
	    case "wiggle" :
		console.log("wiggle");
		var angle = instance.valueFrom(data, "delta", 15);
		$("#" + instance.css_id).rotate({
		    angle:0, animateTo: angle, duration: duration,
		    callback: function(){
			$("#" + instance.css_id).rotate({
			    angle:angle, animateTo: -angle, duration: duration * 2,
			    callback: function(){
				$("#" + instance.css_id).rotate({
				    angle:-angle, animateTo: 0, duration: duration,
				    callback: function(){
					instance.moreloop(instance, repeat, defaultRepeat);
				    }});
			    }});
		    }
		});
		break;
            case "path":
            case "sprite":
		
	    }
	}, start_duration);
	
    }

    valueFrom(data, key, defaultValue){
	var ret = defaultValue;
	if (data[key]){
	    ret = data[key];
	}
	return ret;
    }
    back(duration){
	console.log("back");
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.back(duration);
	    });
	}
	this.setFinPos();
	this.animatePrevPos(duration);
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

    inactive(duration){
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.inactive(duration);
	    });
	}
	this.isActive = false;

    }
    active(){
	if (this.elements) {
	    this.elements.forEach(function(element, elem_index){
		element.active();
	    });
	}
	this.isActive = true;
    }

}

class SwipeCounter {
    
    static increase(){
	if(this.counter === undefined){
	    this.counter = 1;
	} else {
	    this.counter ++;
	}
	return this.counter;
    }

    static decrease(){
	if(this.counter === undefined){
	    this.counter = -1;
	} else {
	    this.counter --;
	}
	return this.counter;
    }

    static getCounter(){
	return this.counter;
    }
    
}
