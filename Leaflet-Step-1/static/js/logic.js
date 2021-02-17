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
        var d = new Date(feature.properties.time).toString()
        layer.bindPopup("<h3>"+ feature.properties.place + "</h3><h4>Magnitude: "+ feature.properties.mag + " Depth: "+ feature.geometry.coordinates[2].toFixed(2) +"</h4><p>"+ d.slice(0,24) +"<br>"+ d.slice(26) +"</p>")
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

    var legend = L.control({ position: "bottomright"});
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");
        var limits = gradientValues.map(d => d.breakpoint);
        var colors = gradientValues.map(d => d.color);
        var labels = []

        var legendInfo = "<h1>Quake Depth</h1>" +
            "<div class=\"labels\">" +
                "<div class=\"min\"><" + limits[0] + "</div>" +
                "<div class=\"max\">>" + limits[limits.length - 2] + "<\div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    legend.addTo(myMap);
};

