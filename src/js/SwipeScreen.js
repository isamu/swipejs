class SwipeScreen {

    static init(width, height){
	this.width = width;
	this.height = height;

	if (this.width == 0) {
	    this.width = this.height * $(window).width() / $(window).height();
	}
	if (this.height == 0) {
	    this.height =  this.width * $(window).height() /  $(window).width();
	}
	
	SwipeScreen.setOriginalSize();
	SwipeScreen.setVirtualSize();
	
    }

    static setOriginalSize() {
	this.window_width = $(window).width();
	this.window_height = $(window).height();
    }

    // todo
    //  set vertical and horizontal mode
    static setVirtualSize() {
	var real_ration = this.window_width / this.window_height;
	var virtual_ration = this.width / this.height;
	this.ration = 1.0;
	
	if (real_ration / virtual_ration >= 1) {
	    this.virtual_height = $(window).height();
	    this.virtual_width = this.width / this.height * this.virtual_height;
	} else {
	    this.virtual_width = $(window).width();
	    this.virtual_height = this.height / this.width * this.virtual_width;
	}
	this.ration = this.virtual_width / this.width;
    }

    static getRation(){
	return this.ration;
    }
    static swipewidth() {
	return this.width;
    }

    static swipeheight() {
	return this.height;
    }

    static virtualwidth() {
	return this.virtual_width;
    }

    static virtualheight() {
	return this.virtual_height;
    }

    static refresh() {
	SwipeScreen.setOriginalSize();
	SwipeScreen.setVirtualSize();
    }
    
    // width
    static virtualX(x){
	if(x == undefined){
	    return this.virtual_width;
	}
	if(this.width) {
	    return x / this.width * this.virtual_width;
	}
	return x;
    }
    
    
    static virtualY(y){
	if(y == undefined){
	    return this.virtual_height;
	}
	if(this.height) {
	    return y / this.height * this.virtual_height;
	}
	return y;
    }
    
}
