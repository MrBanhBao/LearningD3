d3.json("../data/tweets.json", function (error, data) {
    dataViz(data.tweets);
});

function dataViz(incData) {
    var nestedTweets = d3.nest()
        .key(function (el) {
        return el.user; //user is key value
    }).entries(incData);

    var packableTweets = {id: "root", values: nestedTweets}; //puts nested array into object, which is going to be root

    var depthScale = d3.scale.category10([0, 1, 2]); // creates color scale to color each depth

    var packChart = d3.layout.pack();
    packChart.size([500, 500]) //set size
        .children(function(d) { //accessor to
            return d.values;
        })
        .value(function(d) { //function which determines size of children
            //return 1;
            return d.retweets.length + d.favorites.length + 1; //+1 because if tweet with no retweet and favorites are still displayed
        })
        .padding(10);

    d3.select("svg")
        .selectAll("circle")
        .data(packChart(packableTweets))
        .enter()
        .append("circle")
        .attr("r", function(d) { return d.r; })
        //.attr("r", function(d) {return d.r - (d.depth * 10);}) //the more in depth the smaller the circles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill", function(d) {return depthScale(d.depth);})
        .style("stroke", "none")
        .style("stroke", "2px");
}