// const container = d3.select(".container");
// const svg = d3.select("#barchart-svg").attr("width", container.node().getBoundingClientRect().width).attr("height", window.innerHeight/2.5);
// const margin = { left: 70, top: 50, right: 50, bottom: 150 };
// const canvas = { width: svg.attr("width")-margin.left-margin.right, height: svg.attr("height")-margin.top-margin.bottom };
// const plot = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")");

// const dateProgress = d3.select("#dateProgress");
// let timer, month = -1, year = 2014;

d3.json("./data/monthlyTopics.json", (err, data) => {
  // d3.json("./data/geojson/rio-de-janeiro.geojson", (err, rio) => {
  // });
  var flattenedData = [];
  data.forEach(d => {
    d.topics = d.topics.split(",");
    d.relevance = d.relevance.split(",");
    d.topics.forEach((e, i) => {
      flattenedData.push({ fbPageId: d.fbPageId, topic: e, relevance: d.relevance[i], month: d.month, year: d.year });
    });
  });
  // console.log(flattenedData);
  var nest = d3.nest()
    .key(d => d.topic)
    .key(d => d.month+"-"+d.year)
    .rollup(d => d.map(e => {
      return { fbPageId: e.fbPageId, relevance: e.relevance };
    }))
    .entries(flattenedData);

  // console.log(nest);

  var unnest = [];
  nest.forEach(d => {
    d.values.forEach(e => {
      unnest.push({
        date: e.key,
        topic: d.key,
        pages: e.value
      });
    });
  });
  var commonality = unnest.filter(d => (d.pages.length > 1));

  console.log(commonality);

  var rows = d3.select("#commonality")
    .selectAll(".row")
    .data(commonality)
    .enter()
    .append("div")
    .classed("row", true)
    .html(d => {
      var date = `<div class='col-sm-2'>${d.date}</div>`
      var topic = `<div class='col-sm-3'>${d.topic}</div>`
      var pages = `<div class='col-sm-6'>`
      d.pages.forEach(e => {
        pages += e.fbPageId + "-" + e.relevance + "</br>";
      })
      pages += `</div>`;

      return date+topic+pages;
    });

});
