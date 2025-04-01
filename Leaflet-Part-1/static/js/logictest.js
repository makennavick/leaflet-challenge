//------ SET UP MAP ------------------------

function createMap(earthquakes) {
    // Create base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create baseMaps object for default map layer
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlayMaps object to overlay the earthquake data
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // (finally) create the map, giving it the streetmap and earthquakes layers to display on load
    let myMap = L.map("map", {
      center: [37.09, -95.71], // Centering the map on the U.S.
      zoom: 5,
      layers: [street, earthquakes] // Default layers
    });
  
    // Create a layer control
    // Pass it our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: true
    }).addTo(myMap);
  }
  
  
  //------ DEAL WITH DATA ------------------------
  
  // Function to deal with earthquake data once we have it
  function createFeatures(earthquakeData) {
    
    // Define a function that will run once for each feature in the earthquakeData
    function onEachFeature(feature, latlng) {
      // For each feature (earthquake), create a circle marker and a popup
      L.circle(latlng, {
        // radius: getRadius(feature.properties.mag) // Use magnitude for radius size
      })
      .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer containing the features array from earthquakeData
    let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        // Calls the function onEachFeature to create a popup for each earthquake
        onEachFeature(feature, latlng);
        return L.circleMarker(latlng, { radius: getRadius(feature.properties.mag) });
      }
    });
  
    // Send the earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  // Function to determine the size of the circle based on magnitude
  function getRadius(magnitude) {
    return magnitude * 4; // Adjust multiplier to change circle size
  }
  
  
  //------ GET THE DATA ------------------------
  
  // Perform a GET request to fetch the earthquake data from the GeoJSON URL
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson").then(function(data) {
    // Once the data is loaded, send it to the createFeatures function
    createFeatures(data.features);
  });
  