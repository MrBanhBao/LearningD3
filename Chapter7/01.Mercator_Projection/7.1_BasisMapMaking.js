queue()
    .defer(d3.json, "../data/world.geojson")
    .defer(d3.csv, "../data/cities.csv")
    .await(function(err, file1, file2) {
        createMap(file1, file2)
    });

function createMap(countries, cities) {
    var width = 500;
    var height = 500;

    var aProjection = d3.geo.mercator() //projection function
        .scale(80) //optimal mapping = width/2/Math.PI //scale value (values work different to families of different projections)
        .translate([width/2, height/2]); //moves the center of the projection to the center of canvas


    var geoPath = d3.geo.path().projection(aProjection); //formats given data into path data||d3.geo.path()[default value = albersUSA (only suitable for maps of USA)]

    d3.select("svg").selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", geoPath)//d3.geo.path() takes properk foratted geoJSON features and returns SVG drawing code
        .attr("class", "countries")
        .style("fill", "green");

    //d3.geo.mercator().scale(); //default 150
    //d3.geo.albersUsa().scale(); // default 1070



    d3.select("svg").selectAll("circle")
        .data(cities)
        .enter()
        .append("circle")
        .attr("class", "cities")
        .attr("r", 3)
        .attr("cx", function(d) {return aProjection([d.x,d.y])[0]})//takes array as parameter, to target cx values we take 0th element in array
        .attr("cy", function(d) {return aProjection([d.x,d.y])[1]})
        .style("fill", "red")
}