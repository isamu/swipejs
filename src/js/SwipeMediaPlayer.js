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
    push(media) {
	if (!this.media[this.current_page]) {
	    this.media[this.current_page] = [];
	}
	console.log("push");
	console.log(this.current_page);
	
	this.media[this.current_page].push(media);
	return this;
    }

    play(){

	if (this.current_playing != this.current_page){
	    this.stop();
	    if (this.media[this.current_page]) {
		console.log("pkay");
		console.log(this.current_page);
		this.media[this.current_page].forEach((media, media_index) => {
		    console.log("media");
		    console.log(media_index);
		    media.play();
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
		this.media[this.current_playing].forEach((media, media_index) => {
		    media.stop();
		});
	    }
	}
	this.current_playing = null;
    }
}

