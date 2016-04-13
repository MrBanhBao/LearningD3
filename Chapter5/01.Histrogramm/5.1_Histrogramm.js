d3.json("../data/tweets.json", function(error, data) {
    histogram(data.tweets);
});

function histogram(tweetsData) {
    var xScale = d3.scale.linear().domain([0, 5]).range([0, 500]);
    var yScale = d3.scale.linear().domain([0, 10]).range([400, 0]);

    var xAxis = d3.svg.axis().scale(xScale).ticks(5).orient("bottom");
    var yAxis = d3.svg.axis().scale(yScale).ticks(5).orient("right");

    d3.select("svg").append("g").attr("class", "x axis")
        .attr("transform", "translate(0,400)").call(xAxis);

    d3.select("g.axis").selectAll("text").attr("dx", 50); //center labels (dx relative coordinates)

    var histoChart = d3.layout.histogram(); //creates new layout function

    histoChart.bins([0, 1, 2, 3, 4, 5]).value(function(d) { //determines values the histrogram bins for
        return d.favorites.length;
    });

    var histoData = histoChart(tweetsData); //formats data (provides data for layout)

    d3.select("svg").selectAll("rect")
        .data(histoData)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return xScale(d.x);
        })
        .attr("y", function(d) {
            return yScale(d.y);
        })
        .attr("width", function() {
            return xScale(histoData[0].dx) - 5; //5 = gap between
        })
        .attr("height", function(d) {
            return 400 - yScale(d.y);
        })
        .on("click", retweets);

    function retweets() {
        histoChart.value(function (d) {
            return d.retweets.length; //changes value beeing measured
        });
        histoData = histoChart(tweetsData);

        d3.selectAll("rect").data(histoData)
            .transition()
            .duration(500)
            .attr("x", function (d) {
                return xScale(d.x)
            }).attr("y", function (d) {
                return yScale(d.y)
            }).attr("height", function (d) {
                return 400 - yScale(d.y);
            });
    }
}