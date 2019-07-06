"use strict";
exports.__esModule = true;
var AxisManager = /** @class */ (function () {
    function AxisManager(startX, startY, endX, endY, controlPoints) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.controlPoints = controlPoints;
    }
    /**
     * Draw arrow by specifying a start point, end point, and control points.
     *
     * @remarks
     * This method is additional method of CanvasRenderingContext2D interface.
     * The origin is upper left in canvas element.
     * x direction is right direction.
     * y direction is down direction.
     *
     * @param ctx - The 2D rendering context to rendering in canvas element
     * @param startX - The x coordinate of start point
     * @param startY - The y coordinate of start point
     * @param endX - The x coordinate of end point
     * @param endY - The y coordinate of end point
     * @param controlPoints - The coordinates of control points which is relative coordinates
     *                        from start point or end point.
     *                        Odd-numbered value is x coordinate.
     *                        Positive value is from the start point and negative is from end   point.
     *                        Even-numbered value is y coordinate.
     *
     * @returns void
     */
    AxisManager.prototype.create = function (ctx) {
        var dx = this.endX - this.startX;
        var dy = this.endY - this.startY;
        var len = Math.sqrt(dx * dx + dy * dy);
        var sin = dy / len;
        var cos = dx / len;
        var pathPoints = [];
        pathPoints.push(0, 0);
        for (var i = 0; i < this.controlPoints.length; i += 2) {
            var x = this.controlPoints[i];
            var y = this.controlPoints[i + 1];
            pathPoints.push(x < 0 ? len + x : x, y);
        }
        pathPoints.push(len, 0);
        for (var i = this.controlPoints.length; i > 0; i -= 2) {
            var x = this.controlPoints[i - 2];
            var y = this.controlPoints[i - 1];
            pathPoints.push(x < 0 ? len + x : x, -y);
        }
        pathPoints.push(0, 0);
        ctx.beginPath();
        ctx.fillStyle = 'rgb(0, 0, 0)';
        for (var i = 0; i < pathPoints.length; i += 2) {
            var x = pathPoints[i] * cos - pathPoints[i + 1] * sin + this.startX;
            var y = pathPoints[i] * sin + pathPoints[i + 1] * cos + this.startY;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    };
    return AxisManager;
}());
exports["default"] = AxisManager;
//# sourceMappingURL=axisManager.js.map