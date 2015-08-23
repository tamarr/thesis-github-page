window.onload = function() {
    var lang = getUrlVars()["lang"];
    $.getJSON("./data/"+lang+"_letters.json", function(json) {

	// Returns a flattened hierarchy containing all leaf nodes under the root.
	classes = function(root) {
	    var classes = [];

	    function recurse(name, node) {
		node.forEach(function(child) {
		    classes.push({packageName: name, className: child.character, value: child.value});
		});
	    }

	    recurse(null, root);
	    return {children: classes};
	};

	bubble_color="lightblue";
	color_highlight = "orange";
	width = json.width;
	height = json.height;

	pixel_color = json.pixel_color;
	var color_scale=d3.scale.linear()
	    .domain(d3.extent(pixel_color, function(d) { return parseInt(d); }))
	    .range(["white","#003399"]);

	var pixel_size = 8;
	d3.select("#main_container").append("svg")
	    .attr("id","main")
	    .attr("height",height*pixel_size)
	    .attr("width",width*pixel_size)


	d3.select("#main").selectAll("rect")
	    .data(pixel_color).enter()
	    .append("rect")
	    .attr("id",function(d,i){ return 'pixel_'+i;})
	    .attr("height",pixel_size+"px")
	    .attr("width",pixel_size+"px")
	    .attr("y",function(d,i){return (Math.floor(i/65)*pixel_size);})
	    .attr("x",function(d,i){return (i%65)*pixel_size;})
	    .attr("style", function(d,i){
		style_str = 'fill:';
		style_str += color_scale(d);
		return style_str;
	    });

	//Based on the example found at: http://jsfiddle.net/xsafy/
	var r = 460,
	format = d3.format(",d"),
	fill = d3.scale.category20c();

	var bubble = d3.layout.pack()
	    .sort(null)
	    .size([r, r])
	    .padding(1.5);

	var vis = d3.select("#bubbles_container").append("svg")
	    .attr("width", r)
	    .attr("height", r)
	    .attr("class", "bubbles");


	var node = vis.selectAll("g.node")
	    .data(bubble.nodes(classes(json.letters_count)).filter(function(d) { return !d.children; }))
	    .enter().append("g")
	    .attr("class", "node")
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	node.append("title")
	    .text(function(d) { return d.className + ": " + format(d.value); });

	node.append("circle")
 	    .attr("r", function(d) { return d.r; })
	    .style("fill", bubble_color)
	    .append("svg:title")
	    .text(function(d) { return d.value; });

	node.append("text")
	    .attr("text-anchor", "middle")
	    .attr("dy", ".3em")
	    .text(function(d) { return d.className.substring(0, d.r / 3); });


	// Create highlighting and linking
	d3.selectAll("rect")
	    .on("mouseover", function(d,i){
		var pixel = i;
		var char_list = json.pixel_letters[i];
		d3.select("#pixel_"+i).attr("style","fill:"+color_highlight);
		d3.selectAll("circle")
		    .attr("style", function(d2,i2){
			if (char_list.indexOf(d2.className) > -1) {
			   return "fill:"+color_highlight;
			} else {
			    return "fill:"+bubble_color;
			}
		    });
	    }).on("mouseout", function(d,i){
		d3.select("#pixel_"+i).attr("style","fill:"+color_scale(d)+';');
		d3.selectAll("circle").attr("style","fill:"+bubble_color);
	    })

	title = d3.select("#name");
	title.text(json.language);

	// Get the original text
	var client = new XMLHttpRequest();
	client.open('GET', './data/'+lang+'_source.txt');
	client.onreadystatechange = function() {
	    $("#text").html(client.responseText);
	}
	client.send();
    });
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
