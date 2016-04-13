queue()
    .defer(d3.json, "../data/world.geojson")
    .defer(d3.csv, "../data/cities.csv")
    .await(function(err, file1, file2) {
        createMap(file1, file2)
    });

function createMap(countries, cities) {
    var width = 500;
    var height = 500;

    var projection = d3.geo.mollweide() //mollweide projection shows the entire world
        .scale(110)
        .translate([width/2, height/2]); //moves the center of the projection to the center of canvas

    var geoPath = d3.geo.path().projection(projection); //formats given data into path data||d3.geo.path()[default value = albersUSA (only suitable for maps of USA)]

    var featureSize = d3.extent(countries.features, function(d) {return geoPath.area(d);});

    var countryColor = d3.scale.quantize().domain(featureSize).range(colorbrewer.Reds[7]); //Measures thefeatures and assigns the size classes toa color ramp

    d3.select("svg").selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", geoPath)//d3.geo.path() takes properk foratted geoJSON features and returns SVG drawing code
        .attr("class", "countries")
        .style("fill", function(d) {
            return countryColor(geoPath.area(d)); //colors each country based on its size
            //geo.path.area measures the graphical area and not the actual physical area of the features
        });

    //d3.geo.mercator().scale(); //default 150
    //d3.geo.albersUsa().scale(); // default 1070

    d3.select("svg").selectAll("circle")
        .data(cities)
        .enter()
        .append("circle")
        .attr("class", "cities")
        .attr("r", 3)
        .attr("cx", function(d) {return projection([d.x,d.y])[0]})//takes array as parameter, to target cx values we take 0th element in array
        .attr("cy", function(d) {return projection([d.x,d.y])[1]})
        .style("fill", "red");

    //Interactivity
    d3.selectAll("path.countries")
        .on("mouseover", centerBounds)
        .on("mouseout", clearCenterBounds);

    function centerBounds(d,i) {
        var thisBounds = geoPath.bounds(d); //Computes the projected bounding box
        var thisCenter = geoPath.centroid(d); //center of projection

        d3.select("svg")
            .append("rect")
            .attr("class", "bbox")
            .attr("x", thisBounds[0][0]) //boundingbox represented as two-dimensional array: [[left, top], [right, bottom]] ,
            .attr("y", thisBounds[0][1])
            .attr("width", thisBounds[1][0] - thisBounds[0][0])
            .attr("height", thisBounds[1][1] - thisBounds[0][1])
            .style("fill", "none")
            .style("stroke-dasharray", "5 5")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("pointer-events", "none");

        d3.select("svg")
            .append("circle")
            .attr("class", "centroid")
            .style("fill", "red")
            .attr("r", 5)
            .attr("cx", thisCenter[0])
            .attr("cy", thisCenter[1])
            .style("pointer-events", "none");
    }

    function clearCenterBounds() {
        d3.selectAll("circle.centroid").remove();
        d3.selectAll("rect.bbox").remove();
    }

    //Graticule (grid line on a map)
    var graticule = d3.geo.graticule(); //geo.graticule function creates a feature known as a multilinestring (array of arrays of coordinates)

    d3.select("svg").append("path")
        .datum(graticule) //binds just one single datapoint
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

    //Zoom behaviour

    /*
    *Triggers on mousewheel, dragging, double click
    * zoom.translate updates translate value
    * zoom.scale updates increasing and decreasing image
    * */

    var mapZoom = d3.behavior.zoom()
        .translate(projection.translate()) //overwrites the translate and scale of the zoom to match the projection (current position and scales value)
        .scale(projection.scale())
        .on("zoom", zoomed);

    d3.select("svg").call(mapZoom); //invokes function

    function zoomed() {
        projection.translate(mapZoom.translate()).scale(mapZoom.scale()); //Whenever the zoom behavoir is called, it overwrites the updated zoom vals


        //Rerender stuff properly
        d3.selectAll("path.graticule").attr("d", geoPath);
        d3.selectAll("path.countries").attr("d", geoPath);

        d3.selectAll("circle.cities")
            .attr("cx", function(d) {return projection([d.x,d.y])[0]})
            .attr("cy", function(d) {return projection([d.x,d.y])[1]});
    }


    function zoomButton(zoomDirection) {
        if(zoomDirection == "in") {
            var newZoom = mapZoom.scale() * 1.5; //calculate new scale with scale factor

            var newX = ((mapZoom.translate()[0] - (width / 2)) * 1.5) + width / 2; //recalculate center
            var newY = ((mapZoom.translate()[1] - (height / 2)) * 1.5) + height / 2;
        } else if(zoomDirection == "out") {
            var newZoom = mapZoom.scale() * .75;
            var newX = ((mapZoom.translate()[0] - (width / 2)) * .75) + width / 2;
            var newY = ((mapZoom.translate()[1] - (height / 2)) * .75) + height / 2;
        }

        mapZoom.scale(newZoom).translate([newX,newY]); // sets the calculated zoom values
        zoomed(); //redraws map based on the updated settings
    }

    //create buttons
    d3.select("#controls").append("button").on("click", function (){
        zoomButton("in")}).html("Zoom In");

    d3.select("#controls").append("button").on("click", function (){
        zoomButton("out")}).html("Zoom Out");



}