var w = window.innerWidth;
var h = window.innerHeight;
var radius = 5;
var svg = d3.select("body").append("svg").attr({ width: w, height: h });
var dataset = [];
var xm = d3.scale.linear().domain([0, w]);
var ym = d3.scale.linear().domain([0, h]);
var pts = { cx: function (d) { return xm(d.x); }, cy: function (d) { return ym(d.y); }, r: radius };
//add point
svg.on("click", function () {
      var xy = d3.mouse(this);
      var pt = { x: Math.round(xm.invert(xy[0])), y: Math.round(ym.invert(xy[1])) };
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
      d3.select(this).attr({ fill: "red", r: radius * 1.5 });
}

function out(d, i) {
      d3.select(this).attr({ fill: "black", r: radius });
}

function test() {
      console.log("hello");
}
function kdDriver() {
      var pointSet = new Array(dataset.length);
      var index = 0;
      for (points of dataset) {
            console.log(points.x + "|" + points.y);
            pointSet[index++] = [points.x, points.y];
      }
      kdAlgo(pointSet, 0);
}
function kdAlgo(pointSet, takeXMedian) {
      console.log(pointSet.length);
      if (pointSet.length <= 1) {
            return;
      }

      var medianValue;
      if (takeXMedian) {
            var xPoints = getPoints(pointSet, 0); // Extract X Points
            medianValue = getMedian(xPoints);
            console.log(xPoints);
            upPointSet = [];
            downPointSet = [];
            for (var point of pointSet) {
                  console.log(point[0], medianValue)
                  if (point[0] <= medianValue) {
                        downPointSet.push(point);
                  }
                  else {
                        upPointSet.push(point);
                  }
            }
            console.log(pointSet.length, upPointSet.length, downPointSet.length);
            medianValue = [medianValue, 0];
            sendMedian(medianValue); // Plot Median Line
            kdAlgo(upPointSet, !takeXMedian);
            kdAlgo(downPointSet, !takeXMedian);
      }
      else {
            var yPoints = getPoints(pointSet, 1); // Extract Y Points
            medianValue = getMedian(yPoints);
            leftPointSet = [];
            rightPointSet = [];
            for (var point of pointSet) {
                  if (point[1] <= medianValue) {
                        leftPointSet.push(point);
                  }
                  else {
                        rightPointSet.push(point);
                  }
            }
            console.log(pointSet.length, leftPointSet.length, rightPointSet.length);
            medianValue = [medianValue, 0];
            sendMedian(medianValue); // Plot Median Line
            kdAlgo(leftPointSet, !takeXMedian);
            kdAlgo(rightPointSet, !takeXMedian);
      }
}

function sendMedian(medianValue) {
      console.log("send median   " + medianValue);
      if (medianValue[1] == 0) {
            svg.append("line")
                  .attr("x1", medianValue[0])
                  .attr("x2", medianValue[0])
                  .attr("y1", 0)
                  .attr("y2", h);
      }
      else {
            svg.append("line")
                  .attr("x1", 0)
                  .attr("x2", w)
                  .attr("y1", medianValue[0])
                  .attr("y2", medianValue[0]);
      }
}

function getPoints(pointSet, index) {
      var points = [];
      var i = 1;
      for (var point of pointSet) {
            // console.log(i++);
            points.push(point[index]);
      }
      return points;
}

function getMedian(points) {
      points = points.sort();
      var half = Math.floor(points.length / 2);
      if (half < (points.length - 1)) {
            console.log("MEDIAN: " + (points[half] + points[half + 1]) / 2);
            return (points[half] + points[half + 1]) / 2;
      }
      else {
            console.log("MEDIAN: " + (points[half] + points[half -1]) / 2);
            return (points[half] + points[half - 1]) / 2;
      }
}