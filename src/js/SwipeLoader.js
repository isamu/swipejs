class SwipeLoader {
    constructor (data, default_page = 0) {
	this.step = default_page;
	this.data = data;
	this.pages = [];
	this.load();
	this.domLoad();
    }
    
    load(){
	var scene_name = this.data["pages"][0]["scene"];
	var scene_index = 0;
	var page_index = 0;

	SwipeScreen.init(this.data.dimension[0], this.data.dimension[1]);
	
	$.each(this.data["pages"], (index, page) => {
	    var scene = null;
	    if (page["scene"] && (scene = this.data["scenes"][page["scene"]]) ){
		scene = this.data["scenes"][page["scene"]];
	    }
	    var page_instance = new SwipePage(page, scene, index);

	    this.pages.push(page_instance);
	});
    }

    domLoad() {
	var pages = [];
	var instance = this;
	this.pages.forEach((page, page_index) => {
	    page.loadElement();
	    
	    // todo snbinder
	    var page_html = "<div id='page_" + page_index + "' class='page'>" + page.getHtml() + "</div>";
	    
	    pages.push(page_html);
	});
	
	$(".swipe").html(pages.join(""));

	// hide page
	for (var i = 0; i < this.pages.length; i++) {
	    if (this.step != i) {
		$("#page_" + i ).css("opacity", 0);
	    }
	}	

	$(".element").load(function() {
	    $(this).attr("__default_width", $(this).width());
	    $(this).attr("__default_height", $(this).height());
	    instance.initData($(this).attr("__page_id"), $(this).attr("__element_id"));
	});

	$(".page").css({"position": "absolute"});
	$(".boxelement").each(function(index, element) {
	    instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));
	});
	// add load event
    }
    
    steps() {
    }

    initData(page_id, element_id){
	this.pages[page_id].initElement(element_id);
    }
    
    next(){
	this.show(this.step + 1);
    }
    
    show(step){
	var mode = (step >= this.step) ? "forward" : "back";
	var same_scene = (this.pages[step].getScene() == this.pages[this.step].getScene());

	if (step >= this.step) {
	    this.pages[step].show();
	} else {
	    if (same_scene) {
		this.pages[this.step].back();
	    }
	    // this.pages[step].finShow();
	}
	
	var prev_step = Number(this.step);
	if (same_scene) {
	    if (mode ==  "forward") {
		$("#page_" + this.step ).css("opacity", 0);
		$("#page_" + step ).css("opacity", 1);
	    } else {
		setTimeout(function(){
		    $("#page_" + prev_step ).css({"opacity": 0});
		    $("#page_" + step).css({"opacity": 1});
		}, 500);
	    }
	} else {
	    if (mode ==  "forward") {
		$("#page_" + this.step ).animate({
		    "opacity": 0
		}, {
		    duration: 500
		});
		this.pageSlide("in", step);
	    } else {
		$("#page_" + step).css({"opacity": 1});

		this.pageSlide("out", this.step);
		setTimeout(function(){
		    $("#page_" + prev_step ).css({"opacity": 0});
		}, 500);
	    }
	}
	this.step = step;
	location.hash = this.step;
    }

    getStep() {
	return this.step;
    }

    pageSlide(mode, step) {
	$(".boxelement-" + step).each(function(index, element) {
	    if (mode == "in") {
		var org_top = parseInt($(element).css("top"));
		var from_top = org_top + SwipeScreen.virtualheight();
	    } else {
		var from_top = parseInt($(element).css("top"));
		var org_top = from_top + SwipeScreen.virtualheight();
	    }

	    $(element).css("top", from_top);
	    $(element).animate({
		"top": org_top
            }, {
		duration: 500
            });
	});

	if (mode == "in") {
	    $("#page_" + step ).css("top", SwipeScreen.virtualheight());
	    $("#page_" + step ).css("opacity", 1);
	    $("#page_" + step ).animate({
		"top": 0
	    }, {
		duration: 500
	    });
	} else {
	    $("#page_" + step ).css("top", 0);
	    $("#page_" + step ).animate({
		"top": SwipeScreen.virtualheight(),
	    }, {
		duration: 500
	    });

	}
    }

}
