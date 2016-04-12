var svg = d3.select(".container")
	.append("svg")
    .attr('width', '100%')
    .attr('height', '100%')
	.append("g")


svg.append("g")
	.attr("class", "slices");

var width = 480,
    height = 225,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.5);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
	.domain(["using", "not using"])
	.range(["#DE6344", "#FF8A6D"]);

function randomData (){
	var labels = color.domain();
	return labels.map(function(label){
		return { label: label, value: Math.random() }
	});
}

// var year = 2005;
// ​
// function doStep() {
//     setTimeout(yearStep, 2000);
// }
// ​
// function yearStep() {
// ​
//     doTransition(year);
//     year++;
//     if (year >= 2015) return;
//     doStep();
// ​
// }
//
// d3.select(".play")
// 	.on("click", function(){
// 		doStep();
// 	});

change(randomData());

d3.select(".play")
	.on("click", function(){
		change(randomData());
	});


function change(data) {

	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();
};
