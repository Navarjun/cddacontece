const container = d3.select(".container");
const svg = d3.select("#barchart-svg").attr("width", container.node().getBoundingClientRect().width).attr("height", window.innerHeight/2.5);
const margin = { left: 70, top: 50, right: 50, bottom: 150 };
const canvas = { width: svg.attr("width")-margin.left-margin.right, height: svg.attr("height")-margin.top-margin.bottom };
const plot = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")");

const dateProgress = d3.select("#dateProgress");
let timer, month = -1, year = 2014;

d3.csv("./data/posts.csv", (err, data) => {
  // d3.json("./data/geojson/rio-de-janeiro.geojson", (err, rio) => {
    data = data.map(d => {
      d.createdTime = new Date(parseInt(d.createdTime));
      return d;
    });
    drawSmallMultiples(data.slice());
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
  // });
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

let smGs;
function drawSmallMultiples(data) {
  const smContainer = d3.select("#small-multiples");
  const nest = d3.nest()
    .key(d => d.fbPageId )
    .key(d => { return d.createdTime.getFullYear()+"-"+d.createdTime.getMonth(); })
    .entries(data);

  console.log(nest);
  let width = 0;
  const fbPageTimelineDivs = smContainer.selectAll("div.fbPageTimeline")
    .data(nest)
    .enter()
    .append("div")
    .attr("class", "col-sm-4 fbPageTimeline")
    .style("height", function() {
      width = this.getBoundingClientRect().width;
      return this.getBoundingClientRect().width+"px";
    });

  fbPageTimelineDivs.append("p")
    .text((d) => d.key);

  const svgs = fbPageTimelineDivs
    .append("svg")
    .style("border", "1px solid grey")
    .attr("width", function(){
      const padding = 15;
      return width-padding*2;
    })
    .attr("height", width-20);

  const innerMargin = {left: 20, top: 20, right: 20, bottom: 20};
  const scaleX = d3.scaleTime()
    .domain([new Date(2014, 0, 1), new Date(2017, 3, 1)])
    .range([0, width-innerMargin.left-innerMargin.right]);
  const scaleY = d3.scaleLinear()
    .domain([0, 300])
    .range([width-innerMargin.left-innerMargin.right, 0]);
  const lineGen = d3.line()
    .x(function(d) {
      return scaleX(new Date(d.key.split("-")[0], d.key.split("-")[1], 1));
    })
    .y(function(d) {
      return scaleY(d.values.length);
    });

  smGs = svgs.append("g")
    .style("transform", `translate(${innerMargin.left}, ${innerMargin.top})`);

  smGs.append("path")
    .classed("timeline", true)
    .datum(d => {
      return d.values;
    })
    .attr("d", lineGen);
}

const buttons = document.querySelector(".btn");
for (var i = 0; i < buttons.length; i++) {
  buttons.addEventListener("click", function() {
    const key = d3.select(this).attr("data-key");
    if (this.classList.includes("active")) {
      this.classList.remove("active");
      hideLines(key);
    } else {
      this.classList.add("active");
      showLines(key);
    }
  });
}

function showLines(key) {
  console.log(smGs.select(".key").node())
}

function hideLines(key) {

}
