queue()
    .defer(d3.csv, "../data/nodelist.csv")
    .defer(d3.csv, "../data/edgelist.csv")
    .await(function (error, file1, file2) {
        createArcDiagram(file1, file2);
    });
function createArcDiagram(nodes, edges) {
    var nodeHash = {};
    for (var x in nodes) {
        nodeHash[nodes[x].id] = nodes[x]; //create hash that associates each node obj it
        nodes[x].x = parseInt(x) * 40; //sets for each node xPos based on its array pos
    }

    for (var x in edges) {
        edges[x].weight = parseInt(edges[x].weight); //string val to int val
        edges[x].source = nodeHash[edges[x].source]; //replace string val to pointer to obj in nodeHash
        edges[x].target = nodeHash[edges[x].target]; //replace string val to pointer to obj in nodeHash
    }

    var linkScale = d3.scale.linear()
        .domain(d3.extent(edges, function (d) {
            return d.weight
        }))
        .range([5, 10]);

    var arcG = d3.select("svg").append("g").attr("id", "arcG") //create "container" for viz
        .attr("transform", "translate(50,250)");

    arcG.selectAll("path")
        .data(edges)
        .enter()
        .append("path")
        .attr("class", "arc")
        .style("stroke-width", function (d) {
            return d.weight * 2;
        })
        .style("opacity", .25)
        .attr("d", arc); //arc = generator for path

    arcG.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("cx", function (d) {
            return d.x; //draws to circle at each node's x position from line 11
        });

    function arc(d, i) {
        var draw = d3.svg.line().interpolate("basis");
        var midX = (d.source.x + d.target.x) / 2;
        var midY = (d.source.x - d.target.x) * 2;
        return draw([[d.source.x, 0], [midX, midY], [d.target.x, 0]])
    }

    d3.selectAll("circle").on("mouseover", nodeOver);
    d3.selectAll("path").on("mouseover", edgeOver);
    function nodeOver(d,i) {
        d3.selectAll("circle").classed("active", function (p) {
            return p == d ? true : false;
        });

        d3.selectAll("path").classed("active", function (p) {
            return p.source == d || p.target == d ? true : false;
        });
    }

    function edgeOver(d) {
        d3.selectAll("path").classed("active", function (p) {
            return p == d ? true : false;
        });
        d3.selectAll("circle").style("fill",function(p) {
                return p == d.source ? "blue" : p == d.target ? "green" : "lightgray";
        });
    }
}