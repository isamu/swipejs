class SwipeBook {
    static setTemplateElements(template) {
	this.templateElements = template;
    }
    static getTemplateElements() {
	return this.templateElements;
    }
    static setMarkdown(markdown) {
	this.markdown = markdown;
    }
    static getMarkdown() {
	return this.markdown;
    }
    static pageInDuration(){
	return 400;
    }
    constructor (data, defaultPage = 0, base_css_id, back_css_id) {
        $('head').prepend('<meta name="viewport" content="width = 640,user-scalable=no">');

	this.step = defaultPage;
	this.data = data;
	this.pages = [];
	this.title = "Swipe";
	this.base_css_id = base_css_id;
	this.back_css_id = back_css_id;
	
	SwipeBook.setTemplateElements(this.getTemplateElements());
	SwipeBook.setMarkdown(this.getMarkdown());
	this.templatePages = this.getTemplatePages();
	this.setScreen();
	this.paging = this.getPaging();
	this.load();
	this.domLoad();
    }
    
    setScreen() {
	this.dimension = (this.data.dimension) ? this.data.dimension : [ $(window).width(),  $(window).height() ];
	SwipeScreen.init(this.dimension[0], this.dimension[1]);
	this.bc = this.data.bc || "#a9a9a9";
	this.setSwipeCss();
    }
    
    load(){
	$.each(this.data["pages"], (index, page) => {
	    var scene;
	    if (page["scene"] && (scene = this.templatePages[page["scene"]]) ){
		scene = this.templatePages[page["scene"]];
	    }
	    if (page["template"] && (scene = this.templatePages[page["template"]]) ){
		scene = this.templatePages[page["template"]];
	    }
	    var pageInstance = new SwipePage(page, scene, index);

	    this.pages.push(pageInstance);
	});
	if (this.data["title"]) {
	    this.title = this.data["title"];
	    document.title = this.title;
	}
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

    getMarkdown() {
	if (this.data["markdown"]) {
	    return this.data["markdown"];
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
	var x = ($(window).width() -  SwipeScreen.virtualwidth()) / 2.0;
	$(this.base_css_id).css({
	    height: SwipeScreen.virtualheight(),
	    width: SwipeScreen.virtualwidth(),
	    position: "absolute",
	    left: x
	});
	$(this.back_css_id).css({
	    "background-color": this.bc,
	    "height": "100vh",
	    "width": "100vw"
	});
    }
    
    resize() {
	this.setScreen();
	for (var i = 0; i < this.pages.length; i++) {
	    this.justShow(i);
	}
	this.setPageSize();
    }

    setPageSize(){
	$("svg").css("overflow", "visible");
	$(".page").css({
	    "overflow": "hidden",
	    "height": SwipeScreen.virtualheight(),
	    "width": SwipeScreen.virtualwidth()
	});
    }
    domLoad() {
	var pages = [];
	var instance = this;
	this.pages.forEach((page, page_index) => {
	    page.loadElement();
	    pages.push(page.getHtml());
	});
	
	$(this.base_css_id).html(pages.join(""));
	
	this.setPageSize();
	$(".page").css("opacity", 0);
	$("#page_" + this.step).css("opacity", 1);

	this.pages[this.step].active();

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
	this.pages.forEach((page, page_index) => {
	    var bc = page.getBc();
	    $("#page_" + page_index).css({"background-color": bc});
	});
	$(".page").css({"position": "absolute"});
	$(".image_element").css({"position": "absolute"});
	$(".video_element").css({"position": "absolute"});
	$(".text_element").css({"position": "absolute"});
	$(".svg_element").css({"position": "absolute"});
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

    back(){
	if (this.step > 0){
	    this.show(this.step - 1);
	}
    }
    
    justShow(step) {
	this.pages[step].justShow();
    }	

    show(nextStep){
	var currentStep =  this.step;
	var mode = (nextStep >= currentStep) ? "forward" : "back";
	var loaded = (nextStep == currentStep);
	var same_scene = (this.pages[currentStep].getScene()) && (this.pages[nextStep]) &&
	    (this.pages[nextStep].getScene() == this.pages[currentStep].getScene());
	
	if (!loaded) {
	    this.pages[currentStep].inactive()
	    this.pages[nextStep].active();
	}
	var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();

	
	if (mode == "forward") {
	    if (same_scene) {
		this.pages[nextStep].show();
		this.pages[nextStep].play();
		$("#page_" + currentStep ).css("opacity", 0);
		$("#page_" + nextStep ).css("opacity", 1);
	    } else {
		// transition 
		if (transition == "fadeIn") {
		    this.pages[nextStep].finShow();
		    $("#page_" + nextStep ).animate({ "opacity": 1 }, {
			duration: SwipeBook.pageInDuration()
		    });
		}else if (transition == "replace") {
		    $("#page_" + currentStep ).css({ "opacity": 0 });
		    $("#page_" + nextStep ).css({ "opacity": 1 });
		    this.pages[nextStep].finShow();
		}else if (transition == "scroll") {
		    setTimeout(function(){
			$("#page_" + currentStep ).css({
			    "opacity": 0
			});
		    }, SwipeBook.pageInDuration());
		    this.pageSlide("in", nextStep);
		    this.pages[nextStep].delayShow();
		} else {
		    
		}
	    }
	} else { // in case back
	    console.log("back");
	    if (same_scene) {
		this.pages[currentStep].back();
		setTimeout(function(){
		    $("#page_" + currentStep ).css({"opacity": 0});
		    $("#page_" + nextStep).css({"opacity": 1});
		}, SwipeBook.pageInDuration());
	    } else {
		// transition 
		if (transition == "fadeIn") {
		    this.pages[nextStep].finShow();
		    $("#page_" + currentStep ).animate({ "opacity": 0 }, {
			duration: SwipeBook.pageInDuration()
		    });
		}else if (transition == "replace") {
		    $("#page_" + currentStep ).css({ "opacity": 0 });
		    $("#page_" + nextStep ).css({ "opacity": 1 });
		    this.pages[nextStep].finShow();
		}else if (transition == "scroll") {
		    $("#page_" + nextStep).css({"opacity": 1});
		    this.pages[currentStep].back();
		    this.pageSlide("out", currentStep);
		    this.pages[nextStep].finShow();
		}
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
		    duration: SwipeBook.pageInDuration()
		});
	    } else {
		$(element).css("left", fromLeft);
		$(element).animate({
		    "left": orgLeft
		}, {
		    duration: SwipeBook.pageInDuration()
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
		    duration: SwipeBook.pageInDuration()
		});
	    } else if (this.paging == "leftToRight"){
		$("#page_" + step ).css("left", SwipeScreen.virtualwidth());
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": 0,
		    "opacity": 1
		}, {
		    duration: SwipeBook.pageInDuration()
		});
	    } else {
		$("#page_" + step ).css("left", - SwipeScreen.virtualwidth());
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": 0,
		    "opacity": 1
		}, {
		    duration: SwipeBook.pageInDuration()
		});
	    }
	} else {
	    let option = {
		duration: SwipeBook.pageInDuration(),
		complete: function(){
		    $("#page_" + step ).css({"opacity": 0});
		}
	    };
	    if (this.paging == "vertical") {
		$("#page_" + step ).css("top", 0);
		$("#page_" + step ).animate({
		    "top": SwipeScreen.virtualheight(),
		}, option);
	    } else if (this.paging == "leftToRight"){
		$("#page_" + step ).css("left", 0);
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": SwipeScreen.virtualwidth(),
		    "opacity": 1
		}, option);
	    } else {
		$("#page_" + step ).css("left", 0);
		$("#page_" + step ).css("opacity", 1);
		$("#page_" + step ).animate({
		    "left": - SwipeScreen.virtualwidth(),
		    "opacity": 1
		}, option);
	    }

	}
    }

}
