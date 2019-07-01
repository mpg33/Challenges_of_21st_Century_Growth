queue()
    .defer(d3.json, "/gdp")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, allData) {
	
	//get chartData from flask app and assign to myData
	var myData = allData[0];
	console.log(allData[0]);
	// var dateFormat = d3.time.format("%Y-%m-%d"); but we have only Year, hence change suitably
	var dateFormat = d3.time.format("%Y");
	myData.forEach(function(d) {
		// we need to convert year from numeric to string befor applying time parse function to convert to time data
		d["year"]= dateFormat.parse(d["year"].toString())
		d["GDP"] = +d["GDP"];
		d["PCI"] = +d["PCI"];
		d["msa"] = d["msa"];
	});

	//Create a Crossfilter instance
	var myCross = crossfilter(myData);

	//Define Dimensions

	var msaDim = myCross.dimension(function(d) { return d["msa"]; });
	var yearDim = myCross.dimension(function(d) { return d["year"]; });
	var GDPDim = myCross.dimension(function(d) { return d["GDP"]; });
	var PCIDim = myCross.dimension(function(d) { return d["PCI"]; });

	console.log(GDPDim.top(1)[0]["GDP"]);
	
	


	function print_filter(filter){
		var f=eval(filter);
		if (typeof(f.length) != "undefined") {}else{}
		if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
		if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
		console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
	}


	var la_filter = msaDim.filter("LA_MSA");
	var la_GDPgroup = yearDim.group().reduceSum(function(d) {return d.GDP;});
	var la_PCIgroup = yearDim.group().reduceSum(function(d) {return d.PCI;});

	// print_filter(la_filter);
	print_filter(la_GDPgroup);
	print_filter(la_PCIgroup);

	msaDim.filterAll();
	print_filter(la_GDPgroup);
	// print_filter(yearDim.group().reduceSum(function(d) {return d.GDP;}););
	

	// var lagdp = msaDim.filter("LA_MSA");
	// print_filter(lagdp)
	// print_filter(lagdp.group());


	//Calculate metrics
	// var numYear = yearDim.group(); group
	var MSAgroup = msaDim.group();
	var numGDP = GDPDim.group();
	var numPCI = PCIDim.group();
	var GDPgroup =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup =   yearDim.group().reduceSum(function(d) {return d.PCI;});

	var all = myCross.groupAll();


	//Define values (to be used in charts)
	var minYear = yearDim.bottom(1)[0]["year"];
	var maxYear = yearDim.top(1)[0]["year"];

	
	print_filter(GDPgroup);


    //Charts
	var gdpChart = dc.barChart("#time-chart");
	gdpChart.xUnits(function(){return 15;});

	var pciChart = dc.barChart("#resource-type-row-chart1");
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

	gdpChart
		.width(400)
		.height(150)
		.margins({top: 10, right: 20, bottom: 30, left: 40})
		.dimension(yearDim)
		.group(GDPgroup)
		.renderHorizontalGridLines(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxisLabel("")
		.yAxis().ticks(4);

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