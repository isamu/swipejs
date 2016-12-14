class SwipePage {
    constructor (page, scene, index) {
	if (scene) {
	    page = SwipeParser.inheritProperties(page, scene );
	}
	this.page = page;
	this.scene = scene;
	this.index = index;
	this.elements = [];
	this.duration = this.page["duration"] ? this.page["duration"] * 1000 : 200;
	this.bc = this.page["bc"] || "#ffffff";
	this.play_style = this.page["play"] || "auto";
	this.transition = this.page["transition"] || (this.play_style == "scroll" ? "replace" : "scroll");
    }

    loadElement(){
	var instance = this;
	var elems = []
	if (this.page["elements"]) {
	    this.page["elements"].forEach(function(element, elem_index){
		instance.elements.push(new SwipeElement(element, instance.index, elem_index, instance.play_style, instance.duration));
	    });
	}
    }

    elementLoad(element){
	var ret = [];
	var instance = this;
	
	ret.push(element);
	if(element["elements"]){
	    element["elements"].forEach(function(elem, elem_index){
		instance.elementLoad(elem).forEach(function(elem2, elem_index2){
		    var copy_obj = Object.assign({}, element);
		    delete copy_obj.elements;
		    ret.push($.extend(true, copy_obj, elem2));
		});
	    });
	}
	
	return ret;
    }

    getHtml(){
	var instance = this;
	var elems = []
	this.elements.forEach(function(element, elem_index){
	    elems.push(element.html());
	});
	// todo snbinder
	return "<div id='page_" + this.index + "' class='page' __page_id='" + this.index + "'>" + elems.join("") + "</div>";
    }

    getBc(){
	return this.bc;
    }

    getTransition() {
	return this.transition;
    }
    
    initElement(index) {
	var indexes = index.split("-");
	if (indexes.length == 1) {
	    this.elements[index].initData();
	} else {
	    this.elements[indexes.shift()].initData(indexes.join("-"));
	}
    }

    getElement(index) {
	var indexes = index.split("-");
	if (indexes.length == 1) {
	    return this.elements[index].getElement();
	} else {
	    return this.elements[indexes.shift()].getElement(indexes.join("-"));
	}
    }
    
    justShow() {
	this.elements.forEach(function(element, elem_index){
	    element.justShow();
	});
    }
    show(){
	let instance = this;
	this.elements.forEach(function(element, elem_index){
	    element.show();
	});

	setTimeout(function(){
	    instance.speech(instance);
	}, this.duration);
	
    }
    animateShow() {
	this.elements.forEach(function(element, elem_index){
	    element.animateShow();
	});
    }
    animateShowBack() {
	this.elements.forEach(function(element, elem_index){
	    element.animateShowBack();
	});
    }

    delayShow(){
	let instance = this;
	this.elements.forEach(function(element, elem_index){
	    element.delayShow();
	});
	setTimeout(function(){
	    instance.speech(instance);
	}, this.duration);
    }

    back() { 
	let instance = this;
	this.elements.forEach(function(element, elem_index){
	    element.back();
	});
	setTimeout(function(){
	    instance.speech(instance);
	}, this.duration);
    }
    finShow() {
	let instance = this;
	this.elements.forEach(function(element, elem_index){
	    element.finShow();
	});
    }
    prevShow() {
	this.elements.forEach(function(element, elem_index){
	    element.prevShow();
	});
    }
    play() {
	let media_player = SwipeMediaPlayer.getInstance();
	media_player.page(this.index).play();

	this.elements.forEach(function(element, elem_index){
	    element.play();
	});
    }
    doLoopProcess() {
	this.elements.forEach(function(element, elem_index){
	    element.doLoopProcess();
	});
    }
    getScene() {
	return this.scene;
    }

    // todo locale
    speech(instance){
	var userAgent = window.navigator.userAgent.toLowerCase();
	if ((userAgent.indexOf('chrome') != -1) || (userAgent.indexOf('safari') != -1)){
	    if (instance.page["speech"]) {
		speechSynthesis.speak(
		    new SpeechSynthesisUtterance(instance.page["speech"]["text"])
		);
	    }
	}
    }
    active() {
	this.elements.forEach(function(element, elem_index){
	    element.active();
	});
    }
    inactive() {
	let instance = this;
	this.elements.forEach(function(element, elem_index){
	    element.inactive();
	});
    }
    
}
