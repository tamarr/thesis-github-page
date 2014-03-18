var treeInfo='Evolution Tree:</br></br>This tree represents a condenced evolutionary tree for the scripts displayed. The data for this tree was scrapped from Wikipedia using the Pattern library. For more information see the <a href="https://googledrive.com/host/0B3_yWG2n9ZTeRzc2bmxKSVZkNG8/index.html">original project</a>.</br>';
var heatmapInfo='Heatmap:</br></br>The intesity of the color on the heatmap corolates to similarity as calculated by our algorithm. We gather an average of lines and curves per script and calculate the similarity as an Euclidean distance function.</br></br> The diagonal is the intersection of a script with itself. Since it contains no additional information we overlayed it with a small version scatter plot of the letters distribution. A larger version of the scatter plots is displayed in the comparison area and all scatter plots can be found <a href="/visualization/char_relation.html">here</a>.</br>';
var comparisonInfo='Comparison Info:</br></br>This section displays additional information on compared scripts. The scatter plots at the top shows the distribution of the character with relation to lines and curves. The letters are divided into clusters using a bisecting kmeans algorithm and the letter closest to each cluster center (marked in +) is selected as a representative character and shown below the scatter plot. The world map shows general locations where the scripts are used today. The script name at the top is a link to it\'s Wikipedia article.</br>';

var closeButton = '<button id="closeButton" onClick="closeInfo()">X</button>'

var order = [
   "Greek", 
   "Latin", 
   "Cyrillic", 
   "Hebrew", 
   "Arabic", 
   "Thai", 
   "Tamil", 
   "Malayalam", 
   "Telugu",
   "Gujarati",
   "Devanagari"
  ];
  
function popupInfo(type) {
    var infoText = treeInfo;
    var infoClass = "treeInfo";

    if (type === "heatmap") {
        infoText = heatmapInfo;
        infoClass = "heatmapInfo";
    } else if (type === "data") {
        infoText = comparisonInfo;
        infoClass = "comparisonInfo";
    }

    var popupWindow = d3.select("#popup")
    popupWindow.html(infoText + closeButton);
    popupWindow.attr("class", infoClass);
    popupWindow.style("visibility", "visible");
}

function closeInfo() {
    d3.select("#popup").style("visibility", "hidden");
}