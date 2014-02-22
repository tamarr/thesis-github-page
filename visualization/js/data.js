var data = null;
var static_data = null;
var div = null;
var countryCodes = null;
var countries = null;
var map = null;

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

    var scale = svg.append("g")
        .attr("class", "x axis scale");

    generateScale(scale, [0,1]);

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
     
    map = div.append("svg")
        .attr("id","map")
        .attr("width", width)
        .attr("height", height);
      
    d3.json("data/world.json", function(error, world) {
      countries = topojson.feature(world, world.objects.countries).features,
          neighbors = topojson.neighbors(world.objects.countries.geometries);

      map.selectAll(".country")
          .data(countries)
        .enter().insert("path", ".graticule")
          .attr("class", "country")
          .attr("d", path)
          .style("fill", function(d){
            // Don't display antarctica - country code 10
            if (d.id === 10){
                return "none";
            } 
            return "#ABDDA4";
          });
     
      map.insert("path", ".graticule")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", path);
    });

    d3.json("data/countries_mapping.json", function(error, countriesData) {
        countryCodes = countriesData;
    });

    d3.json("data/static_data.json", function(error, stats) {
        static_data = stats;
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

    // Put all chars in a column
    var script1Link = static_data[script1]["wiki_link"];
    var script2Link = static_data[script2]["wiki_link"];
    var script1Chars = '<a href="' + script1Link + '" target="_blank"><div class="scriptName script1_color">' + script1 + '</div></a>' + convertArrayToStr(data[script1]);
    var script2Chars = '<a href="' + script2Link + '" target="_blank"><div class="scriptName script2_color">' + script2 + '</div></a>' + convertArrayToStr(data[script2]);

    document.getElementById('script1').innerHTML = script1Chars;
    document.getElementById('script2').innerHTML = script2Chars;

    scale = d3.select(".scale")

    generateScale(scale, [0, weight, 1]);

    var script1Info = static_data[script1];
    var script2Info = static_data[script2];

    map.selectAll('.country').data(countries)
        .style("fill", function(d){
            if (d.id === 10){
                return "none";
            } 

            // Check if script 1, 2 or both is used in this country
            var result = 0
            var countryInfo = countryCodes[d.id];
            if (isCountryInScriptLists(countryInfo, script1Info)) {
                result = 1;
            };

            if (isCountryInScriptLists(countryInfo, script2Info)) {
                if (result == 1) {
                    result = 3;
                } else {
                    result = 2;
                }
            };

            switch (result){
                case 1:
                    return '#EC8722';
                case 2:
                    return '#DF2972';
                case 3:
                    return '#800000';
                case 0:
                default:
                    return "#ABDDA4";
            }
        });
}

function isCountryInScriptLists(countryInfo, scriptInfo) {
    if (countryInfo==undefined) {
        return false;
    };

    var countryCode = countryInfo['alphaCode'];
    if (scriptInfo['countries'].indexOf(countryCode) > -1) {
        return true;
    };

    var countryContinent = countryInfo['region'];
    var africa = scriptInfo['africa_except'];
    if (africa != undefined && countryContinent === 'Africa' && africa.indexOf(countryCode) <= -1) {
        return true;
    }

    var europe = scriptInfo['europe_except'];
    if (europe != undefined && countryContinent === 'Europe' && europe.indexOf(countryCode) <= -1) {
        return true;
    }

    return false;
}

function generateScale(scale, tickValues) {
        var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, 350]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues(tickValues)
        .tickFormat(d3.format(".2g"))
        .orient("bottom");

    scale.call(xAxis);
}