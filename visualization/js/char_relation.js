var w = 500;
var h = 400;
var margin = 50;

var fillColor = null;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function distEclud(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function findRepresentativeForCluster(clusters, chars) {
    var rep_chars_arr = new Array();
    // Go over each cluster
    for (var cluster_idx = 0; cluster_idx < clusters.length; cluster_idx++) {
        var cluster_pt = clusters[cluster_idx];
        var rep_char_min = 100;
        var rep_char = undefined;
        // Find and store the minimal distance char
        for (var i = 0; i < chars.length; i++) {
            char_pt = chars[i];
            dist = distEclud(char_pt[0],char_pt[1],cluster_pt[0],cluster_pt[1]);
            if ( dist < rep_char_min) {
                rep_char_min = dist;
                rep_char = char_pt[3];
            }
        }

        // Add the char closest to the cluster center to the representative chars array
        rep_chars_arr[cluster_idx] = rep_char;
    }
    return rep_chars_arr;
}

function generateRepCharsDiv(parent, data) {
    var rep_chars_div = parent.append("div")
        .attr("id", "rep_chars_div")
        .attr("width", 200)
        .attr("height", 40);

    rep_chars_div.selectAll("chars")
        .data(data)
        .enter()
        .append("span")
        .html(function(d){return d;})
        .attr("class", "rep_char")
        .attr("x", function(d){
            return 40*data.indexOf(d);
        })
        .attr("y", "0")
        .attr("style", function(d){
            var color = fillColor(data.indexOf(d));
            return "color:"+color+"; border: 2px solid "+color;
        });
}

function generateScatterPlot(svg, chars, clusters_pts, show_chars) {
    if (show_chars) {
        padding = 40;
        height = 500;
        width = 500;
    } else {
        padding = 0;
        height = 50;
        width = 50;
        margin = 0;
    }

    var xScale = d3.scale.linear()
        .domain([0, 30])
        .range([padding, width]);

    var yScale = d3.scale.linear()
        .domain([0, 50])
        .range([height - padding, padding]);

    //Create SVG element
    svg.attr("class", "scatter_svg")
        .attr("width", width + margin)
        .attr("height", height + margin);

    if (show_chars) {
        // Add char marks
        svg.selectAll("text")
           .data(chars)
           .enter()
           .append("text")
           .text(function(d) {
                return d[3];
           })
           .attr("x", function(d) {
                return xScale(d[0]);
           })
           .attr("y", function(d) {
                return yScale(d[1]);
           })
           .attr("class", "char_mark")
           .attr("style", function(d){
                return "fill:"+fillColor(d[2]);
           });
    } else {
        svg.selectAll("circle")
            .data(chars)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                 return xScale(d[0]);
            })
            .attr("cy", function(d) {
                 return yScale(d[1]);
            })
            .attr("r", 1)
            .attr("style", function(d){
                 return "fill:"+fillColor(d[2]);
            });
    }

    var ticks = show_chars ? 5 : 0;

    // Add Axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(ticks);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(ticks);
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    if (show_chars) {
        // Axes labels
        svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "end")
            .attr("x", width + padding*2)
            .attr("y", height - 10)
            .text("Lines");

        svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "top")
            .attr("x", 0)
            .attr("y", 10)
            .text("Curves");
            
        // Mark clusters centers
        svg.selectAll("clusters")
           .data(clusters_pts)
           .enter()
           .append("text")
           .attr("x", function(d) {
                return xScale(d[0]);
           })
           .attr("y", function(d) {
                return yScale(d[1]);
           })
           .text("+")
           .attr("class", "cluster_mark")
           .attr("style", function(d){
                return "fill:"+fillColor(clusters_pts.indexOf(d));
           });
    }
}

function getRect(svg, script) {
    fillColor = d3.scale.ordinal()
        .domain([0, 1, 2])
        .range(["#F0B2D1", "#C2C2FF", "#D1E0B2"]);

    d3.json("data/chars_outputs/"+script+"_chars_output.json", function(error, dataset) {
        var chars = dataset['chars'];
        var clusters_pts = dataset['clusters'];
        generateScatterPlot(svg, chars, clusters_pts, false);
    });
}

function loadChars() {
    fillColor = d3.scale.ordinal()
        .domain([0, 1, 2])
        .range(["#CC0066", "#6666FF", "#669900"]);

    var script_name = getParameterByName("script");
    var show_chars = getParameterByName("large");
    d3.json("data/chars_outputs/"+script_name+"_chars_output.json", function(error, dataset) {
        var chars = dataset['chars'];
        var clusters_pts = dataset['clusters']
        var rep_chars = findRepresentativeForCluster(clusters_pts, chars);
        
        // Display representative chars
        generateRepCharsDiv(d3.select("body"), rep_chars);

        var svg = d3.select("body").append("svg");
        generateScatterPlot(svg, chars, clusters_pts, show_chars === 'true');
    });
}