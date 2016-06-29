$(document).ready(function() {
    $(".swipe").html("<div class='test'><h1>swipe</h1></div>")
    $(".test").width("100%")
    $(".test").height($(window).innerHeight())
    $(".test").css({position: "fixed"})

    var json = data();
    var swipe_loader = new SwipeLoader(json);

    $(".swipe").on("click touchstart", function(){
	swipe_loader.next();
    });
    
});




function data(){
    return {
	"type":"net.swipe.swipe",
	"title": "Hirano Manga",
	"dimension":[720, 1280],
	"scenes": {
	    "scene1":{ "play":"scroll",
		       "elements": [
			   { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma000/haikei.png" },
			   { "id":"fukidashi", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma000/serifu.png",
			     "x":380, "y":80, "opacity":0.0 },
		       ]},
	    "scene2":{ "play":"scroll",
		       "elements": [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma001/haikei.png" },
				    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma001/kyara.png", "x":70, "y":240 },
				   ]},
	    "scene3":{ "play":"scroll",
		       "elements": [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/haikei.png" },
				   ]},
	    "scene4":{ "play":"scroll",
		       "elements": [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma003/haikei.png" },
				    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma003/kyara.png", "x":"right", "y":"bottom" },
				    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma003/serifu1.png", "x":10, "y":20 },
				   ]},
	    "scene5":{ "play":"scroll",
		       "elements": [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/haikei.png" },
				   ]},
	    "scene6":{ "play":"scroll",
		       "elements": [{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma005/haikei.png" },
				   ]},
	    "scene7":{ "play":"scroll",
		       "elements": [
			   { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma006/haikei.png" },
			   { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma006/fleme.png" },
			   { "id":"zombi", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma006/kyara1.png" },
			   { "id":"girl", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma006/kyara2.png", "x":143, "y":892 },
			   { "id":"zwoon", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma006/gion.png" },
			   { "id":"baloon1", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma006/serifu.png", "x":500 },
			   { "id":"baloon2", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma006/serifu2.png", "y":862 },
		       ]},
	    "scene8":{ "play":"scroll",
		       "elements": [
			   { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma007/haikei.png" },
			   { "id":"zombi", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma007/kyara1.png", "y":264 },
			   { "id":"girl", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma007/kyara2.png", "x":132, "y":658 },
			   { "id":"gion", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma007/gion.png", "x":268, "y":100 },
			   { "id":"baloon1", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma007/srifu.png", "x":500, "y":50 },
			   { "id":"baloon2", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma007/srifu2.png", "y":226 },
		       ]},
	    "scene9":{ "play":"scroll",
		       "elements": [
			   { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/haikei.png" },
			   { "id":"effect", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/koukasen.png", "x":"center", "y":"center" },
			   { "id":"baloon1", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/serifu.png", "x":0, "y":0 },
			   { "id":"baloon2", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/serifu2.png", "y":926 },
			   { "id":"girl1", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/kyara1.png", "x":-90, "y":250 },
			   { "id":"girl2", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/kyara2.png", "x":19, "y":267 },
			   { "id":"hand1", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/kyara2-1.png", "x":276, "y":424 },
			   { "id":"hand2", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/kyara2-2.png", "x":-71, "y":342 },
			   { "id":"manpu", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/manpu.png", "x":0, "y":530 },
			   { "id":"gion", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma008/gion.png", "x":320, "y":-20 },
		       ]},
	    "scene10":{ "play":"scroll",
			"elements": [
			    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma009/haikei.png" },
			    { "id":"zombi", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma009/kyara1.png", "y":210 },
			    { "id":"gion", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma009/gion.png" },
			    { "id":"baloon1", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma009/serifu.png", "x":50 },
			    { "id":"baloon2", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma009/serifu2.png", "x":315, "y":915 },
			]},
	    "scene11":{ "play":"scroll",
			"elements": [
			    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma010/haikei.png" },
			    { "id":"manpu", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma010/manpu.png", "y":145, "x":"center" },
			    { "id":"girls", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma010/kyara1.png", "y":"bottom" },
			    { "id":"baloon", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma010/serifu.png", "y":4, "x":232 },
			]},
	    "scene12":{ "play":"scroll",
			"elements": [
			    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma011/haikei.png" },
			    { "id":"zombi", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma011/kyara.png", "x":158, "y":480 },
			    { "id":"gion", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma011/gion.png", "x":37, "y":965 },
			    { "id":"baloon1", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma011/serifu.png", "x":420, "y":87 },
			    { "id":"baloon2", "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma011/serifu2.png", "x":25, "y":30 },
			]},
	},
	"pages": [
	    {
		"scene": "scene1",
	    },
	    {
		"scene": "scene1",
		"elements": [
		    { "id":"fukidashi", "to":{ "opacity":1.0 } },
		]
	    },
	    {
		"scene": "scene2",
		"play":"auto",
		"elements": [
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma001/gion.png",
		      "x":580, "y":40,
		      "opacity":0.0, "to":{ "opacity":1.0 } },
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma001/serifu01.png",
		      "x":10, "y":50,
		      "opacity":0.0, "to":{ "opacity":1.0 } },
		]
	    },
	    {
		"scene": "scene2",
		"elements": [
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma001/gion.png",
		      "x":580, "y":40 },
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma001/serifu01.png",
		      "x":10, "y":50 },
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma001/serifu02.png",
		      "x":340, "y":720,
		      "opacity":0.0, "to":{ "opacity":1.0 } },
		]
	    },
	    {
		"scene": "scene3",
		"play":"auto",
		"elements": [
		    {
			"w":426, "h":1400, "x":"right", "y":"top",
			"translate":[-150,0],
			"elements":[
			    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/kyara1.png", "x":"center", "y":"bottom" },
			    { "x":"center", "y":100, "h":570,
			      "elements": [
				  { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/serifu.png", "x":"center", "y":"top" },
				  { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/gion.png", "x":100, "y":"bottom" },
			      ]
			    },
			]
		    },
		]
	    },
	    {
		"scene": "scene3",
		"elements": [
		    {
			"w":426, "h":1400, "x":"right", "y":"top",
			"translate":[-150,0], "to": { "translate":[100,0] },
			"elements":[
			    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/kyara1.png", "x":"center", "y":"bottom" },
			    { "x":"center", "y":100, "h":570, "to": {"opacity":0 },
			      "elements": [
				  { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/serifu.png", "x":"center", "y":"top" },
				  { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/gion.png", "x":100, "y":"bottom" },
			      ]
			    },
			]
		    },
		    {
			"w":500, "h":1350, "x":"left", "y":50,
			"translate":[-500,0], "to": { "translate":[0, 0] },
			"elements":[
			    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/kyara2.png", "x":"center", "y":"bottom" },
			    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma002/serifu2.png", "x":"center", "y":"top" },
			]
		    }
		]
	    },
	    {
		"scene": "scene4",
		"play":"auto",
		"elements":[
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma003/gion.png", "x":330, "y":160,
		      "opacity":0.0, "to":{ "opacity":1.0 } },
		]
	    },
	    {
		"scene": "scene4",
		"elements":[
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma003/gion.png", "x":330, "y":160,
		      "opacity":1.0, "to":{ "opacity":0.0 } },
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma003/serifu2.png", "x":"left", "y":"bottom",
		      "translate":[-200,-40], "to":{ "translate":[5,-40] } },
		]
	    },
	    {
		"scene": "scene5",
		"play":"auto",
		"elements":[
		    { "elements":[
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/kyara1.png", "x":0, "y":"bottom", "translate":[-400,40] },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/kyara2.png", "x":"right", "y":"bottom", "translate":[0,20] },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/serifu.png", "x":"right", "y":5 },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/gion.png", "x":"right", "y":"bottom", "translate":[-520,-740],
			  "loop":{ "style":"wiggle", "repeat":2 } },
		    ]},
		]
	    },
	    {
		"scene": "scene5",
		"elements":[
		    { "elements":[
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/kyara1.png", "x":0, "y":"bottom", "translate":[-400,40] },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/kyara2.png", "x":"right", "y":"bottom", "translate":[0,20] },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/serifu.png", "x":"right", "y":5, "to":{ "opacity":0.0 } },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/gion.png", "x":"right", "y":"bottom", "translate":[-520,-740],
			  "to":{"opacity":0, "translate":[-520,-740]} },
		    ], "to":{ "translate":[280,0] } },
		    { "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma004/serifu2.png", "x":"top", "y":"left", "opacity":0, "to":{"opacity":1}},
		]
	    },
	    {
		"scene": "scene6",
		"play":"auto", "duration":0.1,
		"elements":[
		    { "elements":[
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma005/gion.png", "x":0, "y":"bottom", "opacity":0,
			  "to":{"opacity":1} },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma005/kyara1.png", "x":"0", "y":"bottom", "translate":[-700,0], "opacity":1.0,
			  "to":{"opacity":1, "translate":[-100,0]} },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma005/kyara2.png", "x":"0", "y":"bottom", "translate":[-210,0], "opacity":0,
			  "to":{"opacity":1, "translate":[0,0]} },
			{ "img":"http://satoshi.blogs.com/swipe/hirano-manga/koma005/manpu.png", "x":"0", "y":"bottom", "translate":[200,-290], "opacity":0,
			  "to":{"opacity":1, "translate":[200,-290]} },
		    ]},
		]
	    },
	    {
		"play":"auto",
		"scene": "scene7",
		"elements":[
		    { "id":"zombi", "translate":[-200,0], "to":{"translate":[0,0]} },
		    { "id":"girl", "translate":[0,388], "to":{"translate":[0,0]} },
		    { "id":"zwoon", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon1", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon2", "opacity":0, "to":{"opacity":1} },
		],
	    },
	    {
		"play":"auto",
		"scene": "scene8",
		"elements":[
		    { "id":"gion", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon1", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon2", "opacity":0 },
		],
	    },
	    {
		"scene": "scene8",
		"elements":[
		    { "id":"baloon2", "opacity":0, "to":{"opacity":1} },
		],
	    },
	    {
		"play":"auto",
		"scene": "scene9",
		"elements":[
		    { "id":"gion", "opacity":0, "to":{"opacity":1} },
		    { "id":"effect", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon2", "opacity":0, "to":{"opacity":1} },
		    { "id":"hand1", "opacity":1, "to":{"opacity":0} },
		    { "id":"hand2", "opacity":0, "to":{"opacity":1} },
		    { "id":"manpu", "opacity":0, "to":{"opacity":1} },
		],
	    },
	    {
		"play":"auto",
		"scene": "scene10",
		"elements":[
		    { "id":"gion", "opacity":0, "to":{"opacity":1}, "loop":{"style":"wiggle", "repeat":2, "delta":2} },
		    { "id":"baloon2", "opacity":0, "to":{"opacity":1} },
		],
	    },
	    {
		"play":"auto",
		"scene": "scene11",
		"elements":[
		    { "id":"manpu", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon", "opacity":0, "to":{"opacity":1} },
		],
	    },
	    {
		"play":"auto",
		"scene": "scene12",
		"elements":[
		    { "id":"gion", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon1", "opacity":0, "to":{"opacity":1} },
		    { "id":"baloon2", "opacity":0, "to":{"opacity":1} },
		],
	    },
	]
    }
}    


