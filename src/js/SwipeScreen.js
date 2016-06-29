class SwipeScreen {

    static init(width, height){
	this.width = width;
	this.height = height;

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
	this.virtual_height = $(window).height();
	this.virtual_width = this.width / this.height * this.virtual_height;
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
