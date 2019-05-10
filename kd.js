function kdAlgo(pointSet, takeXMedian) {
    if (pointSet.length == 1) {
        return; 
    }
    var medianValue; 
    if (takeXMedian) {
        var xPoints = getPoints(pointSet, 0); // Extract X Points
        medianValue = getMedian(xPoints);
        upPointSet = [];
        downPointSet = [];
        for (var point of pointSet) {
            if (point[0] < medianValue) {
                downPointSet.push(point);
            }
            else {
                upPointSet.push(point);
            }
        }
        kdAlgo(upPointSet, !takeXMedian);
        kdAlgo(downPointSet, !takeXMedian);
    }
    else {
        var yPoints = getPoints(pointSet, 1); // Extract Y Points
        medianValue = getMedian(yPoints);
        leftPointSet = [];
        rightPointSet = [];
        for (var point of pointSet) {
            if (point[1] < medianValue) {
                leftPointSet.push(point);
            }
            else {
                rightPointSet.push(point);
            }
        }
        kdAlgo(leftPointSet, !takeXMedian);
        kdAlgo(rightPointSet, !takeXMedian);
    }
    sendMedian(medianValue); // Plot Median Line
}

function getPoints(pointSet, index) {
    var points = [];
    for (var point of pointSet) {
        points.push(point[index]);
    }
    return points; 
}

function getMedian(points) {
    points = points.sort();
    return points[points.length/2];
}

console.log(getMedian([1, 2, 4, 2, 1, 5]));