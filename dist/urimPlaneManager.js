"use strict";
exports.__esModule = true;
var axisManager_1 = require("./axisManager");
var UrimPlaneManager = /** @class */ (function () {
    function UrimPlaneManager(canvas) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.urAxis = new axisManager_1["default"](0, canvas.height / 2, canvas.width, canvas.height / 2, [0, 5, -20, 5, -20, 15]);
        this.imAxis = new axisManager_1["default"](canvas.width / 2, canvas.height, canvas.width / 2, 0, [0, 5, -20, 5, -20, 15]);
    }
    UrimPlaneManager.prototype.render = function (canvas, container) {
        var ctx = canvas.getContext("2d");
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        this.urAxis.startY = canvas.height / 2;
        this.urAxis.endX = canvas.width;
        this.urAxis.endY = canvas.height / 2;
        this.imAxis.startX = canvas.width / 2;
        this.imAxis.startY = canvas.height;
        this.imAxis.endX = canvas.width / 2;
        this.urAxis.create(ctx);
        this.imAxis.create(ctx);
    };
    return UrimPlaneManager;
}());
exports["default"] = UrimPlaneManager;
//# sourceMappingURL=urimPlaneManager.js.map