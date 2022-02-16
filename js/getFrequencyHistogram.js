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
  var interval = '&interval=week_of_year';
  var date_field = '&date_field=observed';


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

// basis of new selector //
  d3.csv('https://raw.githubusercontent.com/VtEcostudies/VAL_iNat_js/main/data/GBIF_species_flat.csv',
        function(data){
          console.log(`GITDATA: ${JSON.stringify(data)}`)
        });

  var selectPhenologyArray =[{"text" : "Select taxon:",
                          "value" : "Alces alces",
                          "selected": true},
                       {"text"  : "Monarch Butterfly",
                          "value" : "Danaus plexippus"},
                       {"text"     : "Common Green Darner",
                         "value"    : "Anax junius"},
                       {"text"  : "Cabbage White Butterfly",
                         "value" : "Pieris rapae"},
                       {"text"  : "Eastern Gray Squirrel",
                         "value" : "Sciurus carolinensis"},
                       {"text" : "Moose",
                        "value" : "Alces alces"}]

  var phenoSelectBox = document.getElementById('phenoSelection');
            //console.log(`selected value: ${iconicSelectBox.value}`)
      for(var i = 0, l = selectPhenologyArray.length; i < l; i++){
          var option = selectPhenologyArray[i];
          phenoSelectBox.options.add( new Option(option.text, option.value, option.selected) );
              }

  var selectedPheno = "Alces alces";
  var phenoLabel = "Moose"

  console.log(`selected taxa: ${selectedPheno}`);

  // for (let i = 0; i < iconicTaxon.length; i++) {
  // API strings
  // var qTotalObs = baseUrl + project + iconic + iconicTaxon[i];

  var phenoFreqQueries ='https://api.inaturalist.org/v1/observations/histogram?' + project + "&taxon_name="+ selectedPheno + date_field + interval;

  console.log(`pheno: ${phenoFreqQueries}`);

  var taxon_species = [];

  var phenoWeeklyData = [];

drawFreqHistograms();

document.getElementById("phenoSelection").addEventListener("change", function() {
  var phenoSelect = document.getElementById("phenoSelection");
  selectedPheno = phenoSelect.options[phenoSelect.selectedIndex].value;
  phenoLabel = phenoSelect.options[phenoSelect.selectedIndex].text;

console.log(`selected taxa: ${selectedPheno}`)

phenoFreqQueries ='https://api.inaturalist.org/v1/observations/histogram?' + project + "&taxon_name="+ selectedPheno + date_field + interval;

drawFreqHistograms();
});

function drawFreqHistograms() {
//function sleep(ms) {
//    return new Promise(resolve => setTimeout(resolve, ms));}

//********************************************************************//
//
//                    FUNCTIONS
//
//
//*******************************************************************//
Promise.all([fetch(phenoFreqQueries)])
        .then(function (responses) {
	       // Get a JSON object from each of the responses
	      return Promise.all(responses.map(function (response) {
		                                     return response.json();}
                                       )
                          );
                        })
        .then(function (data) {
        var data2 = data.map(function (d) {
            return d.results.week_of_year
                                       })
      // add data to global variable
      phenoWeeklyData = data2[0];

console.log(phenoWeeklyData);
	// Log the data to the console
	// You would do something with both sets of data here
    // console.log(`data2: ${data2}`);
    console.log(Object.values(phenoWeeklyData));
                })
        .then(function(){makeFreqHistograms({
                            phenoData: phenoWeeklyData,
                            htmlID: "speciesPhenoHisto"})})
        .catch(function (error) {
	// if there's an error, log it
	console.log(error);
});
}

function makeFreqHistograms({phenoData=TOOLS,
                       total_species=1000,
                       htmlID=null,
                       lineColor="steelblue",
                       lineWidth=1.5,
                       width = 450,
                       height = 450,
                       margin = 70,
                       spaceSides = 460,
                       spaceTopBot = 460}){

// Get the total number of observations
var total_spp_obs = Object.values(phenoData).reduce((weekobs, a) => weekobs + a, 0);

// Get the probs
// var weekly_probs = Object.values(phenoData).map(function(week) { return week/total_spp_obs});
 var weekly_probs = Object.values(phenoData).map(function(week) { return week/total_spp_obs});

console.log(`weekProbs: ${weekly_probs}`)
// empty object to store data
var phenoProcData = [];

var monthNames = ["Jan", "Feb", "Mar", "Apr",
                  "May","Jun","Jul", "Aug", "Sep",
                  "Oct", "Nov","Dec"];

// set up loops
var pv = Object.keys(phenoData);

console.log(`pv: ${pv}`)
for (var key of pv) {
    phenoProcData.push({wk: key,
                        count: phenoData[key],
                        prob: weekly_probs[key],
                        mon: monthNames[new Date(1000 * 60 * 60 * 24 * 7 * key).getMonth()]})
};

console.log(`phenoData: ${phenoData}`)
console.log(`Total species obs: ${total_spp_obs}`);

var wkProbData = phenoProcData.reduce((obj, item) => Object.assign(obj, { [item.wk]: item.prob }), {});

console.log(`weekly_probs: ${wkProbData}`);

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#" + htmlID)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
// X axis
var x = d3.scaleBand()
          .range([ 0, width ])
          .domain(phenoProcData.map(function(d) { return d.wk; }));
          //.padding(0.01);
svg.append("g")
   .attr("transform", "translate(0," + height + ")")
   //.call(d3.axisBottom(x))
  //.selectAll("text")
  //  .attr("transform", "translate(+2,0)")
  //  .style("text-anchor", "middle")
  //  .style("font-size", "0.6em");

// Add Y axis
var y = d3.scaleLinear()
  .domain([-0.1, 0.1])
  .range([ height, 0]);
//svg.append("g")
//  .call(d3.axisLeft(y));
svg.append("polygon")
   .attr("points", x(1)+","+y(0.1)+" "+x(53)+","+y(0.1)+" "+x(53)+","+y(0.08)+" "+x(1)+","+y(0.08))
   .style("fill", "lightblue")
   .style("stroke", "black")
   .style("strokeWidth", "10px")

 var monLabs = {label: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               x: [2, 6,10,14,18,22,26,30,34,38,42,44]}

//var yLabLocs = [0.09,0.09,0.09,0.09,0.09,0.09,0.09,0.09,0.09,0.09,0.09,0.09]
//var xLabLocs = [1,5,9,13,17,21,25,29,33,37,41,43]
var xLabs = [{"month":"Jan", xlab: 1, ylab: 0.09},
            {"month":"Feb",xlab: 5, ylab: 0.09},
            {"month":"Mar",xlab: 9, ylab: 0.09},
            {"month":"Apr",xlab: 13, ylab: 0.09},
            {"month":"May",xlab: 17, ylab: 0.09},
            {"month":"Jun",xlab: 21, ylab: 0.09},
            {"month":"Jul",xlab: 25, ylab: 0.09},
            {"month":"Aug",xlab: 29, ylab: 0.09},
            {"month":"Sept",xlab: 33, ylab: 0.09},
            {"month":"Oct",xlab: 37, ylab: 0.09},
            {"month":"Nov",xlab: 41, ylab: 0.09},
            {"month":"Dec",xlab: 43, ylab: 0.09}]

svg.append("text")
       .datum(xLabs)
       .attr("x", function(d){return x(d.xlab)})
       .attr("y", function(d){return y(d.ylab)})
       //.attr("dy", ".25em")
       //.attr("transform", "translate(+2,0)")
       .style("font-size", "0.6em")
       .style("stroke","none")
       .style("fill","black")
       .style("text-anchor","middle")
       .text(function(d){return x(d.month)});

// Bars
svg.selectAll("mybar")
  .data(phenoProcData)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.wk); })
    .attr("y", function(d) { return y(d.prob); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return y(0)-y(d.prob); })
    .attr("fill", "steelblue")

svg.selectAll("underbar")
      .data(phenoProcData)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d.wk); })
        .attr("y", function(d) { return y(0); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return y(d.prob*-1)-y(0); })
        .attr("fill", "steelblue")
};
