class SwipePage {
    constructor (page, scene, index) {
	if (scene) {
	    page = SwipeParser.inheritProperties(page, scene );
	}
	this.page = page;
	this.scene = scene;
	this.index = index;
	this.elements = [];
	this.bc = this.page["bc"] || "#ffffff";
	this.transition = this.page["transition"] || "scroll";
    }

    loadElement(){
	var instance = this;
	var elems = []
	this.page["elements"].forEach(function(element, elem_index){
	    instance.elements.push(new SwipeElement(element, instance.index, elem_index));
	});
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

    justShow() {
	this.elements.forEach(function(element, elem_index){
	    element.justShow();
	});
    }
    show(duration){
	this.elements.forEach(function(element, elem_index){
	    element.show(duration);
	});

	let instance = this;
	setTimeout(function(){
	    instance.speech(instance);
	}, duration);
	
    }

    delayShow(duration){
	this.elements.forEach(function(element, elem_index){
	    element.delayShow(duration);
	});
	let instance = this;
	setTimeout(function(){
	    instance.speech(instance);
	}, duration);
    }

    back(duration) { 
	this.elements.forEach(function(element, elem_index){
	    element.back(duration);
	});
	let instance = this;
	setTimeout(function(){
	    instance.speech(instance);
	}, duration);
    }
    finShow() {
	this.elements.forEach(function(element, elem_index){
	    element.finShow();
	});
    }
    play() {
	this.elements.forEach(function(element, elem_index){
	    element.play();
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
    inactive(duration) {
	this.elements.forEach(function(element, elem_index){
	    element.inactive(duration);
	});
    }
    
}
