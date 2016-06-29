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
	    var scene = null;
	    if (page["scene"] && (scene = this.data["scenes"][page["scene"]]) ){
		scene = this.data["scenes"][page["scene"]];
	    }
	    var page_instance = new SwipePage(page, scene, index);

	    /*
	    if (scene_name != page["scene"]) {
		scene_index += 1;
		scene_name = page["scene"];
		page_index = 0;
	    }
	    page["scene_index"] = scene_index;
	    page["page_index"] = page_index;	
	    page_index += 1;
	    */

	    this.pages.push(page_instance);
	});
    }

    domLoad() {
	var pages = [];
	var instance = this;
	console.log(this.pages);
	this.pages.forEach((page, page_index) => {
	    page.loadElement();
	    
	    // todo snbinder
	    var page_html = "<div id='page_" + page_index + "'>" + page.getHtml() + "</div>";
	    
	    pages.push(page_html);
	});
	
	$(".swipe").html(pages.join(""));

	// hide page
	for (var i = 1; i < this.pages.length; i++) {
	    $("#page_" + i ).hide();
	}	

	$(".element").load(function() {
	    $(this).attr("__default_width", $(this).width());
	    $(this).attr("__default_height", $(this).height());
	});
	// add load event
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
