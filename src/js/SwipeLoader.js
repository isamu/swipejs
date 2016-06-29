class SwipeLoader {
    constructor (data) {
	this.data = data;
	this.pages = [];
	this.load();
	this.domLoad();
	this.step = 0;
    }
    
    load(){
	var scene_name = this.data["pages"][0]["scene"];
	var scene_index = 0;
	var page_index = 0;

	$.each(this.data["pages"], (index, page) => {
	    var scene;
	    if (page["scene"] && (scene = this.data["scenes"][page["scene"]]) ){
		page = SwipeParser.inheritProperties(page, scene );
	    }
	    if (scene_name != page["scene"]) {
		scene_index += 1;
		scene_name = page["scene"];
		page_index = 0;
	    }
	    page["scene_index"] = scene_index;
	    page["page_index"] = page_index;	
	    page_index += 1;
	    this.pages.push(page);
	});
    }

    domLoad() {
	var pages = [];
	var instance = this;
	console.log(this.pages);
	this.pages.forEach((page, page_index) => {
	    var elems = [];
	    
	    page["elements"].forEach(function(element, elem_index){
		elems.push(instance.elementLoad(element));
	    });

	    elems = Array.prototype.concat.apply([], elems);

	    // todo snbinder
	    var page_html = "<div id='page_" + page_index + "'>" + elems.join("<br/>") + "</div>";

	    pages.push(page_html);
	});
	
	$(".swipe").html(pages.join(""));
	for (var i = 1; i < this.pages.length; i++) {
	    $("#page_" + i ).hide();
	}	


	
    }

    elementLoad(element){
	var ret = [];
	var instance = this;

	ret.push(this.element2html(element));
	if(element["elements"]){
	    element["elements"].forEach(function(elem, elem_index){
		ret.push(instance.elementLoad(elem));
	    });
	}
	return ret;
    }
    element2html(element){
	if (element.img) {
	    return "<img src='" + element.img + "' class='element'/>";
	} else {
	    return "";
	}
    }
    
    steps() {
    }

    next(){
	this.show(this.step + 1);
    }
    
    show(step){
	$("#page_" + this.step ).hide();
	$("#page_" + step ).show();
	this.step = step;
    }
}
