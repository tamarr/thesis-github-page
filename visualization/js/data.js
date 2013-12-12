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
        .attr("class", "axis");

    // Setup the map
    div.append('div').attr('id', 'basic_choropleth');

        var basic_choropleth = new Datamap({
        element: document.getElementById("basic_choropleth"),
        projection: 'mercator',
        fills: {
        defaultFill: "#ABDDA4",
        authorHasTraveledTo: "#fa0fa0"
        }
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