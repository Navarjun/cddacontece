d3.json("data/posts_processed.json", function(data) {
  var maxShares = d3.max(data, function(d) { return d.shares; });
  var maxComments = d3.max(data, function(d) { return d.comments; });
  var maxLikes = d3.max(data, function(d) { return d.likes; });

  console.log("shares", maxShares);
  console.log("comments", maxComments);
  console.log("likes", maxLikes);

  var table = d3.select("#content");
  table.selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .classed("row", true)
    .classed("bg-grey", function(_, i) { return i%2 == 0; })
    .each(function(d) {
      $(this).html("\
        <div class='col-md-3 postContent'>"+
          d.message
        + "</div> \
        <div class='col-md-3'> \
        <div class='bar' style='height: 100%; width: "+((d.shares*100)/maxShares)+"%; background: #a77;'> "+
          d.shares
        + "</div> </div> \
        <div class='col-md-3 bar'>\
        <div style='height: 100%; width: "+((d.comments*100)/maxComments)+"%; background: #7a7;'> "+
          d.comments
        + "</div> </div> \
        <div class='col-md-3 bar'>\
        <div style='height: 100%; width: "+((d.likes*100)/maxLikes)+"%; background: #99a;'> "+
          d.likes
        + "</div></div> \
      ");
    });
})
