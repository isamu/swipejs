class SwipeTouch {
  static init(options = {}) {
	  this.startY = 0;
	  this.currentY = 0;
	  this.diff = 0;
	  this.ratio = 0;
	  this.options = options;
	  this.status = "stop";
    
	  // this.paging = "vertical"; //"rightToLeft", "leftToRight"
	  this.paging = options.paging ?  options.paging : "vertical";
    console.log(this.paging);
    // "leftToRight"; //"rightToLeft", "leftToRight"
	  // this.paging = "rightToLeft"; //"rightToLeft", "leftToRight"
    
	  var dom = options.dom ? options.dom : window;

	  var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    
	  let self = this;
	  $(window).on("scrollstart", function(e) {
	    let current;
      if (self.paging == "rightToLeft" || self.paging == "leftToRight") {
	      current = e.originalEvent.clientX ? e.originalEvent.clientX : event.changedTouches[0].pageX;
      } else if (self.paging	== "vertical") {
        current = e.originalEvent.clientY ? e.originalEvent.clientY : event.changedTouches[0].pageY;
      }
       
	    self.currentY = current;
	    self.startY  = current;
	    SwipeTouch.start_event(e);
	  }).on(scroll_event, function(e){
	    e.preventDefault();
	    
	    let delta;
      if (self.paging == "rightToLeft" || self.paging == "leftToRight") {
	      delta = e.originalEvent.deltaX ? -(e.originalEvent.deltaX) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
      } else if (self.paging  == "vertical") {
        delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
      }
      
	    if (delta || delta === 0) { 
		    self.currentY = self.currentY - delta;
	    } else {
        if (self.paging == "rightToLeft" || self.paging == "leftToRight") {
		      self.currentY = event.changedTouches[0].pageX;
        } else if (self.paging  == "vertical") {
		      self.currentY = event.changedTouches[0].pageY;
        }
	    }
	    self.diff =  self.currentY - self.startY;
      if (self.paging == "rightToLeft") {
	      self.ratio = (self.diff / $(window).innerWidth());
      } else if (self.paging == "leftToRight") {
	      self.ratio = - (self.diff / $(window).innerWidth());
      } else if (self.paging  == "vertical") {
	      self.ratio = (self.diff / $(window).innerHeight());
      }
	    if (self.ratio > 1){ self.ratio = 1;}
	    if (self.ratio < -1){ self.ratio = -1;}

	    SwipeTouch.scroll_event_handler(e, self.ratio);
	  }).on("scrollstop", function(e) {
      console.log("scrollstop");
	    SwipeTouch.stop_event(e);
	  }).on("touchstart", function(e) {
	    var current;
      if (self.paging == "rightToLeft" || self.paging == "leftToRight") {
	      current = e.originalEvent.clientX ? e.originalEvent.clientX : event.changedTouches[0].pageX;
      } else if (self.paging  == "vertical") {
        current = e.originalEvent.clientY ? e.originalEvent.clientY : event.changedTouches[0].pageY;
      }
	    self.startY  = current;
	    SwipeTouch.start_event(e);
	  }).on('touchmove.noScroll', function(e) {
	    e.preventDefault();
      let current;
      if (self.paging == "rightToLeft" || self.paging == "leftToRight") {
	      current = (e.originalEvent && e.originalEvent.pageX) ? e.originalEvent.pageX : event.changedTouches[0].pageX;
      } else if (self.paging  == "vertical") {
	      current = (e.originalEvent && e.originalEvent.pageY) ? e.originalEvent.pageY : event.changedTouches[0].pageY;
      }
	    self.diff = self.startY - current;
      if (self.paging == "rightToLeft") {
        self.ratio = self.diff / $(window).innerWidth();
      } else if (self.paging == "leftToRight") {
	      self.ratio = - self.diff / $(window).innerWidth();
      } else if (self.paging  == "vertical") {
	      self.ratio = self.diff / $(window).innerHeight();
      }
	    SwipeTouch.scroll_event_handler(e, self.ratio);
	  }).on("touchend", function(e) {
	    SwipeTouch.stop_event(e);
	  });
  }	     
  
  static scroll_event_handler(event, ratio) {
	  console.log("scroll");
	  this.status = "scroll";
	  if(this.options.scroll_callback) {
	    this.options.scroll_callback(event, ratio)
	  }
  }

  static stop_event(event){
	  console.log("stop");
	  this.status = "stop";
	  if(this.options.stop_callback) {
	    this.options.stop_callback(event, this.ratio)
	  }
  }
  
  static getRatio() {
	  return this.ratio;
  }
  static start_event(){
	  this.ratio = 0;
	  console.log("start");
	  this.status = "start";
	  if(this.options.start_callback) {
	    this.options.start_callback(event, this.ratio)
	  }
  }

  static getStatus() {
	  return this.status;
  }
}
