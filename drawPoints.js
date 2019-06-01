var w = window.innerWidth;
var h = window.innerHeight / 1.5;
var radius = 5;
var svg = d3.select("body").append("svg").attr({ width: w, height: h });
var dataset = [];
var xm = d3.scale.linear().domain([0, w]).range([0, w]);
var ym = d3.scale.linear().domain([0, h]).range([0, h]);
var pts = { cx: function (d) { return xm(d.x); }, cy: function (d) { return ym(d.y); }, r: radius };
var ptnum = 0;
var c=0;
var disButtons=false;
svg.on("click", function () {
      var xy = d3.mouse(this);
      var pt = { x: Math.round(xm.invert(xy[0])), y: Math.round(ym.invert(xy[1])) };
      dataset.push(pt);
      ptnum += 1;
      svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr(pts)
            .on("mouseover", over);
})
var exists = false;
var selectionRect = {
      element: null,
      currentY: 0,
      currentX: 0,
      originX: 0,
      originY: 0,
      setElement: function (ele) { this.element = ele; },
      getNewAttributes: function () {
            var x = this.currentX < this.originX ? this.currentX : this.originX;
            var y = this.currentY < this.originY ? this.currentY : this.originY;
            var width = Math.abs(this.currentX - this.originX);
            var height = Math.abs(this.currentY - this.originY);
            return {
                  x: x,
                  y: y,
                  width: width,
                  height: height
            };
      },
      getCurrentAttributes: function () {
            var x = +this.element.attr("x");
            var y = +this.element.attr("y");
            var width = +this.element.attr("width");
            var height = +this.element.attr("height");
            return {
                  x1: x,
                  y1: y,
                  x2: x + width,
                  y2: y + height,
                  wid: width,
                  hei: height
            };
      },
      init: function (newX, newY) {
            var rectElement = svg2.append("rect").attr({
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0
            })
            this.setElement(rectElement);
            this.originX = newX;
            this.originY = newY;
            this.update(newX, newY);
      },
      update: function (newX, newY) {
            this.currentX = newX;
            this.currentY = newY;
            this.element.attr(this.getNewAttributes());
      },
      focus: function () {
            this.element
                  .style("opacity", "0.5")
                  .style("fill", "darkpurple")
                  .style("stroke", "black")
                  .style("stroke-width", "2.5");
      },
};

var svg2 = d3.select("svg");
function start() {
      var p = d3.mouse(this);
      selectionRect.init(p[0], p[1]);
      selectionRect.focus();
}
function move() {
      if (!exists) {
            var p = d3.mouse(this);
            selectionRect.update(p[0], p[1]);
            selectionRect.focus();
      }
}
function end() {
      var finalAttributes = selectionRect.getCurrentAttributes();
      if (finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1) {
            exists = true;
            d3.event.sourceEvent.preventDefault();
            selectionRect.focus();
            if (dataset.length != 0) { ptnum -= 1; }
      }
}
var beh = d3.behavior.drag()
      .on("drag", move)
      .on("dragstart", start)
      .on("dragend", end);
svg2.call(beh);

drawBoundary(0, 0, 0, h);
drawBoundary(0, 0, w, 0);
drawBoundary(0, h, w, h);
drawBoundary(w, 0, w, h);

function over(d, i) { d3.select(this).attr({ fill: "black", r: radius }); }

var setRectangles = [];
var setRectangles2=[];
var colored=false;

function kdDriver() {
	disButtons=true;
	d3.select("#tog3").attr("disabled",null);
	c+=1;
	if(c==1) {
		dataset.pop();
		console.log("test");
		svg.selectAll("#temp2").remove();
		setRectangles = []
		var pointSet = new Array(dataset.length);
		var index = 0;
		for (point of dataset) {
		    pointSet[index++] = [point.x, point.y];
		    var setRectangle = { x: point.x, y: point.y, up: 0, left: 0, down: h, right: w };
		    setRectangles.push(setRectangle);
		}
		var verticalMedians = [0, w]
		var horizontalMedians = [0, h]
		kdAlgo(pointSet, 1, 1, h, verticalMedians, horizontalMedians, 0, w, 0, h);
		colored=true;
		//tog1.setAttribute("disabled");
		var answerLabel = document.getElementById("answerText");
		answerLabel.innerHTML = "Number of points inside the rectangle are: " + countPoints();
	}
}

function countPoints() {
      var selectionRectangle = selectionRect.getCurrentAttributes();
      var count = 0;
      for (point of dataset) {
            if (point.x <= selectionRectangle.x2 && point.x >= selectionRectangle.x1) {
                  if (point.y <= selectionRectangle.y2 && point.y >= selectionRectangle.y1) {
                        count++;
                  }
            }
      }
      return count;
}


// UP and LEFT is true, rest false
function kdAlgo(pointSet, takeXMedian, isUpOrLeft, oldMedian, verticalMedians, horizontalMedians, left, right, up, down) {
      // console.log(verticalMedians);
      var selectionRectAttr = selectionRect.getCurrentAttributes(); 
      var val = false;
      // If statements to not draw rectangles for points outside query box
      if (!takeXMedian) { // If result of X Median
            if (isUpOrLeft) {
                  if (oldMedian < selectionRectAttr.x1) { // left
                        val = true;
                  }
            }
            else {
                  if (oldMedian > selectionRectAttr.x2) { // right
                        val = true;
                  }
            }
      }
      else {
            if (isUpOrLeft) {
                  if (oldMedian < selectionRectAttr.y1) { // up
                        val = true;
                  }
            }
            else {
                  if (oldMedian > selectionRectAttr.y2) { // down
                        val = true;
                  }
            }
      }

      if (left > selectionRectAttr.x1 && up > selectionRectAttr.y1 && right < selectionRectAttr.x2 && down < selectionRectAttr.y2) {
            val = true; 
      }

      if (val) {
            drawRectangles(left, right, up, down);
            return;
      }

      if (pointSet.length <= 1) {
            drawRectangles(left, right, up, down);
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
            if (pointSet.length == 2 && pointSet[0][0] == medianValue && pointSet[1][0] == medianValue) {
                  leftPointSet.push(pointSet[0]);
                  rightPointSet.push(pointSet[1]);
            }
            else {
                  for (var point of pointSet) {
                        if (point[0] < medianValue) {
                              leftPointSet.push(point);
                        }
                        else {
                              rightPointSet.push(point);
                        }
                  }
            }
            verticalMediansCopy.push(medianValue);
            verticalMediansCopy = verticalMediansCopy.sort(function (a, b) {
                  return a - b;
            });
            var nextSplit = !takeXMedian;
            kdAlgo(rightPointSet, nextSplit, 0, medianValue, verticalMediansCopy, horizontalMedians, medianValue, right, up, down);
            kdAlgo(leftPointSet, nextSplit, 1, medianValue, verticalMediansCopy, horizontalMedians, left, medianValue, up, down);
      }
      else {
            var yPoints = getPoints(pointSet, 1); // Extract Y Points
            medianValue = getMedian(yPoints);
            var upPointSet = [];
            var downPointSet = [];
            if (pointSet.length == 2 && pointSet[0][1] == medianValue && pointSet[1][1] == medianValue) {
                  upPointSet.push(pointSet[0]);
                  downPointSet.push(pointSet[1]);
            }
            else {
                  for (var point of pointSet) {
                        if (point[1] < medianValue) {
                              upPointSet.push(point);
                        }
                        else {
                              downPointSet.push(point);
                        }
                  }
            }
            horizontalMediansCopy.push(medianValue);
            horizontalMediansCopy = horizontalMediansCopy.sort(function (a, b) {
                  return a - b;
            });
            var nextSplit = !takeXMedian;
            kdAlgo(upPointSet, nextSplit, 1, medianValue, verticalMedians, horizontalMediansCopy, left, right, up, medianValue);
            kdAlgo(downPointSet, nextSplit, 0, medianValue, verticalMedians, horizontalMediansCopy, left, right, medianValue, down);
      }
      return;
}

function drawRectangles(left, right, up, down) {
      butes = selectionRect.getCurrentAttributes();
      var one = left;
      var two = up;
      var three = right - left;
      var four = down - up;
      if (one + three < butes.x1 + butes.wid
            && one > butes.x1
            && two > butes.y1
            && two + four < butes.y1 + butes.hei
            &&!colored) {
            svg.append("rect")
                  //.attr("id", "temp")
                  .attr("x", one)
                  .attr("y", two)
                  .attr("width", three)
                  .attr("height", four)
                  .attr("fill-opacity", 0.3)
                  .attr("fill", "green")
                  .attr("stroke-width", 2)
                  .attr("stroke", "black");
      }
      else if (one < (butes.x1 + butes.wid)
            && one + three > butes.x1
            && two < (butes.y1 + butes.hei)
            && two + four > butes.y1
            &&!colored) {
            svg.append("rect")
                  //.attr("id", "temp")
                  .attr("x", one)
                  .attr("y", two)
                  .attr("width", three)
                  .attr("height", four)
                  .attr("fill-opacity", 0.3)
                  .attr("fill", "red")
                  .attr("stroke-width", 2)
                  .attr("stroke", "black");
      }
      else if(!colored){
            svg.append("rect")
                  //.attr("id", "temp")
                  .attr("x", one)
                  .attr("y", two)
                  .attr("width", three)
                  .attr("height", four)
                  .attr("fill-opacity", 0.3)
                  .attr("fill", "blue")
                  .attr("stroke-width", 2)
                  .attr("stroke", "black");
      }
}

function getPoints(pointSet, index) {
      var points = [];
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

function randomizePoints() {
	if(!disButtons) {
	 for (var i = 0; i < 42; i++) {
	    var pt = { x: Math.floor(Math.random() * Math.floor(w)), y: Math.floor(Math.random() * Math.floor(h)) };
	    dataset.push(pt);
	    ptnum += 1;
	}
      svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr(pts)
            .on("mouseover", over);
	}
}

//toggle la


function updateValue(x, y, boundaryType, boundaryVal) {
      for (point of setRectangles2) {
            if (point.x == x && point.y == y) {
                  point[boundaryType] = boundaryVal;
            }
      }
}

function kdAlgo2(pointSet, takeXMedian, isUpOrLeft, oldMedian, verticalMedians, horizontalMedians) {
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
            if (pointSet.length == 2 && pointSet[0][0] == medianValue && pointSet[1][0] == medianValue) {
                  leftPointSet.push(pointSet[0]);
                  updateValue(pointSet[0][0], pointSet[0][1], "right", medianValue);
                  rightPointSet.push(pointSet[1]);
                  updateValue(pointSet[1][0], pointSet[1][1], "left", medianValue);
            }
            else {
                  for (var point of pointSet) {
                        if (point[0] < medianValue) {
                              leftPointSet.push(point);
                              updateValue(point[0], point[1], "right", medianValue);
                        }
                        else {
                              rightPointSet.push(point);
                              updateValue(point[0], point[1], "left", medianValue);
                        }
                  }
            }
            verticalMediansCopy.push(medianValue);
            verticalMediansCopy = verticalMediansCopy.sort(function (a, b) {
                  return a - b;
            });
            var nextSplit = !takeXMedian;
            kdAlgo2(rightPointSet, nextSplit, 0, medianValue, verticalMediansCopy, horizontalMedians);
            kdAlgo2(leftPointSet, nextSplit, 1, medianValue, verticalMediansCopy, horizontalMedians);
      }
      else {
            var yPoints = getPoints(pointSet, 1); // Extract Y Points
            medianValue = getMedian(yPoints);
            var upPointSet = [];
            var downPointSet = [];
            if (pointSet.length == 2 && pointSet[0][1] == medianValue && pointSet[1][1] == medianValue) {
                  upPointSet.push(pointSet[0]);
                  updateValue(pointSet[0][0], pointSet[0][1], "right", medianValue);
                  downPointSet.push(pointSet[1]);
                  updateValue(pointSet[1][0], pointSet[1][1], "left", medianValue);
            }
            else {
                  for (var point of pointSet) {
                        if (point[1] < medianValue) {
                              upPointSet.push(point);
                              updateValue(point[0], point[1], "down", medianValue);
                        }
                        else {
                              downPointSet.push(point);
                              updateValue(point[0], point[1], "up", medianValue);
                        }
                  }
            }
            horizontalMediansCopy.push(medianValue);
            horizontalMediansCopy = horizontalMediansCopy.sort(function (a, b) {
                  return a - b;
            });
            var nextSplit = !takeXMedian;
            kdAlgo2(upPointSet, nextSplit, 1, medianValue, verticalMedians, horizontalMediansCopy);
            kdAlgo2(downPointSet, nextSplit, 0, medianValue, verticalMedians, horizontalMediansCopy);
      }
      return;
}

function drawRectangles2() {
	  //svg.selectAll("#temp").remove();
	  butes = selectionRect.getCurrentAttributes();
      for (rectangle of setRectangles2) {
            var one = rectangle.left;
            var two = rectangle.up;
            var three = rectangle.right - rectangle.left;
            var four = rectangle.down - rectangle.up;
            if (one + three < butes.x1 + butes.wid
                  && one > butes.x1
                  && two > butes.y1
                  && two + four < butes.y1 + butes.hei) {
                  //&& !colored2) {
                  svg.append("rect")
              			.attr("id","temp2")
                        .attr("x", one)
                        .attr("y", two)
                        .attr("width", three)
                        .attr("height", four)
                        .attr("fill-opacity", 0)
                        .attr("fill", "green")
                        .attr("stroke-width", 2)
                        .attr("stroke", "black");
            }
            else if (one < (butes.x1 + butes.wid)
                  && one + three > butes.x1
                  && two < (butes.y1 + butes.hei)
                  && two + four > butes.y1) {
            }
            else {
                  svg.append("rect")
                        .attr("id","temp2")
                        .attr("x", one)
                        .attr("y", two)
                        .attr("width", three)
                        .attr("height", four)
                        .attr("fill-opacity", 0)
                        .attr("fill", "blue")
                        .attr("stroke-width", 2)
                        .attr("stroke", "black");
            }
      }
}

var firstTime=false;
function kdDriver2() {
	c=0;
	if(!firstTime&&colored) {
	      setRectangles2=[];
	      var pointSet2 = new Array(dataset.length);
	      var hm = 0;
	      for (point of dataset) {
	            pointSet2[hm++] = [point.x, point.y];
	            var setRectangle = { x: point.x, y: point.y, up: 0, left: 0, down: h, right: w };
	            setRectangles2.push(setRectangle);
	      }
	      var verticalMedians = [0, w]
	      var horizontalMedians = [0, h]
	      kdAlgo2(pointSet2, 1, 1, h, verticalMedians, horizontalMedians);
	      drawRectangles2();
	      firstTime=true;
	      return;
	      //var answerLabel = document.getElementById("answerText");
	      //answerLabel.innerHTML = "Number of points inside the rectangle are: " + countPoints();
	}
	else if(colored){
		drawRectangles2();
	}
}