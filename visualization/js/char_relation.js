var w = 500;
var h = 400;
var margin = 5;

function loadChars() {
    d3.json("data/char_heatmap.json", function(error, dataset) {
        var chars = dataset['chars'];
        var fillColor = d3.scale.ordinal()
            .domain([0, 1, 2])
            .range(["red", "blue", "green"]);

        var xScale = d3.scale.linear()
            .domain([0, d3.max(chars, function(d) { return d[0]; })])
            .range([0, w - margin]);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(chars, function(d) { return d[1]; })])
            .range([0, h - margin]);

        //Create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

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
           .attr("r", 5)
           .attr("style", function(d){
                return "fill:"+fillColor(d[2]);
           });

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
           .attr("fill", "black");

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(5);
        
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - margin) + ")")
            .call(xAxis);
    });
}