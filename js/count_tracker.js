// function added to get just the current days observations
  //var mapExt = getMapLlExtents();
  var baseUrl = 'https://api.inaturalist.org/v1/observations?';
  //var begDate = `?d1=${getStamp(30)}`; if (init & vtOnly) {begDate = `?d1=${getDate(getDays)}`;}
  //var begDate = `?created_d1=${getStamp(3600)}` //midnight of current day
  var begDate = '&d1=2022-01-01'; //midnight of current day
  //var endDate = '&d2=2022-01-20';
  var project = '&project_id=vermont-atlas-of-life';
  var research = '&quality_grade=research';
  var needs_id = '&quality_grade=needs_id';
  var casual = '&quality_grade=casual';

// API strings
var qTotalObs = baseUrl + project;
var qObs2022 = baseUrl + project + begDate;
var qId2022 = baseUrl + project + '&updated_since=2022-01-01';
var qNeedsID = baseUrl + project + needs_id
var qResearch = baseUrl + project + research;
var qCasual = baseUrl + project + casual;

var exportData = {
      "totalObs": 0,
      "Obs2022": 0,
      "Id2022": 0,
      "NeedsID": 0,
      "Research": 0,
      "Casual": 0 };

console.log(`exportData names: ${Object.getOwnPropertyNames(exportData)}`);

function call_api({qTotalObs=null,
                  qObs2022=null,
                  qId2022=null,
                  qNeedsID=null,
                  qResearch=null,
                  qCasual=null,
                  htmlID=null,
                  lineColor="steelblue",
                  lineWidth=1.5,
                  width = 450,
                  height = 450,
                  margin = 70,
                  spaceSides = 460,
                  spaceTopBot = 460}){


//var TotalObs = [];
//var Obs2022 = [];
// Id2022 = [];
//var NeedsID = [];
//var Research = [];
//var Casual = [];

// apicall
const fetchPromise = fetch(qTotalObs)
    .then( res => res.json())
    .then(response => {
        var data = (response.total_results);
        exportData.totalObs = data;
    });
//resolve the promise then print
Promise.resolve(fetchPromise) // Waits for fetchPromise to get its value
    .then(() => console.log(`Total Obs: ${exportData.totalObs}`))

// apicall
    const qObsPromise = fetch(qObs2022)
        .then( res => res.json())
        .then(response => {
            var data = (response.total_results);
            exportData.Obs2022 = data;
        });
    //resolve the promise then print
    Promise.resolve(qObsPromise) // Waits for fetchPromise to get its value
        .then(() => console.log(`Obs 2022: ${exportData.Obs2022}`))

// apicall
const qIdPromise = fetch(qId2022)
            .then( res => res.json())
            .then(response => {
                var data = (response.total_results);
                exportData.Id2022 = data;
                });
            //resolve the promise then print
            Promise.resolve(qIdPromise) // Waits for fetchPromise to get its value
                .then(() => console.log(`Id 2022: ${exportData.Id2022}`))

// apicall
const needsIdPromise = fetch(qNeedsID)
    .then( res => res.json())
    .then(response => {
          var data = (response.total_results);
              exportData.NeedsID = data;
                    });
                //resolve the promise then print
                Promise.resolve(needsIdPromise) // Waits for fetchPromise to get its value
                    .then(() => console.log(`NeedsId: ${exportData.NeedsID}`))

  // apicall
  const researchPromise = fetch(qResearch)
          .then( res => res.json())
          .then(response => {
        var data = (response.total_results);
                exportData.Research = data;
                        });
      //resolve the promise then print
      Promise.resolve(researchPromise) // Waits for fetchPromise to get its value
          .then(() => console.log(`Research: ${exportData.Research}`))

// apicall
const casualPromise = fetch(qResearch)
          .then( res => res.json())
          .then(response => {
          var data = (response.total_results);
                        exportData.Casual = data;
                                });
              //resolve the promise then print
              Promise.resolve(casualPromise) // Waits for fetchPromise to get its value
                  .then(() => console.log(`Casual: ${exportData.Casual}`))

/* derive the number of observations in the data */
var totalObs = exportData.totalObs;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#" + htmlID)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                  // set the color scale
                  var color = d3.scaleOrdinal()
                                //.domain(["a", "b", "c", "d", "e", "f", "g", "h"])
                                .domain(Object.keys(exportData))
                                .range(d3.schemeDark2);

                                    console.log(`colors: ${color}`);
                                    // Compute the position of each group on the pie:
                                    var pie = d3.pie()
                                      .sort(null) // Do not sort group by size
                                      .value(function(d) {return d.value; })
                                    var data_ready = pie(d3.entries(exportData))

                                    // The arc generator
                                    var arc = d3.arc()
                                      .innerRadius(radius * 0.7)         // This is the size of the donut hole
                                      .outerRadius(radius * 0.8)

                                    // Another arc that won't be drawn. Just for labels positioning
                                    var outerArc = d3.arc()
                                      .innerRadius(radius * 0.9)
                                      .outerRadius(radius * 0.9)

                                    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
                                    svg
                                      .selectAll('allSlices')
                                      .data(data_ready)
                                      .enter()
                                      .append('path')
                                      .attr('d', arc)
                                      .attr('fill', function(d){ return(color(d.data.key)) })
                                      .attr("stroke", "white")
                                      .style("stroke-width", "2px")
                                      .style("opacity", 0.7)

                                    /* add text to center of the donut plot */
                                        svg.append("text")
                                           .attr("text-anchor", "middle")
                                           .attr('font-size', '4em')
                                           .attr('y', 20)
                                           .text(totalObs.toLocaleString());

                                    /* add text to center of the donut plot */
                                        svg.append("text")
                                            .attr("text-anchor", "middle")
                                            .attr('font-size', '2em')
                                            .attr('y', -40)
                                            .text(`Observations:`);

                                    // Add one dot in the legend for each name.
                                    svg.selectAll("mydots")
                                      .data(data_ready)
                                      .enter()
                                      .append("circle")
                                        .attr("cx", -10)
                                        .attr("cy", function(d,i){ return 130 + i*12}) // 100 is where the first dot appears. 25 is the distance between dots
                                        .attr("r", 5)
                                        .style("fill", function(d){ return color(d.data.key)})

                                    // Add one dot in the legend for each name.
                                    svg.selectAll("mylabels")
                                      .data(data_ready)
                                      .enter()
                                      .append("text")
                                        .attr("x", -8)
                                        .attr("y", function(d,i){ return 130 + i*12}) // 100 is where the first dot appears. 25 is the distance between dots
                                        .style("fill", function(d){ return color(d.data.key)})
                                        .text(function(d){ return d.data.key})
                                        .attr("text-anchor", "left")
                                        .style("alignment-baseline", "middle")

                                    }

var exported_data = setInterval(
         call_api({qTotalObs: qTotalObs,
                  qObs2022: qObs2022,
                  qId2022: qId2022,
                  qNeedsID: qNeedsID,
                  qResearch: qResearch,
                  qCasual: qCasual,
                  htmlID: "obsDoughnut"}),5000);

console.log(`interval: ${exported_data}`);
