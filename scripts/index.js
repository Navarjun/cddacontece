var data;
var tableHeader = [
  {display:"Post", id:"message"},
  {display:"Shares", id:"shares"},
  {display:"Comments", id:"comments"},
  {display:"Likes", id:"likes"},
];
var sortCriteria = -1, sortDescending = true;
var maxShares, maxComments, maxLikes;

d3.json("data/posts_processed.json", function(x) {
  data = x;
  maxShares = d3.max(data, function(d) { return d.shares; });
  maxComments = d3.max(data, function(d) { return d.comments; });
  maxLikes = d3.max(data, function(d) { return d.likes; });
  visualize();
});
var o = 0;
function visualize() {
  var table = d3.select("#content");
  table.selectAll("div")
    .data([])
    .exit()
    .remove();
  table.selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .classed("row", true)
    .classed("bg-grey", function(_, i) { return i%2 !== 0; })
    .each(function(d) {
      $(this).html(""+
        "<div class='col-md-3 postContent'>" +
        "<a href='"+d.link+"'>"+
          d.message +
        "</a></div>" +
        "<div class='col-md-3'>" +
        "<div class='bar' style='height: 100%; width: "+((d.shares*100)/maxShares)+"%; background: #a77;'> "+
          d.shares +
        "</div> </div>" +
        "<div class='col-md-3 bar'>" +
        "<div style='height: 100%; width: "+((d.comments*100)/maxComments)+"%; background: #7a7;'> "+
          d.comments +
        "</div> </div>" +
        "<div class='col-md-3 bar'>" +
        "<div style='height: 100%; width: "+((d.likes*100)/maxLikes)+"%; background: #99a;'> "+
          d.likes +
        "</div></div>"+
      "");
    });
}

function createHeader() {
  var headerHtml = "";
  for(var i = 0; i < tableHeader.length; i++) {
    var head = tableHeader[i];
    var caretString = i === sortCriteria ? (sortDescending ? " &#9650;" : " &#9660;") : "";
    headerHtml += ""+
    "<div class='col-md-3'>"+
      "<button type='button' class='btn btn-sort sort' id='sort-"+head.id+"'>"+head.display+
      caretString+
    "</div>";
  }
  $(".data-table-header").html(headerHtml);
  $(".sort").click(function() {
    var sortString = $(this).attr("id").replace("sort-","");
    var newSortCriteria = _.findIndex(tableHeader, function(d){ return sortString === d.id; });
    if (newSortCriteria === sortCriteria) {
      sortDescending = !sortDescending;
      data = data.reverse();
    } else {
      sortDescending = true;
      sortCriteria = newSortCriteria;
      data = _.sortBy(data, function(d) { return 1/d[sortString]; });
    }
    createHeader();
    visualize();
  });
}
createHeader();
