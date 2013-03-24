queue()
    .defer(d3.json, "data/us-states.json")
//    .defer(d3.json, "data/diabetes1.json")
    .await(ready);

var path = d3.geo.path();

var svg = d3.select("body").append("svg")
    .attr("width", 400)
    .attr("height", 300);

var map = svg.append("g")
    .attr("class", "map");

function ready(error, us, data) {
    map
	.selectAll("path")
    	.data(topojson.object(us, us.objects.states).geometries)
	.enter().append("path")
//    	.attr("class", "states")
    	.attr("d", path);


}

