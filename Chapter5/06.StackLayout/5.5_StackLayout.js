d3.csv("../data/movies.csv", function(err, data) {
    dataViz(data);
});

function dataViz(incData) {
    var expData = incData;
    var stackData = [];

    var xScale = d3.scale.linear()
        .domain([0, 10])
        .range([0, 500]);

    var yScale = d3.scale.linear()
        .domain([0, 100])
        .range([500, 0]);

    var movieColors = d3.scale.category10(["movie1","movie2","movie3","movie4","movie5","movie6"]);

    for(var x in incData[0]) {
        if(x != "day") { //skip day attribute
            var newMovieObject = {name: x, values: []}; //for each movie we create obj with empty array named "value"

            for(var y in incData) {
                newMovieObject.values.push({
                    //fill "values" array with objects
                    x: parseInt(incData[y]["day"]), //which contains days as x
                    y: parseInt(incData[y][x]) //amount of money on that day as y
                })
            }
            stackData.push(newMovieObject);
        }
    }

    var stackLayout = d3.layout.stack().values(function(d) {return d.values}); //formats our data to data which can be viz as stack

    var stackArea = d3.svg.area() //generates area with stackLayout formatted data
        .x(function(d) { return xScale(d.x) })
        .y0(function(d) { return yScale(d.y0) }) //upper points
        .y1(function(d) { return yScale(d.y0 + d.y) }); //bottom points


    d3.select("svg").selectAll("path")
        .data(stackLayout(stackData))
        .enter()
        .append("path")
        .attr("d", function(d) { return stackArea(d.values) }) //returns are with formatted data
        .style("fill", function(d) { return movieColors(d.name) });
}