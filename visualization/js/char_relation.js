var w = 500;
var h = 400;
var margin = 50;
var padding = 20;

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

function loadChars() {
    var script_name = getParameterByName("script");
    d3.json("data/chars_outputs/"+script_name+"_chars_output.json", function(error, dataset) {
        var chars = dataset['chars'];
        var clusters_pts = dataset['clusters']
        var rep_chars = findRepresentativeForCluster(clusters_pts, chars);

        // Setup scales
        var fillColor = d3.scale.ordinal()
            .domain([0, 1, 2])
            .range(["#CC0066", "#6666FF", "#669900"]);

        var xScale = d3.scale.linear()
            .domain([0, 50])
            .range([padding, w]);

        var yScale = d3.scale.linear()
            .domain([0, 50])
            .range([h - padding, padding]);

        // Display representative chars
        var rep_chars_div = d3.select("body")
            .append("div")
            .attr("id", "rep_chars_div")
            .attr("width", w + margin)
            .attr("height", 40);

        rep_chars_div.selectAll("chars")
            .data(rep_chars)
            .enter()
            .append("span")
            .html(function(d){return d;})
            .attr("class", "rep_char")
            .attr("x", function(d){
                return 40*rep_chars.indexOf(d);
            })
            .attr("y", "0")
            .attr("style", function(d){
                var color = fillColor(rep_chars.indexOf(d));
                return "color:"+color+"; border: 2px solid "+color;
            });

        //Create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("id", "scatter_svg")
            .attr("width", w + margin)
            .attr("height", h + margin);

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

        // Add Axes
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(5);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);
        
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        // Axes labels
        svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "end")
            .attr("x", w + padding*2)
            .attr("y", h - 10)
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
    });
}