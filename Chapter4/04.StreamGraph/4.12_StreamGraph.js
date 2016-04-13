 d3.csv("data/movies.csv", areaChart);
    function areaChart(data) {
        xScale = d3.scale.linear().domain([0,11]).range([0,500]);
        yScale = d3.scale.linear().domain([-100,100]).range([500,0]);

        yAxis = d3.svg.axis().scale(yScale).orient("right").ticks(8).tickSize(500).tickSubdivide(true);
        d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

        xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(500).ticks(4);
        d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);

        fillScale = d3.scale.linear().domain([1,10]).range(["lightgray","black"]);
        n = 0;

        for (x in data[0]) {
            if (x != "day") {

                movieArea = d3.svg.area()
                    .x(function(d) {
                        return xScale(d.day)
                    })
                    .y(function(d) {
                    return yScale(d[x]);
                    //return yScale(simpleStacking(d, x))
                        //return yScale(alternatingStacking(d,x,"top"))
                    })
                    .y0(function(d) {
                    /*return yScale(-d[x]); This new accessor provides us with the
                     ability to define where the bottom of the
                     path is. In this case, we start by making
                     the bottom equal to the inverse of the
                     top, which mirrors the shape.*/
                    //Mirroring Y-Path
                        return yScale(-d[x]);
                    //return yScale(simpleStacking(d, x) - d[x]);
                        //return yScale(alternatingStacking(d,x,"bottom"));
                    })
                    .interpolate("basis")

                d3.select("svg")
                    .insert("path",".movie")
                    .attr("class", "movie")
                    .style("id", x + "Area")
                    .attr("d", movieArea(data))
                    .attr("fill", fillScale(n))
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
                    .style("opacity", 1)

            }
            n++;

        }

        function simpleStacking(incomingData, incomingAttribute) {
            var newHeight = 0;
            for (x in incomingData) {
                if (x != "day") {
                    newHeight += parseInt(incomingData[x]);
                    if (x == incomingAttribute) {
                        break;
                    }
                }
            }
            return newHeight;
        }

        function alternatingStacking(incomingData, incomingAttribute,topBottom) {
            var newHeight = 0;
            var skip = true;
            for (var x in incomingData) {
                if (x != "day") {
                    if (x == "movie1" || skip == false) {
                        newHeight += parseInt(incomingData[x]);
                        if (x == incomingAttribute) {
                            break;
                        }
                        if (skip == false) {
                            skip = true;
                        }
                        else {
                            n%2 == 0 ? skip = false : skip = true;
                        }
                    }
                    else {
                        skip = false;
                    }
                }
            }
            if(topBottom == "bottom") {
                newHeight = -newHeight;
            }
            if (n > 1 && n%2 == 1 && topBottom == "bottom") {
                newHeight = 0;
            }
            if (n > 1 && n%2 == 0 && topBottom == "top") {
                newHeight = 0;
            }
            return newHeight;
        }
}