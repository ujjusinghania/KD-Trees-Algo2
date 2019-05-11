var w = window.innerWidth;
var h = window.innerHeight;
var radius = 5;
var svg = d3.select("body").append("svg").attr({ width: w, height: h });
var dataset = [];
var xm = d3.scale.linear().domain([0, w]).range([0, w]);
var ym = d3.scale.linear().domain([0, h]).range([0, h]);
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
      console.log(pt);
})

drawBoundary(0, 0, 0, h);
drawBoundary(0, 0, w, 0);
drawBoundary(0, h, w, h);
drawBoundary(w, 0, w, h);

console.log("w = " + w + "; h = " + h);

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
            pointSet[index++] = [points.x, points.y];
      }
      var verticalMedians = [0, w]
      var horizontalMedians = [0, h]
      kdAlgo(pointSet, 1, 1, h, verticalMedians, horizontalMedians);
}
// UP and LEFT is true, rest false
function kdAlgo(pointSet, takeXMedian, isUpOrLeft, oldMedian, verticalMedians, horizontalMedians) {
      console.log(verticalMedians);
      if (pointSet.length <= 1) {
            return;
      }
      var medianValue;

      var verticalMediansCopy = verticalMedians.slice();
      var horizontalMediansCopy = horizontalMedians.slice();
      
      if (takeXMedian) {
            var xPoints = getPoints(pointSet, 0); // Extract X Points
            medianValue = getMedian(xPoints);
            var leftPointSet = [];
            var rightPointSet = [];
            for (var point of pointSet) {
                  if (point[0] < medianValue) {
                        leftPointSet.push(point);
                  }
                  else {
                        rightPointSet.push(point);
                  }
            }
            drawMedian(medianValue, 1, isUpOrLeft, oldMedian, horizontalMedians); // Plot Median Line
            verticalMediansCopy.push(medianValue);
            verticalMediansCopy = verticalMediansCopy.sort(function (a, b) {
                  return a - b; 
            });
            console.log("left: " + leftPointSet.length + " right: " + rightPointSet.length);
            var nextSplit = !takeXMedian;
            kdAlgo(rightPointSet, nextSplit, 0, medianValue, verticalMediansCopy, horizontalMedians);
            kdAlgo(leftPointSet, nextSplit, 1, medianValue, verticalMediansCopy, horizontalMedians);
      }
      else {
            var yPoints = getPoints(pointSet, 1); // Extract Y Points
            medianValue = getMedian(yPoints);
            var upPointSet = [];
            var downPointSet = [];
            for (var point of pointSet) {
                  if (point[1] < medianValue) {
                        upPointSet.push(point);
                  }
                  else {
                        downPointSet.push(point);
                  }
            }
            drawMedian(medianValue, 0, isUpOrLeft, oldMedian, verticalMedians); // Plot Median Line
            horizontalMediansCopy.push(medianValue);
            horizontalMediansCopy = horizontalMediansCopy.sort(function (a, b) {
                  return a - b; 
            });
            console.log("up: " + upPointSet.length + " down: " + downPointSet.length);
            var nextSplit = !takeXMedian;
            kdAlgo(upPointSet, nextSplit, 1, medianValue, verticalMedians, horizontalMediansCopy);
            kdAlgo(downPointSet, nextSplit, 0, medianValue, verticalMedians, horizontalMediansCopy);
      }
      return; 
}

function drawMedian(medianValue, isVertical, isUpOrLeft, oldMedian, medianList) {
      var x1, x2, y1, y2;
      if (isVertical) {
            x1 = medianValue;
            x2 = medianValue;
            y1 = oldMedian;
            y2 = h;
            if (isUpOrLeft) {
                  y2 = medianList.sort(function (a, b) {
                        return b - a; 
                  }).find(function(element) {
                        return element < oldMedian;
                      });
            } else {
                  y2 = medianList.find(function(element) {
                        return element > oldMedian;
                      });
            }
      }
      else {
            y1 = medianValue;
            y2 = medianValue;
            x1 = oldMedian;
            x2 = w; 
            if (isUpOrLeft) {
                  x2 = medianList.sort(function (a, b) {
                        return b - a; 
                  }).find(function(element) {
                        return element < oldMedian;
                      });
            }
            else {
                  x2 = medianList.find(function(element) {
                        return element > oldMedian;
                      });
            }
      }
      svg.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke-width", 2)
            .attr("stroke", "black");
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
      points = points.sort(function (a, b) {
            return a - b; 
      });
      // console.log("Sorted points: " + points);
      var half = Math.floor(points.length / 2);
      // console.log("Median is: " + (points[half] + points[half - 1]) / 2);
      return (points[half] + points[half - 1]) / 2;
}

function drawBoundary(x1, y1, x2, y2) {
      svg.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke-width", 2)
            .attr("stroke", "black");
}