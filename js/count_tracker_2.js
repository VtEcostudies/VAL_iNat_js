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

var export_OBS = {"totalObs": 0,
                  "Obs2022": 0,
                  "Id2022": 0};

var exportData = {"NeedsID": 0,
                  "Research": 0,
                  "Casual": 0 };

console.log(`exportData names: ${Object.getOwnPropertyNames(exportData)}`);



// Get data
async function getData({url=null}) {
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow' // manual, *follow, error
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

getData({url: qTotalObs})
  .then(data => {
    console.log(`getData: ${data.total_results}`); // JSON data parsed by `data.json()` call
  });



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

// apicall
const fetchPromise = fetch(qTotalObs)
    .then( res => res.json())
    .then(response => {
        var data = (response.total_results);
        export_OBS.totalObs = data;
    });
//resolve the promise then print
Promise.resolve(fetchPromise) // Waits for fetchPromise to get its value
    .then(() => console.log(`Total Obs: ${exportData.totalObs}`))

// apicall
    const qObsPromise = fetch(qObs2022)
        .then( res => res.json())
        .then(response => {
            var data = (response.total_results);
            export_OBS.Obs2022 = data;
        });
    //resolve the promise then print
    Promise.resolve(qObsPromise) // Waits for fetchPromise to get its value
        .then(() => console.log(`Obs 2022: ${exportData.Obs2022}`))

// apicall
const qIdPromise = fetch(qId2022)
            .then( res => res.json())
            .then(response => {
                var data = (response.total_results);
                export_OBS.Id2022 = data;
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
const casualPromise = fetch(qCasual)
          .then( res => res.json())
          .then(response => {
          var data = (response.total_results);
                        exportData.Casual = data;
                                });
              //resolve the promise then print
              Promise.resolve(casualPromise) // Waits for fetchPromise to get its value
                  .then(() => console.log(`Casual: ${exportData.Casual}`))

/* derive the number of observations in the data */
var totalObs = export_OBS.totalObs;

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
              .value(function(d) {return d.value;})

  //**********************
  //        TOOLTIP
 //**********************

var tooltip = d3.select('#'+ htmlID) // select element in the DOM with id 'chart'
                .append('div') // append a div element to the element we've selected
                .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected
              tooltip.append('div') // add divs to the tooltip defined above
                .attr('class', 'label'); // add class 'label' on the selection
              tooltip.append('div') // add divs to the tooltip defined above
                .attr('class', 'count'); // add class 'count' on the selection
              tooltip.append('div') // add divs to the tooltip defined above
                .attr('class', 'percent'); // add class 'percent' on the selection

var data_ready = pie(d3.entries(exportData))

// creating the chart
var path = svg.selectAll('allSlices') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d){ return(color(d.data.key)) })// use color scale to define fill of each label in dataset
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

  // mouse event handlers are attached to path so they need to come after its definition
  path.on('mouseover', function(d) {  // when mouse enters div
   var total = d3.sum(exportData.map(function(d) { // calculate the total number of tickets in the dataset
    return (d.enabled) ? d.value : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase
    }));
   var percent = Math.round(1000 * d.data.value / total) / 3; // calculate percent
   tooltip.select('.label').html(d.data.key); // set current label
   tooltip.select('.count').html('$' + d.data.key); // set current count
   tooltip.select('.percent').html(percent + '%'); // set percent calculated above
   tooltip.style('display', 'block'); // set display
  });

  path.on('mouseout', function() { // when mouse leaves div
    tooltip.style('display', 'none'); // hide tooltip for that element
   });

  path.on('mousemove', function(d) { // when mouse moves
    tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
      .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
    });

// The arc generator
var arc = d3.arc()
              .innerRadius(radius * 0.7)         // This is the size of the donut hole
              .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
              .innerRadius(radius * 0.9)
              .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
/*      .data(data_ready)
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
    // 100 is where the first dot appears. 25 is the distance between dots
    .attr("y", function(d,i){ return 120 + i*12})
    .style("fill", function(d){ return color(d.data.key)})
    .text(function(d){ return d.data.key})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

                                    }

function runSetInterval(){
             call_api({qTotalObs: qTotalObs,
                      qObs2022: qObs2022,
                      qId2022: qId2022,
                      qNeedsID: qNeedsID,
                      qResearch: qResearch,
                      qCasual: qCasual,
                      htmlID: "obsDoughnut"})
}

window.setInterval(runSetInterval,5000);

console.log(`interval: ${exported_data}`);
