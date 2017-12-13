class SwipeUtil {
  static getParameterByName(name, url) {
	  if (!url) url = window.location.href;
	  name = name.replace(/[\[\]]/g, "\\$&");
	  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
	  if (!results) return null;
	  if (!results[2]) return '';
	  return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  static initSwipe(data, css_id, back_css_id) {
	  $(document.body).css({"margin":0, "padding": 0, "background-color": "#fff", "font-size": "26px"})
	  $('div').css({"margin":0, "padding": 0, "background-color": "#fff", "font-size": "26px"})
	  
	  var default_page = 0;
	  
	  if (location.hash) {
      default_page = Number(location.hash.substr(1));
	  }

	  var swipe_book = new SwipeBook(data, default_page, css_id, back_css_id);
	  this.swipe_book = swipe_book;
	  
	  $(css_id).on("click", function(){
	    swipe_book.next();
	  });
	  
	  $(window).on('hashchange', function(){
	    if( ("#" + swipe_book.getStep()) != location.hash) {
		    swipe_book.show(Number(location.hash.substr(1)));
	    }
	  });

	  $(window).resize(function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
		    swipe_book.resize();
	    }, 250);
	  });

	  if (SwipeUtil.getParameterByName("autoplay") === "1") {
	    var autoplayDuration  = SwipeUtil.getParameterByName("autoplayDuration")  || 1000;
	    console.log("duatio " +autoplayDuration);
	    var autoplay = function() {
		    setTimeout(function(){
		      swipe_book.next();
		      var current = Number(location.hash.substr(1));
		      console.log(swipe_book.getPageSize());
		      if (swipe_book.getPageSize() >  current + 1) {
			      autoplay();
		      } else if (SwipeUtil.getParameterByName("autoloop") === "1") {
			      setTimeout(function(){
			        swipe_book.show(0);
			        autoplay();
			      }, autoplayDuration);
		      }
		    }, autoplayDuration)
	    };
	    autoplay();
	  }
	  
  };

  static getSwipeBook(){
	  return this.swipe_book;
  }
  
  static merge(object1, object2) {
	  var newObject = {};
	  var keys = Object.keys(object1);
	  for (var i = 0; i < keys.length; i++) {
	    newObject[keys[i]] = object1[keys[i]];
	  }
	  keys = Object.keys(object2);
	  for (i = 0; i < keys.length; i++) {
	    newObject[keys[i]] = object2[keys[i]];
	  }
	  return newObject;
  }

  static initTouchSwipe(data){
	  $(document.body).css({"margin":0, "padding": 0, "background-color": "#fff", "font-size": "26px"})
	  $('div').css({"margin":0, "padding": 0, "background-color": "#fff", "font-size": "26px"})
	  $('#swipe_back').css({"touch-action": "none"});

	  var swipe_book = new SwipeBook(data, 0, "#swipe", "#swipe_back");
	  this.swipe_book = swipe_book;
	  this.ratio = null;
	  $(window).resize(function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
		    swipe_book.resize();
	    }, 250);
	  });
	  
	  $.extend($.easing,
		         {
		           swipe: function (x, t, b, c, d) {
			           return Math.abs(SwipeUtil.getRatio());
		           },
		           swipeangle: function (x, t, b, c, d) {
			           return b + Math.abs(SwipeUtil.getRatio()) * c
		           }
		           
		         });
	  
	  SwipeTouch.init({
	    start_callback: SwipeUtil.start_event,
	    scroll_callback: SwipeUtil.scroll_event_handler,
	    stop_callback: SwipeUtil.stop_event
	  });
	  
  }
  static getRatio(){
	  return  this.ratio;
  }
  static setRatio(ratio){
	  this.ratio = ratio;
  }

  static getStatus(){
	  return this.status;
  }
  static setStatus(status){
	  this.status = status;
  }
  
  static start_event(event, ratio){
	  var swipe_book = SwipeUtil.getSwipeBook();
	  if (SwipeUtil.getStatus() == "stopping") {
	    SwipeUtil.stop();
	  }
	  this.ratio = 0;
	  console.log("start ratio " + String(ratio));
	  SwipeUtil.setStatus("start");
  }

  static scroll_event_handler(event, ratio) {
	  var currentStatus = "start";
	  SwipeUtil.setRatio(ratio);
	  if (ratio > 0) {
	    currentStatus = "forward";
	  }
	  if (ratio < 0) {
	    currentStatus = "back";
	  }
	  
	  var swipe_book = SwipeUtil.getSwipeBook();
	  if (currentStatus != SwipeUtil.getStatus()) {
	    if (currentStatus == "forward") {
		    if (SwipeUtil.getStatus() == "back") {
		      swipe_book.prevHide();
		    }
		    swipe_book.nextStart(ratio);
	    }
	    if (currentStatus == "back") {
		    if (SwipeUtil.getStatus() == "forward") {
		      swipe_book.nextHide();
		    }
		    swipe_book.prevStart(ratio);
	    }
	    SwipeUtil.setStatus(currentStatus);
	  }
	  
	  swipe_book.view(ratio);
  }
	
  static stop_event(event, ratio){
	  SwipeUtil.setRatio(ratio);
	  if (ratio > 0) {
	    SwipeUtil.setStatus("stopping");
	    SwipeUtil.go_ratio(0.03);
	  } else {
	    SwipeUtil.setStatus("stopping");
	    SwipeUtil.go_ratio(-0.03);
	  }
  }

  static stop(){
	  var swipe_book = SwipeUtil.getSwipeBook();
	  SwipeUtil.setStatus("stop");
	  if (this.ratio > 0){
	    SwipeUtil.setRatio(1);
	    swipe_book.nextEnd();
	  } else if (this.ratio < 0){
	    SwipeUtil.setRatio(-1);
	    swipe_book.prevEnd();
	  }
  }

  static go_ratio(delta) {
	  if( SwipeUtil.getStatus() != "stopping") {
	    return ;
	  }
	  this.ratio = this.ratio + delta;
	  
	  var swipe_book = SwipeUtil.getSwipeBook();
	  if (Math.abs(this.ratio) > 1){
	    SwipeUtil.stop();
	  } else {
	    var swipe_book = SwipeUtil.getSwipeBook();
	    swipe_book.view(this.ratio);
	    
	    setTimeout(function(){
		    SwipeUtil.go_ratio(delta);
	    }, 20);
	  }
  }
	
  
}
