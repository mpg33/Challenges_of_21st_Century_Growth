queue()
    .defer(d3.json, "/fetch")
    .defer(d3.json, "/tomtom")
    .defer(d3.json, "/filter_msa")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, allData, tomtom_index, msaData, mapData) {



		
		//get chartData from flask app and assign to myData
		var myData = allData;
		// console.log(allData)

		// var dateFormat = d3.time.format("%Y-%m-%d"); but we have only Year, hence change suitably
		var dateFormat = d3.time.format("%Y");
		myData.forEach(function(d) {
			// we need to convert year from numeric to string befor applying time parse function to convert to time data
			d["year"]= dateFormat.parse(d["year"].toString())
			d["GDP"] = +d["GDP"];
			d["PCI"] = +d["PCI"];
			d["pop"] = +d["pop"];
			d["pas"] = +d["pas"];
			d["aqi"] = +d["aqi"];
			d["housing"] = +d["housing"];


		});

		for(i=0; i< msaData.length; i++){
	
		//get chartData from flask app and assign to myData
		var myData1 = msaData;

		// var dateFormat = d3.time.format("%Y-%m-%d"); but we have only Year, hence change suitably
		var dateFormat = d3.time.format("%Y");
		myData1[i].forEach(function(d) {
			// we need to convert year from numeric to string befor applying time parse function to convert to time data
			d["year"]= dateFormat.parse(d["year"].toString())
			d["GDP"] = +d["GDP"];
			d["PCI"] = +d["PCI"];
			d["pop"] = +d["pop"];
			d["pas"] = +d["pas"];
			d["aqi"] = +d["aqi"];
			d["housing"] = +d["housing"];
		});

	}

	// console.log(myData)

	//Create a Crossfilter instance
	// https://animateddata.co.uk/articles/crossfilter/
	var myCross = crossfilter(myData)

	var myCross_la = crossfilter(myData1[0]);
	var myCross_sf = crossfilter(myData1[1]);
	var myCross_ny = crossfilter(myData1[2]);



	//Define Dimensions

	var msaDim = myCross.dimension(function(d) { return d["msa"]; });
	var yearDim = myCross.dimension(function(d) { return d["year"]; });
	// var PCIDim = myCross.dimension(function(d) { return d["PCI"];});
	// var GDPDim = myCross.dimension(function(d) { return d["GDP"];});
	// var POPDim = myCross.dimension(function(d) { return d["pop"];});
	// var PASDim = myCross.dimension(function(d) { return d["pas"];});
	// var AQIDim = myCross.dimension(function(d) { return d["aqi"];});
	// var HOUSINGDim = myCross.dimension(function(d) { return d["housing"];});

	var msayearDim = myCross_la.dimension(function(d) { return d["year"]; });

	


// This is a function to print crossfilter objects
	function print_filter(filter){
		var f=eval(filter);
		if (typeof(f.length) != "undefined") {}else{}
		if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
		if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
		console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
	};

// Create charting data arrays
	var GDPgroup =   yearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup =   yearDim.group().reduceSum(function(d) {return d.PCI/3/1000;});
	var POPgroup =   yearDim.group().reduceSum(function(d) {return d.pop;});
	var PASgroup =   yearDim.group().reduceSum(function(d) {return d.pas;});
	var AQIgroup =   yearDim.group().reduceSum(function(d) {return d.aqi/3;});
	var HOUSINGgroup =   yearDim.group().reduceSum(function(d) {return d.housing/3;});


	var GDPgroup_la =   msayearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup_la =   msayearDim.group().reduceSum(function(d) {return d.PCI;});
	var POPgroup_la =   msayearDim.group().reduceSum(function(d) {return d.pop;});
	var PASgroup_la =   msayearDim.group().reduceSum(function(d) {return d.pas;});
	var AQIgroup_la =   msayearDim.group().reduceSum(function(d) {return d.aqi;});
	var HOUSINGgroup_la =   msayearDim.group().reduceSum(function(d) {return d.housing;});

	var GDPgroup_sf =   msayearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup_sf =   msayearDim.group().reduceSum(function(d) {return d.PCI;});
	var POPgroup_sf =   msayearDim.group().reduceSum(function(d) {return d.pop;});
	var PASgroup_sf =   msayearDim.group().reduceSum(function(d) {return d.pas;});
	var AQIgroup_sf =   msayearDim.group().reduceSum(function(d) {return d.aqi;});
	var HOUSINGgroup_sf =   msayearDim.group().reduceSum(function(d) {return d.housing;});


	var GDPgroup_ny =   msayearDim.group().reduceSum(function(d) {return d.GDP;});
	var PCIgroup_ny =   msayearDim.group().reduceSum(function(d) {return d.PCI;});
	var POPgroup_ny =   msayearDim.group().reduceSum(function(d) {return d.pop;});
	var PASgroup_ny =   msayearDim.group().reduceSum(function(d) {return d.pas;});
	var AQIgroup_ny =   msayearDim.group().reduceSum(function(d) {return d.aqi;});
	var HOUSINGgroup_ny =   msayearDim.group().reduceSum(function(d) {return d.housing;});





	// print_filter(HOUSINGgroup)
	// print_filter(GDPgroup)
	// var pcid = myCross.dimension(function(d) { if (d.msa === 'LA_MSA') return d["PCI"];} else {return 0;});
	// print_filter(pcid)





	// Define values (to be used in charts)
	var minYear = yearDim.bottom(1)[0]["year"];
	var maxYear = yearDim.top(1)[0]["year"];

	var msaminYear = msayearDim.bottom(1)[0]["year"];
	var msamaxYear = msayearDim.top(1)[0]["year"];


	// var maxGDP = GDPDim.top(1)[0]["GDP"]
	// var minGDP = GDPDim.bottom(1)[0]["GDP"]
	// console,log("Hello")
	// console.log("hello",maxYear, minYear)
	// console.log(maxGDP-minGDP)
	print_filter(HOUSINGgroup_ny)
	print_filter(HOUSINGgroup_sf)
	print_filter(HOUSINGgroup_la)

	// var maxPCI = PCIDim.top(1)[0]["PCI"]
	// var minPCI = PCIDim.bottom(1)[0]["PCI"]
	// var maxPOP = POPDim.top(1)[0]["pop"]
	// var minPOP = POPDim.bottom(1)[0]["pop"]
	// var maxPAS = PASDim.top(1)[0]["pas"]
	// var minPAS = PASDim.bottom(1)[0]["pas"]
	// var maxAQI = AQIDim.top(1)[0]["aqi"]
	// var minAQI = AQIDim.bottom(1)[0]["aqi"]
	// var maxHousing = HousingDim.top(1)[0]["housing"]
	// var minHousing = HousingDim.bottom(1)[0]["housing"]

	// console.log(maxGDP, minGDP)
	// console.log(maxPCI, minPCI)
	// console.log(maxPOP, minPOP)
	// console.log(maxPAS, minPAS)
	// console.log(maxAQI, minAQI)

	

    //Charts
	var gdpChart = dc.lineChart("#gdp-area-chart");
	gdpChart.xUnits(function(){return 15;});


	var pciChart = dc.lineChart("#pciarea-chart");
	pciChart.xUnits(function(){return 15;});

	var popChart = dc.lineChart("#population-area-chart");
	// popChart.xUnits(function(){return 15;});

	var pasChart = dc.barChart("#pas-area-chart");
	pasChart.xUnits(function(){return 15;});

	var aqiChart = dc.barChart("#aqi-area-chart");
	aqiChart.xUnits(function(){return 15;});

	var houseChart = dc.barChart("#house-area-chart");
	houseChart.xUnits(function(){return 20;});

	gdpChart
		.width(500)
		.height(160)
		.margins({top: 10, right: 20, bottom: 20, left: 40})
		.dimension(msayearDim)
		.group(GDPgroup_la, "LA")

   		.stack(GDPgroup_sf,"SF")
	    .stack(GDPgroup_ny,"NY")

	    .legend(dc.legend().x(60).y(5).itemHeight(5).gap(5))   
	    .renderArea(true)
	    .brushOn(false)
	    .colors(['#984ea3', '#a65628', '#ff7f00' ])

		.renderHorizontalGridLines(true)

		.y(d3.scale.linear().domain([300, 3500]))

		.transitionDuration(500)
		.x(d3.time.scale().domain([msaminYear, msamaxYear]))
		// .elasticY(true)
		.xAxisLabel("")
		.yAxisLabel("")
		// .title(function(d){return "\nGross Domestic Product ($Billion): " + Math.round(d.data.value, 2); })
		.yAxis().ticks(5);

	pciChart
		.width(500)
		.height(160)
		.margins({top: 10, right: 20, bottom: 20, left: 40})
		.dimension(yearDim)
		.group(PCIgroup, "Average of LA+SF+NY")
		.legend(dc.legend().x(60).y(5).itemHeight(5).gap(5))  

		.title(function(d){return "\nPer Capita Income ($Thousands): " + Math.round(d.data.value); })
		.renderArea(true)
		.brushOn(false)
	    .colors(['#ff7f00'])
		.renderHorizontalGridLines(true)
		.y(d3.scale.linear().domain([54, 85]))
		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))
		// .elasticY(true)
		.xAxisLabel("")
		.yAxisLabel("")
		.yAxis().ticks(8)

	popChart
		.width(500)
		.height(160)
		.margins({top: 10, right: 20, bottom: 20, left: 40})
		.dimension(msayearDim)

		.group(POPgroup, "LA+SF+NY")
		.legend(dc.legend().x(60).y(5).itemHeight(5).gap(5))  

   		// .stack(POPgroup_sf,"SF")
	    // .stack(POPgroup_ny,"NY")
		.title(function(d){return "\nPopulation ($Million): " + Math.round(d.data.value); })
	    .renderArea(true)
	    .brushOn(false)
	    .colors(['#a65628'])
		.renderHorizontalGridLines(true)

		.y(d3.scale.linear().domain([32.5, 36]))

		.transitionDuration(500)
		.x(d3.time.scale().domain([msaminYear, msamaxYear]))
		// .elasticY(true)
		.xAxisLabel("")
		.yAxisLabel("")
		.yAxis().ticks(5);


	pasChart
		.width(500)
		.height(160)
		.margins({top: 10, right: 20, bottom: 20, left: 40})
		.dimension(yearDim)
		.group(PASgroup, "LA+SF+NY")
		.legend(dc.legend().x(60).y(5).itemHeight(5).gap(5))  
		.title(function(d){return "\nAir Passengers-onward journey (Million): " + Math.round(d.data.value); })
	    // .renderArea(true)
	    .brushOn(false)
	    .colors(['#e41a1c'])
		.renderHorizontalGridLines(true)

		.y(d3.scale.linear().domain([110, 160]))

		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))

		.xAxisLabel("")
		.yAxisLabel("")
		.yAxis().ticks(5);

	aqiChart
		.width(500)
		.height(160)
		.margins({top: 10, right: 20, bottom: 20, left: 40})
		.dimension(yearDim)
		.group(AQIgroup,  "Average of LA+SF+NY")
		.legend(dc.legend().x(60).y(5).itemHeight(5).gap(5))  

		.title(function(d){return "\nMedian Air Quality Index: " + Math.round(d.data.value); })
	    // .renderArea(true)
	    .brushOn(false)
	    .colors(['#A9A9B1'])
		.renderHorizontalGridLines(true)

		.y(d3.scale.linear().domain([54, 70]))

		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))

		.xAxisLabel("")
		.yAxisLabel("")
		.yAxis().ticks(5);

	houseChart
		.width(500)
		.height(160)
		.margins({top: 10, right: 20, bottom: 20, left: 40})
		.dimension(yearDim)
		.group(HOUSINGgroup, "Average of LA+SF+NY")
		.legend(dc.legend().x(60).y(5).itemHeight(5).gap(5))  
		.title(function(d){return "\nZillow House Value Index:" + Math.round(d.data.value); })
		.brushOn(false)
		.renderHorizontalGridLines(true)
	    .colors(['#a65628'])
		.y(d3.scale.linear().domain([400000, 650000]))

		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))

		.xAxisLabel("")
		.yAxisLabel("")
		.yAxis().ticks(5);


	
 	
	document.getElementById("TomTom_index_LA").value = "Los Angeles:"+(tomtom_index[0]['LA']).toString();
	document.getElementById("TomTom_index_SF").value = "San Francisco:"+(tomtom_index[0]['SF']).toString();
	document.getElementById("TomTom_index_NY").value = "New York:"+(tomtom_index[0]['NY']).toString();
	


    dc.renderAll();

};