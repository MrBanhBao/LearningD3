function createSoccerViz() {
    d3.csv("worldcup.csv", function(data) {
        overallTeamViz(data);
    });

    function overallTeamViz(incomingData) {
        d3.select("svg")
            .append("g") //Append g to svg to move it's content more easily
            .attr("id", "teamsG")
            .attr("transform", "translate(50, 300)")
            .selectAll("g")
            .data(incomingData)
            .enter()
            .append("g")
            .attr("class", "overallG")
            .attr("transform", function(d, i) {
                return "translate(" + (i * 50) + ", 0)"
            });

        var teamG = d3.selectAll("g.overallG");

       /*teamG
            .append("circle")
            .attr("r", 20)
            .style("fill", "pink")
            .style("stroke", "black")
            .style("stroke-width", "1px");*/

        //using delay to create a pulsating effect
        teamG
            .append("circle").attr("r", 0)
            .transition()
            .duration(500)
            .attr("r", 40)
            .delay(function(d,i) {return i * 100})
            .transition()
            .duration(500)
            .attr("r", 20);


        teamG
            .append("text")
            .style("text-anchor", "middle") //middle of g is origin point
            .attr("y", 30) //30px under origin point
            .text(function(d) {return d.team;});

        var dataKeys = d3.keys(incomingData[0]).filter(function(el) { //returns attribute names in an array
            return el != "team" && el != "region"; //filter condition
        });

        d3.select("#controls").selectAll("button.teams")
            .data(dataKeys)
            .enter()
            .append("button")
            .on("click", buttonClick)
            .html(function(d) {return d;});

        function buttonClick(datapoint) {
            var maxValue = d3.max(incomingData, function (d) {
                return parseFloat(d[datapoint]);
            });
            var radiusScale = d3.scale.linear()
                .domain([ 0, maxValue ]).range([ 2, 20 ]);


            //!!!-COLORS--!!

            //var ybRamp = d3.scale.linear().domain([0, maxValue]).range(["yellow", "blue"]); //default interpolation

            /*var ybRamp = d3.scale.linear()
                .interpolate(d3.interpolateHsl) //setting interpolation method HSL
                .domain([0, maxValue]).range(["yellow", "blue"]);*/

            /*var ybRamp = d3.scale.linear()
                .interpolate(d3.interpolateHcl) //setting interpolation method HCL
                .domain([0,maxValue]).range(["yellow", "blue"]);*/

            /*var ybRamp = d3.scale.linear()
                .interpolate(d3.interpolateLab) //setting interpolation method LAB
                .domain([0,maxValue]).range(["yellow", "blue"]);*/

            var tenColorScale = d3.scale.category10(["UEFA", "CONMEBOL", "CAF", "AFC"]); //discrete color scales available in D3

            var colorQuantize = d3.scale.quantize().domain([0, maxValue]).range(colorbrewer.Reds[3]); //numerical data is presented in 3 colors


            d3.selectAll("g.overallG").select("circle").transition().duration(1000)//animation stuff (option: delay)
                .attr("r", function(d) {
                    return radiusScale(d[datapoint]);
                })
                .style("fill", function(p) {
                    //return ybRamp(d[datapoint])
                    //return tenColorScale(p.region)
                    return colorQuantize(p[datapoint])
                });
        }

        teamG.on("mouseover", highlightRegion2);

        function highlightRegion(d) { //data which is bound to element
            d3.selectAll("g.overallG").select("circle") //selectAll also works
                .style("fill", function(p) { //go trough all circles (p to avoid naming conflict)
                    return p.region == d.region ? "red" : "gray";
                });
        }

        function highlightRegion2(d,i) {
            var teamColor = d3.rgb("pink");
            d3.select(this).select("text").classed("active", true).attr("y", 10);
            /*d3.selectAll("g.overallG").select("circle").each(function(p,i) {
                p.region == d.region ?
                    d3.select(this).classed("active",true) :
                    d3.select(this).classed("inactive",true);
            });*/
            //note: loose of css-styling
            d3.selectAll("g.overallG").select("circle")
                .style("fill", function(p) {
                    return p.region == d.region ? teamColor.darker(.75) : teamColor.brighter(.5)}); //intensity

            this.parentElement.appendChild(this); //reappending this(element) to been drawn over other elements
        }

        teamG.on("mouseout", unHighlight);
        function unHighlight() {
            d3.selectAll("g.overallG").select("circle").attr("class", "");
            d3.selectAll("g.overallG").select("text")
                .classed("active", false).attr("y", 30);
        }

        teamG.select("text").style("pointer-events","none"); //prevent triggering mouse events on text

        //Adding Pregenerated content

        //IMAGES
        /*d3.selectAll("g.overallG").insert("image", "text") //inserts "image" element before "text" element
            .attr("xlink:href", function(d) {
                return "images/" + d.team + ".png";
            })
            .attr("width", "45px") //must be declared
            .attr("height", "20px") //must be decalared
            .attr("x", "-22")
            .attr("y", "-10");*/

        //MODAL-DIALOG
        d3.text("resources/modal.html", function(data) { //data = content of modal.html
            d3.select("body").append("div").attr("id", "modal").html(data)
        });

        teamG.on("click", teamClick);

        function teamClick(d) { //d = object which was binded to clicked element
            d3.selectAll("td.data").data(d3.values(d))//bind divs to data (divs as many as datapoins, to no enter needed)
                .html(function(p) { //
                    return p;
                });
        }

        d3.html("resources/icon_1907.svg", loadSVG); //callback function
        /*function loadSVG(svgData) { //svgData = content of icon_1907.svg
            while(!d3.select(svgData).selectAll("path").empty()) { //checks whether there is a path element or not
                d3.select("svg").node()
                    .appendChild(d3.select(svgData).selectAll("path").node());
            }
            d3.selectAll("path").attr("transform", "translate(50,50)");
        }*/
        d3.html("resources/icon_1907.svg", loadSVG);
        function loadSVG(svgData) {
            d3.selectAll("g.overallG").each(function() {
                var gParent = this;
                d3.select(svgData).selectAll("path").each(function() {
                    gParent.appendChild(this.cloneNode(true)); //this is the paths

                    d3.selectAll("path").style("fill", "darkred").style("stroke", "black").style("stroke-width", "1px");

                    d3.selectAll("g.overallG").each(function(d) { //selectAll do not rebind data just selt does
                        d3.select(this).selectAll("path").datum(d); //rebinding data with paths //dataum = sets the bound data for each selected element
                    });
                    var tenColorScale = d3.scale
                        .category10(["UEFA", "CONMEBOL", "CAF", "AFC"]);
                    d3.selectAll("path").style("fill", function(p) {
                        return tenColorScale(p.region)
                    }).style("stroke", "black").style("stroke-width", "2px");
                });
            });
        }


    }
}