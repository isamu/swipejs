$(document).ready(function() {
    $(".swipe").html("<div class='test'><h1>swipe</h1></div>")
    $(".test").width("100%")
    $(".test").height($(window).innerHeight())
    $(".test").css({position: "fixed"})
    SwipeScroll.init(5);
    SwipeScroll.callback(function(index, delta, status){
	$(".swipe").html("<div class='test'><h1>" + index + "/" + status +"</h1></div>")
	console.log(index);
    });
    SwipeScroll.watch();
});
