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
	

	var swipe_book = new SwipeBook(data, 0, "#swipe", "#swipe_back");
	this.swipe_book = swipe_book;
    
	$(window).resize(function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
		swipe_book.resize();
	    }, 250);
	});
	

	function scroll_event_handler(event, ration) {
	    //show_status(event, ration);
	    var swipe_book = SwipeUtil.getSwipeBook();
	    swipe_book.view(ration);
	}
	
	function stop_event(event, ration){
	    if (ration > 0) {
		go_ration(ration, 0.1);
	    } else {
		//	step = step - 1;
		go_ration(ration, -0.1);
	    }
	    // go_ration(ration);
	}
	
	function go_ration(ration, delta) {
	    ration = ration + delta;
	    var swipe_book = SwipeUtil.getSwipeBook();
	    
	    if (ration > 1){
		ration = 1;
		swipe_book.nextEnd();
	    } else if (ration < -1){
		ration = -1;
		swipe_book.prevEnd();
		
	    } else {
		var swipe_book = SwipeUtil.getSwipeBook();
		swipe_book.view(ration);
		
		setTimeout(function(){
		    go_ration(ration, delta);
		}, 10);
	    }
	}
	
	function start_event(event, ration){
	    var swipe_book = SwipeUtil.getSwipeBook();
	    if (ration > 0) {
		swipe_book.nextStart(ration);
	    } else {
		swipe_book.prevStart(ration);
	    }		
	}
	
	$.extend($.easing,
		 {
		     swipe: function (x, t, b, c, d) {
			 // console.log(SwipeTouch.getRation());
			 return SwipeTouch.getRation();
		     }
		 });
	
	SwipeTouch.init({
	    start_callback: start_event,
	    scroll_callback: scroll_event_handler,
	    stop_callback: stop_event
			});
	
    }
}
