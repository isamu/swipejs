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
	
	this.elements = Array.prototype.concat.apply([], elems);
	
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
	    elems.push(instance.element2html(element));
	});
	return elems.join("");
    }

    element2html(element){
	if (element.img) {
	    return "<img src='" + element.img + "' class='element' />";
	} else {
	    return "";
	}
    }
    
    
    
}
