queue()
    .defer(d3.json, "../data/world.topojson")
    .defer(d3.csv, "../data/cities.csv")
    .await(function(error, file1, file2) { createMap(file1, file2); });
function createMap(topoCountries, cities) {

    //loading
    var countries = topojson.feature(topoCountries, topoCountries.objects.countries);
    //console.log(countries);


    var width = 500;
    var height = 500;

    var projection = d3.geo.mollweide()
        .scale(120)
        .translate([width/2, height/2])
        .center([20,0])

    var geoPath = d3.geo.path().projection(projection);
    var featureSize = d3.extent(countries.features, function(d) {return geoPath.area(d)});

    var countryColor = d3.scale.quantize()
        .domain(featureSize).range(colorbrewer.Reds[7]);

    var graticule = d3.geo.graticule();

    d3.select("svg").append("path")
        .datum(graticule)
        .attr("class", "graticule line")
        .attr("d", geoPath)
        .style("fill", "none")
        .style("stroke", "lightgray")
        .style("stroke-width", "1px");

    d3.select("svg").append("path")
        .datum(graticule.outline)
        .attr("class", "graticule outline")
        .attr("d", geoPath)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1px");

    d3.select("svg").selectAll("path.countries")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("class", "countries")
        .style("fill", function(d) {return countryColor(geoPath.area(d))})
        .style("stroke-width", 1)
        .style("stroke", "black")
        .style("opacity", .5);

    d3.select("svg").selectAll("circle").data(cities)
        .enter()
        .append("circle")
        .style("fill", "black")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .attr("r", 3)
        .attr("cx", function(d) {return projection([d.x,d.y])[0];})
        .attr("cy", function(d) {return projection([d.x,d.y])[1];});

    //Neighbors
    var neighbors = topojson.neighbors(topoCountries.objects.countries.geometries); //builds an array of all the features that share a border

    d3.selectAll("path.countries")
        .on("mouseover", findNeighbors)
        .on("mouseout", clearNeighbors);

    function findNeighbors (d,i) {
        d3.select(this).style("fill", "red");
        d3.selectAll("path.countries")
            .filter(function (p,q) {return neighbors[i].indexOf(q) > -1})
            .style("fill", "green")
    }

    function clearNeighbors () {
        d3.selectAll("path.countries").style("fill", "gray");
    }

};