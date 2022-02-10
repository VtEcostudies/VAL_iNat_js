var baseUrl = 'https://api.inaturalist.org/v1/observations/species_counts?';
var project = '&project_id=vermont-atlas-of-life';

const currentYear = new Date().getFullYear();

const previousYear =  currentYear-1;

var yr1first = '&d1=' + currentYear + '-01-01';
var yr0first = '&d1=' + previousYear + '-01-01';
var yr1 = '&year=' + currentYear;
var yr0 = '&year=' + previousYear;
var yr0last = '&d2=' + previousYear + '-12-31';

// API strings
var allyrsAPI = baseUrl+project
var currentAPI = baseUrl+project+yr1+yr1first
var pastAPI = baseUrl+project+yr0+yr0first+yr0last

var obsSppData = [];
var thisDay = new Date();

Date.prototype.getDOY = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((this - onejan) / 86400000);
};

console.log('------------------species tracker--------------------------------')
console.log(`this day: ${thisDay.toLocaleString()}`);
console.log(`getDOY: ${thisDay.getDOY()}`)

var thisOrdDay = thisDay.getDOY();

//********************************************************************//
//
//                    FUNCTIONS
//
//
//*******************************************************************//
Promise.all([fetch(allyrsAPI),
             fetch(currentAPI),
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
          return d.total_results
                                     })

      // add data to global variable
      // totalSpp, current yr, past year
          obsSppData=[data1[0],data1[1],data1[2]]

          console.log(`obsSppData: ${Object.values(obsSppData)}`)

              })
        .then(function(){
        //  interval value
        var htmlID = "observedSpecies";
          var lineColor="steelblue"
          var lineWidth=1.5;
          var margin={top: 10,
                  right: 30,
                  bottom: 60,
                  left: 60};
          var spaceSides = 800;
          var spaceTopBot = 100;
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
              //.attr("transform",
              //      "translate(" + margin.left + "," + margin.top + ")");

            // Add X axis --> it is a date format
            var x = d3.scaleLinear()
              .domain([0,obsSppData[0]])
              //.domain(d3.extent(xVals))
              .range([0, width]);

              // Add Y axis
              var y = d3.scaleLinear()
                .domain([0,1])
                .range([height, 0])
                //.padding(0.1);


              // add x axis label
                svg.append("text")
                   .attr("class", "x label")
                   .attr("text-anchor", "middle")
                   .attr("x", x(obsSppData[0]/2))
                   .attr("y", height+40)
                   .text("Observed species");

                   // Bars
                   var sppTotBar = svg.selectAll(".totsppbar")
                       .data(obsSppData)
                       .enter()
                       .append("rect");

                   sppTotBar.attr("x", function(d){return x(0)})
                       .attr("y", function(d){ return y(0.99)})
                       .attr("width", function(d){ return x(obsSppData[0])})
                       .attr("height", 28)
                       .attr("fill", "#D0D0D0");

              // Bars
              var sppYrBar = svg.selectAll(".yrsppbar")
                           .data(obsSppData)
                           .enter()
                           .append("rect");

                  sppYrBar.attr("x", function(d){return x(0)})
                           .attr("y", function(d){ return y(0.65)})
                           .attr("width", function(d){ return x(obsSppData[1])})
                           .attr("height", 10)
                           .attr("fill", "#00CC00");
                           // Bars
            var sppAllText = svg.selectAll('.AllsppText')
                            .append()
                            .attr("x", x(obsSppData[0]))
                            .attr("y", y(0.65))
                            .text(obsSppData[0].toLocaleString()+'spp');

            var sppAllText = svg.selectAll('.yrsppText')
                                .append()
                                .attr("x", x(obsSppData[1]))
                                .attr("y", y(0.65))
                                .text(obsSppData[1].toLocaleString()+'spp');

            var sppLastBar = svg.selectAll(".lastsppbar")
                                        .data(obsSppData)
                                        .enter()
                                        .append("rect");

                    sppLastBar.attr("x", function(d){return x(obsSppData[2])})
                            .attr("y", function(d){ return y(0.85)})
                            .attr("width", function(d){ return x(20)})
                            .attr("height", 20)
                            .attr("fill", "#505050");

            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

        //    svg.append("g")
        //      .call(d3.axisLeft(y));


          })

.catch(function (error) {
// if there's an error, log it
console.log(error);
});
