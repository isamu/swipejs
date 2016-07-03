class SwipeLoader {
    constructor (data, defaultPage = 0) {
	this.step = defaultPage;
	this.data = data;
	this.pages = [];
	this.load();
	this.domLoad();
    }
    
    load(){
	SwipeScreen.init(this.data.dimension[0], this.data.dimension[1]);
	
	$.each(this.data["pages"], (index, page) => {
	    var scene;
	    if (page["scene"] && (scene = this.data["scenes"][page["scene"]]) ){
		scene = this.data["scenes"][page["scene"]];
	    }
	    var pageInstance = new SwipePage(page, scene, index);

	    this.pages.push(pageInstance);
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
    }
    
    steps() {
    }

    initData(page_id, element_id){
	this.pages[page_id].initElement(element_id);
    }
    
    next(){
	this.show(this.step + 1);
    }
    
    show(nextStep){
	var currentStep =  this.step;
	var mode = (nextStep >= currentStep) ? "forward" : "back";
	var same_scene = (this.pages[nextStep].getScene() == this.pages[currentStep].getScene());

	if (mode == "forward") {
	    if (same_scene) {
		this.pages[nextStep].show();
		$("#page_" + currentStep ).css("opacity", 0);
		$("#page_" + nextStep ).css("opacity", 1);
	    } else {
		$("#page_" + currentStep ).animate({
		    "opacity": 0
		}, {
		    duration: 500
		});
		this.pageSlide("in", nextStep);
		this.pages[nextStep].delayShow();
	    }
	} else { // in case back
	    if (same_scene) {
		this.pages[currentStep].back();
		// todo more smooth.
		setTimeout(function(){
		    $("#page_" + currentStep ).css({"opacity": 0});
		    $("#page_" + nextStep).css({"opacity": 1});
		}, 500);
	    } else {
		$("#page_" + nextStep).css({"opacity": 1});
		
		this.pageSlide("out", currentStep);
		setTimeout(function(){
		    $("#page_" + currentStep ).css({"opacity": 0});
		}, 500);
	    }
	}
	
	this.step = nextStep;
	location.hash = nextStep;
    }

    getStep() {
	return this.step;
    }

    pageSlide(mode, step) {
	$(".boxelement-" + step).each(function(index, element) {
	    console.log("box");
	    
	    if (mode == "in") {
		// todo not use css top. use virtual x.
		var orgTop = $("#" + this.css_id).attr("__x");
		var fromTop = orgTop + SwipeScreen.virtualheight();
	    } else {
		var fromTop = $("#" + this.css_id).attr("__x");
		var orgTop = fromTop + SwipeScreen.virtualheight();
	    }
	    
	    $(element).css("top", fromTop);
	    $(element).animate({
		"top": orgTop
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
