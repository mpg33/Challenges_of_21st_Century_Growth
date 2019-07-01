
const API_KEY = "pk.eyJ1Ijoic21vcnRlemF2aSIsImEiOiJjangweXg2dHAwMjR2NDRuenZobjFuOG9jIn0.jiVwTVGuAEaYH-mTB9t7xA";

var dataArray = [];


var IMP_Markers = [];
var Inc_Markers = [];

var LA_lon_lat = [34.058760,-118.229360]
var SF_lon_lat = [37.774929,-122.419418]
var NY_lon_lat = [40.712776,-74.005974]


function markerSize(value) {
    return value / 40;
  }


// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });
  
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Define a markerSize function that will give each city a different radius based on its population
  function markerSize(population) {
    return population / 40;
  }


var api_key = 'Tx8GhHmntW9csEbtjmH_'
//IMP URLS
var LA_IMP = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_IMP.json?api_key=Tx8GhHmntW9csEbtjmH_"
var SF_IMP = "https://www.quandl.com/api/v3/datasets/ZILLOW/M11_IMP.json?api_key=Tx8GhHmntW9csEbtjmH_"
var NY_IMP = "https://www.quandl.com/api/v3/datasets/ZILLOW/M2_IMP.json?api_key=Tx8GhHmntW9csEbtjmH_"


LA_Homes_Inc = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
SF_Homes_Inc= "https://www.quandl.com/api/v3/datasets/ZILLOW/M1047_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
NY_Homes_Inc = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1105_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"



//ATTEMPING TO LOOK THROUGH THE ARRAY TO HAVE DYNAMIC/ MORE EFFICIENT CODE

IMP_URL_Array = [LA_IMP, SF_IMP, NY_IMP]

// for (var i = 0; i < IMP_URL_Array.length; i++) {
//     // var sum = sum + IMP_URL_Array[i][1]
//     console.log(IMP_URL_Array[i])
    
// };
 

// for (var i = 0; i < IMP_URL_Array.length; i++) {
//     L.circle(IMP_URL_Array[i].dataset, {
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "purple",
//       // Setting our circle's radius equal to the output of our markerSize function
//       // This will make our marker's size proportionate to its population
//       radius: markerSize(IMP_URL_Array[i].dataset.data)
//     }).bindPopup("<h1>" + IMP_URL_Array[i].dataset + "</h1> <hr> <h3>Population: " + IMP_URL_Array[i].population + "</h3>").addTo(myMap);
//   }
  

d3.json(LA_IMP, function(response) {
    console.log(response);

    for (var i = 0; i < response.dataset.data.length; i++) {
        dataArray.push(response.dataset.data[i]);
    }

    var sum = 0;
    for (var i = 0; i < dataArray.length; i++) {
        var sum = sum + dataArray[i][1];
    }

    var average = Math.round(sum / dataArray.length);
    console.log("LA avg:" + average)
    console.log("LA sum:" + sum)
    for (var i = 0; i < response.dataset.data.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        IMP_Markers.push(
        L.circle(LA_lon_lat, {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: "purple",
            radius: markerSize(average * 100)
        }).bindPopup("<h1>Los Angeles</h1> <hr> <h4>Param 1: $" + average + "</h4> <h4>Param 2: $" + 1000000 + "<h4>").addTo(myMap)
        );
    }
    });


d3.json(SF_IMP, function(response) {
    console.log(response);
    
      for (var i = 0; i < response.dataset.data.length; i++) {
          dataArray.push(response.dataset.data[i]);
      }
    
      var sum = 0;
      for (var i = 0; i < dataArray.length; i++) {
          var sum = sum + dataArray[i][1];
      }
    
      var average = Math.round(sum / dataArray.length);
        console.log("SF avg:" + average)
        console.log("SF sum:" + sum)
      for (var i = 0; i < response.dataset.data.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        IMP_Markers.push(
          L.circle(SF_lon_lat, {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: "purple",
            radius: markerSize(average * 100)
          }).bindPopup("<h1>San Fransisco</h1> <hr> <h3>Avg Price: $" + average + "</h3>").addTo(myMap)
        );
      }
    });


d3.json(NY_IMP, function(response) {
    console.log(response);
    
        for (var i = 0; i < response.dataset.data.length; i++) {
            dataArray.push(response.dataset.data[i]);
        }
    
        var sum = 0;
        for (var i = 0; i < dataArray.length; i++) {
            var sum = sum + dataArray[i][1];
        }
    
        var average = Math.round(sum / dataArray.length);
        console.log("NY avg:" + average)
        console.log("NY sum:" + sum)
        for (var i = 0; i < response.dataset.data.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        IMP_Markers.push(
            L.circle(NY_lon_lat, {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: "purple",
            radius: markerSize(average * 100)
            }).bindPopup("<h1>New York</h1> <hr> <h3>Avg Price: $" + average + "</h3>").addTo(myMap)
        );
        }
    });


// LA_Homes_Inc = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
// SF_Homes_Inc= "https://www.quandl.com/api/v3/datasets/ZILLOW/M1047_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
// NY_Homes_Inc = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1105_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"


d3.json(LA_Homes_Inc, function(response) {
    console.log(response);

    for (var i = 0; i < response.dataset.data.length; i++) {
        dataArray.push(response.dataset.data[i]);
    }

    var sum = 0;
    for (var i = 0; i < dataArray.length; i++) {
        var sum = sum + dataArray[i][1];
    }

    var average = Math.round(sum / dataArray.length);
    console.log("LA avg:" + average)
    console.log("LA sum:" + sum)
    for (var i = 0; i < response.dataset.data.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        Inc_Markers.push(
        L.circle(LA_lon_lat, {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: "red",
            radius: markerSize(average * 500)
        }).bindPopup("<h1>Los Angeles</h1> <hr> <h4>Average: $" + average + "</h4> <h4>Max: %" + 1000000 + "<h4> <h4>Min: %" + 1000 + "<h4>").addTo(myMap)
        );
    }
    });


d3.json(SF_Homes_Inc, function(response) {
    console.log(response);
    
      for (var i = 0; i < response.dataset.data.length; i++) {
          dataArray.push(response.dataset.data[i]);
      }
    
      var sum = 0;
      for (var i = 0; i < dataArray.length; i++) {
          var sum = sum + dataArray[i][1];
      }
    
      var average = Math.round(sum / dataArray.length);
        console.log("SF avg:" + average)
        console.log("SF sum:" + sum)
      for (var i = 0; i < response.dataset.data.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        Inc_Markers.push(
          L.circle(SF_lon_lat, {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: "red",
            radius: markerSize(average * 500)
          }).bindPopup("<h1>San Fransisco</h1> <hr> <h3>Avg Price: %" + average + "</h3>").addTo(myMap)
        );
      }
    });


d3.json(NY_Homes_Inc, function(response) {
    console.log(response);
    
        for (var i = 0; i < response.dataset.data.length; i++) {
            dataArray.push(response.dataset.data[i]);
        }
    
        var sum = 0;
        for (var i = 0; i < dataArray.length; i++) {
            var sum = sum + dataArray[i][1];
        }
    
        var average = Math.round(sum / dataArray.length);
        console.log("NY avg:" + average)
        console.log("NY sum:" + sum)
        for (var i = 0; i < response.dataset.data.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        Inc_Markers.push(
            L.circle(NY_lon_lat, {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: "red",
            radius: markerSize(average * 500)
            }).bindPopup("<h1>New York</h1> <hr> <h3>Avg Price: %" + average + "</h3>").addTo(myMap)
        );
        }
    });





    // Define variables for our base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
    // Create two separate layer groups: one for cities and one for states
var IMP = L.layerGroup(IMP_Markers);
var Housing_Inc = L.layerGroup(Inc_Markers);

//Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

// Create an overlay object
var overlayMaps = {
  "Inventory Measure Index (Public)": IMP,
  "Percent Homes Increasing In Values": Housing_Inc
};

// Define a map object
// var myMap = L.map("map", {
//   center: [37.09, -95.71],
//   zoom: 5,
//   layers: [IMP]
// });

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);