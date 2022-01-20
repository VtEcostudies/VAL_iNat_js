// function added to get just the current days observations
  //var mapExt = getMapLlExtents();
  var baseUrl = 'https://api.inaturalist.org/v1/observations/species_counts';
  //var begDate = `?d1=${getStamp(30)}`; if (init & vtOnly) {begDate = `?d1=${getDate(getDays)}`;}
  //var begDate = `?created_d1=${getStamp(3600)}` //midnight of current day
  var begDate = '?d1=2022-01-01'; //midnight of current day
  var endDate = `&d2=${getStamp(0)}`;
  var project = '&project_id=vermont-atlas-of-life';
  var identified = '&current=true';
  //var bbox = `&nelat=${mapExt.nelat}&nelng=${mapExt.nelng}&swlat=${mapExt.swlat}&swlng=${mapExt.swlng}`;
  var order = '&order=desc&order_by=created_at';
  var iNatUrl = baseUrl + begDate + project + order;

console.log(`iNatUrl: ${iNatUrl}`);
