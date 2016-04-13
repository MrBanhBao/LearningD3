d3.csv("data/tweetdata.csv", lineChart);

function lineChart(data) {
    xScale = d3.scale.linear().domain([1, 10.5]).range([20, 480]);
    yScale = d3.scale.linear().domain([0, 35]).range([480, 20]);

    xAxis = d3.svg.axis().scale(xScale)
        .orient("bottom")
        .tickSize(480)
        .tickValues(data.day);

    d3.select("svg").append("g")
        .attr("id", "xAxisG")
        .call(xAxis);

    yAxis = d3.svg.axis().scale(yScale)
        .orient("right")
        .ticks(10)
        .tickSize(480);


    d3.select("svg").append("g")
        .attr("id", "yAxisG")
        .call(yAxis);


    d3.select("svg").selectAll("circle.tweets")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "tweets")
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d.day)})
        .attr("cy", function(d) { return yScale(d.tweets)})
        .style("fill", "darkred");

    d3.select("svg").selectAll("circle.retweets")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "retweets")
        .attr("r", 5)
        .attr("cx", function(d) {return xScale(d.day)})
        .attr("cy", function(d) {return yScale(d.retweets)})
        .style("fill", "gray");

    d3.select("svg").selectAll("circle.favorites")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "favorites")
        .attr("r", 5)
        .attr("cx", function(d) {return xScale(d.day)})
        .attr("cy", function(d) {return yScale(d.favorites)})
        .style("fill", "black");


    //accessor for x and y values
    var tweetLine = d3.svg.line()
        .x(function(data) {
            return xScale(data.day); //function is set to x-accessor
        })
        .y(function(data) {
            return yScale(data.tweets); //function is set to y-accessor
        });
    tweetLine.interpolate("basis");


    d3.select("svg")
        .append("path")
        .attr("d", tweetLine(data)) //gives data to function of x and y accessor
        .attr("fill", "none")
        .attr("stroke", "darkred")
        .attr("stroke-width", 4);

    var retweetLine = d3.svg.line()
        .x(function(d) {
            return xScale(d.day);
        })
        .y(function(d) {
            return yScale(d.retweets);
        });
    retweetLine.interpolate("step");


    d3.select("svg")
        .append("path")
        .attr("d", retweetLine(data))
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 4);

    var favLine = d3.svg.line()
        .x(function(d) {
            return xScale(d.day);
        })
        .y(function(d) {
            return yScale(d.favorites);
        });
    favLine.interpolate("cardinal");

    d3.select("svg")
        .append("path")
        .attr("d", favLine(data))
        .attr("stroke", "black")
        .attr("stroke-width", 4)
        .attr("fill", "none");
}