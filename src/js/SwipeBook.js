import SwipeCounter from "./SwipeCounter";
import SwipeMediaPlayer from "./SwipeMediaPlayer";
import SwipeScreen from "./SwipeScreen";

export default class SwipeBook {
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

	  this.first_touch = false;
	  this.data = data;
	  this.title = "Swipe";
	  this.pages = [];
	  this.base_css_id = base_css_id;
	  this.back_css_id = back_css_id;
	  this.media_player = SwipeMediaPlayer.getInstance();
	  this.loaded_callback = null;
	  this.start_callback = null;
	  this.finish_callback = null;
	  if (data["type"] == "net.swipe.list") {
	    let html = []
	    this.data.items.forEach((item, item_index) => {
		    html.push('<li><a href="?file=' + item["url"] +  '">' + item["title"]  + '</li>');
	    });
	    $(base_css_id).html("<ul>" + html.join("") + "</ul>");
	    this.setScreen();
	  } else {
      $(base_css_id).html("");
	    // 	"type":"net.swipe.swipe"
	    this.step = defaultPage;
	    
	    SwipeBook.setTemplateElements(this.getTemplateElements());
	    SwipeBook.setMarkdown(this.getMarkdown());
	    this.templatePages = this.getTemplatePages();
	    this.setScreen();
	    this.paging = this.getPaging();
      this.isLoaded = {};
      this.isReady = false;
	    this.isFinished = false;
	    this.load();
	    if (this.step > this.pages.length) {
		    this.step = this.pages.length - 1;
	    }
	    if (this.pages.length > 0) {
		    this.domLoad();
	    }
	  }
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
	    } else if (this.templatePages["*"]) {
		    scene = this.templatePages["*"];
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
    
	  $("#loading").css({
	    height: SwipeScreen.virtualheight(),
	    width: SwipeScreen.virtualwidth(),
	    "z-index": 100,
	    "background-color": "#fff",
	    overflow: "hidden",
	    position: "absolute",
	    left: x
	  });
	  
	  $(this.base_css_id).css({
	    height: SwipeScreen.virtualheight(),
	    width: SwipeScreen.virtualwidth(),
	    overflow: "hidden",
	    position: "absolute",
	    left: x
	  });
	  var height = SwipeScreen.getSize();
	  $(this.back_css_id).css({
	    "background-color": this.bc,
	    "height": height + "vh",
	    "width": "100vw"
	  });
  }
  
  resize() {
	  this.setScreen();
	  for (var i = 0; i < this.pages.length; i++) {
	    this.pages[i].resize();
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
  pageLoad(page_index) {
	  var instance = this;
    var page = this.pages[page_index];
	  page.loadElement();
    
    if (this.loadingBasePage > page_index) {
      $(this.base_css_id).prepend(page.getHtml());
    } else {
	    $(this.base_css_id).append(page.getHtml());
    }
    
    if (page_index == this.loadingBasePage) {
	    $("#page_" + page_index).css("opacity", 1);
	    page.active();
    } else {
	    $("#page_" + page_index).css("opacity", 0);
    }
	  var bc = page.getBc();
	  $("#page_" + page_index).css({"background-color": bc});

    $(".image_element_page_" + page_index).load( function() {
      
	    $(this).attr("__default_width", $(this).width());
	    $(this).attr("__default_height", $(this).height());
      
	    $("#" + $(this).attr("__base_id")).attr("__default_width", $(this).width());
	    $("#" + $(this).attr("__base_id")).attr("__default_height", $(this).height());
      
	    instance.initData($(this).attr("__page_id"), $(this).attr("__element_id"));
	    instance.counterDecrease();
    });
    
	  $(".element_page_" + page_index ).each(function(index, element) {
	    instance.initData($(element).attr("__page_id"), $(element).attr("__element_id"));
	    instance.counterDecrease();
	  });
    
	  $(".video_element_" + page_index ).each(function(index, element) {
	    var __element = instance.pages[$(element).attr("__page_id")].getElement( $(element).attr("__element_id"));
      
	    let player = new MediaElement( $(element).attr("id") + "-video", {
		    flashName: 'flashmediaelement.swf',
		    loop: true,
		    success: function (mediaElement, domObject) { 
		      __element.setVideoElement = mediaElement;
		    }
      });
      
	    this.media_player = SwipeMediaPlayer.getInstance();
	    let data = {
		    media: player,
		    canPlay: false,
		    currentTime: 0,
		    dom: $("#" + $(element).attr("id") + "-video")[0]
	    };
	    if (__element.videoStart) {
		    data["videoStart"] = __element.videoStart;
	    }
	    if (__element.videoDuration) {
		    data["videoDuration"] = __element.videoDuration;
	    }
	    this.media_player.page($(element).attr("__page_id")).push($(element).attr("id"), data);
	    instance.counterDecrease();
	  });
    this.checkAndUpdateNextPage();
    
  }
  
  domLoad() {
	  var instance = this;
    this.loadingPage = this.step;
    this.loadingBasePage = this.step;
    this.loadingPageOffset = 0;
    
    this.pageLoad(this.loadingPage);

	  $("#debug").css({position: "absolute", "z-index": 100})
	  this.setPageSize();
    this.updateCss();
  }

  updateCss(){
	  $(".page").css({"position": "absolute"});
	  $(".image_element").css({"position": "absolute"});
	  $(".image_box").css({"position": "absolute"});
	  $(".element_inner").css({
	    "position" : "relative",
	    "height": "100%",
	    "width": "inherit"
	  });

	  $(".video_element").css({"position": "absolute"});
	  $(".text_element").css({"position": "absolute"});
	  $(".svg_element").css({
	    "position": "absolute"
	  });
  }

  nextLoadPage() {
    if ( (this.pages[this.loadingBasePage + Math.abs(this.loadingPageOffset)] === undefined) &&
         (this.pages[this.loadingBasePage - Math.abs(this.loadingPageOffset)] === undefined)) {
      return null;
    }

    this.loadingPageOffset = this.loadingPageOffset *	-1;
    if (this.loadingPageOffset > -1) {
      this.loadingPageOffset++;
    }
    
    if (this.pages[this.loadingBasePage + this.loadingPageOffset]) {
      this.loadingPage = this.loadingBasePage + this.loadingPageOffset;
      return this.loadingPage;
    }
    return this.nextLoadPage();
  }
  
  counterDecrease(){
	  SwipeCounter.decrease();
	  $("#counter").html(SwipeCounter.getCounter());
    this.checkAndUpdateNextPage()
  }    

  checkAndUpdateNextPage() {
	  if(SwipeCounter.getCounter() == 0){
      if (this.loadingPage == this.step) {
	      $("#loading").remove();
	      this.show(this.step);
      }
      this.isLoaded[this.loadingPage] = true;
      
      var next_page = this.nextLoadPage();
      if (next_page !== null) {
        console.log("load ", next_page);
        this.pageLoad(next_page);
	      this.setPageSize();
        this.updateCss();
      } else {
	      this.loadFinish();
      }
	  }
	  console.log(SwipeCounter.getCounter());
  }
  
  loadFinish(){
    this.isReady = true;
	  // $("#loading").remove();
	  if (this.loaded_callback) {
      this.loaded_callback();
    }
  }
  set_loaded_callback(func) {
	  this.loaded_callback = func;
  }
  set_start_callback(func) {
	  this.start_callback = func;
    console.log( this.start_callback );
  }
  set_finish_callback(func) {
	  this.finish_callback = func;
  }
  initData(page_id, element_id){
	  this.pages[page_id].initElement(element_id);
  }
  
  next(){
    if (this.step === this.pages.length - 1) {
		  this.isFinished = true;
		  if (this.finish_callback) {
		    this.finish_callback(true);
		  }
	  }
	  if (this.isLoaded[this.step + 1]) {
	    if (this.step < this.pages.length - 1){
		    this.show(this.step + 1);
	    }
    } 
  }

  back(){
	  if (this.isLoaded[this.step - 1]) {
	    if (this.step > 0){
		    this.show(this.step - 1);
		    if (this.isFinished) {
		      if (this.finish_callback) {
			      this.finish_callback(false);
		      }
		      this.isFinished = false;
		    }
	    }
	  }
  }
  getStep() {
	  return this.step;
  }
  getPages() {
	  return this.pages;
  }
  getPageSize() {
	  return this.pages.length;
  }
  
  justShow(step) {
	  this.pages[step].justShow();
  }	
  nextAnimate(nextStep) {
	  var play_style = this.pages[nextStep].getPlayStyle();
	  
	  var play = null;
	  if (play_style == "auto") {
	    this.pages[nextStep].delayShow();
	  } else if (play_style == "scroll") {
	    this.pages[nextStep].show();
	  } else if (play_style == "always") {
	    this.pages[nextStep].delayShow();
	  } else if (play_style == "pause") {
	    this.pages[nextStep].finShow();
	  }
  }

  prevAnimate(prevStep) {
	  var play_style = this.pages[prevStep].getPlayStyle();
	  
	  var play = null;
	  if (play_style == "auto") {
	    this.pages[prevStep].finShow();
	  } else if (play_style == "scroll") {
	    this.pages[prevStep].show();
	  } else if (play_style == "always") {
	    this.pages[prevStep].delayShow();
	  } else if (play_style == "pause") {
	    this.pages[prevStep].finShow();
	  }
  }
  
  show(nextStep){
	  var currentStep =  this.step;
	  var mode = (nextStep >= currentStep) ? "forward" : "back";
	  var loaded = (nextStep == currentStep);
	  
	  if (!loaded) {
	    this.pages[currentStep].inactive()
	    this.pages[nextStep].active();
	  }
	  if (!this.first_touch && this.isReady){
	    this.media_player.load();
	    this.first_touch = true;
      if (this.start_callback) {
        this.start_callback();
      }
	  }
	  var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();
	  var currentTransition = this.pages[currentStep].getTransition();
	  var nextTransition = this.pages[nextStep].getTransition();
	  var instance = this;
	  
	  if (mode == "forward") {
	    this.nextAnimate(nextStep);
	    if (nextTransition == "fadeIn") {
		    $("#page_" + nextStep ).animate({ "opacity": 1 }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    }else if (nextTransition == "replace") {
		    $("#page_" + nextStep ).css({ "opacity": 1 });
		    
	    }else if (nextTransition == "scroll") {
		    this.pageSlide("in", nextStep);
	    }else if (nextTransition == "slide") {
		    this.pageSlideDown("in", nextStep, loaded);
	    } else {
		    console.log("wrong transition in step " + String(nextStep));
	    }

	    if (!loaded) {
		    if (currentTransition == "fadeIn") {
		      $("#page_" + currentStep ).animate({ "opacity": 0 }, {
			      duration: SwipeBook.pageInDuration()
		      });
		    }else if (currentTransition == "replace") {
		      setTimeout(function(){
			      $("#page_" + currentStep ).css({ "opacity": 0 });
		      }, SwipeBook.pageInDuration());     
		    } else if (currentTransition == "scroll") {
		      this.pageSlide("out", currentStep);
		    }
	    }


	  } else { // in case back
	    console.log("back");
	    this.prevAnimate(nextStep);
	    if (nextTransition == "fadeIn") {
		    $("#page_" + nextStep).css({"opacity": 0});
		    $("#page_" + nextStep ).animate({ "opacity": 1 }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    } else if (nextTransition == "replace") {
		    if (currentTransition == "replace" ) {
		      setTimeout(function(){
			      $("#page_" + nextStep).css({"opacity": 1});
		      }, SwipeBook.pageInDuration());
		    } else {
		      $("#page_" + nextStep).css({"opacity": 1});
		    }
		    setTimeout(function(){
		      instance.pages[nextStep].doLoopProcess();
		    }, SwipeBook.pageInDuration());
	    } else if (nextTransition == "scroll" && currentTransition == "scroll") {
		    $("#page_" + nextStep).css({"opacity": 1});
		    this.pageSlide("out_back", nextStep);
	    } else {
		    $("#page_" + nextStep).css({"top": 0, "left" :0})
		    $("#page_" + nextStep).css({"opacity": 1});
		    setTimeout(function(){
		      instance.pages[nextStep].doLoopProcess();
		    }, SwipeBook.pageInDuration());
	    }		
	    
	    if (currentTransition == "fadeIn") {
		    $("#page_" + currentStep).css({"opacity": 1});
		    $("#page_" + currentStep).animate({ "opacity": 0 }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    } else if (currentTransition == "replace" ) {
		    this.pages[currentStep].back();
		    setTimeout(function(){
		      $("#page_" + currentStep ).css({"opacity": 0});
		    }, SwipeBook.pageInDuration());
	    } else if (currentTransition == "scroll") {
		    this.pageSlide("in_back", currentStep);
      } else if (currentTransition == "slide") {
		    this.pageSlideDown("back", currentStep, loaded);
	    }		
	  }

	  if (!loaded) {
	    if (this.pages[nextStep].getPlayStyle() == "auto") {
		    console.log("AUTO NEXT");
		    this.media_player.play(nextStep);
	    }
	    if (this.pages[nextStep].getPlayStyle() == "scroll") {
		    console.log("scroll NEXT");
		    this.media_player.play(nextStep);
	    }
	  }
	  if (loaded) {
	    if (this.pages[currentStep].getPlayStyle() == "auto") {
		    this.media_player.play(currentStep);
	    }
	  }
	  this.step = nextStep;
	  location.hash = nextStep;
  }

  pageSlide(mode, step) {
	  console.log("pageSlide");
	  
	  if (mode == "in") {
	    $("#page_" + step ).css("opacity", 1);
	    if (this.paging == "vertical") {
		    $("#page_" + step ).css("top", SwipeScreen.virtualheight());
		    $("#page_" + step ).animate({
		      "top": 0
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css("left", SwipeScreen.virtualwidth());
		    $("#page_" + step ).animate({
		      "left": 0
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    } else if (this.paging == "rightToLeft"){
		    $("#page_" + step ).css("left", - SwipeScreen.virtualwidth());
		    $("#page_" + step ).animate({
		      "left": 0
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    }
	  } else if (mode == "out") {
	    if (this.paging == "vertical") {
		    $("#page_" + step ).css("top", 0);
		    $("#page_" + step ).css("opacity", 1);
		    $("#page_" + step ).animate({
		      "top": - SwipeScreen.virtualheight()
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css("left", 0);
		    $("#page_" + step ).css("opacity", 1);
		    $("#page_" + step ).animate({
		      "left": - SwipeScreen.virtualwidth()
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    } else if (this.paging == "rightToLeft"){
		    $("#page_" + step ).css("left", 0);
		    $("#page_" + step ).css("opacity", 1);
		    $("#page_" + step ).animate({
		      "left": SwipeScreen.virtualwidth()
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    }
	    setTimeout(function(){
		    $("#page_" + step ).css("opacity", 0);
	    }, SwipeBook.pageInDuration());
	    
    } else if (mode == "in_back") {
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
	    } else if (this.paging == "rightToLeft"){
		    $("#page_" + step ).css("left", 0);
		    $("#page_" + step ).css("opacity", 1);
		    $("#page_" + step ).animate({
		      "left": - SwipeScreen.virtualwidth(),
		      "opacity": 1
		    }, option);
	    }
	    setTimeout(function(){
		    $("#page_" + step ).css("opacity", 0);
	    }, SwipeBook.pageInDuration());
	  } else if (mode == "out_back") {
	    $("#page_" + step ).css("opacity", 1);
	    let option = {
		    duration: SwipeBook.pageInDuration(),
	    };
	    if (this.paging == "vertical") {
		    $("#page_" + step ).css("top", - SwipeScreen.virtualheight());
		    $("#page_" + step ).animate({
		      "top": 0,
		    }, option);
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css("left", -SwipeScreen.virtualwidth());
		    $("#page_" + step ).css("opacity", 1);
		    $("#page_" + step ).animate({
		      "left": 0,
		      "opacity": 1
		    }, option);
	    } else if (this.paging == "rightToLeft"){
		    $("#page_" + step ).css("left", SwipeScreen.virtualwidth());
		    $("#page_" + step ).css("opacity", 1);
		    $("#page_" + step ).animate({
		      "left": 0,
		      "opacity": 1
		    }, option);
	    }
	    
	  }
  }

  pageSlideDown(mode, step, loaded) {
	  console.log("pageSlideDown");
	  
	  if (mode == "in") {
		  $("#page_" + step ).css({"opacity": 0});

      let paging = this.paging;
			setTimeout(function(){
		    $("#page_" + step ).css({"opacity": 1});
	      if (paging == "vertical") {
          $("#page_" + step ).css("height", 0);
          $("#page_" + step ).animate({
            "height": SwipeScreen.virtualheight()
          }, {
            duration: SwipeBook.pageInDuration()
          });
        console.log("in vertical slide")
	      } else if (paging == "leftToRight"){
		      $("#page_" + step ).css({"left": 0, "width": 0});
		      $("#page_" + step ).animate({
		        "width":  SwipeScreen.virtualwidth()
		      }, {
		        duration: SwipeBook.pageInDuration()
		      });
	      } else if (paging == "rightToLeft"){
          // not supported
	      }
      }, loaded ? 300 : 0);
        
    } else if (mode == "back") {
      let option = {
	      duration: SwipeBook.pageInDuration(),
        complete: function(){
          $("#page_" + step ).css({"opacity": 0});
        }
      };
      if (this.paging == "vertical") {
        $("#page_" + step ).css("height", SwipeScreen.virtualheight());
	      setTimeout(function(){
          $("#page_" + step ).animate({
            "height": 0
          }, {
            duration: SwipeBook.pageInDuration()
          });
        }, loaded ? 200 : 0);
        console.log("in_back vertical slide")
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css({"left": 0, "width": SwipeScreen.virtualwidth()});
		    $("#page_" + step ).animate({
		      "width": 0
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    } else if (this.paging == "rightToLeft"){
        // not supported
	    }
	    setTimeout(function(){
		    $("#page_" + step ).css("opacity", 0);
	    }, SwipeBook.pageInDuration());
	  }
  }

  pageSlideDown2(mode, step, ratio) {
	  console.log("pageSlideDown");
	  if (mode == "in") {
		  $("#page_" + step ).css({"opacity": 1});
	    if (this.paging == "vertical") {
		    $("#page_" + step ).css({"top": 0, "height":  SwipeScreen.virtualheight() * ratio});
        console.log("in vertical slide")
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css({"left": 0, "width":  SwipeScreen.virtualwidth() * ratio});
	    } else if (this.paging == "rightToLeft"){
        // not supported
	    }
        
    } else if (mode == "back") {
      if (this.paging == "vertical") {
		    $("#page_" + step ).css({"top": 0, "height": SwipeScreen.virtualheight() * (1 + ratio)});
        console.log("in_back vertical slide")
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css({"left": 0, "width": SwipeScreen.virtualwidth() * (1 + ratio)});
	    } else if (this.paging == "rightToLeft"){
        // not supported
	    }
	  }
  }
  

  // scroll
  
  view(ratio) {
	  var nextStep = this.step + ((ratio > 0) ? 1 : - 1);
	  var currentStep =  this.step;
	  var mode = (nextStep >= currentStep) ? "forward" : "back";

	  if (nextStep < 0  || nextStep >= this.pages.length) {
	    return 0;
	  }
	  //this.pages[currentStep].inactive()
	  //this.pages[nextStep].active();

	  if (mode == "forward" && this.pages[nextStep].getPlayStyle() == "scroll") {
	    // for video
	    this.media_player.playing(ratio);
	  }
	  if (mode == "back" && this.pages[currentStep].getPlayStyle() == "scroll") {
	    this.media_player.playing(ratio);
	  }

	  if (this.pages[nextStep].getPlayStyle() == "pause") {
	    // for video
	    this.pages[nextStep].pause();
	  }
	  
	  var transition = this.pages[Math.max(currentStep, nextStep)].getTransition();
	  var currentTransition = this.pages[currentStep].getTransition();
	  var nextTransition = this.pages[nextStep].getTransition();
	  var instance = this;
	  
	  if (mode == "forward") {
	    // transition 
	    if (nextTransition == "fadeIn") {
		    $("#page_" + nextStep ).css({ "opacity": ratio });
	    }else if (nextTransition == "replace") {
		    $("#page_" + nextStep ).css({ "opacity": 1 });
	    }else if (nextTransition == "scroll") {
		    this.pageSlide2("in", nextStep, ratio);
	    }else if (nextTransition == "slide") {
		    this.pageSlideDown2("in", nextStep, ratio);
	    } else {
		    console.log("wrong transition in step " + String(nextStep));
	    }
	  } else { // in case back
	    console.log("back");
	    // transition 
	    if (nextTransition == "fadeIn") {
		    $("#page_" + nextStep).css({"opacity": Math.abs(ratio)});
	    }
	    
	    if (currentTransition == "fadeIn") {
		    $("#page_" + currentStep).css({"opacity": (1 - Math.abs(ratio))});
	    } else if (currentTransition == "scroll") {
		    this.pageSlide2("in_back", currentStep, ratio);
	    } else if (currentTransition == "slide") {
		    this.pageSlideDown2("back", currentStep, ratio);
	    }		

	  }
	  
  }
  nextStart(ratio){
	  if (!this.first_touch && this.isReady){
	    this.media_player.load();
      /*
	      $("video").each(( video_index, video) => {
		    // todo video
		    video.load();
	      });
      */
      if (this.start_callback) {
        this.start_callback();
      }
	    this.first_touch = true;
	  }
	  
	  if (this.step + 1 >= this.pages.length) {
		  this.isFinished = true;
	    if (this.finish_callback) {
		    this.finish_callback(true);
		  }
	    return 0;
	  }
	  var nextPlayStyle = this.pages[this.step + 1 ].getPlayStyle();
	  
	  this.pages[this.step + 1].prevShow();
	  if (nextPlayStyle == "scroll") {
	    $("#page_" + String(this.step + 1)).css("opacity", 1);
	    this.pages[this.step + 1].animateShow();
	  }

	  if (this.pages[this.step + 1].getPlayStyle() == "auto") {
	    this.media_player.play(this.step + 1);
	  }
 	  if (this.pages[this.step + 1].getPlayStyle() == "scroll") {
	    this.media_player.play(this.step + 1);
	  }
 	  if (this.pages[this.step + 1].getPlayStyle() == "always") {
	    this.media_player.play(this.step + 1);
	  }
 	  if (this.pages[this.step + 1].getPlayStyle() == "pause") {
	    this.media_player.play(this.step + 1);
	    // todo
	  }
  }

  nextHide() {
	  var nextStep = this.step + 1;
	  if (nextStep >= this.pages.length) {
	    return 0;
	  }
	  $("#page_" +  (nextStep) ).css("opacity", 0);
	  this.pages[nextStep].finShow();
  }
  nextEnd(){
	  var nextStep = this.step + 1;
	  if (nextStep >= this.pages.length) {
	    return 0;
	  }
	  $("#page_" +  (this.step) ).css("opacity", 0 );
	  $("#page_" +  (nextStep) ).css("top", 0 );
	  $("#page_" +  (nextStep) ).css("left", 0 );
	  $("#page_" +  (nextStep) ).css("opacity", 1);
    $("#page_" +  (nextStep) ).css("width",  SwipeScreen.virtualwidth());
    $("#page_" +  (nextStep) ).css("height",  SwipeScreen.virtualheight());
    
	  var nextPlayStyle = this.pages[nextStep].getPlayStyle();

	  if (nextPlayStyle == "scroll") {
	    this.pages[nextStep].finShow();
	  } else if (nextPlayStyle == "auto" || nextPlayStyle == "always") {
	    this.pages[nextStep].show();
	  }
	  this.step = nextStep;
	  location.hash = nextStep;
  }
  prevStart(ratio){
	  console.log("prevStart");
	  if (this.step <= 0) {
	    return 0;
	  }
	  if (this.isFinished) {
	    if (this.finish_callback) {
		    this.finish_callback(false);
	    }
	    this.isFinished = false;
	  }
	  
	  var prevPlayStyle = this.pages[this.step - 1 ].getPlayStyle();
	  var currentPlayStyle = this.pages[this.step].getPlayStyle();

	  $("#page_" + String(this.step - 1)).css("opacity", 1);
	  if (prevPlayStyle == "always") {
	    this.pages[this.step - 1].prevShow();
	    this.media_player.play(this.step - 1);
	  } else {
	    this.pages[this.step - 1].finShow();
	    this.media_player.setCurrent(this.step - 1);
	  }
	  if (currentPlayStyle == "scroll") {
	    this.pages[this.step].finShow();
	    this.pages[this.step].animateShowBack();
	  }
  }
  prevHide(){
	  var nextStep = this.step - 1;
	  if (nextStep < 0) {
	    return 0;
	  }
	  $("#page_" +  (nextStep) ).css("opacity", 0);
	  this.pages[nextStep].finShow();
  }
  prevEnd(){
	  var nextStep = this.step - 1;
	  if (nextStep < 0) {
	    return 0;
	  }
	  $("#page_" +  (this.step) ).css("opacity", 0 );
	  $("#page_" +  (nextStep) ).css("opacity", 1);
	  $("#page_" +  (nextStep) ).css("top", 0 );
	  $("#page_" +  (nextStep) ).css("left", 0 );
	  var nextPlayStyle = this.pages[nextStep].getPlayStyle();
	  if (nextPlayStyle == "always") {
	    this.pages[nextStep].show();
	  } else {
	    this.pages[nextStep].finShow();
	  }
	  this.step = nextStep;
	  location.hash = nextStep;
  }
  pageSlide2(mode, step, ratio) {
	  if (mode == "in") {
	    $("#page_" + step ).css("opacity", 1);
	    if (this.paging == "vertical") {
		    $("#page_" + step ).css("top", SwipeScreen.virtualheight() * (1 - ratio));
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css("left", SwipeScreen.virtualwidth() * (1 - ratio));
	    } else if (this.paging == "rightToLeft"){
		    $("#page_" + step ).css("left", - SwipeScreen.virtualwidth());
		    $("#page_" + step ).animate({
		      "left": 0
		    }, {
		      duration: SwipeBook.pageInDuration()
		    });
	    }
	  } else if (mode == "in_back") {
	    if (this.paging == "vertical") {
		    $("#page_" + step ).css("top",  - SwipeScreen.virtualheight() * ratio);
	    } else if (this.paging == "leftToRight"){
		    $("#page_" + step ).css("left", - SwipeScreen.virtualheight() * ratio);
		    $("#page_" + step ).css("opacity", 1);
	    } else if (this.paging == "rightToLeft"){
		    $("#page_" + step ).css("left", SwipeScreen.virtualheight() * ratio);
		    $("#page_" + step ).css("opacity", 1);
	    }
	  }
  }
  
}
