//set margins
	var margin = {top: 20, right: 80, bottom: 30, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

//attach svg to page
// Define the div for the tooltip
	var tool = d3.select(".container").append("div")
    	.attr("class", "tooltip")
    	.style("opacity", 0);

	var svg = d3.select(".container").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//parsing data
	var parseDate = d3.time.format("%Y").parse;

//setting ranges
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);


	var color = d3.scale.ordinal()
  .domain(["All","18-29","30-49","50-64","65+"])
  .range(["#b0d5c3", "#ff8a6d" , "#de6344", "#CE3D33", "#6F020E"]);

//axes defined
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

//lines defined
	var line = d3.svg.line()
	    .interpolate("linear")
	    .x(function(d) { return x(d.year); })
	    .y(function(d) { return y(d.percentage); });

//pull in data from file
	d3.tsv("media.txt", function(error, data) {
	  if (error) throw error;

	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

	  data.forEach(function(d) {
	    d.year = parseDate(d.year);
	  });

	  var ages = color.domain().map(function(name) {
	    return {
	      name: name,
	      values: data.map(function(d) {
	        return {year: d.year, percentage: +d[name]};
	      })
	    };
	  });

	  x.domain(d3.extent(data, function(d) { return d.year; }));

	  y.domain([
	    d3.min(ages, function(c) { return d3.min(c.values, function(v) { return v.percentage; }); }),
	    d3.max(ages, function(c) { return d3.max(c.values, function(v) { return v.percentage; }); })
	  ]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Percent of users");

	  var age = svg.selectAll(".age")
	      .data(ages)
	    .enter().append("g")
	      .attr("class", "age");

	  age.append("path")
	      .attr("class", "line")
	      .attr("d", function(d) { return line(d.values); })
	      .style("stroke", function(d) { return color(d.name); });

		age.selectAll(".age")
    .data(function (d) { return d.values; })
		.enter().append("circle")
			.attr("class", "dot")
	    .attr("r", 5)
	    .attr("cx", function(d) { return x(d.year); })
	    .attr("cy", function(d) { return y(d.percentage); })
			.style("fill", function(d) { return color(d.name); })
			.on("mouseover", function(d) {
	        tool.transition()
	            .duration(200)
	            .style("opacity", .9);
	        tool.html(d.percentage + "%")
						.style("left", d3.select(this).attr("cx") + "px")
						.style("top", d3.select(this).attr("cy") + "px");
	        })
	    .on("mouseout", function(d) {
	        tool.transition()
	            .duration(500)
	            .style("opacity", 0);
	    });

	  age.append("text")
	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.percentage) + ")"; })
	      .attr("x", 3)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name; });
	});
