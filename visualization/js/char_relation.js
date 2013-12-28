var w = 500;
var h = 400;
var margin = 20;
var padding = 20;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function loadChars() {
    var script_name = getParameterByName("script");
    d3.json("data/chars_outputs/"+script_name+"_chars_output.json", function(error, dataset) {
        var chars = dataset['chars'];
        var fillColor = d3.scale.ordinal()
            .domain([0, 1, 2])
            .range(["red", "blue", "green"]);

        var xScale = d3.scale.linear()
            .domain([0, 30])
            .range([padding, w]);

        var yScale = d3.scale.linear()
            .domain([0, 30])
            .range([h - padding, padding]);

        //Create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("id", "scatter_svg")
            .attr("width", w + margin)
            .attr("height", h + margin);

        /*svg.selectAll("circle")
           .data(chars)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
                return xScale(d[0]);
           })
           .attr("cy", function(d) {
                return yScale(d[1]);
           })
           .attr("r", 5)
           .attr("style", function(d){
                return "fill:"+fillColor(d[2]);
           });*/

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
           .attr("font-family", "sans-serif")
           .attr("font-size", "1em")
           .attr("style", function(d){
                return "fill:"+fillColor(d[2]);
           });

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


        svg.selectAll("clusters")
           .data(dataset['clusters'])
           .enter()
           .append("text")
           .attr("x", function(d) {
                return xScale(d[0]);
           })
           .attr("y", function(d) {
                return yScale(d[1]);
           })
           .text("+")
           .attr("font-size", "1.5em")
           .attr("style", "fill:purple");
    });
}