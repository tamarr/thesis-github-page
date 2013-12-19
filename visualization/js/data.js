var data = null;
var div = null;

function loadData(script_chars) {
    data = script_chars;

    div = d3.select("body")
    .append("div")
    .attr('id','data');

    // Setup the character set display
    div.append('div').attr('class','script script1_color').attr('id', 'script1')
    div.append('div').attr('class','script script2_color').attr('id', 'script2')

    // Setup the scale
    var svg = div.append("svg").attr('id', 'scale')
      .append("g").attr("transform", "translate(30,10)");

    svg.append("g")
        .attr("class", "x axis");

    // Setup the map
    var width = 400,
    height = 300;
  
    var projection = d3.geo.naturalEarth()
        .scale(90)
        .translate([width / 2, height / 2])
        .precision(.1);
     
    var path = d3.geo.path()
        .projection(projection);
     
    var graticule = d3.geo.graticule();
     
    var map = div.append("svg")
        .attr("id","map")
        .attr("width", width)
        .attr("height", height);
      
    d3.json("data/world.json", function(error, world) {
      var countries = topojson.feature(world, world.objects.countries).features,
          neighbors = topojson.neighbors(world.objects.countries.geometries);
     
      map.selectAll(".country")
          .data(countries)
        .enter().insert("path", ".graticule")
          .attr("class", "country")
          .attr("d", path)
          .style("fill", "#ABDDA4");
     
      map.insert("path", ".graticule")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", path);
    });
}

function convertArrayToStr(arr) {
    var str = '';
    for (entry in arr) {
        str += arr[entry] + ' ';
    }

    return str;
}

function displayData(script1, script2, weight) {
    if (data == null || div == null) {
        alert('scripts data or div not loaded');
        return;
    } else if (script1 == undefined || script2 == undefined){
        alert('the given scripts are undefined');
        return;
    } else if (data[script2] == undefined || data[script1] == undefined){
        alert('the data does not contain the given scripts');
        return;
    }

    document.getElementById('data').style.visibility = 'visible';

    // Put all chars in a column
    var script1Chars = '<div class="scriptName">' + script1 + '</div>' + convertArrayToStr(data[script1]);
    var script2Chars = '<div class="scriptName">' + script2 + '</div>' + convertArrayToStr(data[script2]);

    document.getElementById('script1').innerHTML = script1Chars;
    document.getElementById('script2').innerHTML = script2Chars;

    scale = d3.select(".axis")

    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, 350]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues([0, weight, 1])
        .tickFormat(d3.format(".2g"))
        .orient("bottom");

    scale.call(xAxis);
}