var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var gradientValues = [
    {breakpoint: 5, color:"#c7b6e7"},
    {breakpoint: 20, color:"#aa92cb"},
    {breakpoint: 35, color:"#8d6eae"},
    {breakpoint: 50, color:"#704a92"},
    {breakpoint: 70, color:"#532675"},
    {breakpoint: 10000, color:"#360259"}];

d3.json(queryURL, function(d){
    console.log(d.features)
    createFeatures(d.features);
});

function createFeatures(earthquakeData){
    console.log("creating Features")
    // define what to do with each feature
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>"+ feature.properties.place + "</h3><h4>Magnitude: "+ feature.properties.mag + "</h4><h4>Depth: "+ feature.geometry.coordinates[2] +"</h4>")
    }
    //change color based on depth
    function adjustColor(depth){
        for (var value of gradientValues){
            if (depth < value.breakpoint){
                return value.color;
            };
        };
    };
    //change size based on mag, scale exponentially
    function adjustSize(mag){
        return mag**7 + 5000;
    }
    // create GeoJson layer
    var earthquakes = L.geoJSON(earthquakeData,{
        pointToLayer: (feature, latlng) =>
                L.circle(latlng, {
                    color: "black",
                    weight: 1,
                    fillColor: adjustColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.8,
                    radius: adjustSize(feature.properties.mag),
                    riseOnHover: true
                }),
        onEachFeature: onEachFeature
    });
    // send layer to createMap function
    createMap(earthquakes);
};

function createMap(quakes){
    // Define layer/style of map
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v10",
    accessToken: API_KEY
    });
    // baseMaps object to hold our base layer(s)
    var baseMaps = {
        "Light Map": light,
        "Outdoors": outdoors
    };
    // overlay object to hold our geoJSON features
    var overlayMaps = {
        Quakes : quakes
    };
    // Create map
    var myMap = L.map("map",{
        center: [37.09,-95.71],
        zoom: 5,
        layers: [outdoors, quakes]
    })
    // Layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
}

