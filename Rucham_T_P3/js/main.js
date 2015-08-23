/*****************************************************
* Source file for cs171 project 3 by Tamar Rucham
*
* Trees are loosly based on the example by Pavan Podila (Jul 20th, 2011) as a blog post in his blog Pixel-In-Gene: http://blog.pixelingene.com/2011/07/building-a-tree-diagram-in-d3-js/
* 
* Determining tree size dynamically (line 99) is based of the answer by user Superboggly (Jan 3rd, 2013) in Stackoverflow: http://stackoverflow.com/a/14145316
*
******************************************************/

var script_to_language;
var last_selected;
var script_color = '#5FB404';
var script_back_color = '#38610B';
var script_link_color = '#BEF781';
var language_color = '#B40404';
var language_link_color = '#F5A9A9';
var language_back_color = '#610B0B';
var greyout_color = 'grey';
var between_color = '#FF8000';
var between_root = [];
var in_between = null;
var current_tree = '';
var start = 0;
var init_set = false;

window.onload = function() {
    var left_panel = d3.select('#left-panel');
    left_panel.append('div').attr('class','header font red').text('Languages');
    var right_panel = d3.select('#right-panel');
    right_panel.append('div').attr('class','header font green').text('Sctipts');
    $.getJSON("./data/language_origins_list.json", function(language_list) {
	lang_list = language_list.language_origins;
	for (var i = 0; i < lang_list.length; i++) {
	    var language = lang_list[i];
	    $.getJSON("./data/"+language+"_language.json", function(json) {
		left_panel.append('div')
		    .attr('id',json.name)
		    .attr('class','entry font').text(json.name)
		    .on('click', function() {
			if (start === 0 && init_set) return;
			if (start > 0 && init_set) dismissSteps();
			// First selection of the tree
			current_tree = json.name;
			reset();
			d3.selectAll('.panel').attr('style','height:'+determineBottom()+'px;');
			new_color = 'color: ' + language_color;
			last_selected = d3.select(this).attr('style',new_color);
			generate_lang(json, d3.select('#main').append("svg:svg").attr('id', 'main_svg'), true);
		    });
	    });
	}	
    });
    $.getJSON("./data/script_origins_list.json", function(script_list) {
	script_list = script_list.script_origins;
	for (var i = 0; i < script_list.length; i++) {
	    var script = script_list[i];
	    $.getJSON("./data/"+script+"_script.json", function(json) {
		right_panel.append('div')
		    .attr('id',json.name)
		    .attr('class','entry font').text(json.name)
		    .on('click', function() {
			reset();
			if (start === 0 && init_set) return;
			current_tree = json.name;
			d3.selectAll('.panel').attr('style','height:'+determineBottom()+'px;');
			new_color = 'color: ' + script_color;
			last_selected = d3.select(this).attr('style',new_color);
			generate_lang(json, d3.select('#main').append("svg:svg").attr('id', 'main_svg'), false);
			if(start === 2 && current_tree === 'Oracle Bone Script') {
			    d3.select('#step2').attr('style','display:none;');
			    d3.select('#step3').attr('style','display:inline;');
			    start = 4;
		 	} else if (start > 0 && current_tree === 'Oracle Bone Script') {
			    dismissSteps();
			}
		    });
	    });
	}	
    });
    $.getJSON("./data/script_to_language.json", function(json) {
	script_to_language = json;
    });

   // Wait a little to allow the visualization to catch up and select English
    window.setTimeout(function() {
	var origin = document.getElementById('Indo-European');
	if (origin) {
	    origin.click();
	    window.setTimeout(function() {
		var english = $('#English_node');
		if (english) english[0].__onclick();
		// Vis finished init
		init_set = true;
		start = 1;
		d3.select('#step1').attr('style','display:inline;');
	    },250);
	}
    },250);
}

function generate_lang(data, svg, from_left, between, link_node){
    tab = document.getElementById(data.name);
    if (!tab) return;
    root_origin = tab.offsetTop - 70;
    var height = 750;
    var width = 700;
    var color = (from_left) ? language_color : script_color;
    var link_color = (from_left) ? language_link_color : script_link_color;
    if (!from_left) svg.attr('style','float: right;');
    
    root = data;
    root.x0 = 0;
    root.y0 = root_origin;
    
    // Calculate a box for the tree
    var levelWidth = [1];
    var childCount = function(level, n) {

	if(n.children && n.children.length > 0) {
	    if(levelWidth.length <= level + 1) levelWidth.push(0);

	    levelWidth[level+1] += n.children.length;
	    n.children.forEach(function(d) {
		childCount(level + 1, d);
	    });
	}
    };
    childCount(0, root); 
    // If the tree is bigger then the ultimate width, stick to width
    var spacing = (from_left) ? 50 : 70;
    var newWidth = newHeight = d3.max(levelWidth) * spacing;
    if (newWidth > width - 100) {
	newWidth = width - 100;
	newHeight = height;
    }

    var tree = d3.layout.tree()
    .sort(null)
    .size([newHeight, newWidth])
    .children(function(d)
    {
	if(!d.children || d.children.length === 0)
	    return null;

	// Remove nodes with one child (single line) to avoid clutter
	for (var i = 0; i < 5; i++) {
	    // Break if this is not a single line node OR if this is the origin 
	    // OR if this language has a script associated OR if this is a live script
	    if (!d.children || d.children.length !== 1 || d.script_name || d.name === data.name || script_to_language[d.name]) {
		break;
	    }
	    new_children = d.children[0].children; 
	    new_name = d.children[0].name;
	    if (d.children[0].script_name) {
		d['script_name'] = d.children[0].script_name;
	    }
	    d.children = new_children;
	    d.name = new_name;
	}

        return (!d.children || d.children.length === 0) ? null : d.children;
    });

    var nodes = tree.nodes(data);
    // Set the root node to start from the tab
    nodes.forEach(function(d) {
	if (d.name === data.name) {
	    d.y = 10; 
	    d.x = root_origin;
	}
    }); 

    var links = tree.links(nodes);
    var layoutRoot = svg.attr("width", width+100).attr("height", height + 100).attr('class','svg_position')
     .append("svg:g")

    // Edges between nodes as a <path class="link" />
    var link = d3.svg.diagonal()
     .projection(function(d)
     {
	 y = (from_left) ? d.y: width - d.y + 100;
	 x =  d.x;
	 if (between) {
	    if (d.name !== data.name) {
		y = (from_left) ? d.y + 10 : width - 10;
		x = link_node;
	    } else {
		x = root_origin;
	    }
	 }

	 if (d.name !== data.name) x += 20;
         return [y, x];
     });

    layoutRoot.selectAll("path.link")
     .data(links)
     .enter()
     .append("svg:path")
     .attr("class", "link")
     .attr('style', function(d){
	 return 'stroke: ' + link_color +'; ';
      })
     .attr("d", link);

 /*
     Nodes as
     <g class="node">
         <circle class="node-dot" />
         <text />
     </g>
  */
    var nodeGroup = layoutRoot.selectAll("g.node")
     .data(nodes)
     .enter()
     .append("svg:g")
     .attr("class", "node")
     .attr("id", function(d) {return getID(d.name);})
     .attr("transform", function(d)
     {
	 y = (from_left) ? d.y: width - d.y + 100;
	 x = d.x;
	 if (between) {
	    if (d.name !== data.name) {
		y = (from_left) ? d.y + 10 : width - 10;
		x = link_node;
	    } else {
		x = root_origin;
	    }
	 }

	 if (d.name !== data.name) x += 20;
         return "translate(" + y + "," + x + ")";
     })
     .on('mouseover', function(d) {
	if (d.script_name || script_to_language[d.name] || (between && d.name !== data.name)) {
	    d3.select(this).select('circle').attr('style', 'cursor:pointer; fill:' + between_color);
	    d3.select(this).select('text').attr('style', 'cursor:pointer; fill:' + between_color);
	}     
     })
     .on('mouseout', function(d) {
	if (d.script_name || script_to_language[d.name] || (between && d.name !== data.name)) {
	    color_to_set = (in_between) ? greyout_color : color;
	    if (in_between && in_between[0][0] == this) {
		color_to_set = between_color;
	    }
	    d3.select(this).select('circle').attr('style', 'fill: ' + color_to_set);
	    d3.select(this).select('text').attr('style', 'fill: ' + color_to_set);
	}     
     })
     .on('click',function(d) {
	if (d.script_name) {
	    if (start === 0 && init_set) return;
	    clearIFrame();
	    in_between = d3.select(this);
	    if (between_root && between_root.length > 0) {
		between_root[0].remove();
	    }
	    greyout(d3.select(this));
	    scriptBetween(d3.select(this)[0][0].__data__.x, d.script_name, svg);
	    setIFrame(d.name+' language', true, language_back_color);
	    setIFrame(d.script_name, false, script_back_color);
	    if (start > 0) dismissSteps();
	} else if (between) {
	    if (start === 0 && init_set) return;
	    clearIFrame();
	    var name = d.name;
	    var id = '#' + getID(d.name);
	    var origin = (script_to_language[d.name]) ? determineScriptOrigin(d.name) : data.name;
	    document.getElementById(origin).click();
	    // Wait a little to allow the visualization to catch up
	    window.setTimeout(function() {
		var new_node = d3.select(id); 
		greyout(new_node);
		if (!from_left) {
		    setIFrame(d.name, false, script_back_color);
		} else {
		    setIFrame(d.name+' language', true, language_back_color);
		    setIFrame(d.script_name, false, script_back_color);		    
		}

		window.setTimeout(function() {
		    var selected_node = $(id);
		    if (selected_node) selected_node[0].__onclick();
		},250);

	    },100);
	    if (start === 1 && id === "#Latinalphabet_node") {
		d3.select('#step1').attr('style','display:none;');
		d3.select('#step2').attr('style','display:inline;');
		start = 2;
	    } else if (start > 0) {
		dismissSteps();
	    }
	} else if (script_to_language[d.name]) {
	    if (start === 0 && init_set) return;
	    clearIFrame();
	    if (between_root && between_root.length > 0) {
		for (var i = 0; i < between_root.length; i++) {
		    if (between_root[i]) between_root[i].remove();
		}
		between_root = [];
	    }
	    greyout(d3.select(this));
	    languageBetween(d3.select(this)[0][0].__data__.x, d.name, svg);
	    setIFrame(d.name, false, script_back_color);
	    if (start > 0 && d.name !== "Latin alphabet") dismissSteps();
	}
    });

    nodeGroup.append("svg:circle")
     .attr("class", "node-dot")
     .attr('style', function(d){
	 var str = 'stroke: ' + color +'; ';
	 str += (d.script_name || script_to_language[d.name] || d.name === data.name  || (between && from_left && d.name !== data.name)) ? 'fill: ' + color : 'fill: white;';
	 return str;
      })
     .attr("r", function(d){
	 if (d.script_name || script_to_language[d.name] || (between && from_left && d.name !== data.name)) {
	     return 4;
	 }
	 return 2;
     });

    nodeGroup.append("svg:text")
     .attr("text-anchor", "end")
     .attr("class","label font")
     .attr("dx", 30)
     .attr("dy", -6)
     .text(function(d)
     {
	 if (d.name !== data.name) {
             return d.name;
	 }
     })
    .attr('style', 'fill:'+color);

    return layoutRoot;
}

function determineScriptOrigin(name) {
    return (name === 'Chinese characters') ? 'Oracle Bone Script' : 'Egyptian hieroglyphs'
}

function greyout(selected) {
    d3.selectAll('circle').attr('style', 'fill: '+greyout_color);
    d3.selectAll('text').attr('style', 'fill: '+greyout_color);
    d3.selectAll('g.node').attr('style', 'color: '+greyout_color);
    d3.selectAll('path').attr('style', 'stroke: '+greyout_color);
    selected.attr('style', 'fill: ' + between_color);
    selected.select('circle').attr('style', 'fill: ' + between_color);
    selected.select('text').attr('style', 'fill: ' + between_color);
    in_between = selected;
}

function languageBetween(current_node_x, name, svg) {
    if (name.indexOf('Latin') > -1) current_node_x = 750;
    for (var i = 0; i < script_to_language[name].length; i++) {
	language_tree = script_to_language[name][i];
	between_data = {'name':language_tree.origin, 'children':[{'name':language_tree.name}]};
	between_root.push(generate_lang(between_data, svg, true, true, current_node_x));
	current_node_x -= 20; 
    }
}

function scriptBetween(current_node_x, name, svg) {
    origin = determineScriptOrigin(name);
    between_data = {'name':origin, 'children':[{'name':name}]};
    between_root = [generate_lang(between_data, svg, false, true, current_node_x)];
}

function getID(name) {
    return name.replace(' ','') + '_node';
}

function reset() {
    in_between = null;
    clearIFrame();
    d3.selectAll('svg').remove();
    if (last_selected) {
	last_selected.attr('style','color: grey;');
    }
}

function setIFrame(name, is_language, color) {
    var id = (is_language) ? "lang" : 'script';
    article_url = "http://en.wikipedia.org/w/index.php?title=" + encodeURIComponent(name) + "&printable=yes";
    window.frames[id + '_wikipedia'].location.replace(article_url);
    d3.select('#' + id + '_wikipedia').attr('style', 'border: 3px solid '+color+'; top:' + (determineBottom() + 100) +'px;');
    //$('#' + id + '_link').bind('click', function() {  window.open(article_url,'_blank');});
}

function clearIFrame() {
    window.frames["lang_wikipedia"].location.replace('about:blank');			
    window.frames["script_wikipedia"].location.replace('about:blank');
    d3.select("#lang_wikipedia").attr('style', 'border: 0px;');
    d3.select("#script_wikipedia").attr('style', 'border: 0px;');
}

function determineBottom() {
    return (current_tree.indexOf('Indo') > -1 || current_tree.indexOf('Egyptian') > -1) ? 850 : 600;
}

function dismissSteps() {
    d3.select('#step1').remove();
    d3.select('#step2').remove();
    d3.select('#step3').remove();
    start = 100;
}
