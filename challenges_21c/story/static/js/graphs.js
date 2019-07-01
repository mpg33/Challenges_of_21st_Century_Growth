
const API_KEY = "pk.eyJ1Ijoic21vcnRlemF2aSIsImEiOiJjangweXg2dHAwMjR2NDRuenZobjFuOG9jIn0.jiVwTVGuAEaYH-mTB9t7xA";

var dataArray = [];


var IMP_Markers = [];
var Inc_Markers = [];


function markerSize(value) {
    return value / 40;
  }


// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
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



//ATTEMPING TO LOOK THROUGH THE ARRAY TO HAVE DYNAMIC/ MORE EFFICIENT CODE

bble_size = {'GDP_bn': 10000, 'Per_Capita_Income': 100, 'Population_mn': 1000000, 'Passengers_mn': 150000, 'Median_AQI': 140000, 'Good_Days_Percent': 100000, 'Zillow_home_value_index': 100}
fill_colr = ['purple', 'white']


d3.json(mapURL, function(response) {
    console.log(response);

    for (var i = 0; i < response.length; i++) {
      for(var j = 0; j < response[i].length; j++) {
        console.log(response[i][j]['value']);
        IMP_Markers.push(
        L.circle(response[i][j]['lon_lat'], {
            stroke: false,
            fillOpacity: 0.75,
            color: "black",
            fillColor: fill_colr[j],
            radius: markerSize(response[i][j]['value'] * bble_size[response[i][j]['indx'] ])
        }).bindPopup("<h1>" + response[i][j]['msa'] + "</h1> <hr> <h4>" + response[i][j]['indx'] + "<br> Value in " + response[i][j]['year'] + " : " + response[i][j]['value'] + "</h4>").addTo(myMap)
        );
      }        
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

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);