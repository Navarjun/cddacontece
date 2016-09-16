var data;
var sortCriteria = -1, sortDescending = true;
var maxShares, maxComments, maxLikes;

var margin = {t: 30, r: 30, b: 60, l: 60},
canvas = {
  origin: {x: margin.l, y: margin.t},
  size: {width: innerWidth - margin.l - margin.r, height: innerHeight/4 - margin.t - margin.b}
},
canvas2 = {
  origin: {x: margin.l, y: margin.t},
  size: {width: innerWidth*2/3 - margin.l - margin.r, height: innerHeight/2 - margin.t - margin.b}
};


var svg = d3.select("#content")
            .append("svg")
            .attr("width", innerWidth)
            .attr("height", innerHeight/4);
var masterG = svg.append("g");
var svg2 = d3.select("#filtered-content")
            .append("svg")
            .attr("width", innerWidth*2/3)
            .attr("height", innerHeight/2);
var masterG2 = svg2.append("g");

d3.json("data/posts.json", function(x) {
  data = x.map(function(d) {
    var date = moment(d.created_time).toDate();
    d.created_time = date;
    return d;
  });
  maxShares = d3.max(data, function(d) { return d.shares; });
  maxComments = d3.max(data, function(d) { return d.comments; });
  maxLikes = d3.max(data, function(d) { return d.likes; });
  console.log(data[0]);
  visualize();
  // visualize2(data);
  addBrush();
});

var scaleX, scaleX2;
function visualize() {
  var min = d3.min(data, function(d){ return d.created_time; }),
  max = d3.max(data, function(d) { return d.created_time; });
  scaleX = d3.scaleTime().domain([min, max]).range([canvas.origin.x, canvas.origin.x + canvas.size.width]);
  var axisX = d3.axisBottom().scale(scaleX)
                .ticks(d3.timeYear)
                .tickFormat(function(d) {
                  return moment(d).format("MM/YYYY");
                });

  min = d3.min(data, function(d){ return d.shares; });
  max = d3.max(data, function(d){ return d.shares; });
  var scaleY = d3.scaleLinear().domain([min, max]).range([canvas.size.height, canvas.origin.y]);
  var axisY = d3.axisLeft().scale(scaleY);

  var axisXG = masterG.append("g")
                  .attr("transform", "translate("+0+","+(canvas.origin.y + canvas.size.height)+")")
                  .call(axisX);
  var axisYG = masterG.append("g")
                  .attr("transform", "translate("+(canvas.origin.x)+","+(canvas.origin.y)+")")
                  .call(axisY);
  var hist = masterG.append("g")
                .attr("transform", "translate("+0+","+canvas.origin.y+")")
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function(d) { return scaleX(d.created_time); })
                .attr("y", function(d) { return scaleY(d.shares); })
                .attr("height", function(d) { return canvas.size.height - scaleY(d.shares); })
                .attr("width", 2)
                .attr("shares", function(d) { return d.shares; })
                .attr("style", "fill: #A78;");
}

function visualize() {
  svg2.remove();
  var min = d3.min(data, function(d){ return d.created_time; }),
  max = d3.max(data, function(d) { return d.created_time; });
  scaleX = d3.scaleTime().domain([min, max]).range([canvas.origin.x, canvas.origin.x + canvas.size.width]);
  var axisX = d3.axisBottom().scale(scaleX)
                .ticks(d3.timeYear)
                .tickFormat(function(d) {
                  return moment(d).format("MM/YYYY");
                });

  min = d3.min(data, function(d){ return d.shares; });
  max = d3.max(data, function(d){ return d.shares; });
  var scaleY = d3.scaleLinear().domain([min, max]).range([canvas.size.height, canvas.origin.y]);
  var axisY = d3.axisLeft().scale(scaleY);

  var axisXG = masterG.append("g")
                  .attr("transform", "translate("+0+","+(canvas.origin.y + canvas.size.height)+")")
                  .call(axisX);
  var axisYG = masterG.append("g")
                  .attr("transform", "translate("+(canvas.origin.x)+","+(canvas.origin.y)+")")
                  .call(axisY);
  var hist = masterG.append("g")
                .attr("transform", "translate("+0+","+canvas.origin.y+")")
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function(d) { return scaleX(d.created_time); })
                .attr("y", function(d) { return scaleY(d.shares); })
                .attr("height", function(d) { return canvas.size.height - scaleY(d.shares); })
                .attr("width", 2)
                .attr("shares", function(d) { return d.shares; })
                .attr("style", "fill: #A78;");
}

function visualize2(filteredData) {
  svg2.remove();
  svg2 = d3.select("#filtered-content")
          .append("svg")
          .attr("width", innerWidth*2/3)
          .attr("height", innerHeight/2);
  masterG2 = svg2.append("g");
  var min = d3.min(filteredData, function(d){ return d.created_time; }),
  max = d3.max(filteredData, function(d) { return d.created_time; });
  scaleX2 = d3.scaleTime().domain([min, max]).range([canvas2.origin.x, canvas2.origin.x + canvas2.size.width]);
  var axisX = d3.axisBottom().scale(scaleX2)
                .ticks(d3.timeYear)
                .tickFormat(function(d) {
                  return moment(d).format("MM/YYYY");
                });

  min = d3.min(filteredData, function(d){ return d.shares; });
  max = d3.max(filteredData, function(d){ return d.shares; });
  var scaleY2 = d3.scaleLinear().domain([min, max]).range([canvas2.size.height, canvas2.origin.y]);
  var axisY = d3.axisLeft().scale(scaleY2);

  var axisXG = masterG2.append("g")
                  .attr("transform", "translate("+0+","+(canvas2.origin.y + canvas2.size.height)+")")
                  .call(axisX);
  var axisYG = masterG2.append("g")
                  .attr("transform", "translate("+(canvas2.origin.x)+","+(canvas2.origin.y)+")")
                  .call(axisY);
  var hist = masterG2.append("g")
                .attr("transform", "translate("+0+","+canvas2.origin.y+")")
                .selectAll("rect")
                .data(filteredData)
                .enter()
                .append("rect")
                .attr("x", function(d) { return scaleX2(d.created_time); })
                .attr("y", function(d) { return scaleY2(d.shares); })
                .attr("height", function(d) { return canvas2.size.height - scaleY2(d.shares); })
                .attr("width", 2)
                .attr("shares", function(d) { return d.shares; })
                .attr("style", "fill: #A78;");
}

function addBrush() {
  var brush = d3.brushX()
    .extent([[0, 0], [canvas.size.width, canvas.size.height]])
    .on("brush end", brushed);

  masterG.append("g")
    .attr("class", "brush")
    .attr("transform", "translate("+canvas.origin.x+","+canvas.origin.y+")")
    .call(brush)
    .call(brush.move, [0, canvas.size.width]);

}

function brushed() {
  var s = d3.event.selection || scaleX.range();
  console.log(s.map(scaleX.invert, scaleX));
  if (scaleX2) {
    scaleX2.domain(s.map(scaleX.invert, scaleX));
    visualize2(data.filter(function(d) { return d.created_time > scaleX2.domain()[0] && d.created_time < scaleX2.domain()[1]; }));
  } else {
    visualize2(data);
  }
  console.log(s);
}
