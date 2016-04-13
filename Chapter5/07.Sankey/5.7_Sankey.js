d3.json("../data/sitestats.json", function(error, data) {
    var numLayouts = 1;

    var sankey = d3.sankey()
        .nodeWidth(1) //where to start and stop drawing flows between nodes
        .nodePadding(200) //istance between nodes vertically
        .size([460, 460])
        .nodes(data.nodes) //formats nodes to sankey layout nodes
        .links(data.links) //formats links to sankey layout links
        .layout(numLayouts); //number of times to run the layout to optimize placement of flows
    //ANIMATION
    d3.select("svg").on("click", moreLayouts);

    function moreLayouts() {
        numLayouts += 50;
        sankey.layout(numLayouts);

        d3.selectAll(".link")
            .transition()
            .duration(500)
            .attr("d", sankey.link());

        d3.selectAll(".node")
            .transition()
            .duration(500)
            .attr("transform", function(d) {
                return "translate(" + d.x + ", " + d.y + ")";
            })
    }

    var intensityRamp = d3.scale.linear()
        .domain([0, d3.max(data.links, function(d) {
            return d.value;
        })])
        .range(["black", "red"]);

    d3.select("svg").append("g")
        .attr("transform", "translate(20, 20)") //offsets the parent g of entire chart
        .attr("id", "sankeyG");

    d3.select("#sankeyG").selectAll(".link")
        .data(data.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", sankey.link()) //sankey.link function is path generator
        .style("stroke-width", function(d) { return d.dy; }) //layout expects to use thick stroke and not filled area
        .style("stroke-opacity",.5)
        .style("fill", "none")
        .style("stroke", function(d) {
            return intensityRamp(d.value); //stroke color using intensityRamp
        })
        .sort(function(a, b) {
            return b.dy - a.dy;
        })
        .on("mouseover", function() {
            d3.select(this).style("stroke-opacity", .8);
        })
        .on("mouseout", function() {
            d3.selectAll("path.link").style("stroke-opacity", .5)
        });

    d3.select("#sankeyG").selectAll(".node")
        .data(data.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    //WITH RECT
    /*d3.selectAll(".node").append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", 20)
        .style("fill", "pink")
        .style("stroke", "gray");*/

    //WITH CIRCLES
    d3.selectAll(".node").append("circle")
        .attr("height", function(d) { return d.dy; })
        .attr("r", function(d) { return d.dy / 2; })
        .attr("cy", function(d) { return d.dy / 2; })
        .style("fill", "pink")
        .style("stroke", "gray");

    d3.selectAll(".node").append("text")
        .attr("x", 0)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });
});

