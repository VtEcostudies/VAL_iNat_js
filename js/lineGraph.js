/* This script creates a line graph with mouse over
 * to see the number of observations
 */

/* The data we need for this is pulled from the api
 * it requires the structure below - here these
 * are the observations per week
 */


var weeklyData = {
      "1": 1878,
      "2": 1668,
      "3": 1694,
      "4": 1728,
      "5": 1620,
      "6": 1469,
      "7": 2072,
      "8": 2139,
      "9": 2188,
      "10": 2430,
      "11": 2354,
      "12": 3521,
      "13": 3770,
      "14": 6410,
      "15": 7024,
      "16": 9207,
      "17": 11912,
      "18": 14686,
      "19": 15982,
      "20": 17714,
      "21": 19037,
      "22": 17753,
      "23": 16717,
      "24": 16958,
      "25": 17508,
      "26": 16038,
      "27": 19793,
      "28": 17018,
      "29": 23361,
      "30": 20786,
      "31": 17877,
      "32": 16448,
      "33": 15720,
      "34": 15045,
      "35": 13924,
      "36": 13525,
      "37": 14620,
      "38": 13789,
      "39": 11227,
      "40": 9101,
      "41": 8621,
      "42": 6226,
      "43": 4525,
      "44": 3806,
      "45": 3555,
      "46": 2533,
      "47": 1951,
      "48": 1974,
      "49": 1966,
      "50": 1923,
      "51": 1629,
      "52": 1857,
      "53": 580
    }


let timeScale = d3.scaleTime()
                 .domain([new Date('2013-01-01').toLocaleString(),
                          new Date('2013-12-01').toLocaleString()])
                 .range([0,12]);

console.log(timeScale(3));

// Empty data array
    var histoData = '';
    // apicall
    const fetchPromise = await fetch("https://api.inaturalist.org/v1/observations/histogram?place_id=47&d1=2013-01-01&d2=2021-12-31&date_field=observed&interval=month")
        .then( res => res.json())
        .then(response => {
            var data = (response.results);
            histoData = data.month;
        });
    //resolve the promise then print
    Promise.resolve(fetchPromise) // Waits for fetchPromise to get its value
        .then(() => console.log(histoData))
        .then(() => console.log(`names: ${Object.keys(histoData)}`))
        .then(createLineGraph({dataJson : histoData,
                               htmlID : "weeklyLineGraph",
                               lineColor : "forestgreen"}))


  //Read the data
  /* dataJson = data returned from iNat API;
   * interval = interval used in iNat API call -
                month_of_year (default)
                year,
                month,
                week,
                day,
                hour,
                week_of_year;
    *htmlID  = div id reference
    *margin = named parameter with margin size
    *spaceSides = buffer on either side of plots
    *spaceTopBot = buffer on top and bottomright
    */

    /* NEEDS: switch to change between intervals */
    /* options for graphics / styling changes */
function createLineGraph({dataJson,
                         interval="month_of_year",
                         htmlID=null,
                         xLabel = "Week of Year",
                         yLabel = "Observations",
                         lineColor="steelblue",
                         lineWidth=1.5,
                         margin={top: 10,
                                 right: 30,
                                 bottom: 60,
                                 left: 60},
                         spaceSides = 460,
                         spaceTopBot = 460}) {

  if(htmlID===null){console.log(`createLineGraph needs htmlID`)}
//  NEED A SWITCH ABILITY HERE IN JAVASCRIPT TO DO DIFFERENT THINGS BASED ON
//  interval value
var nX = Object.keys(dataJson).length;
var nNames = Object.keys(dataJson);

  var cData = []
  //for(let i = 1; i <= nX; i++){
  for (var key of nNames) {
    cData.push({x: key,
                count: dataJson[key]})
  }
  var wTots = cData.slice(0,nX-1)
  var newData = wTots.reduce((obj, item) => Object.assign(obj, { [item.x]: item.count }), {});

  let yVals = Object.values(newData);
  let xVals = Object.keys(newData);
  console.log(`extent: ${d3.extent(xVals)}`)
  console.log(`xVals[0]: ${xVals[0]}`)
  console.log(`newData values: ${Object.keys(newData)}`)
  //console.log(Math.max.apply(null,yVals))
  //console.log(`wTots length: ${wTots.length}`)
  console.log(`wTots: ${Object.entries(wTots)}`)
  //console.log(`newData: ${Object.keys(newData)}`)

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
      .domain([1,wTots.length])
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
         .attr("x", x(wTots.x))
         .attr("y", height + 30)
         .text(xLabel);

      svg.append("text")
         .attr("class", "y label")
         .attr("text-anchor", "middle")
         .attr("y", y(Math.floor(Math.max.apply(null,yVals)/2)))
         .attr("dy", "-20em")
         .attr("transform", "rotate(-90)")
         .text(yLabel);
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
          .attr("y2", y(2000))
          .attr("stroke",'gray')
          .style("opacity",0)

    // Add the line
  svg.append("path")
    .datum(newData)
    .attr("fill", "none")
    .attr("stroke", lineColor)
    .attr("stroke-width", lineWidth)
    .attr("d", d3.line()
      .x(function(d) { return x(Object.keys(d)) })
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
      var i = bisect(wTots, x0, 1);
      var selectedData = wTots[i]
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
  };

  //createLineGraph({dataJson : histoData.month,
  //                 htmlID : "weeklyLineGraph",
  //                 lineColor: "forestgreen",
  //                 margin : {top: 10, left: 60, right: 65, bottom: 50}});
