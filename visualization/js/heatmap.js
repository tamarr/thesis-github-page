var lastSelected = null;

function load() {
  var width = 650,
  height = 750;

  //height of each row in the heatmap
  var h = 50;
  //width of each column in the heatmap
  var w = 50;

  //attach a SVG element to the div
  var mySVG = d3.select("#meta")
  .append("svg")
  .attr("width", width) 
  .attr("height", height)
  .attr('class','heatmap');

  d3.json("data/scripts_heatmap.json", function(error, data) {
    var hash_lookup = [];

    //initialize data section
    loadData(data['scripts_data']);

    //define a color scale using the min and max expression values
    var colorScale = d3.scale.linear()
    .domain([0, 1])
    .range(["white", "green"]);

    //generate heatmap rows
    var heatmapRow = mySVG.selectAll(".heatmapRows")
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
      .attr('id', function(d){
        if (d[1] === 4 && d[2] === 1) {
          return "toSelect";
        };
      })
      .attr('x', function(d) {
        return getRectXY(w, d[2], 90);
      })
      .attr('y', function(d) {
        return getRectXY(h, d[1], 100);
      })
      .style('fill',function(d) {
        return colorScale(d[0]); 
      }).on('click', function(d){
        // Show extra data on the right-hand side
        displayData(order[d[1]], order[d[2]], d[0]);
        // Redraw the columns to color the selected scripts
        redrawColumnLabels(mySVG, data, order[d[1]], order[d[2]]);

        // Highlight selected rect and unselect previous
        self = d3.select(this);
        self.attr('class', 'selected');
        if (lastSelected) lastSelected.attr('class', '');
        lastSelected = self;

        redrawSelectedNodes(order[d[1]], order[d[2]]);

        scale = d3.select(".scale")

        generateScale(scale, [0, d[0], 1]);

      }).append("svg:title")
        .text(function(d) {return order[d[1]] + " & " + order[d[2]];})
        .attr("x", function(d) {return 0;})
        .attr("y", function (d) {return 0;});

    for (var i = 0; i < data.labels.length; i++) {
      var svg = mySVG.append('svg')
        .attr('x', getRectXY(w, i, 90))
        .attr('y', getRectXY(h, i, 100));

      getRect(svg, data.labels[i]);
    }

    // First time we create the labels - redrawColumnLabels will update
    var columnLabel = mySVG.selectAll(".colLabel")
    .data(data.labels)
    .enter().append('svg:text')
    .attr('x', function(d,i) {
      return getLabelX(i, w);
    })
    .attr('y', 100)
    .attr('class','label green')
    .attr('transform',function(d, i) {
      return 'rotate(-65 '+(getLabelX(i, w))+',90)';
    })
    .text(function(d) {return d;});

    // Setup the scale
    var scaleSvg = d3.select("#meta")
      .append("svg").attr('id', 'scale');

    // Add gradient - this gradient is referenced in the fill of the scale in the css
    var defs = scaleSvg.append('defs').append('linearGradient')
      .attr('id','grad1')
      .attr('x1','0%').attr('y1','0%')
      .attr('x2','100%').attr('y2','0%');
    defs.append('stop')
      .attr('offset','0%').attr('style','stop-color:white;stop-opacity:1')
    defs.append('stop')
      .attr('offset','100%').attr('style','stop-color:green;stop-opacity:1')

    var scaleG = scaleSvg.append("g").attr("transform", "translate(30,10)");

    var scale = scaleG.append("g")
        .attr("class", "x axis scale");

    generateScale(scale, [0,1]);
  });
}

function redrawColumnLabels(svg, data, script1, script2) {
  svg.selectAll(".label")
    .data(data.labels)
    .attr('class',function(d){
      var str = 'label';
      if (d === script1) str += ' script1_color';
      else if (d === script2) str += ' script2_color';
      else str += ' green';
      return str;
    })
}

function getLabelX(i, w) {
  return ((i + 0.5) * w) + 70;
}

function getRectXY(m, i, padd) {
  return (i * m) + padd;
}

function generateScale(scale, tickValues) {
        var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, 250]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues(tickValues)
        .tickFormat(d3.format(".2g"))
        .tickSize(10)
        .orient("bottom");

    scale.call(xAxis);
}