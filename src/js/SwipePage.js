class SwipePage {
    constructor (page, scene, index) {
	if (scene) {
	    page = SwipeParser.inheritProperties(page, scene );
	}
	this.page = page;
	this.scene = scene;
	this.index = index;
	this.elements = [];
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
	return elems.join("");
    }

    initElement(index) {
	var indexes = index.split("-");
	if (indexes.length == 1) {
	    this.elements[index].initData();
	} else {
	    this.elements[indexes.shift()].initData(indexes.join("-"));
	}
    }

    show(duration){
	this.elements.forEach(function(element, elem_index){
	    element.show(duration);
	});
    }

    delayShow(duration){
	this.elements.forEach(function(element, elem_index){
	    element.delayShow(duration);
	});
    }
    
    back(duration) { 
	this.elements.forEach(function(element, elem_index){
	    element.back(duration);
	});
    }
    finShow() {
	this.elements.forEach(function(element, elem_index){
	    element.finShow();
	});
    }
    getScene() {
	return this.scene;
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
