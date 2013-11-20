var language_color = '#B40404';
var language_link_color = '#F5A9A9';
var language_back_color = '#610B0B';

function generate_lang(data, svg){
    root_origin = 100;
    var height = 700;
    var width = 400;
    var color = language_color;
    var link_color = language_link_color;
    var order = [
    "Greek", 
    "Cryllic", 
    "Latin", 
    "Hebrew", 
    "Arabic", 
    "Thai", 
    "Telugu", 
    "Tamil", 
    "Malayalam", 
    "Devanagari", 
    "Gujarati"
    ]
    
    root = data;
    root.x0 = 50;
    root.y0 = root_origin;

    var tree = d3.layout.tree()
    .sort(null)
    .size([height, width])
    .children(function(d)
    {
        if(!d.children || d.children.length === 0)
            return null;

    // Remove nodes with one child (single line) to avoid clutter
    for (var i = 0; i < 5; i++) {
        // Break if this is not a single line node OR if this is the origin 
        // OR if this language has a script associated OR if this is a live script
        if (!d.children || d.children.length !== 1) {
            break;
        }
        new_children = d.children[0].children; 
        new_name = d.children[0].name;
        d.children = new_children;
        d.name = new_name;
    }

    return (!d.children || d.children.length === 0) ? null : d.children;
});

    var nodes = tree.nodes(data);
    // Set the root node to start from the tab
    nodes.forEach(function(d) {
        if (d.name === data.name) {
            d.y = 10; 
            d.x = root_origin;
        }
    }); 

    var links = tree.links(nodes);
    var layoutRoot = svg.attr("width", width+100).attr("height", height + 100).attr('class','svg_position')
    .append("svg:g")

    // Edges between nodes as a <path class="link" />
    var link = d3.svg.diagonal()
    .projection(function(d)
    {
     y = d.y;
     x =  d.x;


     var idx = order.indexOf(d.name)

     if (idx >= 0) {
        y = 400;
        x = 50 * idx + 100;
    }
}
return [y, x];
});

    layoutRoot.selectAll("path.link")
    .data(links)
    .enter()
    .append("svg:path")
    .attr("class", "link")
    .attr('style', function(d){
     return 'stroke: ' + link_color +'; ';
 })
    .attr("d", link);

 /*
     Nodes as
     <g class="node">
         <circle class="node-dot" />
         <text />
     </g>
     */
     var nodeGroup = layoutRoot.selectAll("g.node")
     .data(nodes)
     .enter()
     .append("svg:g")
     .attr("class", "node")
     .attr("id", function(d) {return getID(d.name);})
     .attr("transform", function(d)
     {
         y = d.y;
         x = d.x;


         var idx = order.indexOf(d.name)

         if (idx >= 0) {
            y = 400;
            x = 50 * idx + 120;
        }
    }
    return "translate(" + y + "," + x + ")";
})

     nodeGroup.append("svg:circle")
     .attr("class", "node-dot")
     .attr('style', function(d){
         return 'stroke: ' + color +'; fill: ' + color + ';';
     })
     .attr("r", function(d){
        return 4;
    });

     nodeGroup.append("svg:text")
     .attr("text-anchor", "end")
     .attr("class","tree_label")
     .attr("dx", 30)
     .attr("dy", -6)
     .text(function(d)
     {
         if (d.name !== data.name) {
             return d.name;
         }
     })
     .attr('style', 'fill:'+color);

     return layoutRoot;
 }

 function getID(name) {
    return name.replace(' ','') + '_node';
}