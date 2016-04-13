var width = 500,
    height = 500;

d3.select("svg").append("g").attr("id", "tiles"); //group to keep tiles behind any other draaen features
d3.select("svg").append("g").attr("id", "vectors");

queue()
    .defer(d3.json, "../data/world.topojson")
    .defer(d3.csv, "../data/cities.csv")
    .await(function(error, file1, file2) { createMap(file1, file2); });

function createMap(countries1, cities) {
    var countries = topojson.feature(countries1, countries1.objects.countries);

    var tile = d3.geo.tile() //tile function to create tiles
        .size([width, height]);

    var projection = d3.geo.mercator()
        .scale(120)
        .translate([width / 2, height / 2]);

    var center = projection([12, 42]);

    var geoPath = d3.geo.path().projection(projection);

    var zoom = d3.behavior.zoom()
        .scale(projection.scale() * 2 * Math.PI)
        .translate([width - center[0], height - center[1]])
        .on("zoom", redraw);

    d3.select("svg").call(zoom);
    redraw();

    var featureSize = d3.extent(countries.features, function(d) {return geoPath.area(d)});
    var countryColor = d3.scale.quantize().domain(featureSize).range(colorbrewer.Reds[7]);

    d3.select("#vectors").selectAll("path.countries").data(countries.features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("class", "countries")
        .style("fill", function(d) {return countryColor(geoPath.area(d))})
        .style("stroke-width", 1)
        .style("stroke", "black")
        .style("opacity", .5)
        .style("display", function(d,i) {return i%2 == 0 ? "none" : "block"})

    d3.select("#vectors").selectAll("circle").data(cities)
        .enter()
        .append("circle")
        .style("fill", "black")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .attr("r", 3)
        .attr("cx", function(d) {return projection([d.y,d.x])[0]})
        .attr("cy", function(d) {return projection([d.y,d.x])[1]})

    redraw();

    function redraw() {
        var tiles = tile //dataset to create images
            .scale(zoom.scale())
            .translate(zoom.translate())
        ();

        var image = d3.select("#tiles").attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")") //generates proper transform settings based
            .selectAll("image")
            .data(tiles, function(d) { return d; });

        image.exit()
            .remove();

        image.enter().append("image")
            .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/examples.map-zgrqqx0w/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            .attr("width", 1)
            .attr("height", 1)
            .attr("x", function(d) { return d[0]; })
            .attr("y", function(d) { return d[1]; });

        projection
            .scale(zoom.scale() / 2 / Math.PI)
            .translate(zoom.translate());

        d3.selectAll("path.countries")
            .attr("d", geoPath);

        d3.selectAll("circle")
            .attr("cx", function(d) {return projection([d.y,d.x])[0]})
            .attr("cy", function(d) {return projection([d.y,d.x])[1]})

    }
}