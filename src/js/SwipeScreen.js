class SwipeScreen {
  static getSize(){
	  if (this.size) {
	    return this.size[1];
	  } else {
	    return 100;
	  }
  }
  static setSize(size){
	  this.size = [size, size];
  }
  static setSizes(width, height){
	  this.size = [width, height];
  }

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
    var size = this.size || [100, 100]
	  var real_ratio = (this.window_width * size[0]) / (this.window_height * size[1]);
	  var virtual_ratio = this.width / this.height;
	  this.ratio = 1.0;
	  
	  if (real_ratio / virtual_ratio >= 1) {
	    this.virtual_height = $(window).height() * size[1] / 100;
	    this.virtual_width = this.width / this.height * this.virtual_height;
	  } else {
	    this.virtual_width = $(window).width()  * size[0] / 100;
	    this.virtual_height = this.height / this.width * this.virtual_width;
	  }
	  this.ratio = this.virtual_width / this.width;
  }

  static getRatio(){
	  return this.ratio;
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
