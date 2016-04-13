d3.csv("../data/movies.csv", function(err, data) {
    dataViz(data);
});

function dataViz(incData) {
    var expData = incData;
    var stackData = [];

    var xScale = d3.scale.linear()
        .domain([0, 10])
        .range([20, 440]);

    var yScale = d3.scale.linear()
        .domain([0, 70])
        .range([480, 0]);

    var heightScale = d3.scale.linear()
        .domain([0, 70])
        .range([0, 480]);

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

    var stackLayout = d3.layout.stack().values(function(d) {return d.values}) //formats our data to data which can be viz as stack
        //.offset("silhouette") //centers streams
        //.order("inside-out"); //sort by index of maximum value, then use balanced weighting

    var stackArea = d3.svg.area() //generates area with stackLayout formatted data
        .x(function(d) { return xScale(d.x) })
        .y0(function(d) { return yScale(d.y0) }) //upper points
        .y1(function(d) { return yScale(d.y0 + d.y) }) //bottom points
        .interpolate("basis");

    d3.select("svg").selectAll("path")
        .data(stackLayout(stackData))
        .enter()
        .append("g")
        .attr("class", "bar")
        .each(function(d) {
            d3.select(this).selectAll("rect")
                .data(d.values)
                .enter()
                .append("rect")
                .attr("x", function(p) { return xScale(p.x) - 15; })
                .attr("y", function(p) { return yScale(p.y + p.y0); })
                .attr("height", function(p) { return heightScale(p.y); })
                .attr("width", 30)
                .style("fill", movieColors(d.name));
        })
}