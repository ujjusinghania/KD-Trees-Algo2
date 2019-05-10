class Point {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
    }
}

var pointSet = [];

console.log("Hello World");

function kdAlgo(pointSet, takeXMedian) {
    if (pointSet.length == 1) {
        return; 
    }
    if (takeXMedian) {
        var xPoints; // Extract X Points
        // xMedian = getMedian(xPoints);
        // kdAlgo(upPointSet, !takeXMedian);
        // kdAlgo(downPointSet, !takeXMedian);
    }
    else {
        var yPoints; // Extract Y Points
        // yMedian = getMedian(yPoints);
        // kdAlgo(leftPointSet, !takeXMedian);
        // kdAlgo(rightPointSet, !takeXMedian);
    }
    sendMedian() // Plot Median Line

}

function getMedian(points) {
    points = points.sort();
    return points[points.length/2];
}

console.log(getMedian([1, 2, 4, 2, 1, 5]));