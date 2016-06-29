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
	    elems.push(instance.elementLoad(element));
	});
	
	Array.prototype.concat.apply([], elems).forEach(function(element, elem_index){
	    instance.elements.push(new SwipeElement(element, instance.index, elem_index));
	});
    }

    elementLoad(element){
	var ret = [];
	var instance = this;
	
	ret.push(element);
	if(element["elements"]){
	    element["elements"].forEach(function(elem, elem_index){
		ret.push(instance.elementLoad(elem));
	    });
	    ret =  Array.prototype.concat.apply([], ret);
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
	this.elements[index].initData();
    }
    
}
