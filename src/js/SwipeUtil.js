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
    
}
