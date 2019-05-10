var w = window.innerWidth;
var h = window.innerHeight;
var radius = 5;
var svg = d3.select("body").append("svg").attr({width:w,height:h});
var dataset = [];
var xm = d3.scale.linear().domain([0, w]);
var ym = d3.scale.linear().domain([0, h]);
var pts = { cx: function(d) { return xm(d.x); }, cy: function(d) { return ym(d.y); }, r: radius};
//add point
svg.on("click", function() {
    var xy = d3.mouse(this);
    var pt= {x: Math.round(xm.invert(xy[0])), y: Math.round(ym.invert(xy[1]))};
    dataset.push(pt); 
    svg.selectAll("circle") 
      .data(dataset)
      .enter()
      .append("circle")
      .attr(pts)
      .on("mouseover", over)
      .on("mouseout", out);
  })
function over(d, i) { 
      d3.select(this).attr({fill: "red", r: radius*1.5});
}
function out(d, i) {
      d3.select(this).attr({fill: "black", r: radius});
}