var data = null;
var div = null;

function loadData(script_chars) {
    data = script_chars;

    div = d3.select("body")
    .append("div")
    .attr('id','data');

    // Setup the extra data area
    div.append('div').attr('class','script script1_color').attr('id', 'script1')
    div.append('div').attr('class','script script2_color').attr('id', 'script2')
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
    for (char1 in arr) {
        str += arr[char1] + ' ';
    }

    return str;
}

function displayData(script1, script2) {
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
}