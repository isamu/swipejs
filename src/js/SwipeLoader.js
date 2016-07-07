class SwipeLoader {
    static setTemplateElements(template) {
	this.templateElements = template;
    }
    static getTemplateElements() {
	return this.templateElements;
    }
    constructor (data, defaultPage = 0) {
	this.step = defaultPage;
	this.data = data;
	this.pages = [];

	SwipeLoader.setTemplateElements(this.getTemplateElements());
	this.templatePages = this.getTemplatePages();
	this.setScreen();
	this.paging = this.getPaging();
	this.load();
	this.domLoad();
    }
    
    setScreen() {
	this.dimension = (this.data.dimension) ? this.data.dimension : [ $(window).width(),  $(window).height() ];
	SwipeScreen.init(this.dimension[0], this.dimension[1]);
	this.setSwipeCss();
    }
    
    load(){
	$.each(this.data["pages"], (index, page) => {
	    var scene;
	    if (page["scene"] && (scene = this.templatePages[page["scene"]]) ){
		scene = this.templatePages[page["scene"]];
	    }
	    var pageInstance = new SwipePage(page, scene, index);

	    this.pages.push(pageInstance);
	});
    }

    getTemplatePages() {
	if (this.data["templates"] && this.data["templates"]["pages"]) {
	    return this.data["templates"]["pages"];
	} else if (this.data["scenes"]) {
	    return this.data["scenes"];
	}
	return {};
    }

    getTemplateElements() {
	if (this.data["templates"] && this.data["templates"]["elements"]) {
	    return this.data["templates"]["elements"];
	} else if (this.data["elements"]){
	    return this.data["elements"];
	}
	return {};
    }
    
    getPaging(){
	if (this.data["paging"] == "leftToRight" || this.data["paging"] == "vertical" ||  this.data["paging"] == "rightToLeft" ) {
	    return this.data["paging"];
	}
	return "vertical";
    }
    
    setSwipeCss() {
	$(".swipe").css({
	    height: SwipeScreen.virtualheight(),
	    width: SwipeScreen.virtualwidth()
	});
	// rename class name and move to css file
	$(".right").css({
	    position: "absolute",
	    top: 0,
	    left: SwipeScreen.virtualwidth(),
	    height: SwipeScreen.virtualheight(),
	    width:  $(window).width(),
	    display: "inline-block",
	    "z-index": 100,
	    "background-color": "white"
	});
    }
    
    resize() {
	this.setScreen();
	this.show(this.step);
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
	
	$(".image_element").load(function() {
	    $(this).attr("__default_width", $(this).width());
	    $(this).attr("__default_height", $(this).height());
	    instance.initData($(this).attr("__page_id"), $(this).attr("__element_id"));
	    SwipeCounter.decrease();

	    if(SwipeCounter.getCounter() == 0){
		instance.loadFinish();
	    }
	});

	$(".element").each(function(index, element) {
	    instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));

	    SwipeCounter.decrease();
	    if(SwipeCounter.getCounter() == 0){
		instance.loadFinish();
	    }
	});

	$(".page").css({"position": "absolute"});
	$(".image_element").css({"position": "absolute"});
	$(".video_element").css({"position": "absolute"});
	$(".text_element").css({"position": "absolute"});
    }

    loadFinish(){
	this.show(this.step);
    }
    initData(page_id, element_id){
	this.pages[page_id].initElement(element_id);
    }
    
    next(){
	if (this.step < this.pages.length - 1){
	    this.show(this.step + 1);
	}
    }
    
    show(nextStep){
	var currentStep =  this.step;
	var mode = (nextStep >= currentStep) ? "forward" : "back";
	var loaded = (nextStep == currentStep);
	var same_scene = (this.pages[currentStep].getScene()) && (this.pages[nextStep]) &&
	    (this.pages[nextStep].getScene() == this.pages[currentStep].getScene());
	var duration = 500;
	
	if (!loaded) {
	    this.pages[currentStep].inactive(duration)
	    this.pages[nextStep].active();
	}

	if (mode == "forward") {
	    if (same_scene) {
		this.pages[nextStep].show(duration);
		$("#page_" + currentStep ).css("opacity", 0);
		$("#page_" + nextStep ).css("opacity", 1);
	    } else {
		setTimeout(function(){
		    $("#page_" + currentStep ).css({
			"opacity": 0
		    });
		}, duration);
		this.pageSlide("in", nextStep, duration);
		this.pages[nextStep].delayShow(duration);
	    }
	} else { // in case back
	    if (same_scene) {
		this.pages[currentStep].back(duration);
		// todo more smooth.
		setTimeout(function(){
		    $("#page_" + currentStep ).css({"opacity": 0});
		    $("#page_" + nextStep).css({"opacity": 1});
		}, duration);
	    } else {
		$("#page_" + nextStep).css({"opacity": 1});
		
		this.pageSlide("out", currentStep, duration);
		setTimeout(function(){
		    $("#page_" + currentStep ).css({"opacity": 0});
		}, duration);
	    }
	}
	
	this.step = nextStep;
	location.hash = nextStep;
    }

    getStep() {
	return this.step;
    }
    
    pageSlide(mode, step, duration) {
	$(".boxelement-" + step).each(function(index, element) {
	    console.log("box");
	    
	    if (mode == "in") {
		if (this.paging == "vertical") {
		    var orgTop = $("#" + this.css_id).attr("__x");
		    var fromTop = orgTop + SwipeScreen.virtualheight();
		} else if (this.paging == "leftToRight"){
		    var orgLeft = $("#" + this.css_id).attr("__y");
		    var fromLeft = orgLeft + SwipeScreen.virtualwidth();
		} else {
		    var orgLeft = $("#" + this.css_id).attr("__y");
		    var fromLeft = orgLeft - SwipeScreen.virtualwidth();
		}
	    } else {
		if (this.paging == "vertical") {
		    var fromTop = $("#" + this.css_id).attr("__x");
		    var orgTop = fromTop + SwipeScreen.virtualheight();
		} else if (this.paging == "leftToRight"){
		    var fromLeft =  $("#" + this.css_id).attr("__y");
		    var orgLeft = fromLeft + SwipeScreen.virtualwidth();
		} else {
		    var fromLeft =  $("#" + this.css_id).attr("__y");
		    var orgLeft = fromLeft - SwipeScreen.virtualwidth();
		} 
	    }
	    
	    if (this.paging == "vertical") {
		$(element).css("top", fromTop);
		$(element).animate({
		    "top": orgTop
		}, {
		    duration: duration
		});
	    } else {
		$(element).css("left", fromLeft);
		$(element).animate({
		    "left": orgLeft
		}, {
		    duration: duration
		});
	    }
	});

	if (mode == "in") {
	    if (this.paging == "vertical") {
		$("#page_" + step ).css("top", SwipeScreen.virtualheight());
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "top": 0,
		    "opacity": 1
		}, {
		    duration: duration
		});
	    } else if (this.paging == "leftToRight"){
		$("#page_" + step ).css("left", SwipeScreen.virtualwidth());
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": 0,
		    "opacity": 1
		}, {
		    duration: duration
		});
	    } else {
		$("#page_" + step ).css("left", - SwipeScreen.virtualwidth());
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": 0,
		    "opacity": 1
		}, {
		    duration: duration
		});
	    }
	} else {
	    if (this.paging == "vertical") {
		$("#page_" + step ).css("top", 0);
		$("#page_" + step ).animate({
		    "top": SwipeScreen.virtualheight(),
		}, {
		    duration: duration
		});
	    } else if (this.paging == "leftToRight"){
		$("#page_" + step ).css("left", 0);
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": SwipeScreen.virtualwidth(),
		    "opacity": 1
		}, {
		    duration: duration
		});
	    } else {
		$("#page_" + step ).css("left", 0);
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": - SwipeScreen.virtualwidth(),
		    "opacity": 1
		}, {
		    duration: duration
		});
	    }

	}
    }

}
