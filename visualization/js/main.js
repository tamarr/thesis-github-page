var treeInfo='Evolution Tree:</br>This tree represents a condenced evolutionary tree for the scripts displayed. The data for this tree was scrapped from wikipedia using the Pattern library. For more information see the <a href="https://googledrive.com/host/0B3_yWG2n9ZTeRzc2bmxKSVZkNG8/index.html">original project</a>';
var heatmapInfo='Heatmap:</br>The intesity of the color on the heatmap corolates to similarity as calculated by our algorithm. We gather an average of lines and curves per script and calculate the similarity as an Euclidean distance function. The diagonal is the intersection of a script with itself therefore it always has a value of 1 (identity). Therefore we overlayed it with a small version of the letters distribution as a scatter plot with identical axes values between the scripts to allow comparison. A larger version of the scatter plots is displayed in the comparison area.';
var comparisonInfo='Comparison Info:</br>This section displays additional information on compared scripts. The scatter plots at the top shows the distribution of the character with relation to lines and curves. The letters are divided into clusters using a bisecting kmeans algorithm and the letter closest to each cluster center (marked in +) is selected as a representative character and shown at the top. The scale displays the similarity value correlating to the color intensity of the heatmap. The world map shows general locations where the scripts are used today. The script name at the top is a link to it\'s Wikipedia article.';

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