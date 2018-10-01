export default class SwipeMediaPlayer {
  static getInstance() {
	  if(this.instance) {
	    return this.instance;
	  }
	  this.instance = new SwipeMediaPlayer();
	  return this.instance;
  }
  constructor () {
	  this.current_page = 0;
	  this.current_playing = null;
	  this.media = {};
  }

  page(num){
	  this.current_page = num;
	  return this;
  }
  push(key, media) {
	  if (!this.media[this.current_page]) {
	    this.media[this.current_page] = {};
	  }
	  this.media[this.current_page][key] = media;
	  return this;
  }

  setCurrent(page=null){
	  if (page) {
	    this.current_page = page;
	  }
	  var instance = this;
	  if (this.current_playing != this.current_page){
	    this.stop();
    }
	  if (this.media[this.current_page]) {
		  var current_page = this.media[this.current_page];
		  Object.keys(current_page).forEach(function (key) {
		    var data = current_page[key];
		    var player = data.media;
        let duration = (current_page[key] && current_page[key].videoDuration) ? current_page[key].videoDuration : player.duration;
		    let start = (current_page[key] && current_page[key].videoStart) ? current_page[key].videoStart : 0;
        let last = start + duration;
			  player.setCurrentTime(last);
      });
    }                      
  }
  play(page=null){
	  if (page) {
	    this.current_page = page;
	  }
	  var instance = this;
	  if (this.current_playing != this.current_page){
	    this.stop();
	    if (this.media[this.current_page]) {
		    var current_page = this.media[this.current_page];
		    Object.keys(current_page).forEach(function (key) {
		      var data = current_page[key];
		      var player = data.media;
		      var start = 0;
		      if (current_page[key] && current_page[key].videoStart) {
			      start = current_page[key].videoStart;
			      player.setCurrentTime(start);
		      }
		      if (data["canPlay"]) {
            player.currentTime = 0;
			      player.play();
			      player.addEventListener('ended', function() {
			        instance.current_playing = null;
			      });
		      } else {
			      data["waitPlay"] = true;
			      instance.media[instance.current_current_page][key] = data;
		      }
		      if (current_page[key] && current_page[key].videoDuration) {
			      var duration = current_page[key].videoDuration;
			      setTimeout(function(){
			        // accuracy of settimeout is not good. so I add  a second.
			        if (player.currentTime + 1 > (Number(start) + Number(duration))) {
				        player.stop();
			          instance.current_playing = null;
			        }
			      }, duration * 1000);
		      }
		    });
	    }
	    this.current_playing = this.current_page;
	  }
	  return this;
  }
  playing(ratio) {
	  if (ratio < 0) {
	    ratio = 1 + ratio;
	  }
	  var instance = this;
	  if (this.media[this.current_page]) {
	    var page = this.media[this.current_page];
	    Object.keys(page).forEach(function (key) {
		    var data =  page[key];
		    var player = data.media;
		    var dom = page[key].dom;
		    var start = start = (page[key] && page[key].videoStart) ?  page[key].videoStart : 0;
		    var duration = (page[key] && page[key].videoDuration) ? page[key].videoDuration : 1.0;

		    var currentTime = start  + ratio * duration;
		    //player.setCurrentTime(currentTime);
		    if (Math.abs(data["currentTime"] - currentTime) > 0.05) {
		      dom.currentTime = currentTime;
		      data["currentTime"] = currentTime;
		      instance.media[instance.current_page][key] = data;
		    }

	    });
	  }
  }
  load () {
	  var instance = this;
	  Object.keys(this.media).forEach(function (key) {
	    var page = instance.media[key];
	    Object.keys(page).forEach(function (key2) {
		    var data = page[key2];
		    var player = page[key2].media;
		    player.addEventListener('loadeddata', function() {
		      if (instance.media[key][key2]["waitPlay"]) {
			      player.play();
		      }			
		      data["canPlay"] = true;
		      instance.media[key][key2] = data
		    }, false);
		    player.load();
	    });
	  });
  }
	
  media() {
	  return this.media[this.current_page];
  }
  stop() {
	  if (this.current_playing !== null) {
	    if (this.media[this.current_playing]) {
		    var page = this.media[this.current_playing];
		    Object.keys(page).forEach(function (key) {
		      page[key].media.stop();
		    });
	    }
	  }
	  this.current_playing = null;
  }
}

