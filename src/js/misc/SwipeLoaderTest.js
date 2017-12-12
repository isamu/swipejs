$(document).ready(function() {
    var script = document.createElement('script');
    if (SwipeUtil.getParameterByName("file")) {
	script.src = SwipeUtil.getParameterByName("file");
    } else {
	script.src = './ehon.js';
    }
    document.body.appendChild(script);
});

function callback(data){
    SwipeScreen.setSize(100);
    SwipeUtil.initSwipe(data, "#swipe", "#swipe_back");
}

