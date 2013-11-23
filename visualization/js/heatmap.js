function load(order) {
 var width = 650,
 height = 750;

   //height of each row in the heatmap
   var h = 50;
   //width of each column in the heatmap
   var w = 50;

   var order = [
   "Greek", 
   "Cyrillic", 
   "Latin", 
   "Hebrew", 
   "Arabic", 
   "Thai", 
   "Tamil", 
   "Malayalam", 
   "Telugu",
   "Gujarati",
   "Devanagari"
   ]

   //attach a SVG element to the document's body
   var mySVG = d3.select("body")
   .append("svg")
   .attr("width", width) 
   .attr("height", height)
   .attr('class','heatmap');

   d3.json("data/languages_heatmap.json", function(error, data) {
    var hash_lookup = [];

      //define a color scale using the min and max expression values
      var colorScale = d3.scale.linear()
      .domain([data.minData, data.maxData])
      .range(["green", "white"]);

      //generate heatmap rows
      var heatmapRow = mySVG.selectAll(".heatmap")
      .data(data.data)
      .enter().append("g");

      //generate heatmap columns
      var heatmapRects = heatmapRow
      .selectAll(".rect")
      .data(function(d) {
        return d;
      }).enter().append("svg:rect")
      .attr('width',w)
      .attr('height',h)
      .attr('x', function(d) {
        return (d[2] * w) + 90;
      })
      .attr('y', function(d) {
        return (d[1] * h) + 100;
      })
      .style('fill',function(d) {
        return colorScale(d[0]);
      }).on("mouseover", function() {
        d3.select(this).append("svg:title")
        .text(function(d) {return order[d[1]] + " & " + order[d[2]];})
        .attr("x", function(d) {return 0;})
        .attr("y", function (d) {return 0;}); 
      });

      var columnLabel = mySVG.selectAll(".colLabel")
      .data(data.labels)
      .enter().append('svg:text')
      .attr('x', function(d,i) {
        return getLabelX(i, w);
      })
      .attr('y', 100)
      .attr('class','label')
      .attr('transform',function(d, i) {
        return 'rotate(-65 '+(getLabelX(i, w))+',90)';
      })
      .text(function(d) {return d;});

      return mySVG;

    });
}

function getLabelX(i, w) {
  return ((i + 0.5) * w) + 70;
}