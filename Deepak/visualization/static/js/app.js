var graphData = {{ data.chart_data | safe }};

var margin = {top: 30, right: 50, bottom: 30, left: 50};
var svgWidth = 600;
var svgHeight = 270;
var graphWidth = svgWidth - margin.left - margin.right;
var graphHeight = svgHeight - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale().range([0, graphWidth]);
var y = d3.scale.linear().range([graphHeight, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);


var airQLine = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Median_AQI); });



var svg = d3.select("#graphDiv")
    .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
    .append("g")
        .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")")


function drawGraph(data) {

  // var url = "/api/air_quality";
  // d3.json(url).then(function(response) {

  //   console.log(response);

  //   var data = response;

  // For each row in the data, parse the date
  // and use + to make sure data is numerical
  data.forEach(function(d) {
    d.Year = parseDate(d.Year);
    d.Median_AQI = +d.Median_AQI;

  });
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([d3.min(data, function(d) {
      return Math.min(d.Median_AQI) }),
      d3.max(data, function(d) {
      return Math.max(d.Median_AQI) })]);
  // Add the area path
  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area)
  // Add the highLine as a green line
  svg.append("path")
    .style("stroke", "green")
    .style("fill", "none")
    .attr("class", "line")
    .attr("d", highLine(data));
  // Add the closeLine as a blue dashed line
  svg.append("path")
    .style("stroke", "blue")
    .style("fill", "none")
    .style("stroke-dasharray", ("3, 3"))
    .attr("d", closeLine(data));
  // Add the lowLine as a red dashed line
  svg.append("path")
    .style("stroke", "red")
    .attr("d", lowLine(data));
  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + graphHeight + ")")
      .call(xAxis);
  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  // Add the text for the "High" line
  svg.append("text")
    .attr("transform", "translate("+(graphWidth+3)+","+y(graphData[0].High)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("High");
  // Add the text for the "Low" line
  svg.append("text")
    .attr("transform", "translate("+(graphWidth+3)+","+y(graphData[0].Low)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Low");
  // Add the text for the "Close" line
  svg.append("text")
    .attr("transform", "translate("+(graphWidth+3)+","+y(graphData[0].Close)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "blue")
    .text("Close");
};

drawGraph(graphData);

// function buildPlot1() {
//     /* data route */
//   var url = "/api/air_quality";
//   d3.json(url).then(function(response) {

//     console.log(response);

//     var data = response;

//     var layout = {
//       scope: "usa",
//       title: "Air Quality",
//       showlegend: false,
//       height: 600,
//             // width: 980,
//       geo: {
//         scope: "usa",
//         projection: {
//           type: "albers usa"
//         },
//         showland: true,
//         landcolor: "rgb(217, 217, 217)",
//         subunitwidth: 1,
//         countrywidth: 1,
//         subunitcolor: "rgb(255,255,255)",
//         countrycolor: "rgb(255,255,255)"
//       }
//     };

//     Plotly.newPlot("plot", data, layout);
//   });
// }

// buildPlot1();












// function buildPlot2() {
//     /* data route */
//   var url = "/api/gdp";
//   d3.json(url).then(function(response) {

//     console.log(response);

//     var data = response;
//   // data
//   var dataArray = data[0].good_days_percent;
//   var dataCategories = data[0].year;

//   console.log(dataArray);
//   console.log(dataCategories);

//   // svg container
//   var height = 500;
//   var width = 500;

//   // margins
//   var margin = {
//     top: 50,
//     right: 50,
//     bottom: 50,
//     left: 50
//   };

//   // chart area minus margins
//   var chartHeight = height - margin.top - margin.bottom;
//   var chartWidth = width - margin.left - margin.right;

//   // create svg container
//   var svg = d3.select("body").append("svg")
//       .attr("height", height)
//       .attr("width", width);

//   // shift everything over by the margins
//   var chartGroup = svg.append("g")
//       .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   // scale y to chart height
//   var yScale = d3.scaleLinear()
//       .domain([0, d3.max(dataArray)])
//       .range([chartHeight, 0]);

//   // scale x to chart width
//   var xScale = d3.scaleBand()
//       .domain(dataCategories)
//       .range([0, chartWidth])
//       .padding(0.1);

//   // create axes
//   var yAxis = d3.axisLeft(yScale);
//   var xAxis = d3.axisBottom(xScale);

//   // set x to the bottom of the chart
//   chartGroup.append("g")
//       .attr("transform", `translate(0, ${chartHeight})`)
//       .call(xAxis);

//   // set y to the y axis
//   chartGroup.append("g")
//       .call(yAxis);

//   // Create the rectangles using data binding
//   var barsGroup = chartGroup.selectAll("rect")
//       .data(dataArray)
//       .enter()
//       .append("rect")
//       .attr("x", (d, i) => xScale(dataCategories[i]))
//       .attr("y", d => yScale(d))
//       .attr("width", xScale.bandwidth())
//       .attr("height", d => chartHeight - yScale(d))
//       .attr("fill", "green");

//   // Create the event listeners with transitions
//   barsGroup.on("mouseover", function() {
//     d3.select(this)
//               .transition()
//               .duration(500)
//               .attr("fill", "red");
//   })
//       .on("mouseout", function() {
//         d3.select(this)
//               .transition()
//               .duration(500)
//               .attr("fill", "green");
//       });


// buildPlot2();


