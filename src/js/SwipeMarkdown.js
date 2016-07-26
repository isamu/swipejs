class SwipeMarkdown {
    constructor (info) {
	this.info = info;

	this.setMdStyle()
	if (this.info["styles"]) {
	    // not well
	    this.md_style = SwipeElement.merge(this.md_style, this.info["styles"]);
	}
    }


    parse(element, css_prefix) {
	var instance = this;
	let fCode = false;
	let prepared = element.map(function(element, elem_index){
	    if (element === '```') {
		fCode = !fCode
		return fCode ? [null, ""] : ["```+", ""]
	    } else if (fCode) {
		return ["```", element]
	    } 
	    return instance.getMdSymbol(element);
	});
	let htmls = [];
	let csses = []
	prepared.forEach(function(element, elem_index){
	    let style = element[0];
	    let body  = element[1];
	    if (instance.prefixes(style)) {
		body = instance.prefixes(style) + body;
	    }
	    
	    htmls.push(instance.conv_html(body, css_prefix, elem_index));
	    csses.push(instance.conv_css(style));
	});
	
	return [htmls.join(""), csses];
    }
    conv_html(body, css_prefix, index) {
	return "<div class='markdown_line' id='" + css_prefix + "-" + index + "'>" + body + "</div>";
    }
    conv_css(style) {
	let my_style = this.md_style[style];
	let fontSize = 10;
	let fontname = "";
	let textAlign = "left";
	let info = {};
	
	if (my_style) {
	    if (my_style["font"]){
		if (my_style["font"] && my_style["font"]["name"]) {
		    fontname = SwipeParser.parseFontName(my_style["font"], true);
		}
		if (my_style["font"] && my_style["font"]["size"]) {
		    fontSize = SwipeParser.parseFontSize(my_style["font"], SwipeScreen.swipeheight(), 10, true);
		}
	    }
	    if (my_style && my_style["alignment"]) {
		textAlign = my_style["alignment"];
	    }
	}


	return {
	    position: "relative",
	    "font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
	    "line-height" : String(SwipeScreen.virtualY(fontSize)) + "px",
	    "font-family": fontname,
	    "textAlign": textAlign,
	    "color": SwipeParser.parseColor(my_style, "#000")
	};
	
    }

    setMdStyle() {
	this.md_style = {
            "###":{ "color":"#800", "font":{ "size":"4%", "name":"Helvetica" }},
	    "#": {"font": { "size":32}, "spacing": 16},
            "##": {"font": { "size":28}, "spacing": 14},
            "###": {"font": { "size":24}, "spacing": 12},
            "####": {"font": { "size":22}, "spacing": 10},
            "*": {"font": { "size":20}, "spacing": 10},
            "-": {"font": { "size":20}, "spacing": 5},
            "```": {"font": { "size":14, "name": "Courier"}, "spacing": 0},
            "```+": {"font": { "size":7, "name": "Courier"}, "spacing": 0},
        };
    }	
    getMdStyle(){
	return this.md_style;
    }
    
    getMdSymbol(element){
	let md_style = this.getMdStyle();
	let words = element.split(" ");
	
	if (words.length > 1 && md_style[words[0]] ){
	    let symbol = words.shift();
	    return [symbol, words.join(" ")];
	}
	return ["*", element];
    }

    prefixes(style) {
	let my_style = this.md_style[style];
	if (my_style && my_style["prefix"]) {
	    return my_style["prefix"];
	}

	let arr = {
            "-":"\u{2022} ", // bullet (U+2022), http://graphemica.com/%E2%80%A2
            "```":" ",
	};
	if (style) {
	    if (arr.hasOwnProperty(style)) {
		return arr[style];
	    }
	}
	return null;
    }


}
