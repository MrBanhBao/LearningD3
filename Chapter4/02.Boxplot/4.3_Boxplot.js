

d3.csv("data/boxplot.csv", scatterplot);

function scatterplot(data) {
    var xScale = d3.scale.linear().domain([1, 8]).range([20, 470]);

    //Scale is inverted, so higher values are drawn higher up and lower values toward the bottom
    var yScale = d3.scale.linear().domain([0, 100]).range([480, 20]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(8)
        .tickSize(-470);

    d3.select("svg").append("g")
        .attr("id", "yAxisG")
        .attr("transform", "translate(470,0)")
        .call(yAxis);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(-470)
        .tickValues([1,2,3,4,5,6,7]);

    d3.select("svg").append("g")
        .attr("id", "xAxisG")
        .attr("transform", "translate(0, 480)")
        .call(xAxis);
/*
    //median
    d3.select("svg").selectAll("circle.median")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "tweets")
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d.day)})
        .attr("cy", function(d) { return yScale(d.median)})
        .style("fill", "darkgray");*/

    d3.select("svg").selectAll("g.box")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "box")
        .attr("transform", function(d) {return "translate(" + xScale(d.day) +"," + yScale(d.median) + ")"}) //origin point is set here!!!
        .each(function(d,i) {
            //min and max
            d3.select(this)
                .append("line")
                .attr("class", "range")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", yScale(d.max) - yScale(d.median)) //median is origin point
                .attr("y2", yScale(d.min) - yScale(d.median))
                .style("stroke", "black")
                .style("stroke-width", "4px");

            d3.select(this)
                .append("line")
                .attr("class", "max")
                .attr("x1", -10)
                .attr("x2", 10)
                .attr("y1", yScale(d.max) - yScale(d.median))
                .attr("y2", yScale(d.max) - yScale(d.median))
                .style("stroke", "black")
                .style("stroke-width", "4px");

            d3.select(this)
                .append("line")
                .attr("class", "min")
                .attr("x1", -10)
                .attr("x2", 10)
                .attr("y1", yScale(d.min) - yScale(d.median))
                .attr("y2", yScale(d.min) - yScale(d.median))
                .style("stroke", "black")
                .style("stroke-width", "4px");

            //box
            d3.select(this)//becaus we use each method, wie can use this
                .append("rect")
                .attr("class", "range")
                .attr("width", 20)
                .attr("x", -10) //moves half of rects width to the left siede
                .attr("y", yScale(d.q3) - yScale(d.median))
                .attr("height", yScale(d.q1) - yScale(d.q3))
                .style("fill", "white")
                .style("stroke", "black");

            d3.select(this)
                .append("line")
                .attr("x1", -10)
                .attr("x2", 10)
                .attr("y1", 0)
                .attr("y2", 0)
                .style("stroke", "darkgray")
                .style("stroke-width", "4px");
        });
}