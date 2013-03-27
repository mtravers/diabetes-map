var scale = .7,
    width = 960 * scale,
    height = 500 * scale;

var path = d3.geo.path();

var g;
var titlev;
var centered;

queue()
    .defer(d3.json, "data/us-states1.json")
    .defer(d3.csv, "data/title v table d3.csv")
    .await(ready);

function ready(error, us, titlev_a) {
    var svg = d3.select("#map").append("svg")
	    .attr("width", width)
	    .attr("height", height);

    svg.append("rect")
	.attr("class", "background")
	.attr("width", width)
	.attr("height", height)
	.on("click", click);

    // scale to fit
    var gg = svg.append("g")
    	.attr("transform", "scale(" + scale + ")");

    g = gg.append("g")
	.attr("id", "states");

    // I'd rather roll this data into the geo data, but couldn't figure the right js magic for that.
    titlev = titlev_a;
    g.selectAll("path")
	.data(us.features)
	.enter().append("path")
	.attr("d", path)
	.attr("class", function(d) { 
	    var row = state2row(d);
	    return row == null ? "no" : "yes";
	})
	.on("click", click);
};

function state2row(dstate) {
    var abbrev = dstate["abbrev"];
    var rows = titlev.filter(function(r) { return  r["abbrev"] == abbrev;});
    return rows.length == 1 ? rows[0] : null;
}

function click(d) {
    var x, y, k;

    if (d && centered !== d) {
	var centroid = path.centroid(d);
	x = centroid[0];
	y = centroid[1];
	k = 4;
	centered = d;
    } else {
	x = width / 2;
	y = height / 2;
	k = 1;
	centered = null;
    }

    g.selectAll("path")
	.classed("active", centered && function(d) { return d === centered; })
	.sort(function (a, b) { 
	    if (centered && a.id != centered.id) return -1;  
	    else return 1;   
	});

    g.transition()
	.duration(1000)
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	.style("stroke-width", 1.5 / k + "px");

    updateText(centered);

}

function updateText(stateData) {
    setField('stitle', stateData['name']); 
    var row = state2row(stateData);
    if (row == null) {
	d3.select('#desc').style("display", "none");
    }
    else {
	d3.select('#desc').style("display", "");
	d3.select('#desc').style("display", "");
	setField('max_eligibility_age', row['Maximum Age']);
    }
}

function setField(name, text) {
    document.getElementById(name).innerHTML = text;
}


