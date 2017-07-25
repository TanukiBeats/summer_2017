//Setting some variables to be used later on 
var margin = {top: 50, right: 300, bottom: 50, left: 50 },
	outerWidth = 1050,
	outerHeight = 500,
	width = outerWidth - margin.left - margin.right,
	height = outerHeight - margin.top - margin.bottom;
	
//Making the scale for the x-axis
var x = d3.scale.linear()
	.range([0, width])
	.nice();

//Making the scale for the y-axis
var y = d3.scale.linear()
	.range([height, 0])
	.nice();
	
//Defining more variables
var xCat = "Calories", //x-category is calories
	yCat = "Potassium", //y-category is potassium
	rCat = "Protein (g)", //radius of datapoint is defined by protein content
	colorCat = "Manufacturer";
	
//This first command is to convert the .csv file into an array of objects
//ex. {city:" "seattle", state: "WA", population: "652405", land area: "83.9"}	
d3.csv("cereal.csv", function(data) {
	data.forEach(function(d) {
//In this section, we are doing type conversions. In the array, numbers became strings which is something which we do *NOT* want
//The property names for numbers are converted from strings to numbers. The reason some lines have square brackets is becuase the property names have spaces, the ones which don't have spaces don't need square brackets.  
		d.Calories = +d.Calories; 
		d.Carbs = +d.Carbs; 
		d["Cups per Serving"] = +d["Cups per Serving"];
		d["Dietary Fiber"] = +d["Dietary Fiber"];
		d["Display Shelf"] = +d["Display Shelf"];
		d.Fat = +d.Fat;
		d.Potassium = +d.Potassium;
		d["Protein (g)"] = +d["Protein (g)"];
		d["Serving Size Weight"] = +d["Serving Size Weight"];
		d.Sodium = +d.Sodium;
		d.Sugars = +d.Sugars;
		d["Vitamens and Minerals"] = +d["Vitamens and Minerals"];
	});
	
//Setting the max and mins of the axes and datapoints
var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
	xMin = d3.min(data, function(d) { return d[xCat]; }), 
	xMin = xMin > 0 ? 0 : xMin,
	yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
	yMin = d3.min(data, function(d) { return d[yCat]; }),
	yMin = yMin > 0 ? 0 : yMin;
	
//Setting the domain of the x and y axes
x.domain([xMin, xMax]);
y.domain([yMin, yMax]);

//Creating the x-axis
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickSize(-height);
	
//Creating the y-axis
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.tickSize(-width);
	
//Creating a new ordinal scale with a range of 10 ordinal categorical colors
var color = d3.scale.category10();

//Making the tooltips
var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-10, 0])
	.html(function(d) {
		return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
	});
	
//Zooming in stuff
var zoomBeh = d3.behavior.zoom()
	.x(x)
	.y(y)
	.scaleExtent([0, 500])
	.on("zoom", zoom);

//The #scatter refers to an html element, specifically the div which was created in the .html
//The div is called and an svg is added to it. Then it is moved over and the zooming function it applied
var svg = d3.select("#scatter")
	.append("svg")
		.attr("width", outerWidth)
		.attr("height", outerHeight)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(zoomBeh);

//The tooltip was defined earlier on, so they are calling it here.
svg.call(tip);

//They are creating a rectangle! For something!
svg.append("rect")
	.attr("width", width)
	.attr("height" height);

//The axes are having their traits defined here
svg.append("g")
	.classed("x axis" ,true)
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
	.classed("label", true)
	.attr("x", width)
	.attr("y", margin.bottom - 10)
	.style("text-anchor", "end")
	.text(xCat);
	
svg.append("g")
	.classed("y axis", true)
	.call(yAxis)
	.append("text")
	.classed("label", true)
	.attr("transform", "rotate(-90)")
	.attr("y", -margin.left)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text(yCat);
	
//The svg which contains *just* the graph (and not the legend) is being made
//It is defined as a variable for convenience
var objects = svg.append("svg")
	.classed("objects", true)
	.attr("width", width)
	.attr("height", height);
	
//The axes lines are being created here
object.append("svg:line")
	.classed("axisLine hAxisLine", true)
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 0)
	.attr("y2", 0)
	.attr("transform", "translate(0," + height + ")");
	
objects.append("svg:line")
	.classed("axisLine vAxisLine", true)
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 0)
	.attr("y2", height);
	
//Creating the dots for the datapoints and their attributes, and making sure that the tooltips show up
objects.selectAll("dot")
	.data(data)
	.enter().append("circle)
	.classed("dot", true)
	.attr("r", function(d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
	.attr("transform", transform)
	.style("fill", function(d) { return color(d[colorCat]); })
	.on("mouseover", tip.show)
	.on("mouseout", tip.hide)
	
//Creating the legend
var legend = svg.select(".legend")
	.data(color.domain())
	.enter()
	.append("g")
	.classed("legend", true)
	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	
//Making the little colored circles which are on the legend
legend.append("circle")
	.attr("r", 3.5)
	.attr("cx", width + 20)
	.attr("fill", color);
	
//Putting the text with the names of the companies onto the legend
legend.append("text")
	.attr("x", width + 26)
	.attr("dy", ".35em")
	.text(function(d), { return d; });

//Click on the little button to change the x-axis to "carbs" instead of "calories"
d3.select("input").on("click", change);

//When the "xAxis" button is clicked and the axis is changed, the graph is recalculated
function change() {
	xCat = "Carbs"
	xMax = d3.max(data, function(d) { return d[xCat]; });
	xMin = d3.min(data, function(d) { return d[xCat]; });
	
	zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));
	
	var svg = d3.select("#scatter").transition;

//Doing some animation stuff
	svg.select(.x.axis).duration(750).call(xAxis).select(".label").text(xCat);
	
	objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
}

//I need to learn more about how the zooming function works
function zoom() {
	svg.select(".x.axis").call(xAxis);
	svg.select(".y.axis").call(yAxis);
	
	svg.selectAll(".dot")
		.attr("transform", transform);
	}
	
	function transform(d) {
		return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
	}
});
	
	
