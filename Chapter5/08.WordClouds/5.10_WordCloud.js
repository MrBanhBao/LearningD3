d3.csv("../data/worddata.csv", function(data) {dataViz(data)});


function dataViz(data) {
    var keywords = ["layout", "zoom", "circle", "style", "append", "attr"];

    var wordScale = d3.scale.linear() //uses a scale rahter than raw values for font size
        .domain([0,100])
        .range([10,160])
        .clamp(true);

    var randomRotate = d3.scale.linear()
        .domain([0,1])
        .range([-20,20]);

    d3.layout.cloud().size([500, 500])
        .words(data) //assign data to the cloud layout
        //.rotate(function() {return randomRotate(Math.random());})
        .rotate(function(d) { return d.text.length > 5 ? 0 : 90; }) //if word length is smaller than  it got ratoted by 90deg
        .fontSize(function(d) { return wordScale(d.frequency); }) //set size base of it's frequency
        .on("end", draw) //assigned draw to "end" event
        .start(); //cloud layout needs to be initialized, when it's done it's fires end and runs function which is end is associated with

    function draw(words) { //assigned this draw method to "end"

        var wordG = d3.select("svg").append("g")
            .attr("id", "wordCloudG")
            .attr("transform","translate(250,250)"); //moves g to middlepoint

        /*wordG.selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("opacity", .75)
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; //transformation is calc by layout
            })
            .style("fill", function(d) {
                return (keywords.indexOf(d.text) > -1 ? "red" : "black"); //if word appears in keyword array than color it red
            })
            .text(function(d) { return d.text; });*/

        wordG.selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("opacity", .75)
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; //transformation is calc by layout
            })
            .style("fill", function(d) {
                return (keywords.indexOf(d.text) > -1 ? "red" : "black"); //if word appears in keyword array than color it red
            })
            .text(function(d) { return d.text; });
    }

}