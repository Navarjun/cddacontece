var data;
var sortCriteria = -1, sortDescending = true;
var maxShares, maxComments, maxLikes;

var margin = {t: 30, r: 30, b: 60, l: 60},
canvas = {
  origin: {x: margin.l, y: margin.t},
  size: {width: innerWidth - margin.l - margin.r, height: innerHeight/2 - margin.t - margin.b}
};

var svg = d3.select("#content")
            .append("svg")
            .attr("width", innerWidth)
            .attr("height", innerHeight);

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

  // var width = (data.length * 3);
  // canvas.size.width = width;
  // svg.attr("width", canvas.size.width + margin.l + margin.r);

  visualize();
});

function visualize() {
  var min = d3.min(data, function(d){ return d.created_time; }),
  max = d3.max(data, function(d) { return d.created_time; });
  var scaleX = d3.scaleTime().domain([min, max]).range([canvas.origin.x, canvas.origin.x + canvas.size.width]);
  var axisX = d3.axisBottom().scale(scaleX)
                .ticks(d3.timeYear)
                .tickFormat(function(d) {
                  return moment(d).format("MM/YYYY");
                });

  min = d3.min(data, function(d){ return d.shares; });
  max = d3.max(data, function(d){ return d.shares; });
  var scaleY = d3.scaleLinear().domain([min, max]).range([canvas.size.height, canvas.origin.y]);
  var axisY = d3.axisLeft().scale(scaleY);

  var axisXG = svg.append("g")
                  .attr("transform", "translate("+0+","+(canvas.origin.y + canvas.size.height)+")")
                  .call(axisX);
  var axisYG = svg.append("g")
                  .attr("transform", "translate("+(canvas.origin.x)+","+(canvas.origin.y)+")")
                  .call(axisY);
  var hist = svg.append("g")
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
