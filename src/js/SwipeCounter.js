class SwipeCounter {
  
  static increase(){
	  if(this.counter === undefined){
	    this.counter = 1;
	  } else {
	    this.counter ++;
	  }
	  return this.counter;
  }

  static decrease(){
	  if(this.counter === undefined){
	    this.counter = -1;
	  } else {
	    this.counter --;
	  }
	  return this.counter;
  }

  static getCounter(){
	  return this.counter;
  }
}
