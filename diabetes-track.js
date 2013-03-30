var scale = .8,
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
	.on("mousemove", move);

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
	.on("mousemove", move);
};

function state2row(dstate) {
    var abbrev = dstate["abbrev"];
    var rows = titlev.filter(function(r) { return  r["abbrev"] == abbrev;});
    return rows.length == 1 ? rows[0] : null;
}

function move(d) {
    var x, y, k;

    g.selectAll("path")
	.classed("active", function(dd) { return d === dd; })
	.sort(function (a, b) { 
	    if (d && a.id != d.id) return -1;  
	    else return 1;   
	});

    updateText(d);
    // +++ move text box to mouse pos
    var box = document.getElementById('desc');
    var map = document.getElementById('map');
    var mouse = d3.mouse(map);
    box.style.left = mouse[0] + "px";
    box.style.top = mouse[1] + "px";
}

function updateText(stateData) {
    setField('stitle', stateData['name']); 
    var row = state2row(stateData);
    if (row == null) {
	d3.select('#desc').style("display", "none");
    }
    else {
	d3.select('#desc').style("display", "");
	setField('max_eligibility_age', row['Maximum Age']);
	setField('schip', row['SCHIP']);
	setField('medicaid', row['Medicaid']);
	var cap = row['Coverage Cap'];
	setField('cap', cap == 'N' ? "None" : cap);
	toggleField('medical_provider', row["Medical Provider"]);
	toggleField('dietician', row["Dietician"]);
	toggleField('education', row["Education"]);
	toggleField('mental_health', row["Mental Health"]);
	toggleField('transportation', row["Transportation"]);
	toggleField('insulin', row["Insulin"]);
    }
}

function setField(name, text) {
    document.getElementById(name).innerHTML = text;
}

function toggleField(name, value) {
    document.getElementById(name).style.display = (value == 'Y') ? "" : "none";
}


