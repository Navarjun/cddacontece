const svg = d3.select("#barchart-svg").attr("width", window.innerWidth).attr("height", window.innerHeight/2.5);
const margin = { left: 70, top: 50, right: 50, bottom: 150 };
const canvas = { width: svg.attr("width")-margin.left-margin.right, height: svg.attr("height")-margin.top-margin.bottom };
const plot = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")");

const dateProgress = d3.select("#dateProgress");
let timer, month = -1, year = 2014;

d3.csv("./data/posts.csv", (err, data) => {
  d3.json("./data/geojson/rio-de-janeiro.geojson", (err, rio) => {
    data = data.map(d => {
      d.createdTime = new Date(parseInt(d.createdTime));
      return d;
    });
    const cf = crossfilter(data);
    const dateDimension = cf.dimension(d => { return d.createdTime.getFullYear()+"-"+d.createdTime.getMonth(); })

    const pagesSet = d3.set(data.map(d => d.fbPageId)).values();
    const scaleX = d3.scaleOrdinal().domain(pagesSet).range(d3.range(0, canvas.width, canvas.width/parseFloat(pagesSet.length)));

    const nest = d3.nest()
      .key(d => { return d.createdTime.getFullYear()+"-"+d.createdTime.getMonth(); })
      .key(d => d.fbPageId )
      .rollup(d => d.length)
      .entries(dateDimension.top(Infinity));

    const maxPosts = d3.max(nest, d => {
        return d3.max(d.values, e => e.value);
      });
    const scaleY = d3.scaleLinear().domain([0, maxPosts]).range([canvas.height, 0]);

    const barChart = plot.append("g")
      .classed("barchart", true);

    timer = setInterval(function() {
      month++;
      console.log(month, year);
      if (month >= 12) {
        month = 0;
        year++;
      }
      if (year == 2017 && month == 3) {
        clearInterval(timer);
        return;
      }
      dateDimension.filter(year+"-"+month);
      const nest = d3.nest()
        .key(d => d.fbPageId )
        .rollup(d => d.length)
        .entries(dateDimension.top(Infinity));

      drawBarChart(nest, scaleX, scaleY, barChart);
      dateProgress.text((month+1)+"/"+year);
    }, 1500);
    const axisX = d3.axisBottom().scale(scaleX);
    const axisY = d3.axisLeft().scale(scaleY).ticks(3);

    plot.append("g")
      .classed("axis", true)
      .classed("axisX", true)
      .attr("transform", `translate(0, ${canvas.height})`)
      .call(axisX);
    plot.append("g")
      .classed("axis", true)
      .classed("axisY", true)
      .attr("transform", `translate(-30, 0)`)
      .call(axisY);
  });
});

function drawBarChart(data, scaleX, scaleY, ele) {
  const rectSel = ele.selectAll("rect")
    .data(data, d => d.key);
  rectSel.exit()
    .transition()
    .duration(1000)
    .attr("height", 0)
    .style("opacity", 0.2)
    .attr("y", scaleY.range()[0])
    // .remove();

  const enterSet = rectSel.enter()
    .append("rect")
    .attr("x", d => scaleX(d.key)-5)
    .attr("y", d => scaleY.range()[0])
    .style("opacity", 0)
    .attr("width", 10)
    .attr("height", 0);

  enterSet.merge(rectSel)
    .transition()
    .duration(1000)
    .style("opacity", 1)
    .attr("x", d => scaleX(d.key)-5)
    .attr("y", d => scaleY.range()[0] - scaleY(d.value))
    .attr("width", 10)
    .attr("height", d => scaleY(d.value));

}
