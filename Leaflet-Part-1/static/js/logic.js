
//------ SET UP MAP ------------------------

function createMap(earthquakes) {

  // create base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // create baseMaps object for default map layer
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // create an overlayMaps object to overlay the earthquake data
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // (finally) create the map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);


  // Create a legend & add to map
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      let div = L.DomUtil.create('div', 'info legend'),
          depths = [-10, 10, 30, 60],
          colors = ['green', 'yellow', 'orange', 'red'];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < depths.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}


//------ DEAL WITH DATA ------------------------

// function to deal with aforementioned earthquake data once we have it
function createFeatures(earthquakeData) {
  console.log(earthquakeData)

  function radius(feature){
    let magnitude = feature.properties.mag
    return magnitude * 10000
  }

  function color(feature){
    let depth = feature.geometry.coordinates[2]
    
    if (depth < 10) return 'green'
    else if (depth < 30) return 'yellow'
    else if (depth < 60) return 'orange'
    else return 'red'
  }

  // Define a function that we want to run once for each feature in the features array.
  // FOR NOW, just give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, latlng) {
      return L.circle(latlng, {
        color: 'black',
        weight: 1,
        fillColor: color(feature),
        radius: radius(feature),
        fillOpacity: 1
      }).bindPopup(`<h3>Magnitude: ${feature.properties.mag}, Location: ${feature.properties.place}, Depth: ${feature.geometry.coordinates[2]}</h3>`);
    }
  

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      // Return the circle with the correct styles and popup
      return onEachFeature(feature, latlng);
    }
  })

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

}




//------ GET THE DATA ------------------------

// do a get request to the desired geojson url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson").then(function (data) {
  
  // once the response is complete, send the data.features object to the createFeatures function
  createFeatures(data.features);

});






