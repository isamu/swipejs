class SwipeMediaPlayer {
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
	console.log("push");
	console.log(this.current_page);
	
	this.media[this.current_page][key] = media;
	return this;
    }

    play(){
	if (this.current_playing != this.current_page){
	    this.stop();
	    if (this.media[this.current_page]) {
		console.log("play");
		var page = this.media[this.current_page];
		Object.keys(page).forEach(function (key) {
		    var player = page[key].media;
		    var start = 0;
		    if (page[key] && page[key].videoStart) {
			start = page[key].videoStart;
			player.setCurrentTime(start);
		    }
		    player.play();
		    if (page[key] && page[key].videoDuration) {
			var duration = page[key].videoDuration;
			setTimeout(function(){
			    // accuracy of settimeout is not good. so I add  a second.
			    if (player.currentTime + 1 > (Number(start) + Number(duration))) {
				player.stop();
			    }
			}, duration * 1000);
		    }
		});
	    }
	    this.current_playing = this.current_page;
	}
	return this;
    }
    media() {
	return this.media[this.current_page];
    }
    stop() {
	if (this.current_playing !== null) {
	    console.log("stop");
	    console.log(this.current_playing);
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

