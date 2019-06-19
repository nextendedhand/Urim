"use strict";
exports.__esModule = true;
var axisManager_1 = require("./axisManager");
var UrimPlaneManager = /** @class */ (function () {
    function UrimPlaneManager(canvas) {
        this.imToCoord = {
            'S': 0,
            'A': 1,
            'B': 2,
            'C': 3
        };
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.urAxis = new axisManager_1["default"](0, canvas.height / 2, canvas.width, canvas.height / 2, [0, 5, -20, 5, -20, 15]);
        this.imAxis = new axisManager_1["default"](canvas.width / 2, canvas.height, canvas.width / 2, 0, [0, 5, -20, 5, -20, 15]);
    }
    UrimPlaneManager.prototype.setupCanvas = function (canvas) {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        this.width = canvas.width = rect.width * dpr;
        this.height = canvas.height = rect.height * dpr;
        var ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return ctx;
    };
    UrimPlaneManager.prototype.calcImpCoord = function (canvas, importance) {
        return canvas.height * this.imToCoord[importance] / 4 + canvas.height / 20;
    };
    UrimPlaneManager.prototype.renderAxis = function (canvas, ctx) {
        canvas.height = this.height;
        canvas.width = this.width;
        this.urAxis.startY = canvas.height / 2;
        this.urAxis.endX = canvas.width;
        this.urAxis.endY = canvas.height / 2;
        this.imAxis.startX = canvas.width / 2;
        this.imAxis.startY = canvas.height;
        this.imAxis.endX = canvas.width / 2;
        this.urAxis.create(ctx);
        this.imAxis.create(ctx);
    };
    UrimPlaneManager.prototype.renderToDo = function (canvas, ctx) {
        var _this = this;
        var toDoDatas = [{
                title: 'hoge',
                importance: 'S',
                urgency: '2'
            }, {
                title: 'fuga',
                importance: 'A',
                urgency: '5'
            }];
        var fontSize = canvas.width / 70;
        ctx.font = fontSize + "px Arial"; //フォントにArial,40px,斜体を指定
        toDoDatas.forEach(function (toDoData) {
            ctx.fillText(toDoData.title, canvas.width / 10, _this.calcImpCoord(canvas, toDoData.importance));
        });
    };
    UrimPlaneManager.prototype.render = function (canvas, container) {
        var ctx = this.setupCanvas(canvas);
        this.renderAxis(canvas, ctx);
        this.renderToDo(canvas, ctx);
    };
    return UrimPlaneManager;
}());
exports["default"] = UrimPlaneManager;
//# sourceMappingURL=urimPlaneManager.js.map