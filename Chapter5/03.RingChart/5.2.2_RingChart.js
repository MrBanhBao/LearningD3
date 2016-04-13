d3.json("../data/tweets.json",function(error,data) {dataViz(data.tweets)});

    function dataViz(incData) {
        var nestedTweets = d3.nest()
            .key(function (el) {
                return el.user;
            })
            .entries(incData);

        var colorScale = d3.scale.category10([0,1,2,3]);

        nestedTweets.forEach(function (el) {
            //add new attributes
            el.numTweets = el.values.length;
            el.numFavorites = d3.sum(el.values, function (d) {
                return d.favorites.length
            });
            el.numRetweets = d3.sum(el.values, function (d) {
                return d.retweets.length
            });
        });

        var pieChart = d3.layout.pie().sort(null); //?
        pieChart.value(function(d) {
            return d.numTweets
        });
        var newArc = d3.svg.arc();
        newArc.outerRadius(100).innerRadius(20);

        d3.select("svg")
            .append("g")
            .attr("transform","translate(250,250)") //move to middle
            .selectAll("path")
            .data(pieChart(nestedTweets), function(d) {
                return d.data.key; //key value of one datapoint (user)
            })
            .enter()
            .append("path")
            .attr("d", newArc)
            .style("fill", function(d, i) {return colorScale(i)})
            .style("opacity", .5)
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .each(function(d) { this._current = d; });


        pieChart.value(function(d) {
            return d.numFavorites
        });

        d3.selectAll("path")
            .data(pieChart(nestedTweets))
            //animation
            .transition()
            .delay(500)
            .duration(1000)
            .attr("d", newArc);

        pieChart.value(function(d) {
            return d.numRetweets
        });

        d3.selectAll("path")
            .data(pieChart(nestedTweets))
            .transition()
            .duration(1000)
            .attr("d", newArc);

        d3.selectAll("path").data(pieChart(nestedTweets.filter(function(d) {
                return d.numRetweets > 0;
            })),
            function (d) {
                return d.data.key;
            })
            .exit()
            .transition()
            .duration(500)
            .remove();

        d3.selectAll("path").data(pieChart(nestedTweets.filter(function(d) {
                return d.numRetweets > 0;
            })),
            function (d) {
                return d.data.key}
        )
            .transition()
            .duration(1000)
            .attrTween("d", arcTween);

        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return newArc(i(t));
            };
        }
    }