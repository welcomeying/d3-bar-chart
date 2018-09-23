d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", function (error, data) {
	if (error) throw error;

	// Get the data
	var dataset = data.data.map(function (item) {
		return [Number(item[0].split("-")[0]), item[1], item[0]];
	});

	// Set the dimensions of the canvas / graph
	var w = 1000;
	var h = 500;
	var margin = 80;

	var svg = d3.select("body").
	append("svg").
	attr("width", w + margin * 2).
	attr("height", h + margin * 2).
	append("g").
	attr("transform", "translate(" + margin + "," + margin + ")");

	// Add title
	svg.append("text").
	attr("id", "title").
	attr("x", 320).
	attr("y", 10).
	text("United States GDP").
	style("font-size", "40px");

	svg.append("text").
	attr("id", "units").
	attr("x", 370).
	attr("y", 50).
	text("(Units: Billions of Dollars)").
	style("font-size", "20px");

	// Define tooltip
	var tooltip = d3.select("body").
	append("div").
	style("visibility", "hidden").
	attr("id", "tooltip");

	// Set the ranges
	var xScale = d3.scaleLinear().
	domain([d3.min(dataset, function (d) {return d[0];}), d3.max(dataset, function (d) {return d[0];})]).
	range([0, w]);

	var yScale = d3.scaleLinear().
	domain([0, d3.max(dataset, function (d) {return d[1];})]).
	range([h, 0]);

	// Define and add the axes
	var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
	var yAxis = d3.axisLeft(yScale);

	svg.append("g").
	attr("id", "x-axis").
	attr("transform", "translate(0," + h + ")").
	call(xAxis);

	svg.append("g").
	attr("id", "y-axis").
	call(yAxis);

	// Add bars and tooltips
	svg.selectAll("rect").
	data(dataset).
	enter().
	append("rect").
	attr("class", "bar").
	attr("x", function (d, i) {return i * (w / dataset.length);}).
	attr("y", function (d) {return yScale(d[1]);}).
	attr("width", w / dataset.length).
	attr("height", function (d) {return h - yScale(d[1]);}).
	attr("data-date", function (d) {return d[2];}).
	attr("data-gdp", function (d) {return d[1];}).
	on("mouseover", function (d, i) {
		tooltip.style("visibility", "visible").
		attr("data-date", dataset[i][2]).
		html(dataset[i][2] + "<br>$" + dataset[i][1] + " Billion").
		style("left", d3.select(this).attr("x") + "px").
		style("top", d3.select(this).attr("y") + "px");}).
	on("mouseout", function () {return tooltip.style("visibility", "hidden");});
});