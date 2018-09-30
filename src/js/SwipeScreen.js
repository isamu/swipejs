export default class SwipeScreen {
  static getSize(){
	  if (window.swipe_screen_size) {
	    return window.swipe_screen_size[1];
	  } else {
	    return 100;
	  }
  }
  static setSize(size){
	  window.swipe_screen_size = [size, size];
  }
  static setSizes(width, height){
	  window.swipe_screen_size = [width, height];
  }

  static init(width, height){
	  window.swipe_screen_width = width;
	  window.swipe_screen_height = height;

	  if (window.swipe_screen_width == 0) {
	    window.swipe_screen_width = window.swipe_screen_height * $(window).width() / $(window).height();
	  }
	  if (window.swipe_screen_height == 0) {
	    window.swipe_screen_height =  window.swipe_screen_width * $(window).height() /  $(window).width();
	  }
	  
	  SwipeScreen.setOriginalSize();
	  SwipeScreen.setVirtualSize();
	  
  }

  static setOriginalSize() {
	  window.swipe_screen_window_width = $(window).width();
	  window.swipe_screen_window_height = $(window).height();
  }

  // todo
  //  set vertical and horizontal mode
  static setVirtualSize() {
    var size = window.swipe_screen_size || [100, 100]
	  var real_ratio = (window.swipe_screen_window_width * size[0]) / (window.swipe_screen_window_height * size[1]);
	  var virtual_ratio = window.swipe_screen_width / window.swipe_screen_height;
	  window.swipe_screen_ratio = 1.0;
	  
	  if (real_ratio / virtual_ratio >= 1) {
	    window.swipe_screen_virtual_height = $(window).height() * size[1] / 100;
	    window.swipe_screen_virtual_width = window.swipe_screen_width / window.swipe_screen_height * window.swipe_screen_virtual_height;
	  } else {
	    window.swipe_screen_virtual_width = $(window).width()  * size[0] / 100;
	    window.swipe_screen_virtual_height = window.swipe_screen_height / window.swipe_screen_width * window.swipe_screen_virtual_width;
	  }
	  window.swipe_screen_ratio = window.swipe_screen_virtual_width / window.swipe_screen_width;
  }

  static getRatio(){
	  return window.swipe_screen_ratio;
  }
  static swipewidth() {
	  return window.swipe_screen_width;
  }

  static swipeheight() {
	  return window.swipe_screen_height;
  }

  static virtualwidth() {
	  return window.swipe_screen_virtual_width;
  }

  static virtualheight() {
	  return window.swipe_screen_virtual_height;
  }

  static refresh() {
	  SwipeScreen.setOriginalSize();
	  SwipeScreen.setVirtualSize();
  }
  
  // width
  static virtualX(x){
	  if(x == undefined){
	    return window.swipe_screen_virtual_width;
	  }
	  if(window.swipe_screen_width) {
	    return x / window.swipe_screen_width * window.swipe_screen_virtual_width;
	  }
	  return x;
  }
  
  
  static virtualY(y){
	  if(y == undefined){
	    return window.swipe_screen_virtual_height;
	  }
	  if(window.swipe_screen_height) {
	    return y / window.swipe_screen_height * window.swipe_screen_virtual_height;
	  }
	  return y;
  }
  
}
