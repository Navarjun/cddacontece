d3.json("data/pages_keywords_raw.json", function(err, data) {
  console.log(err, data);
  data = data.filter(d => d.keywords.length > 5);

  var divs = d3.select("#word-clouds")
    .selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .classed("cloud-container", true)
    .style("float", "left");


  divs.append("h4")
    .text(d => d.pageName.toUpperCase());

  var svgs = divs.append("svg")
    .attr("width", 400)
    .attr("height", 300)

  svgs[0].forEach(function(svg, i) {
    drawCloud(data[i], svg);
  });
});

var color = d3.scale.linear()
          .domain([0,1,2,3,4,5,6,10,15,20,100])
          .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

function drawCloud(d, svg) {
  d3.layout.cloud().size([400 - 100, 300 - 100])
          .words(d.keywords)
          .rotate(0)
          .fontSize(function(d) { return d.relevance*40; })
          .on("end", draw)
          .start();

  function draw(words) {
    d3.select(svg)
              .attr("class", "wordcloud")
              .append("g")
              // without the transform, words words would get cutoff to the left and top, they would
              // appear outside of the SVG area
              .attr("transform", "translate(100,150)")
              .selectAll("text")
              .data(words)
              .enter().append("text")
              .style("font-size", function(d) { return d.size + "px"; })
              .style("fill", function(d, i) { return color(i); })
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.text; });
  }
}
