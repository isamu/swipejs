$(document).ready(function() {
    $(".swipe").html("<div class='test'><h1>swipe</h1></div>")
    $(".test").width("100%")
    $(".test").height($(window).innerHeight())
    $(".test").css({position: "fixed"})

    var script = document.createElement('script');
    if (getParameterByName("file")) {
	script.src = getParameterByName("file");
    } else {
	script.src = './hirano.js';
    }
    document.body.appendChild(script);
    

});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function callback(data){
    var default_page = 0;
    
    if (location.hash) {
 	default_page = Number(location.hash.substr(1));
    }
    
    var swipe_loader = new SwipeLoader(data, default_page);
    
    $(".swipe").on("click", function(){
	swipe_loader.next();
    });
    
    $(window).on('hashchange', function(){
	if( ("#" + swipe_loader.getStep()) != location.hash) {
	    swipe_loader.show(Number(location.hash.substr(1)));
	}
    });

    $(window).resize(function() {
	clearTimeout(window.resizedFinished);
	window.resizedFinished = setTimeout(function(){
	    swipe_loader.resize();
	}, 250);
    });
    
};

