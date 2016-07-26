class SwipeMarkdown {
    constructor (_handlers = {}) {
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
	    if (instance.prefixes(element[0])) {
		body = instance.prefixes(element[0]) + body;
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
	let fontSize = 10;
	let fontname = "";
	let textAlign = "center";
	let info = {};
	return {
	    position: "relative",
	    "font-size": String(SwipeScreen.virtualY(fontSize)) + "px",
	    "line-height" : String(SwipeScreen.virtualY(fontSize)) + "px",
	    "font-family": fontname,
	    "textAlign": textAlign,
	    "color": SwipeParser.parseColor(info, "#000")
	};
	
    }
    getMdSymbol(element){
	let md_attr = {
	    "#": "1",
            "##": "2",
            "###": "3",
            "####": "4",
            "*": "5",
            "-": "6",
            "```": "7",
            "```+": "7"
        };
	
	let words = element.split(" ");
	
	if (words.length > 1 && md_attr[words[0]] ){
	    let symbol = md_attr[words.shift()]
	    return [symbol, words.join(" ")];
	}
	return ["*", element];
    }

    prefixes(param) {
	let arr = {
            "-":"\u{2022} ", // bullet (U+2022), http://graphemica.com/%E2%80%A2
            "```":" ",
	};
	if (param) {
	    if (arr.hasOwnProperty(param)) {
		return arr[param];
	    }
	}
	return null;
    }


}
