
    queue()//we need to load two datasets before we can start, queue move async loaders to sync loaders
        .defer(d3.csv, "../data/nodelist.csv")//defer(abwarten) for nodelist.csv and edgelist.csv to load
        .defer(d3.csv, "../data/edgelist.csv")
        .await(function(error, file1, file2) { //await(erwarten) loaded datas
            createAdjacencyMatrix(file1, file2); //callback function with dataset
        });

    function createAdjacencyMatrix(nodes, edges) {
        var edgeHash = {}; //hash to test if a source-target

        for(var x in edges) {
            var id = edges[x].source + "-" + edges[x].target;
            edgeHash[id] = edges[x];
         }

        var matrix = [];
        for(var a in nodes) {
            for(var b in nodes) {
                var grid = { //creates all possible source-target connections
                        id: nodes[a].id + "-" + nodes[b].id,
                        x: b, //sets x coordinates based on source-target pos
                        y: a, //sets y coordinates based on source-target pos
                        weight: 0
                    };
                if (edgeHash[grid.id]) {
                    grid.weight = edgeHash[grid.id].weight;
                }
                matrix.push(grid);
            }
        }

        d3.select("svg")
            .append("g")
            .attr("transform", "translate(50, 50)")
            .attr("id", "adjacencyG")
            .selectAll("rect")
            .data(matrix)
            .enter()
            .append("rect")
            .attr("class", "grid")
            .attr("width", 25)
            .attr("height", 25)
            .attr("x", function (d) {return d.x * 25})
            .attr("y", function (d) {return d.y * 25})
            .style("fill-opacity", function(d) { return d.weight * .2; })

        var scaleSize = nodes.length * 25;
        var nameScale = d3.scale.ordinal()
            .domain(nodes.map(function(el) { return el.id })) //creates ordinal scale from nodes IDs (takes array with ordinal values)
            .rangePoints([0, scaleSize], 1); //used for ordinal values (last parameter = padding)

        var xAxis = d3.svg.axis()
            .scale(nameScale).orient("top").tickSize(4);

        var yAxis = d3.svg.axis()
            .scale(nameScale).orient("left").tickSize(4);

        d3.select("#adjacencyG").append("g").call(xAxis).selectAll("text").style("text-anchor", "end").attr("transform", "translate(-10,-10) rotate(90)");
        d3.select("#adjacencyG").append("g").call(yAxis);

        d3.selectAll("rect.grid").on("mouseover", gridOver);
        function gridOver(d,i) {
            d3.selectAll("rect").style("stroke-width", function (p) {
                return p.x == d.x || p.y == d.y ? "3px" : "1px"});
        };

    }
