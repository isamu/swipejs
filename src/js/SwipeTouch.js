class SwipeTouch {
    static init(options = {}) {
	this.startY = 0;
	this.currentY = 0;
	this.diff = 0;
	this.ration = 0;
	this.options = options;
	this.status = "stop";
	
	var dom = options.dom ? options.dom : window;

	var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

	var self = this;
	$(window).on("scrollstart", function(e) {
	    var current = e.originalEvent.clientY ? e.originalEvent.clientY : event.changedTouches[0].pageY;

	    self.currentY = current;
	    self.startY  = current;
	    SwipeTouch.start_event(e);
	    //$("#debug").html("start" + current);
	}).on(scroll_event, function(e){
	    e.preventDefault();
	    
	    var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
	    if (delta || delta === 0) { 
		self.currentY = self.currentY - delta;
	    } else {
		self.currentY = event.changedTouches[0].pageY;
	    }
	    //$("#debug").html("scroll" + self.currentY );
	    self.diff =  self.currentY - self.startY;
	    self.ration =   (self.diff / $(window).innerHeight());

	    if (self.ration > 1){ self.ration = 1;}
	    if (self.ration < -1){ self.ration = -1;}

	    SwipeTouch.scroll_event_handler(e, self.ration);
	}).on("scrollstop", function(e) {
	    //$("#debug").html("scroll stop");
	    SwipeTouch.stop_event(e);
	}).on("touchstart", function(e) {
	    var current = e.originalEvent.clientY ? e.originalEvent.clientY : event.changedTouches[0].pageY;
	    self.startY  = current;
	    SwipeTouch.start_event(e);
	}).on('touchmove.noScroll', function(e) {
	    e.preventDefault();
	    
	    var current = (e.originalEvent && e.originalEvent.pageY) ? e.originalEvent.pageY : event.changedTouches[0].pageY;
	    self.diff = self.startY - current;
	    self.ration = self.diff / $(window).innerHeight()      
	    //$("#debug").html("touchmove" + self.startY +":" + current );
	    SwipeTouch.scroll_event_handler(e, self.ration);
	}).on("touchend", function(e) {
	    //$("#debug").html("touchend");
	    SwipeTouch.stop_event(e);
	});
    }	     
    
    static scroll_event_handler(event, ration) {
	console.log("scroll");
	this.status = "scroll";
	if(this.options.scroll_callback) {
	    this.options.scroll_callback(event, ration)
	}
    }

    static stop_event(event){
	console.log("stop");
	this.status = "stop";
	if(this.options.stop_callback) {
	    this.options.stop_callback(event, this.ration)
	}
    }
    
    static getRation() {
	return this.ration;
    }
    static start_event(){
	this.ration = 0;
	console.log("start");
	this.status = "start";
	if(this.options.start_callback) {
	    this.options.start_callback(event, this.ration)
	}
    }

    static getStatus() {
	return this.status;
    }
		 
    
}
