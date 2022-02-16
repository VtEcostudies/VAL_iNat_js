var baseUrl = 'https://api.inaturalist.org/v1/observations/histogram?';
var project = '&project_id=vermont-atlas-of-life';
var yr1first = '&d1=2022-01-01';
var yr0first = '&d1=2021-01-01';
var yr1 = '&year=2022';
var yr0 = '&year=2021';
var yr0last = '&d2=2021-12-31';
var tail = '&date_field=observed&interval=day'

// API strings
var currentAPI = baseUrl+project+yr1+yr1first+tail
var pastAPI = baseUrl+project+yr0+yr0first+yr0last+tail

var thisYear = [];
var thisDay = [];
var pastYear = [];
var pastDay = [];
var cumObsThisYear = [];
var cumObsPastYear = [];
var thisOrdDay = [];
var pastOrdDay = [];
var thisYearData = [];
var pastYearData = [];

Date.prototype.getDOY = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((this - onejan) / 86400000);
};
//********************************************************************//
//
//                    FUNCTIONS
//
//
//*******************************************************************//
Promise.all([fetch(currentAPI),
           fetch(pastAPI)])
      .then(function (responses) {
       // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
                                       return response.json();}
                                     )
                        );
                      })
      .then(function (data) {
      var data1 = data.map(function (d) {
          return d.results
                                     })
        return(data1) })
      .then(function (data) {
        var day = data.map(function (d) {
          return d.day
        })
        thisYear = Object.values(day[0])

     // get the cumulative number of observations
        thisYear.reduce(function(a,b,i) {
           return cumObsThisYear[i] = a+b; },0);

        thisDay = Object.keys(day[0])
      //  console.log(`thisdaya here: ${Object.keys(day[0])[0]}`)

        thisOrdDay = thisDay.map(function(d){
          var now = new Date(d);
          var add5 = new Date(now.getTime() + (5*60*60*1000))
        //  console.log(`pastYear now: ${now}`)
        //  console.log(`pastYear add5: ${add5}`)
          var day = add5.getDOY();
        //  console.log(`pastYearday: ${day}`)
          return(day)
        })
    // previous year
        pastYear = Object.values(day[1])
    // get the cumulative number of observations
        pastYear.reduce(function(a,b,i) {
              return cumObsPastYear[i] = a+b; },0);
        pastDay = Object.keys(day[1])
        pastOrdDay = pastDay.map(function(d){
          var now = new Date(d);
          var add5 = new Date(now.getTime() + (5*60*60*1000))
        //  console.log(`pastYear now: ${now}`)
        //  console.log(`pastYear add5: ${add5}`)
          var day = add5.getDOY();
        //  console.log(`pastYearday: ${day}`)
          return(day)
        })
   //console.log(`data2: ${Object.values(day[0])}`);
   //console.log(`this year: ${thisYear}`);
   //console.log(`this day: ${thisOrdDay}`)
   //console.log(`cumObs: ${cumObsThisYear}`)
   //console.log(`past year: ${pastYear}`);
   //console.log(`past day: ${pastDay}`)
   //console.log(`past ord: ${pastOrdDay}`)
              })
        .then(function(){
        //  interval value
        var htmlID = "weeklyLineGraph";
        var nX = Object.values(thisOrdDay);
        var nNames = Object.values(thisOrdDay);

          //let yVals = Object.values(cumObsThisYear);
          let yVals = Object.values(cumObsThisYear)
                             .concat(Object.values(cumObsPastYear)
                                           .slice(0,Math.max.apply(null,Object.values(thisOrdDay))))
          let xVals = Object.values(thisOrdDay);
          console.log(`extent: ${d3.extent(xVals)}`)
          //console.log(Math.max.apply(null,yVals))
          //console.log(`wTots length: ${wTots.length}`)
          //console.log(`newData: ${Object.keys(newData)}`)
          var lineColor="steelblue"
          var lineWidth=1.5;
          var margin={top: 10,
                  right: 30,
                  bottom: 60,
                  left: 60};
          var spaceSides = 460;
          var spaceTopBot = 460;
          // set the dimensions and margins of the graph
          //var margin = {top: 10, right: 30, bottom: 30, left: 60},
          //    width = 460 - margin.left - margin.right,
          //    height = 400 - margin.top - margin.bottom;
           var width = spaceSides - margin.left - margin.right;
           var height = spaceTopBot - margin.top - margin.bottom;

          // append the svg object to the body of the page
          var svg = d3.select("#" + htmlID)
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // Add X axis --> it is a date format
            var x = d3.scaleLinear()
              .domain([0,thisOrdDay.length])
              //.domain(d3.extent(xVals))
              .range([ 0, width ]);
            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
              .domain([0, Math.max.apply(null,yVals)])
              .range([ height, 0 ]);
            svg.append("g")
              .call(d3.axisLeft(y));

            // add x axis label
              svg.append("text")
                 .attr("class", "x label")
                 .attr("text-anchor", "middle")
                 .attr("x", x(Math.floor(Math.max.apply(null,xVals)/2)))
                 .attr("y", height + 30)
                 .text("Ordinal Day");

              svg.append("text")
                 .attr("class", "y label")
                 .attr("text-anchor", "middle")
                 .attr("y", y(Math.floor(Math.max.apply(null,yVals)/2)))
                 .attr("dy", "-20em")
                 .attr("transform", "rotate(-90)")
                 .text("Cumulative observations");
            // This allows to find the closest X index of the mouse:
            var bisect = d3.bisector(function(d) { return d.x; }).left;

            // Create the circle that travels along the curve of chart
            var focus = svg
              .append('g')
              .append('circle')
                .style("fill", "none")
                .attr("stroke", "black")
                .attr('r', 8.5)
                .style("opacity", 0)

            // Create the text that travels along the curve of chart
            var focusText = svg
              .append('g')
              .append('text')
                .style("opacity", 0)
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "middle")

            // Create the text that travels along the curve of chart
            var focusX = svg
                  .append('g')
                  .append('text')
                    .style("opacity", 0)
                    .attr("text-anchor", "left")
                    .attr("alignment-baseline", "middle")

            var focusDrop = svg
                  .append('line')
                  .attr("x1", x(0))
                  .attr("x2", x(0))
                  .attr("y1", y(0))
                  .attr("y2", y(0))
                  .attr("stroke",'gray')
                  .style("opacity",0)

    for (var key of xVals) {
          thisYearData.push({x: thisOrdDay[key],
                         count: cumObsThisYear[key]})
          pastYearData.push({x: pastOrdDay[key],
                         count: cumObsPastYear[key]})
                  }
    var thisData = thisYearData.reduce((obj, item) => Object.assign(obj, { [item.x]: item.count }), {});

    //console.log(`thisdata: ${Object.values(thisData)}`)
    //console.log(`thisdataKeys: ${Object.keys(thisData)}`)

            // Add the line
          svg.append("path")
            .datum(thisYearData)
            .attr("fill", "none")
            .attr("stroke", lineColor)
            .attr("stroke-width", lineWidth)
            .attr("d", d3.line()
              .x(function(d) { return x(d.x) })
              .y(function(d) { return y(d.count) })
              )

              // Add the line
            svg.append("path")
              .datum(pastYearData)
              .attr("fill", "none")
              .attr("stroke", "gray")
              .attr("stroke-width", lineWidth)
              .attr("d", d3.line()
                .x(function(d) { return x(d.x) })
                .y(function(d) { return y(d.count) })
                )

            // Create a rect on top of the svg area: this rectangle recovers mouse position
            svg
              .append('rect')
              .style("fill", "none")
              .style("pointer-events", "all")
              .attr('width', width)
              .attr('height', height)
              .on('mouseover', mouseover)
              .on('mousemove', mousemove)
              .on('mouseout', mouseout);


            // What happens when the mouse move -> show the annotations at the right positions.
            function mouseover() {
              focus.style("opacity", 1)
              focusText.style("opacity",1)
              focusX.style("opacity",1)
              focusDrop.style("opacity",0.75)
            }

            function mousemove() {
              // recover coordinate we need
              var x0 = x.invert(d3.mouse(this)[0]);
              var i = bisect(thisYearData, x0, 1);
              var selectedData = thisYearData[i]
              focus
                .attr("cx", x(selectedData.x))
                .attr("cy", y(selectedData.count))
              focusText
                .html(selectedData.count.toLocaleString() + " Observations")
                .attr("x", x(selectedData.x)+15)
                .attr("y", y(selectedData.count))
              focusX
                .html(selectedData.x)
                .attr("x", x(selectedData.x-1))
                .attr("y", y(Math.floor(Math.max.apply(null,yVals) * 0.02)))
              focusDrop
                .attr("x1", x(selectedData.x))
                .attr("x2", x(selectedData.x))
                .attr("y1", y(0))
                .attr("y2", y(selectedData.count))

              }
            function mouseout() {
              focus.style("opacity", 0)
              focusText.style("opacity", 0)
              focusX.style("opacity", 0)
              focusDrop.style("opacity",0)
            }
          })
      //.then(function(){makeDoughNut({exportData: exportData,
      //                    export_OBS: export_OBS,
      //                    htmlID: "obsDoughnut"})}

      //)
.catch(function (error) {
// if there's an error, log it
console.log(error);
});
