class SwipeScroll {
    
    static init(size){
	this.size = size;
	this.functions = [];
	this.step = 0;
	this.step_next = 0;

	$(".swipe").width("100%")
	$(".swipe").height($(window).innerHeight())
	$(".swipe").css({position: "fixed"})
	$(".back").height($(".swipe").innerHeight() * size  + "px");
    }
    
    static callback(func){
	this.functions.push(func);
    }

    static call_callback(index, delta, status){
	this.functions.forEach(function(obj, idx) {
	    obj(index, delta, status);
	});
    }
    
    static scrollStart(){
    }
    
    static scrollStop(e) {
	if (this.step == this.step_next) {
	    if (!SwipeScroll.near()){
		if ( $(window).scrollTop() >  $(window).innerHeight() * this.step ) {
		    this.step_next = this.step_next + 1;
		} else {
		    this.step_next = this.step_next - 1;
		}
		if (this.step_next < 0){
		    this.step_next = 0;
		}
		if (this.step_next >= this.size) {
		    this.step_next = this.size - 1;
		}
		SwipeScroll.near_or_move();
	    }
	} else {
	    SwipeScroll.near_or_move();
	}
	$(".swipe").html(this.step);
    }

    static near_or_move(){
	if(SwipeScroll.near()){
	    this.step = this.step_next;
	} else {
	    $(window).scrollTop(this.step_next * $(window).innerHeight());
	}
    }
    
    static near() {
	if (($(window).scrollTop() < (this.step_next * $(window).innerHeight() + 5)) &&
	    ($(window).scrollTop() > (this.step_next * $(window).innerHeight() - 5))){
	    return true;
	}
	return false;
    }
    
    static scroll(e){
    }
    static getStep(){
	return this.step;
    }
    
    static watch() {
	$(window).on("scrollstart", function() {
	    console.log('scrollstart');
	    SwipeScroll.scrollStart();
	    SwipeScroll.call_callback(SwipeScroll.getStep(), 0, "start");
	}).on("scrollstop", function(e) {
	    console.log('scrollstop');
	    SwipeScroll.scrollStop(e);
	    SwipeScroll.call_callback(SwipeScroll.getStep(), 0, "stop");
	}).on("scroll", function(e){
	    console.log('scroll');
	    SwipeScroll.scroll();
	    SwipeScroll.call_callback(SwipeScroll.getStep(), 0, "scroll");
	});
    }

}    


