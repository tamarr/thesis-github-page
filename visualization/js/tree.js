var color = 'green';
var svg = null;

function generate_lang(order) {
  d3.json("data/Egyptian_hieroglyphs_script.json", function(error, data) {  
    svg = d3.select("body")
      .append("svg")
      .attr('class','tree');

    root_origin = 100;
    var height = 750;
    var width = 300;
    
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
        var idx = order.indexOf(d.name)

        if (d.name === data.name) {
            d.y = 10; 
            d.x = root_origin;
        } else if (idx >= 0) {
            d.y = 210;
            d.x = 50 * idx + 125;
        } else {
            d.y -= 30;
        }

        if(d.name == "Greek") d.y -= 50;
        else if (d.name == "Brāhmī" || d.name == "Nāgarī") {
            d.x += 100;
            d.y -= 20;
        }
    }); 

    var links = tree.links(nodes);
    var layoutRoot = svg.attr("width", width).attr("height", height)
    .append("svg:g")

    // Edges between nodes as a <path class="link" />
    var link = d3.svg.diagonal()

    .projection(function(d)
    {
        return [d.y, d.x];
    });

    layoutRoot.selectAll("path.link")
    .data(links)
    .enter()
    .append("svg:path")
    .attr("class", "link")
    .attr('style', function(d){
        return 'stroke: ' + color +'; ';
    })
    .attr("d", link);

    var nodeGroup = layoutRoot.selectAll("g.node")
     .data(nodes)
     .enter()
     .append("svg:g")
     .attr("class", "node")
     .attr("id", function(d) {return getID(d.name);})
     .attr("transform", function(d)
     {
        return "translate(" + d.y + "," + d.x + ")";
     });

     nodeGroup.append("svg:circle")
     .attr("class", "node-dot")
     .attr('style', function(d){
        var fill_color = (isLiveScript(d.name)) ? color : 'white'
        return 'stroke: ' + color +'; fill: ' + fill_color + ';';
     })
     .attr("r", function(d){
        return 4;
    });

    nodeGroup.append("svg:text")
    .attr("text-anchor", "end")
    .attr("class",function(d){
        var name = "tree_label";
        if (isLiveScript(d.name)) name += ' bigger';
        return name;
    })
    .attr("dx", function(d){
        if (isLiveScript(d.name)) {
            return 80;
        } else if (d.name === data.name) {
            return 130;
        }

        return 30;
    })
    .attr("dy", function(d){
        if (isLiveScript(d.name)) {
            return 5;
        };

        return -10;
    })
    .text(function(d)
    {
        if (d.name !== data.name)
            return d.name;
        else
            return 'Egyptian Hieroglyphs';
    })
    .attr('style', 'fill:'+color);

    return layoutRoot;
  });
}

function getID(name) {
    return name.replace(' ','') + '_node';
}

function isLiveScript(name) {
    return (order.indexOf(name) >= 0);
}


function redrawSelectedNodes(script1, script2) {
    if (!svg) return;

    svg.selectAll('.node-dot').attr('style', function(d){
        var fill_color = (isLiveScript(d.name)) ? color : 'white'
        if (d.name === script1) fill_color = '#E2A600';
        else if (d.name === script2) fill_color = '#DF2972';
        return 'stroke: ' + color +'; fill: ' + fill_color + ';';

    });

    svg.selectAll('.tree_label').attr('style', function(d){
        var str = 'fill: ';
        if (d.name === script1) str += '#E2A600; font-weight: bold;';
        else if (d.name === script2) str +='#DF2972; font-weight: bold;';
        else str += color;
        return str;
    });
}