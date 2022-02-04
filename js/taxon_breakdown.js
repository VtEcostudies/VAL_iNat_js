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


  // for (let i = 0; i < iconicTaxon.length; i++) {
  // API strings
  // var qTotalObs = baseUrl + project + iconic + iconicTaxon[i];

    var sppQueries = [];
      iconicTaxon.map(function(d){
      sppQueries[d] ='https://api.inaturalist.org/v1/observations/species_counts?' + project + iconic + d + lrank + rank
                     });

  console.log(sppQueries);
  var taxon_species = [];
  var sppTaxonData = {"Amphibia" : 0,
                      "Arachnida" : 0,
                      "Aves" : 0,
                      "Chromista" : 0,
                      "Fungi" : 0,
                      "Insecta" : 0,
                      "Mammalia" : 0,
                      "Mollusca" : 0,
                      "Reptilia" : 0,
                      "Plantae" : 0,
                      "Protozoa" : 0};



drawTaxonBreakdownDonut();


function drawTaxonBreakdownDonut() {
//function sleep(ms) {
//    return new Promise(resolve => setTimeout(resolve, ms));}

//********************************************************************//
//
//                    FUNCTIONS
//
//
//*******************************************************************//
Promise.all([fetch(sppQueries.Amphibia),
	           fetch(sppQueries.Arachnida),
             fetch(sppQueries.Aves),
             fetch(sppQueries.Chromista),
             fetch(sppQueries.Fungi),
             fetch(sppQueries.Insecta),
             fetch(sppQueries.Mammalia),
             fetch(sppQueries.Mollusca),
             fetch(sppQueries.Reptilia),
             fetch(sppQueries.Plantae),
             fetch(sppQueries.Protozoa)])
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
      sppTaxonData.Amphibia = data2[0];
      sppTaxonData.Arachnida = data2[1];
      sppTaxonData.Aves = data2[2];
      sppTaxonData.Chromista = data2[3];
      sppTaxonData.Fungi = data2[4];
      sppTaxonData.Insecta = data2[5];
      sppTaxonData.Mammalia = data2[6];
      sppTaxonData.Mollusca = data2[7];
      sppTaxonData.Reptilia = data2[8];
      sppTaxonData.Plantae = data2[9];
      sppTaxonData.Protozoa = data2[10];

  taxon_species = Object.values(sppTaxonData).reduce(function(a, b){return a + b;}, 0);
	// Log the data to the console
	// You would do something with both sets of data here
    // console.log(`data2: ${data2}`);
    console.log(Object.values(sppTaxonData));
                })
        .then(function(){makeSppBreakdownDoughNut({
                            exportData: sppTaxonData,
                            total_species: taxon_species,
                            htmlID: "speciesBreakdown"})})
        .catch(function (error) {
	// if there's an error, log it
	console.log(error);
});
}

function makeSppBreakdownDoughNut({exportData=TOOLS,
                       total_species=1000,
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
                    .range([d3.interpolateViridis(0.5),
                            d3.interpolateViridis(1.0),
                            d3.interpolateViridis(0.1),
                            d3.interpolateViridis(0.9),
                            d3.interpolateViridis(0.2),
                            d3.interpolateViridis(0.8),
                            d3.interpolateViridis(0.3),
                            d3.interpolateViridis(0.7),
                            d3.interpolateViridis(0.4),
                            d3.interpolateViridis(0.6),
                            d3.interpolateViridis(0.0)]);

    //  console.log(`colors: ${color}`);
      // Compute the position of each group on the pie:
      var pie = d3.pie()
                  .sort(null) // Do not sort group by size
                  .value(function(d) {return d.value; })
                  .startAngle(1.1*Math.PI)
                  .endAngle(3.1*Math.PI)

      var tooltip = d3.select("#" + htmlID)
                      .append('div')
                      .attr('class', 'tooltip');

           tooltip.append('div')
                  .attr('class', 'label')
                  .style('font-weight','bold');

          tooltip.append('div')
                .attr('class', 'count');

          tooltip.append('div')
                  .attr('class', 'percent');

      // The arc generator
      var arc = d3.arc()
                  .innerRadius(radius * 0.7) // This is the size of the donut hole
                  .outerRadius(radius * 0.8)

      // Another arc that won't be drawn. Just for labels positioning
      var outerArc = d3.arc()
                       .innerRadius(radius * 0.9)
                       .outerRadius(radius * 0.9)

      var data_ready = pie(d3.entries(exportData))

      console.log(`data_ready: ${data_ready}`);

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

      pathEnter.on('mouseover', function(d) {                            // NEW
            var total = d3.sum(data_ready.map(function(d) {                // NEW
              return d.value;                                           // NEW
            }));                                                        // NEW
            var percent = Math.round(1000 * d.data.value / total) / 10; // NEW
            tooltip.select('.label').html(d.data.key);                // NEW
            tooltip.select('.count').html(d.data.value.toLocaleString());                // NEW
            tooltip.select('.percent').html(percent + '%');             // NEW
            tooltip.style('display', 'block');                          // NEW
          });                                                           // NEW

          pathEnter.on('mouseout', function() {                              // NEW
            tooltip.style('display', 'none');                           // NEW
          });                                                           // NEW

          // OPTIONAL
          pathEnter.on('mousemove', function(d) {                            // NEW
            tooltip.style('top', (d3.event.pageY + 10) + 'px')          // NEW
                   .style('left', (d3.event.pageX + 10) + 'px');             // NEW
          });                                                           // NEW
      /* add text to center of the donut plot */
          svg.append("text")
             .attr("text-anchor", "middle")
             .attr('font-size', '4em')
             .attr('y', 20)
             .text(total_species.toLocaleString());

      /* add text to center of the donut plot */
      svg.append("text")
         .attr("text-anchor", "middle")
         .attr('font-size', '2em')
         .attr('y', -40)
         .text(`Species:`);

     /* add text to center of the donut plot */
         svg.append("text")
            .attr("x", 0)
            .attr("y", -150)
            .attr("text-anchor", "middle")
            .style("font-size", "4em")
            .text(`Taxon breakdown`);

      // Add one dot in the legend for each name.
      svg.selectAll("mydots")
          .data(data_ready)
          .enter()
          .append("circle")
          .attr("cx", 150)
          .attr("cy", function(d,i){ return -75 + i*18}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 5)
          .style("fill", function(d){ return color(d.data.key)})


     svg.selectAll("mylabels")
          .data(data_ready)
          .enter()
          .append("text")
          .attr("x", 155)
          // 100 is where the first dot appears. 25 is the distance between dots
          .attr("y", function(d,i){ return -70 + i*18})
          .style("fill", function(d){ return color(d.data.key)})
          .text(function(d){ return d.data.key})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")

      }
