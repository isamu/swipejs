"use strict";

$(document).ready(function () {
    var script = document.createElement('script');
    if (SwipeUtil.getParameterByName("file")) {
        script.src = SwipeUtil.getParameterByName("file");
    } else {
        script.src = './hirano.js';
    }
    document.body.appendChild(script);
});

function callback(data) {
    SwipeScreen.setSize(50);
    SwipeUtil.initSwipe(data, "#swipe", "#swipe_back");
}