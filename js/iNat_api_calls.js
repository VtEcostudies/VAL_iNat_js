// function added to get just the current days observations
  //var mapExt = getMapLlExtents();
  var baseUrl = 'https://api.inaturalist.org/v1/observations/species_counts';
  //var begDate = `?d1=${getStamp(30)}`; if (init & vtOnly) {begDate = `?d1=${getDate(getDays)}`;}
  //var begDate = `?created_d1=${getStamp(3600)}` //midnight of current day
  var begDate = '?d1=2022-01-01'; //midnight of current day
  var endDate = '&d2=2022-01-20';
  var project = '&project_id=vermont-atlas-of-life';
  var identified = '&current=true';
  //var bbox = `&nelat=${mapExt.nelat}&nelng=${mapExt.nelng}&swlat=${mapExt.swlat}&swlng=${mapExt.swlng}`;
  var order = '&order=desc&order_by=created_at';
  var iNatUrl = baseUrl + begDate + project + order;

console.log(`iNatUrl: ${iNatUrl}`);

// Empty data array
var dataJson = [];

// apicall
const fetchPromise = fetch(iNatUrl)
    .then( res => res.json())
    .then(response => {
        var data = (response.results);
        dataJson = data;
    });
//resolve the promise then print
Promise.resolve(fetchPromise) // Waits for fetchPromise to get its value
    .then(() => console.log(dataJson))

/* Ideally we'll have a number of different API functions with
 * default values for all parameters in the API
 * we can then filter the named parameter list
 * params.filter(x=> x!==null) and concatenate them
 * to get the iNatUrl Object
 *
 *
 * envisioned workflow drafted out below
 */

 var updates_params = {created_after: null,
                       viewed: null,
                       observations_by: null,
                       page: 1,
                       per_page: 200}

 updates_params.per_page = 500;

 function iNatAPI_udpates(updates_params){
   // baseUrl for the specific results page
   // find non-null fields
   // concatenate Object.key, &, parameter value
   // Call API and get data
   // return dataJson results: whatever else
 }
