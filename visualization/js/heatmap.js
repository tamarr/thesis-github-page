function load() {
   var width = 960,
       height = 650;

   //height of each row in the heatmap
   var h = 50;
   //width of each column in the heatmap
   var w = 70;

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
        .domain([data.minData, data.maxData + 10])
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
            return (d[2] * w) + 100;
         })
         .attr('y', function(d) {
            return (d[1] * h) + 50;
         })
         .style('fill',function(d) {
            return colorScale(d[0]);
         });

      var columnLabel = mySVG.selectAll(".colLabel")
         .data(data.labels)
         .enter().append('svg:text')
         .attr('x', function(d,i) {
            return ((i + 0.5) * w) + 100;
         })
         .attr('y', 30)
         .attr('class','label')
         .style('text-anchor','middle')
         .text(function(d) {return d;});

      /*var rowLabel = mySVG.selectAll(".rowLabel")
         .data(data.labels)
         .enter().append('svg:text')
         .attr('y', function(d,i) {
            return ((i + 0.5) * h) + 50;
         })
         .attr('x', 50)
         .attr('class','label')
         .style('text-anchor','middle')
         .text(function(d) {return d;});*/

      return mySVG;

   });
}