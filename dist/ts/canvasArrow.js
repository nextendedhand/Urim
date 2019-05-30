CanvasRenderingContext2D.prototype.arrow = function (context, startX, startY, endX, endY, controlPoints) {
    var dx = endX - startX;
    var dy = endY - startY;
    var len = Math.sqrt(dx * dx + dy * dy);
    var sin = dy / len;
    var cos = dx / len;
    var a = [];
    a.push(0, 0);
    for (var i = 0; i < controlPoints.length; i += 2) {
        var x = controlPoints[i];
        var y = controlPoints[i + 1];
        a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (var i = controlPoints.length; i > 0; i -= 2) {
        var x = controlPoints[i - 2];
        var y = controlPoints[i - 1];
        a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (var i = 0; i < a.length; i += 2) {
        var x = a[i] * cos - a[i + 1] * sin + startX;
        var y = a[i] * sin + a[i + 1] * cos + startY;
        if (i === 0)
            context.moveTo(x, y);
        else
            context.lineTo(x, y);
    }
};
//# sourceMappingURL=canvasArrow.js.map