export default class SwipeCounter {
  
  static increase(){
	  if(window.counter === undefined){
	    window.counter = 1;
	  } else {
	    window.counter ++;
	  }
	  return window.counter;
  }

  static decrease(){
	  if(window.counter === undefined){
	    window.counter = -1;
	  } else {
	    window.counter --;
	  }
	  return window.counter;
  }

  static getCounter(){
	  return window.counter;
  }
}
