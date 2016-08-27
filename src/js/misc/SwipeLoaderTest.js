$(document).ready(function() {
    var script = document.createElement('script');
    if (SwipeUtil.getParameterByName("file")) {
	script.src = SwipeUtil.getParameterByName("file");
    } else {
	script.src = './hirano.js';
    }
    document.body.appendChild(script);
});

function callback(data){
    var default_page = 0;
    
    if (location.hash) {
 	default_page = Number(location.hash.substr(1));
    }
    
    SwipeUtil.initSwipe(data, default_page, "#swipe", "#swipe_back");
}

