queue() //we need to load two datasets before we can start, queue move async loaders to sync loaders
    .defer(d3.csv, "../data/nodelist.csv") //defer(abwarten) for nodelist.csv and edgelist.csv to loa
    .defer(d3.csv, "../data/edgelist.csv")
    .await(function(error, file1, file2) { //await(erwarten) loaded datas
        createForceLayout(file1, file2) //callback function
    });

function createForceLayout(nodes, edges) {
    var nodeHash = {}; //Obj which will contain nodes with their ID has Hash

    for(var x in nodes) {
        nodeHash[nodes[x].id] = nodes[x]; //add new attribute to nodeHash which stores the node
    }

    for(var x in edges) {
        edges[x].weight = parseInt(edges[x].weight); //convert
        edges[x].source = nodeHash[edges[x].source]; //direct reference to node obj in nodeHash
        edges[x].target = nodeHash[edges[x].target];
    }

    var weightScale = d3.scale.linear()
        .domain(d3.extent(edges, function(d) { return d.weight })) //returns array with min max vals of weight
        .range([.1, 1]);

    var force = d3.layout.force().charge(-1000) //how much each node pushes away each other (positive number nodes attract each other)
        .gravity(0.1) //forbids the nodes fly off screen
        .linkDistance(50) //attraction between nodes (default 20) optimal distance
        .linkStrength(function(d) { return weightScale(d.weight)})
        .size([500, 500])
        .nodes(nodes)
        .links(edges)
        .on("tick", forceTick); //"tick" events are fired continously, running associated function


    d3.select("svg").selectAll("line.link")
        .data(edges, function(d) { return d.source.id + "-" + d.target.id;}) //key values for nodes and edges will help when updating it later
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return d.weight})
        .style("stroke", "gray");
    var nodeEnter = d3.select("svg").selectAll("g.node")
        .data(nodes, function(d) { return d.id;})
        .enter()
        .append("g")
        .attr("class", "node");

    d3.selectAll("g.node").call(force.drag()); //behavior "force.drag" is called by element g.node

    nodeEnter.append("circle")
        .attr("r", 5)
        .style("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "1px");

    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 15)
        .text(function(d) {return d.id;});

    force.start(); //Initializing the netwok: start firing "tick" events and calcs the degree centrality of nodes

    function forceTick() { //updates edge-drawing and node-drawing after "tick" event:
        d3.selectAll("line.link") //updates links
            .attr("x1", function(d) { return d.source.x})
            .attr("x2", function(d) { return d.target.x})
            .attr("y1", function(d) { return d.source.y})
            .attr("y2", function(d) { return d.target.y})

        d3.selectAll("g.node") //updates node
            .attr("transform", function(d) {
                return "translate("+ d.x+","+ d.y+")";
            })


        //symbol which is connected to a path, line, polyline, polygon element
        var marker = d3.select("svg").append('defs') //container for the marker
            .append('marker')
            .attr("id", "Triangle")
            .attr("refX", 12) //genaue positionierung innerhalb eines markers
            .attr("refY", 6)
            .attr("markerUnits", 'userSpaceOnUse')//maßeinheit strokeWidth (spitze passt sich an dicke an) || userSpaceOnUse (keine anpassung, immer gleich)
            .attr("markerWidth", 12)
            .attr("markerHeight", 18)
            .attr("orient", 'auto')
            .append('path')
            .attr("d", 'M 0 0 12 6 0 12 3 6');

        d3.selectAll("line").attr("marker-end", "url(#Triangle)");
        /*
         marker-start - Pfeilspitze am Beginn des Pfades,
         marker-end - Pfeilspitze am Ende des Pfades, und
         marker-mid - alle anderen Enden des Pfades (außer Beginn und Ende)
        */

    }
    d3.select("#controlls").append("button")
        .on("click", sizeByDegree).html("Degree Size");

    function sizeByDegree() {
        //force.stop();
        d3.selectAll("circle")
            .attr("r", function(d) { return d.weight * 2 })
    }

    //updateing network
    /*
    force.stop() - turns of the force interactions (stops running simulation)
    force.start() - begin or restart animation
    force.resume() - restarts cooling parameter
    force.tick() - move layout iteration one step
    force..drag() -
     */

    d3.selectAll("g.node").on("click", fixNode);

    function fixNode(d) {
        d3.select(this).select("circle").style("stroke-width", 4);
        d.fixed = true; //every node got boolean atr. fixed (true -> affected by tick, false -> not affected)
    }

    d3.select("#controlls").append("button")
        .on("click", addEdge).html("Add Edge");

    function addEdge() {
        force.stop();
        var oldEdges = force.links(); //get all edges
        var nodes = force.nodes(); //get all nodes
        newEdge = {source: nodes[0], target: nodes[8], weight: 5}; //create new node
        oldEdges.push(newEdge); //pushes newEdge
        force.links(oldEdges); //refrence links attr. to edges with new edge
        d3.select("svg").selectAll("line.link")
            .data(oldEdges, function(d) {
                return d.source.id + "-" + d.target.id;
            })
            .enter()
            .insert("line", "g.node")
            .attr("class", "link")
            .style("stroke", "red")
            .style("stroke-width", 5)
            .attr("marker-end", "url(#Triangle)");
        force.start();
    }

    d3.select("#controlls").append("button")
        .on("click", addNodesAndEdges).html("Add Node and Edge");

    function addNodesAndEdges() {
        force.stop();
        var oldEdges = force.links();
        var oldNodes = force.nodes();
        var newNode1 = {id: "raj", followers: 100, following: 67};
        var newNode2 = {id: "wu", followers: 50, following: 33};
        var newEdge1 = {source: oldNodes[0], target: newNode1, weight: 5};
        var newEdge2 = {source: oldNodes[0], target: newNode2, weight: 5};
        oldEdges.push(newEdge1, newEdge2);
        oldNodes.push(newNode1, newNode2);
        force.links(oldEdges).nodes(oldNodes);

        d3.select("svg").selectAll("line.link")
            .data(oldEdges, function (d) {
                return d.source.id + "-" + d.target.id
            })
            .enter()
            .insert("line", "g.node")
            .attr("class", "link")
            .style("stroke", "red")
            .style("stroke-width", 5)
            .attr("marker-end", "url(#Triangle)");

        var nodeEnter = d3.select("svg").selectAll("g.node")
            .data(oldNodes, function (d) {
                return d.id
            }).enter()
            .append("g")
            .attr("class", "node")
            .call(force.drag());

        nodeEnter.append("circle")
            .attr("r", 5)
            .style("fill", "red")
            .style("stroke", "darkred")
            .style("stroke-width", "2px");
        nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 15)
            .text(function (d) {
                return d.id;
            });
        force.start();
    }

    d3.select("#controlls").append("button")
        .on("click", manuallyPositionNodes).html("Add manually");

    function manuallyPositionNodes() {
        var xExtent = d3.extent(force.nodes(), function(d) {
            return parseInt(d.followers)
        });
        var yExtent = d3.extent(force.nodes(), function(d) {
            return parseInt(d.following)
        });
        var xScale = d3.scale.linear().domain(xExtent).range([50,450]);
        var yScale = d3.scale.linear().domain(yExtent).range([450,50]);
        force.stop();
        d3.selectAll("g.node")
            .transition()
            .duration(1000)
            .attr("transform", function(d) {
                return "translate("+ xScale(d.followers)
                    +","+yScale(d.following) +")";
            });
        d3.selectAll("line.link")
            .transition()
            .duration(1000)
            .attr("x1", function(d) {return xScale(d.source.followers);})
            .attr("y1", function(d) {return yScale(d.source.following);})
            .attr("x2", function(d) {return xScale(d.target.followers);})
            .attr("y2", function(d) {return yScale(d.target.following);});

        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(4);
        var yAxis = d3.svg.axis().scale(yScale).orient("right").tickSize(4);
        d3.select("svg").append("g").attr("transform",
            "translate(0,460)").call(xAxis);
        d3.select("svg").append("g").attr("transform",
            "translate(460,0)").call(yAxis);
        d3.selectAll("g.node").each(function(d){
            d.x = xScale(d.followers);
            d.px = xScale(d.followers);
            d.y = yScale(d.following);
            d.py = yScale(d.following);
        });
    };

}