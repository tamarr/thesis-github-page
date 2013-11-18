var language_color = '#B40404';
var language_link_color = '#F5A9A9';
var language_back_color = '#610B0B';

window.onload = function() {
}

function generate_lang(data, svg){
    tab = document.getElementById(data.name);
    if (!tab) return;
    root_origin = tab.offsetTop - 70;
    var height = 750;
    var width = 700;
    var color = language_color;
    var link_color = language_link_color;
    
    root = data;
    root.x0 = 0;
    root.y0 = root_origin;
    
    // Calculate a box for the tree
    var levelWidth = [1];
    var childCount = function(level, n) {

    if(n.children && n.children.length > 0) {
        if(levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level+1] += n.children.length;
        n.children.forEach(function(d) {
        childCount(level + 1, d);
        });
    }
    };
    childCount(0, root); 
    var spacing = 50;
    var newWidth = newHeight = d3.max(levelWidth) * spacing;
    if (newWidth > width - 100) {
    newWidth = width - 100;
    newHeight = height;
    }

    var tree = d3.layout.tree()
    .sort(null)
    .size([newHeight, newWidth])
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
     y = (from_left) ? d.y: width - d.y + 100;
     x =  d.x;
     if (between) {
        if (d.name !== data.name) {
        y = (from_left) ? d.y + 10 : width - 10;
        x = link_node;
        } else {
        x = root_origin;
        }
     }

     if (d.name !== data.name) x += 20;
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

     if (d.name !== data.name) x += 20;
         return "translate(" + y + "," + x + ")";
     })
    
    nodeGroup.append("svg:circle")
     .attr("class", "node-dot")
     .attr('style', function(d){
     return 'stroke: ' + color +'; fill: ' + color + ';';
      })
     .attr("r", function(d){
     return 2;
     });

    nodeGroup.append("svg:text")
     .attr("text-anchor", "end")
     .attr("class","label font")
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