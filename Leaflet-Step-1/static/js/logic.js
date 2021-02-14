var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(d){
    console.log(d.features)
    createFeatures(d.features);
});


function createFeatures(earthquakeData){
    console.log("creating Features")
    // define what to do with each feature
    function onEachFeature(feature, layer){
        layer.bindPopup("<p>Some HTML here"+ feature.properties.mag + "</p>")
    }
    // create GeoJson layer
    var earthquakes = L.geoJSON(earthquakeData,{
    onEachFeature: onEachFeature
    });
    // send layer to createMap function
    createMap(earthquakes);
};

// function createMap(earthquakes) {
//     console.log("creating map.")
//     // Define streetmap and darkmap layers
//     var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//       attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//       tileSize: 512,
//       maxZoom: 18,
//       zoomOffset: -1,
//       id: "mapbox/streets-v11",
//       accessToken: API_KEY
//     });
  
//     var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//       attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//       maxZoom: 18,
//       id: "dark-v10",
//       accessToken: API_KEY
//     });
  
//     // Define a baseMaps object to hold our base layers
//     var baseMaps = {
//       "Street Map": streetmap,
//       "Dark Map": darkmap
//     };
  
//     // Create overlay object to hold our overlay layer
//     var overlayMaps = {
//       Earthquakes: earthquakes
//     };
  
//     // Create our map, giving it the streetmap and earthquakes layers to display on load
//     var myMap = L.map("map", {
//       center: [
//         37.09, -95.71
//       ],
//       zoom: 5,
//       layers: [streetmap, earthquakes]
//     });
  
//     // Create a layer control
//     // Pass in our baseMaps and overlayMaps
//     // Add the layer control to the map
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(myMap);
//   }
function createMap(quakes){
    // Define layer/style of map
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });
    // baseMaps object to hold our base layer(s)
    var baseMaps = {
        "Light Map": light
    };
    // overlay object to hold our geoJSON features
    var overlayMaps = {
        Quakes : quakes
    };
    // Create map
    var myMap = L.map("map",{
        center: [37.09,-95.71],
        zoom: 5,
        layers: [light, quakes]
    })
    // Layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
}

