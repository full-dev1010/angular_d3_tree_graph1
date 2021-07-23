var app = angular.module('AngularD3App', ['ngAnimate', 'ui.bootstrap']);

app.controller('D3ChartController', ['$scope', function($scope){
	
	//Hide and Display section when JS libs are available or not.
    jQuery("#hideIfNoJS").removeClass("hidden");
    jQuery("#hideIfJS").addClass("hidden");

    $scope.isCollapsed = true;

    $scope.sales = {};

    $scope.showEdit = false;

    //Object to hold Sales Data
	$scope.salesPersons = [ 
		{name : 'Sheldon', saleByBrand : [
				{brand : "LG", quantity : 121},
				{brand : "Apple", quantity : 24},
				{brand : "Samsung", quantity : 140},
				{brand : "HTC", quantity : 67},
				{brand : "Sony", quantity : 45},
				{brand : "Microsoft", quantity : 205}
			] 
		}, 
		{name : 'Leonard', saleByBrand : [
				{brand : "LG", quantity : 41},
				{brand : "Apple", quantity : 14},
				{brand : "Samsung", quantity : 80},
				{brand : "HTC", quantity : 37},
				{brand : "Sony", quantity : 55},
				{brand : "Microsoft", quantity : 65}
			] 
		}, 
		{name : 'Rajesh', saleByBrand : [
				{brand : "LG", quantity : 61},
				{brand : "Apple", quantity : 84},
				{brand : "Samsung", quantity : 160},
				{brand : "HTC", quantity : 27},
				{brand : "Sony", quantity : 45},
				{brand : "Microsoft", quantity : 45}
			] 
		}, 
		{name : 'Howard', saleByBrand : [
				{brand : "LG", quantity : 250},
				{brand : "Apple", quantity : 94},
				{brand : "Samsung", quantity : 140},
				{brand : "HTC", quantity : 57},
				{brand : "Sony", quantity : 75},
				{brand : "Microsoft", quantity : 85}
			] 
		}, 
		{name : 'Penny', saleByBrand : [
				{brand : "LG", quantity : 50},
				{brand : "Apple", quantity : 14},
				{brand : "Samsung", quantity : 40},
				{brand : "HTC", quantity : 27},
				{brand : "Sony", quantity : 85},
				{brand : "Microsoft", quantity : 25}
			] 
		} ];
    
    $scope.addSalesMan = function () {
  		
  		//console.log($scope.salesPersons);
       	
       	var addToArray=true;
       	//initialize saleByBrand array with Brands and set all quantity to 0.
       	var saleByBrandEmptyArr = [
					       			{brand : "LG", quantity : 0},
									{brand : "Apple", quantity : 0},
									{brand : "Samsung", quantity : 0},
									{brand : "HTC", quantity : 0},
									{brand : "Sony", quantity : 0},
									{brand : "Microsoft", quantity : 0}
								];

       	var salesMan = {name : $scope.salesMan.name, saleByBrand : saleByBrandEmptyArr };

       	//Add new Sales Person if it doesnt alredy exists
		for(var i=0;i<$scope.salesPersons.length;i++){
		    if($scope.salesPersons[i].name===$scope.salesMan.name){
		        addToArray=false;
		    }
		}
		if(addToArray){
		    $scope.salesPersons.push(salesMan);
		}
		$scope.salesMan = '';
		$scope.sales={};

		//console.log($scope.salesPersons);
    };

    //Update salesPerson obj by passing the index of salesPerson{}[] and the new data in sales obj
    $scope.updateSalesMan = function (index, sales) {
    	
    	//array of new sales data
		var sales = sales.updated;		
		//array of targeted old data
		var editedPersonByBrand = $scope.salesPersons[index].saleByBrand;

		//set data from new sales array into targeted old data
		angular.forEach(sales, function(value, key){

			editedPersonByBrand[key].quantity = parseInt(sales[key]);

		});
   		//set updated targeted data into salesPersons obj
		$scope.salesPersons[index].saleByBrand = editedPersonByBrand;
		// console.log($scope.salesPersons); //for debugging
    };


    $scope.removeSalesMan = function (index) {
      $scope.salesPersons.splice(index, 1);
    };

	// d3.select(window).on('resize', resize); 
	// function resize (argument) {
	// 	var screenWidth = parseInt(d3.select(window.screen.width)); 
	// 	var currentWidth = parseInt(d3.select(window.innerWidth));
	// 	var scaleSvg = currentWidth/screenWidth;
	// 	//var height = parseInt(d3.select(window.innerHeight));
	// 	//console.log("Windows Size is changed by : " + screenWidth + " * " + currentWidth +" * " + scaleSvg);
	// 	var pieChartSvg = d3.select("#pieChart svg");
	// 	//pieChartSvg.attr("width", width*scaleSvg);

	// 	var pieChart = d3.select("#pieChart svg g");
	// 	pieChart.attr("transform", "scale("+scaleSvg+")");

	// 	var barChart = d3.select("#barChart svg g");
	// 	barChart.attr("transform", "scale("+scaleSvg+")");

	// 	var lineChart = d3.select("#lineChart svg g");
	// 	lineChart.attr("transform", "scale("+scaleSvg+")");
	// }

	$scope.drawD3Chart = function(argument) {	
		
		//Remove the plotted chart from DOM to generate new chart on Update.
	    jQuery("#pieChart").remove();
	    jQuery("#barChart").remove();
	    jQuery("#lineChart").remove();

		d3.select("#charts").append("div").attr("id", "pieChart");
		d3.select("#charts").append("div").attr("id", "barChart");
		d3.select("#charts").append("div").attr("id", "lineChart");

		/*
		################ FORMATS ##################
		-------------------------------------------
		*/

		var 	formatAsPercentage = d3.format("%"),
				formatAsPercentage1Dec = d3.format(".1%"),
				formatAsInteger = d3.format(","),
				fsec = d3.time.format("%S s"),
				fmin = d3.time.format("%M m"),
				fhou = d3.time.format("%H h"),
				fwee = d3.time.format("%a"),
				fdat = d3.time.format("%d d"),
				fmon = d3.time.format("%b")
				;

		//Formaing data for PieChart
		var datasetPieChart = [];
		angular.forEach($scope.salesPersons, function(value, key){
			var totalSales = 0;
			
			angular.forEach(value.saleByBrand, function(value, key){
				totalSales = totalSales + value.quantity;
			});

			datasetPieChart.push( {category: value.name, measure: totalSales} );
		});

		//Formaing data for BarChart and LineChart
		var datasetBarLineChart = [];
		var brandNames = [];

		angular.forEach($scope.salesPersons, function(value, key){
			var groupName = value.name;
			
			angular.forEach(value.saleByBrand, function(value, key){
				datasetBarLineChart.push( { group: groupName, category: value.brand, measure: value.quantity } );
				brandNames.push(value.brand);
			});

		});
		// console.log("datasetBarLineChart before");
		// console.log(datasetBarLineChart);

		brandNames = d3.set(brandNames).values();

		var datasetBarLineChartForAll = [];

		for (var i = 0; i < brandNames.length; i++) {
			var measureVal = 0;
			for (var j =  0; j < datasetBarLineChart.length; j++) {
				
				if (brandNames[i] === datasetBarLineChart[j].category) {
					measureVal = measureVal + datasetBarLineChart[j].measure;
				};
			};

			var overallSale = { group: "All", category: brandNames[i], measure : measureVal };
			datasetBarLineChartForAll.push(overallSale);
		};
		// console.log("datasetBarLineChartForAll");
		// console.log(datasetBarLineChartForAll);

		datasetBarLineChart = datasetBarLineChart.concat(datasetBarLineChartForAll);
//Same For Loop logic, but not wokring :
/*		angular.forEach(brandNames, function(value, key){

			var measureVal = 0;
			angular.forEach(datasetBarLineChart, function(value, key){
				if (value.category === brandNames[key]) {
					console.log("value.category : "+ value.category + "brandNames[key]"+brandNames[key]);
					measureVal = measureVal + value.measure;
				};
			});
			console.log(brandNames[key] + " - measureVal : "+ measureVal);
			var overallSale = { group: "All", category: brandNames[key], measure : measureVal };
			
			datasetBarLineChart.push(overallSale);
		});
*/
		// console.log("datasetBarLineChart after");
		// console.log(datasetBarLineChart);
		

		


		/*
		############# PIE CHART ###################
		-------------------------------------------
		*/



		function dsPieChart(data){

			var dataset = data;

			var total = d3.sum(dataset, function(d) {return d.measure; });

			var    width = 400,
				   height = 400,
				   outerRadius = Math.min(width, height) / 2,
				   innerRadius = outerRadius * .999,   
				   // for animation
				   innerRadiusFinal = outerRadius * .5,
				   innerRadiusFinal3 = outerRadius* .45,
				   color = d3.scale.category20()    //builtin range of colors
				   ;
			    
			var vis = d3.select("#pieChart")
			     .append("svg:svg")              //create the SVG element inside the <body>
			     .append("g")					//add g to use Scale on window resize
			     .attr("transform", "scale(1)")
			     .data([dataset])                   //associate our data with the document
			         .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
			         .attr("height", height)
			     		.append("svg:g")                //make a group to hold our pie chart
			         .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
						;
						
		   var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
		        	.outerRadius(outerRadius).innerRadius(innerRadius);
		   
		   // for animation
		   var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
			var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

		   var pie = d3.layout.pie()           //this will create arc data for us given a list of values
		        .value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

		   var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
		        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
		            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
		               .attr("class", "slice")    //allow us to style things in the slices (like text)
		               .on("mouseover", mouseover)
		    				.on("mouseout", mouseout)
		    				.on("click", up)
		    				;
		    				
		        arcs.append("svg:path")
		               .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
		               .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
							.append("svg:title") //mouseover title showing the figures
						    .text(function(d) { return d.data.category + " : " 
						   		+ formatAsPercentage((d.data.measure / total)) });						

		        d3.selectAll("g.slice").selectAll("path").transition()
					    .duration(750)
					    .delay(10)
					    .attr("d", arcFinal )
					    ;
			
			  // Add a label to the larger arcs, translated to the arc centroid and rotated.
			  // source: http://bl.ocks.org/1305337#index.html
			  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
			  		.append("svg:text")
			      .attr("dy", ".35em")
			      .attr("text-anchor", "middle")
			      .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
			      //.text(function(d) { return formatAsPercentage(d.value); })
			      .text(function(d) { return d.data.category /*+ " : " + d.data.measure */; })
			      ;
			   
			   // Computes the label angle of an arc, converting from radians to degrees.
				function angle(d) {
				    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
				    return a > 90 ? a - 180 : a;
				}
				    
				
				// Pie chart title			
				vis.append("svg:text")
			     	.attr("dy", ".35em")
			      .attr("text-anchor", "middle")
			      .text("Mobiles Sold")
			      .attr("class","title")
			      ;		    


				
			function mouseover() {
			  d3.select(this).select("path").transition()
			      .duration(750)
			        		//.attr("stroke","red")
			        		//.attr("stroke-width", 1.5)
			        		.attr("d", arcFinal3)
			        		;
			}
			
			function mouseout() {
			  d3.select(this).select("path").transition()
			      .duration(750)
			        		//.attr("stroke","blue")
			        		//.attr("stroke-width", 1.5)
			        		.attr("d", arcFinal)
			        		;
			}
			
			function up(d, i) {
			
						/* update bar chart when salesMan selects piece of the pie chart */
						//updateBarChart(dataset[i].category);
						updateBarChart(d.data.category, color(i));
						updateLineChart(d.data.category, color(i));
					 
			}
		}

		dsPieChart(datasetPieChart);

		/*
		############# BAR CHART ###################
		-------------------------------------------
		*/



		var datasetBarChart = datasetBarLineChart;

		// set initial group value
		var group = "All";

		function datasetBarChosen(group) {
			var ds = [];
			for (x in datasetBarChart) {
				 if(datasetBarChart[x].group==group){
				 	ds.push(datasetBarChart[x]);
				 } 
				}
			return ds;
		}


		function dsBarChartBasics() {

				var margin = {top: 30, right: 5, bottom: 20, left: 50},
				width = 500 - margin.left - margin.right,
			   height = 250 - margin.top - margin.bottom,
				colorBar = d3.scale.category20(),
				barPadding = 1
				;
				
				return {
					margin : margin, 
					width : width, 
					height : height, 
					colorBar : colorBar, 
					barPadding : barPadding
				}			
				;
		}

		function dsBarChart() {

			var firstDatasetBarChart = datasetBarChosen(group);         	
			
			var basics = dsBarChartBasics();
			
			var margin = basics.margin,
				width = basics.width,
			   height = basics.height,
				colorBar = basics.colorBar,
				barPadding = basics.barPadding
				;
							
			var 	xScale = d3.scale.linear()
								.domain([0, firstDatasetBarChart.length])
								.range([0, width])
								;
								
			// Create linear y scale 
			// Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
			// get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
			var yScale = d3.scale.linear()
					// use the max funtion to derive end point of the domain (max value of the dataset)
					// do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
				   .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])
				   // As coordinates are always defined from the top left corner, the y position of the bar
				   // is the svg height minus the data value. So you basically draw the bar starting from the top. 
				   // To have the y position calculated by the range function
				   .range([height, 0])
				   ;
			
			//Create SVG element
			
			var svg = d3.select("#barChart")
					.append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				    .attr("id","barChartPlot")
				    ;
			var groupBarChart = svg.append("g")
					.attr("transform", "scale(1)")
					;

			var plot = groupBarChart
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				    ;
			            
			plot.selectAll("rect")
				   .data(firstDatasetBarChart)
				   .enter()
				   .append("rect")
					.attr("x", function(d, i) {
					    return xScale(i);
					})
				   .attr("width", width / firstDatasetBarChart.length - barPadding)   
					.attr("y", function(d) {
					    return yScale(d.measure);
					})  
					.attr("height", function(d) {
					    return height-yScale(d.measure);
					})
					.attr("fill", "lightgrey")
					;
			
				
			// Add y labels to plot	
			
			plot.selectAll("text")
			.data(firstDatasetBarChart)
			.enter()
			.append("text")
			.text(function(d) {
					return formatAsInteger(d3.round(d.measure));
			})
			.attr("text-anchor", "middle")
			// Set x position to the left edge of each bar plus half the bar width
			.attr("x", function(d, i) {
					return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
			})
			.attr("y", function(d) {
					return yScale(d.measure) + 14;
			})
			.attr("class", "yAxis")
			/* moved to CSS			   
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "white")
			*/
			;
			
			// Add x labels to chart	
			
			var xLabels = groupBarChart
				    .append("g")
				    .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
				    ;
			
			xLabels.selectAll("text.xAxis")
				  .data(firstDatasetBarChart)
				  .enter()
				  .append("text")
				  .text(function(d) { return d.category;})
				  .attr("text-anchor", "middle")
					// Set x position to the left edge of each bar plus half the bar width
								   .attr("x", function(d, i) {
								   		return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
								   })
				  .attr("y", 15)
				  .attr("class", "xAxis")
				  //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
				  ;			
			 
			// Title
			
			groupBarChart.append("text")
				.attr("x", (width + margin.left + margin.right)/2)
				.attr("y", 15)
				.attr("class","title")				
				.attr("text-anchor", "middle")
				.text("Overall Mobiles Sold 2015")
				;
		}

		dsBarChart();

		 /* ** UPDATE CHART ** */
		 
		/* updates bar chart on request */

		function updateBarChart(group, colorChosen) {
			
				var currentDatasetBarChart = datasetBarChosen(group);
				
				var basics = dsBarChartBasics();
			
				var margin = basics.margin,
					width = basics.width,
				   height = basics.height,
					colorBar = basics.colorBar,
					barPadding = basics.barPadding
					;
				
				var 	xScale = d3.scale.linear()
					.domain([0, currentDatasetBarChart.length])
					.range([0, width])
					;
				
					
				var yScale = d3.scale.linear()
			      .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
			      .range([height,0])
			      ;
			      
			   var svg = d3.select("#barChart svg");
			      
			   var plot = d3.select("#barChartPlot")
			   	.datum(currentDatasetBarChart)
				   ;
			
			  		/* Note that here we only have to select the elements - no more appending! */
			  	plot.selectAll("rect")
			      .data(currentDatasetBarChart)
			      .transition()
					.duration(750)
					.attr("x", function(d, i) {
					    return xScale(i);
					})
				   .attr("width", width / currentDatasetBarChart.length - barPadding)   
					.attr("y", function(d) {
					    return yScale(d.measure);
					})  
					.attr("height", function(d) {
					    return height-yScale(d.measure);
					})
					.attr("fill", colorChosen)
					;
				
				plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
					.data(currentDatasetBarChart)
					.transition()
					.duration(750)
				   .attr("text-anchor", "middle")
				   .attr("x", function(d, i) {
				   		return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
				   })
				   .attr("y", function(d) {
				   		return yScale(d.measure) + 14;
				   })
				   .text(function(d) {
						return formatAsInteger(d3.round(d.measure));
				   })
				   .attr("class", "yAxis")					 
				;
				

				svg.selectAll("text.title") // target the text element(s) which has a title class defined
					.attr("x", (width + margin.left + margin.right)/2)
					.attr("y", 15)
					.attr("class","title")				
					.attr("text-anchor", "middle")
					.text(group + "'s Mobiles Sale in 2015")
				;
		}


		/*
		############# LINE CHART ##################
		-------------------------------------------
		*/

		var datasetLineChart = datasetBarLineChart;

		// set initial category value
		var group = "All";

		function datasetLineChartChosen(group) {
			var ds = [];
			for (x in datasetLineChart) {
				 if(datasetLineChart[x].group==group){
				 	ds.push(datasetLineChart[x]);
				 } 
				}
			return ds;
		}

		function dsLineChartBasics() {

			var margin = {top: 20, right: 10, bottom: 0, left: 50},
			    width = 500 - margin.left - margin.right,
			    height = 150 - margin.top - margin.bottom
			    ;
				
				return {
					margin : margin, 
					width : width, 
					height : height
				}			
				;
		}


		function dsLineChart() {

			var firstDatasetLineChart = datasetLineChartChosen(group);    

			var totalData = 0;

			for (var i = firstDatasetLineChart.length - 1; i >= 0; i--) {
				totalData = totalData + firstDatasetLineChart[i].measure;
			};
			
			var basics = dsLineChartBasics();
			
			var margin = basics.margin,
				width = basics.width,
			   height = basics.height
				;

			var xScale = d3.scale.linear()
			    .domain([0, firstDatasetLineChart.length-1])
			    .range([0, width])
			    ;

			var yScale = d3.scale.linear()
			    .domain([0, d3.max(firstDatasetLineChart, function(d) { return d.measure; })])
			    .range([height, 0])
			    ;
			
			var line = d3.svg.line()
			    //.x(function(d) { return xScale(d.category); })
			    .x(function(d, i) { return xScale(i); })
			    .y(function(d) { return yScale(d.measure); })
			    ;
			
			var svg = d3.select("#lineChart").append("svg")
				.append("g")					//add g to use Scale on window resize
			    .attr("transform", "scale(1)")
			    .datum(firstDatasetLineChart)
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    // create group and move it so that margins are respected (space for axis and title)
			    
			var plot = svg
			    .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			    .attr("id", "lineChartPlot")
			    ;

				/* descriptive titles as part of plot -- start */
			var dsLength=firstDatasetLineChart.length;

			//console.log(firstDatasetLineChart);

			plot.append("text")
				.text(totalData)
				//.text("10000")
				.attr("id","lineChartTitle2")
				.attr("x",width/2)
				.attr("y",height/2)	
				;
			/* descriptive titles -- end */
			    
			plot.append("path")
			    .attr("class", "line")
			    .attr("d", line)	
			    // add color
				.attr("stroke", "lightgrey")
			    ;
			  
			plot.selectAll(".dot")
			    .data(firstDatasetLineChart)
			  	 .enter().append("circle")
			    .attr("class", "dot")
			    //.attr("stroke", function (d) { return d.measure==datasetMeasureMin ? "red" : (d.measure==datasetMeasureMax ? "green" : "steelblue") } )
			    .attr("fill", function (d) { return d.measure==d3.min(firstDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(firstDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
			    //.attr("stroke-width", function (d) { return d.measure==datasetMeasureMin || d.measure==datasetMeasureMax ? "3px" : "1.5px"} )
			    .attr("cx", line.x())
			    .attr("cy", line.y())
			    .attr("r", 3.5)
			    .attr("stroke", "lightgrey")
			    .append("title")
			    .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })
			    ;

			svg.append("text")
				.text("Mobiles Sold in - 2015")
				.attr("id","lineChartTitle1")	
				.attr("x",margin.left + ((width + margin.right)/2))
				.attr("y", 10)
				;

		}

		dsLineChart();


		 /* ** UPDATE CHART ** */
		 
		/* updates bar chart on request */
		function updateLineChart(group, colorChosen) {

			var currentDatasetLineChart = datasetLineChartChosen(group);   
			//console.log(currentDatasetLineChart);
			var totalData = 0;

			for (var i = currentDatasetLineChart.length - 1; i >= 0; i--) {
				totalData = totalData + currentDatasetLineChart[i].measure;
			};

			var basics = dsLineChartBasics();
			
			var margin = basics.margin,
				width = basics.width,
			   height = basics.height
				;

			var xScale = d3.scale.linear()
			    .domain([0, currentDatasetLineChart.length-1])
			    .range([0, width])
			    ;

			var yScale = d3.scale.linear()
			    .domain([0, d3.max(currentDatasetLineChart, function(d) { return d.measure; })])
			    .range([height, 0])
			    ;
			
			var line = d3.svg.line()
		    .x(function(d, i) { return xScale(i); })
		    .y(function(d) { return yScale(d.measure); })
		    ;

		   var plot = d3.select("#lineChartPlot")
		   	.datum(currentDatasetLineChart)
			   ;
			   
			/* descriptive titles as part of plot -- start */
			var dsLength=currentDatasetLineChart.length;
			
			plot.select("text")
				.text(totalData)
				;
			/* descriptive titles -- end */
			   
			plot
			.select("path")
				.transition()
				.duration(750)			    
			   .attr("class", "line")
			   .attr("d", line)	
			   // add color
				.attr("stroke", colorChosen)
			   ;
			   
			var path = plot
				.selectAll(".dot")
			   .data(currentDatasetLineChart)
			   .transition()
				.duration(750)
			   .attr("class", "dot")
			   .attr("fill", function (d) { return d.measure==d3.min(currentDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(currentDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
			   .attr("cx", line.x())
			   .attr("cy", line.y())
			   .attr("r", 3.5)
			   // add color
				.attr("stroke", colorChosen)
			   ;
			   
			   path
			   .selectAll("title")
			   .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })	 
			   ;  

		}

	};



}]);
