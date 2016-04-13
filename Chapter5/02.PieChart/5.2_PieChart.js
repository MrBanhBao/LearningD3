var pieChart = d3.layout.pie(); //function that transforms your data into other datas to vis the pie chart

var yourPie = pieChart([1, 1 , 2]); //my dataset

console.log(yourPie); // shows transformed data

//Vis pie chart
var newArc = d3.svg.arc();
newArc.outerRadius(100); //set Radius
console.log(newArc(yourPie[0])); //returns d attribute to draw this arc as <path>

d3.select("svg")
    .append("g") //apends g
    .attr("transform","translate(250,250)") //translate g into the middle
    .selectAll("path") //empty selection
    .data(yourPie) //binds transformed data
    .enter()
    .append("path")
    .attr("d", newArc) //newArc returns necessary path for pie chart
    .style("fill", "blue")
    .style("opacity", .5)
    .style("stroke", "black")
    .style("stroke-width", "2px");


d3.json("../data/tweets.json", tweetData);
function tweetData(incData) {
    var nestedTweets = d3.nest()
        .key(function (el) {
            return el.user;
        })
        .entries(incData);
    nestedTweets.forEach(function (el) {
        //append new attr
        el.numTweets = el.values.length;
        el.numFavorites = d3.sum(el.values, function (d) {
            return d.favorites.length;
        });
        el.numRetweets = d3.sum(el.values, function (d) {
            return d.retweets.length;
        });
    });

    pieChart.value(function(d) {
        return d.numTweets;
    });
    newArc.innerRadius(20);
    yourPie = pieChart(nestedTweets);
}

pieChart.value(function(d) {
    return d.numTweets;
});
newArc.innerRadius(20);
yourPie = pieChart(nestedTweets);
