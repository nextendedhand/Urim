interface CanvasRenderingContext2D {
    arrow(context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, controlPoints: number[]): void;
}

CanvasRenderingContext2D.prototype.arrow = (context: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, controlPoints: number[]) => {
    let dx = endX - startX;
    let dy = endY - startY;
    let len: number = Math.sqrt(dx * dx + dy * dy);
    let sin: number = dy / len;
    let cos: number = dx / len;
    let a: number[] = [];
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
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    }

};

