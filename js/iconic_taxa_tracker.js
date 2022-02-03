//********************************************************************//
//
//                    API VARIABLES
//
//
//*******************************************************************//

  var baseUrl = 'https://api.inaturalist.org/v1/observations?';
  var project = '&project_id=vermont-atlas-of-life';
  var research = '&quality_grade=research';
  var needs_id = '&quality_grade=needs_id';
  var casual = '&quality_grade=casual';
  var iconic = '&iconic_taxa='
  var lrank = '&lrank=species'
  var rank = '&rank=species'

  var iconicTaxon = ["Amphibia",
                     "Arachnida",
                     "Aves",
                     "Chromista",
                     "Fungi",
                     "Insecta",
                     "Mammalia",
                     "Mollusca",
                     "Reptilia",
                     "Plantae",
                     "Protozoa"];

var iconicTaxonArray =[{"text"  : "Amphibians",
                        "value" : "Amphibia"},
                     {"text"     : "Spiders & Allies",
                       "value"    : "Arachnida"},
                     {"text"  : "Birds",
                       "value" : "Aves",
                       "selected" : true},
                     {"text"  : "Others",
                       "value" : ["Chromista","Protozoa","Mollusca"]},
                     {"text"  : "Fungi",
                       "value" : "Fungi"},
                     {"text"  : "Insects",
                       "value" : "Insecta"},
                     {"text"  : "Mammals",
                       "value" : "Mammalia"},
                     {"text"  : "Reptiles",
                       "value" : "Reptilia"},
                     {"text"  : "Plants",
                       "value" : "Plantae"}]
var iconicSelectBox = document.getElementById('iconicSelection');
          //console.log(`selected value: ${iconicSelectBox.value}`)
    for(var i = 0, l = iconicTaxonArray.length; i < l; i++){
        var option = iconicTaxonArray[i];
        iconicSelectBox.options.add( new Option(option.text, option.value, option.selected) );
            }

document.getElementById("iconicSelection").addEventListener("change", function() {
  var taxonSelect = document.getElementById("iconicSelection");
  var selectedTaxa = taxonSelect.options[taxonSelect.selectedIndex].value;

console.log(`selected taxa: ${selectedTaxa}`)

//function sleep(ms) {
//    return new Promise(resolve => setTimeout(resolve, ms));}

// for (let i = 0; i < iconicTaxon.length; i++) {
// API strings
// var qTotalObs = baseUrl + project + iconic + iconicTaxon[i];
var qTotalObs = baseUrl + project + iconic + selectedTaxa;
var qNeedsID = baseUrl + project + needs_id + iconic + selectedTaxa;
var qResearch = baseUrl + project + research + iconic + selectedTaxa;
var qCasual = baseUrl + project + casual + iconic + selectedTaxa;
var qSppCount = 'https://api.inaturalist.org/v1/observations/species_counts?' + project + iconic + selectedTaxa + lrank + rank

console.log(qSppCount);

var export_OBS = {
   "totalObs": 0,
   "totalSpp": 0};

var exportData = {
      "NeedsID": 0,
      "Research": 0,
      "Casual": 0 };

var totalObs = export_OBS.totalObs;

console.log(`exportData names: ${Object.getOwnPropertyNames(exportData)}`);

//********************************************************************//
//
//                    FUNCTIONS
//
//
//*******************************************************************//
Promise.all([fetch(qTotalObs),
	           fetch(qResearch),
             fetch(qNeedsID),
             fetch(qCasual),
             fetch(qSppCount)])
        .then(function (responses) {
	       // Get a JSON object from each of the responses
	      return Promise.all(responses.map(function (response) {
		                                     return response.json();}
                                       )
                          );
                        })
        .then(function (data) {
        var data2 = data.map(function (d) {
            return d.total_results
                                       })
      // add data to global variable
          export_OBS.totalObs = data2[0];
          exportData.Research = data2[1];
          exportData.NeedsID = data2[2];
          exportData.Casual = data2[3];
          export_OBS.totalSpp = data2[4];

	// Log the data to the console
	// You would do something with both sets of data here
    // console.log(`data2: ${data2}`);
    // console.log(exportData);
                })
        .then(function(){makeDoughNut({exportData: exportData,
                            export_OBS: export_OBS,
                            htmlID: "iconictaxaDonut"})}

        )
.catch(function (error) {
	// if there's an error, log it
	console.log(error);
});
});

function makeDoughNut({exportData=TOOLS,
                       export_OBS=TOOLS,
                       htmlID=null,
                       lineColor="steelblue",
                       lineWidth=1.5,
                       width = 450,
                       height = 450,
                       margin = 70,
                       spaceSides = 460,
                       spaceTopBot = 460}){

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
      var radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called '#htmlID'
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
                    .range([d3.interpolateViridis(0.2),
                            d3.interpolateViridis(0.5),
                            d3.interpolateViridis(0.8)]);

    //  console.log(`colors: ${color}`);
      // Compute the position of each group on the pie:
      var pie = d3.pie()
                  .sort(null) // Do not sort group by size
                  .value(function(d) {return d.value; })
      // The arc generator
      var arc = d3.arc()
                  .innerRadius(radius * 0.7) // This is the size of the donut hole
                  .outerRadius(radius * 0.8)

      // Another arc that won't be drawn. Just for labels positioning
      var outerArc = d3.arc()
                       .innerRadius(radius * 0.9)
                       .outerRadius(radius * 0.9)

      var data_ready = pie(d3.entries(exportData))

      // Build the pie chart: Basically, each part of the pie is
      // a path that we build using the arc function.
      var path = svg.selectAll('allSlices')
                    .data(data_ready)

      var pathEnter = path.enter()
                          .append('path')
                          .attr('d', arc)
                          .attr('fill', function(d){ return(color(d.data.key)) })
                          .attr("stroke", "white")
                          .style("stroke-width", "2px")
                          .style("opacity", 0.7)

      //this is the "update" selection:
      var pathUpdate = path.attr("d", arc);

      /* add text to center of the donut plot */
          svg.append("text")
             .attr("text-anchor", "middle")
             .attr('font-size', '4em')
             .attr('y', 20)
             .text(export_OBS.totalSpp.toLocaleString());

      /* add text to center of the donut plot */
      svg.append("text")
         .attr("text-anchor", "middle")
         .attr('font-size', '2em')
         .attr('y', -40)
         .text(`Species:`);

      // Add one dot in the legend for each name.
      svg.selectAll("mydots")
          .data(data_ready)
          .enter()
          .append("circle")
          .attr("cx", -10)
          .attr("cy", function(d,i){ return 50 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 5)
          .style("fill", function(d){ return color(d.data.key)})

      // Add one dot in the legend for each name.
      svg.selectAll("mylabels")
        .data(data_ready)
        .enter()
        .append("text")
        .attr("x", -5)
        // 100 is where the first dot appears. 25 is the distance between dots
        .attr("y", function(d,i){ return 55 + i*15})
        .style("fill", function(d){ return color(d.data.key)})
        .text(function(d){ return d.data.key})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

      }
