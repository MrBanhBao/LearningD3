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

    mergeAt(0); //merge function

    function mergeAt(mergePoint) {
        var filteredCountries = topoCountries.objects.countries.geometries
            .filter(function(d) {
                var thisCenter = d3.geo.centroid(
                    topojson.feature(topoCountries, d)
                );
                return thisCenter[1] > mergePoint? true : null; //all countries with center above 0 longitude
            });
        d3.select("svg").insert("g", "circle")
            .datum(topojson.merge(topoCountries, filteredCountries))//use datum because merge returns single multipolygon, merges features (mergeArcs merges instead of features but shapes)
            .insert("path")
            .style("fill", "gray")
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .attr("d", geoPath);
    };

};