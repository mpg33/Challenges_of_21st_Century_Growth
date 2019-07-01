queue()
    .defer(d3.json, "/gdp")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, allData) {

	for(i=0; i< allData.length-1; i++){
	
		//get chartData from flask app and assign to myData
		var myData = allData;
		// console.log(allData);
		// var dateFormat = d3.time.format("%Y-%m-%d"); but we have only Year, hence change suitably
		var dateFormat = d3.time.format("%Y");
		myData[i].forEach(function(d) {
			// we need to convert year from numeric to string befor applying time parse function to convert to time data
			d["year"]= dateFormat.parse(d["year"].toString())
			d["GDP"] = +d["GDP"];
			d["PCI"] = +d["PCI"];
			d["pop"] = +d["pop"];
			d["pas"] = +d["pas"];
			d["aqi"] = +d["aqi"];
		});

	}

	console.log(myData)
	//Create a Crossfilter instance
	var myCross = crossfilter(myData)

	var myCross_la = crossfilter(myData[0]);
	var myCross_sf = crossfilter(myData[1]);
	var myCross_ny = crossfilter(myData[2]);

	//Define Dimensions

	// var msaDim = myCross.dimension(function(d) { return d["msa"]; });
	var yearDim = myCross_la.dimension(function(d) { return d["year"]; });

	var GDPDim_la = myCross_la.dimension(function(d) { return d["GDP"]; });
	var PCIDim_la = myCross_la.dimension(function(d) { return d["PCI"]; });
	var POPDim_la = myCross_la.dimension(function(d) { return d["PCI"]; });
	var PASDim_la = myCross_la.dimension(function(d) { return d["PCI"]; });
	var AQIDim_la = myCross_la.dimension(function(d) { return d["PCI"]; });

	var GDPDim_sf = myCross_sf.dimension(function(d) { return d["GDP"]; });
	var PCIDim_sf = myCross_sf.dimension(function(d) { return d["PCI"]; });
	var POPDim_sf = myCross_sf.dimension(function(d) { return d["PCI"]; });
	var PASDim_sf = myCross_sf.dimension(function(d) { return d["PCI"]; });
	var AQIDim_sf = myCross_sf.dimension(function(d) { return d["PCI"]; });

	var GDPDim_ny = myCross_ny.dimension(function(d) { return d["GDP"]; });
	var PCIDim_ny = myCross_ny.dimension(function(d) { return d["PCI"]; });
	var POPDim_ny = myCross_ny.dimension(function(d) { return d["PCI"]; });
	var PASDim_ny = myCross_ny.dimension(function(d) { return d["PCI"]; });
	var AQIDim_ny = myCross_ny.dimension(function(d) { return d["PCI"]; });

	console.log(GDPDim_la.top(1)[0]["GDP"]);
	
	var PCIDim = myCross.dimension(function(d) {return d[0]["PCI"], d[1]["PCI"]})


	function print_filter(filter){
		var f=eval(filter);
		if (typeof(f.length) != "undefined") {}else{}
		if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
		if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
		console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
	}


	// var la_filter = msaDim.filter("LA_MSA");
	// var la_GDPgroup = yearDim.group().reduceSum(function(d) {return d.GDP;});
	// var la_PCIgroup = yearDim.group().reduceSum(function(d) {return d.PCI;});

	// // print_filter(la_filter);
	// print_filter(la_GDPgroup);
	// print_filter(la_PCIgroup);

	// msaDim.filterAll();
	// print_filter(la_GDPgroup);
	// print_filter(yearDim.group().reduceSum(function(d) {return d.GDP;}););
	

	// var lagdp = msaDim.filter("LA_MSA");
	// print_filter(lagdp)
	// print_filter(lagdp.group());


	//Calculate metrics
	// var numYear = yearDim.group(); group
	// var MSAgroup_la = msaDim.group();
	// var numGDP_la = GDPDim_la.group();
	// var numPCI_la = PCIDim_la.group();
	var GDPgroup_la =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup_la =   yearDim.group().reduceSum(function(d) {return d.PCI;});
	var POPgroup_la =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PASgroup_la =   yearDim.group().reduceSum(function(d) {return d.PCI;});
	var AQIgroup_la =   yearDim.group().reduceSum(function(d) {return d.GDP;});

	var GDPgroup_sf =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup_sf =   yearDim.group().reduceSum(function(d) {return d.PCI;});
	var POPgroup_sf =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PASgroup_sf =   yearDim.group().reduceSum(function(d) {return d.PCI;});
	var AQIgroup_sf =   yearDim.group().reduceSum(function(d) {return d.GDP;});

	var GDPgroup_ny =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup_ny =   yearDim.group().reduceSum(function(d) {return d.PCI;});
	var POPgroup_ny =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PASgroup_ny =   yearDim.group().reduceSum(function(d) {return d.PCI;});
	var AQIgroup_ny =   yearDim.group().reduceSum(function(d) {return d.GDP;});

	print_filter(AQIgroup_la);
	// var all_la = myCross_la.groupAll();
	var PCIgroup = yearDim.group().reduceSum(function(d) {return d.PCI})


	//Define values (to be used in charts)
	var minYear = yearDim.bottom(1)[0]["year"];
	var maxYear = yearDim.top(1)[0]["year"];

	
	// print_filter(GDPgroup_la);


    //Charts
	// var gdpChart = dc.lineChart("#time-chart");
	// gdpChart.xUnits(function(){return 15;});

	var pciChart = dc.lineChart("#resource-type-row-chart1");
	pciChart.xUnits(function(){return 15;});
	// var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
	// var usChart = dc.geoChoroplethChart("#us-chart");
	// var numberProjectsND = dc.numberDisplay("#number-projects-nd");
	// var totalDonationsND = dc.numberDisplay("#total-donations-nd");

	// numberProjectsND
	// 	.formatNumber(d3.format("d"))
	// 	.valueAccessor(function(d){return d; })
	// 	.group(all);

	// totalDonationsND
	// 	.formatNumber(d3.format("d"))
	// 	.valueAccessor(function(d){return d; })
	// 	.group(totalDonations)
	// 	.formatNumber(d3.format(".3s"));

	// gdpChart
	// 	.width(400)
	// 	.height(160)
	// 	.margins({top: 10, right: 20, bottom: 30, left: 40})
	// 	.dimension(yearDim)
	// 	.group(GDPgroup_la, "LA")

 //   		.stack(GDPgroup_sf,"SF")
	//     .stack(GDPgroup_ny,"NY")
	//     // .valueAccessor(function (d) {return d.value};
	//     .legend(dc.legend().x(60).y(5).itemHeight(5).gap(5))   
	//     .renderArea(true)
	// 	.renderHorizontalGridLines(true)
	// 	.transitionDuration(500)
	// 	.x(d3.time.scale().domain([minYear, maxYear]))
	// 	.elasticY(true)
	// 	.xAxisLabel("Year")
	// 	.yAxisLabel("")
	// 	.yAxis().ticks(10);

	pciChart
		.width(400)
		.height(150)
		.margins({top: 10, right: 20, bottom: 30, left: 40})
		.dimension(yearDim)
		.group(PCIgroup)
		.renderHorizontalGridLines(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxisLabel("")
		.yAxis().ticks(4);


  // // time graph
  // timeChart.width(960)
  //   .height(150)
  //   .margins({top: 10, right: 10, bottom: 20, left: 40})
  //   .dimension(volumeByHour)
  //   .group(volumeByHourGroup)
  //   .transitionDuration(500)
  //   .elasticY(true)
  //   .x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)]))
  //   .xAxis();
// var payments = crossfilter([
//   {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
//   {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
//   {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
//   {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
//   {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
//   {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
//   {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
//   {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
//   {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
//   {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
//   {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
//   {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
// ]);

// var dateDim = payments.dimension(function(d) { return d["date"]; });
// console.log(crossfilter.size())
	// resourceTypeChart
 //        .width(300)
 //        .height(250)
 //        .dimension(resourceTypeDim)
 //        .group(numProjectsByResourceType)
 //        .xAxis().ticks(4);

	// povertyLevelChart
	// 	.width(300)
	// 	.height(250)
 //        .dimension(povertyLevelDim)
 //        .group(numProjectsByPovertyLevel)
 //        .xAxis().ticks(4);


	// usChart.width(1000)
	// 	.height(330)
	// 	// .dimension(stateDim)
	// 	// .group(totalDonationsByState)
	// 	.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
	// 	.colorDomain([0, max_state])
	// 	.overlayGeoJson(statesJson["features"], "state", function (d) {
	// 		return d.properties.name;
	// 	})
	// 	.projection(d3.geo.albersUsa()
 //    				.scale(600)
 //    				.translate([340, 150]))
	// 	.title(function (p) {
	// 		return "State: " + p["key"]
	// 				+ "\n"
	// 				+ "Urban Growth: " + Math.round(p["value"]) + " $";
	// 	})

    dc.renderAll();

};