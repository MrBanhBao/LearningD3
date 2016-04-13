//Data for scatter plot
var scatterData = [{friends: 5, salary: 22000},
    {friends: 3, salary: 18000}, {friends: 10, salary: 88000},
    {friends: 0, salary: 180000}, {friends: 27, salary: 56000},
    {friends: 8, salary: 74000}];

var xExtent = d3.extent(scatterData, function(d) {
    return d.salary;
});

var yExtent = d3.extent(scatterData, function(d) {
    return d.friends;
});

var xScale = d3.scale.linear().domain(xExtent).range([0, 500]);
var yScale = d3.scale.linear().domain(yExtent).range([0, 500]);

d3.select("svg")
    .selectAll("circle")
        .data(scatterData)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
            return xScale(d.salary);
        })
        .attr("cy", function(d) {
            return yScale(d.friends);
        });

var yAxis = d3.svg.axis().scale(yScale)
    .orient("right").ticks(16).tickSize(500);
d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis); //call: equivalent to yAxis(d3.select("svg").append("g").attr("id", "yAxisG"));

/*
Orient(ation) of axis
 "top" - horizontal axis with ticks above the domain path
 "bottom" - horizontal axis with ticks below the domain path
 "left" - vertical axis with ticks to the left of the domain path
 "right" - vertical axis with ticks to the right of the domain path
 */

var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(500).ticks(4);
d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
/*d3.select("#xAxisG")
    .attr("transform", "translate(0, 500)"); //move xAxis to the bottom*/

/*
//axis style
d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "black");
d3.selectAll("line") //ticks of axis
    .style("stroke", "black");*/
