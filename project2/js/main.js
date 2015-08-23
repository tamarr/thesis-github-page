window.onload = function() {
    if (!d3.select("#small_multiple")) {
	return;
    }

    lang_list = ["en","pt","de","fr","ms","he","ar","hi","th","zh"];
    for (var i = 0; i < lang_list.length; i++) {
	var language = lang_list[i];
	$.getJSON("./data/"+language+"_letters.json", function(json) {
	    generate_lang(2,json,"#003399");
	});
    }
}

function generate_lang(pixel_size, data, color){

    var color_scale=d3.scale.linear()
	    .domain(d3.extent(data.pixel_color, function(d) { return parseInt(d); }))
	    .range(["white",color]);

    var highlight_color_scale=d3.scale.linear()
	    .domain(d3.extent(data.pixel_color, function(d) { return parseInt(d); }))
	    .range(["white",color]);

    var language = data.language_code;

    // Create the div with the hover and click events
    var div = d3.select("#small_multiple")
	.append("div").attr("class","sample").attr("id","div_"+language)
	.on("mouseover", function() {
	    d3.select(this).select(".description").attr("style", "color:orange;");
	}).on("mouseout", function(){
	    d3.select(this).select(".description").attr("style", "color:grey;");
	}).on("click", function() {
	    window.location.href = "project2.html?lang="+language;
	});

    var node = div.append("svg").attr("id",language);
	
    node.attr("height",data.height*pixel_size)
	    .attr("width",data.width*pixel_size);

    node.selectAll("rect")
	.data(data.pixel_color).enter()
	.append("rect")
	.attr("id",function(d,i){ return language+'_pixel_'+i;})
	.attr("height",pixel_size+"px")
	.attr("width",pixel_size+"px")
	.attr("y",function(d,i){return (Math.floor(i/65)*pixel_size);})
	.attr("x",function(d,i){return (i%65)*pixel_size;})
	.attr("style", function(d){ return 'fill:'+color_scale(d); });

    div.append("div").text(data.language).attr("class","description");
}
