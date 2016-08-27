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

    static initSwipe(data, default_page, css_id) {
	var swipe_book = new SwipeBook(data, default_page, css_id);
	
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
