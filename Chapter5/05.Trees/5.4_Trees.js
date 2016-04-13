d3.json("../data/tweets.json", function(error, data) {
    dataViz(data.tweets);
});

function dataViz(incData) {
    var nestedTweets = d3.nest()
        .key(function(el) {
            return el.user;
        })
        .entries(incData);

    var packableTweets = {id: "root", values: nestedTweets};

    var depthScale = d3.scale.category10([0, 1, 2]); // creates color scale to color each depth

    var treeChart = d3.layout.tree();
    treeChart.size([500, 500])
        .children(function(d) { return d.values; }); //returns children, which are attr: "values"

    var linkGenerator = d3.svg.diagonal(); //creates diagonal generator with default settings
    linkGenerator.projection(function (d) {
        return [d.y, d.x]; //switch x and y to orient the lines horizontally
    });

    d3.select("svg")
        .append("g") //container for our tree elements
        .attr("id", "treeG")
        .selectAll("g")
        .data(treeChart(packableTweets))
        .enter()
        .append("g") //create g element to label them
        .attr("class", "node")
        .attr("transform", function(d) {
            //return "translate(" + d.x + ", " + d.y +")";
            return "translate(" + d.y + ", " + d.x +")"; //allign nodes horizontally
        });

    d3.selectAll("g.node")
        .append("circle") //circle represents each node
        .attr("r", 10)
        .style("fill", function(d) { return depthScale(d.depth) })
        .style("stroke", "white")
        .style("stroke-width", "2px");

    d3.selectAll("g.node")
        .append("text")
        .text(function(d) { return d.id || d.key || d.content }); //Text label for each node being either id, key or content

    d3.select("#treeG").selectAll("path")
        //The .links function of the layout creates an array of links between each node that we can use to dra these links.
        .data(treeChart.links(treeChart(packableTweets)))
        .enter().insert("path", "g")
        .attr("d", linkGenerator) //gerates diagonal
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "2px");

    var treeZoom = d3.behavior.zoom(); //Create new zoom component
    treeZoom.on("zoom", zoomed); //attach "zoom" event to zoomed function
    d3.select("svg").call(treeZoom); //Calls our zoom component with SVG canvas

    function zoomed() {
        var zoomTranslate = treeZoom.translate();//transform attribute (x,y) changes
        //var zoomScale = treeZoom.scale();
        //console.log(zoomScale);
        d3.select("#treeG").attr("transform", "translate(" + zoomTranslate[0] + ", " + zoomTranslate[1]+")"); //set changes
    }
}