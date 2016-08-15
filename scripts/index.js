d3.json("data/posts_processed.json", function(data) {
  var maxShares = d3.max(data, function(d) { return d.shares; });
  var maxComments = d3.max(data, function(d) { return d.comments; });
  var maxLikes = d3.max(data, function(d) { return d.likes; });

  console.log("shares", maxShares);
  console.log("comments", maxComments);
  console.log("likes", maxLikes);

  var tempData = data.slice(0, 100);
  var table = d3.select("#content");
  table.selectAll("tr")
    .data(data)
    .enter()
    .append("tr")
    .classed("col-md-12", true)
    .each(function(d) {
      $(this).html("\
        <td class='col-md-4'>"+
          d.message
        + "</td> \
        <td class='col-md-4'> \
        <div style='height: 100%; width: "+((d.shares*100)/maxShares)+"%; background: #f00;'> "+
          d.shares
        + "</div> </td> \
        <td class='col-md-4'>\
        <div style='height: 100%; width: "+((d.comments*100)/maxComments)+"%; background: #0f0;'> "+
          d.comments
        + "</div> </td> \
        <td class='col-md-4'>\
        <div style='height: 100%; width: "+((d.likes*100)/maxLikes)+"%; background: #00f;'> "+
          d.likes
        + "</div></td> \
      ");
    });
})
