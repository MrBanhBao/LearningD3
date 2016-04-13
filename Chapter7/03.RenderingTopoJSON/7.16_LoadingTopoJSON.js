queue()
    .defer(d3.json, "../data/world.topojson")
    .defer(d3.csv, "../data/cities.csv")
    .await(function(error, file1, file2) { createMap(file1, file2); });
function createMap(file1, file2) {

    //loading
    var worldFeatures = topojson.feature(file1, file1.objects.countries);
    console.log(worldFeatures);




};