"use strict";
exports.__esModule = true;
var axisManager_1 = require("./axisManager");
var UrimPlaneManager = /** @class */ (function () {
    // cell[importance][urgency][index]: 各importance, urgencyでのtoDoデータIDを格納する
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
        this.urimCell = [
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]]
        ];
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
    UrimPlaneManager.prototype.urToCoord = function (urgency) {
        if (urgency >= 1 && urgency <= 5) {
            return 20 - urgency;
        }
        else if (urgency >= 6 && urgency <= 30) {
            return (urgency - 5) % 5 !== 0 ? 20 - 6 - Math.floor((urgency - 5) / 5) : 20 - 5 - Math.floor((urgency - 5) / 5);
        }
        else if (urgency >= 31 && urgency <= 90) {
            return (urgency - 30) % 12 !== 0 ? 20 - 11 - Math.floor((urgency - 30) / 12) : 20 - 10 - Math.floor((urgency - 30) / 12);
        }
        else if (urgency >= 91) {
            return (urgency - 90) % 30 !== 0 ? 20 - 16 - Math.floor((urgency - 30) / 18) : 20 - 15 - Math.floor((urgency - 90) / 18);
        }
        else if (urgency >= 163) {
            return 0;
        }
    };
    UrimPlaneManager.prototype.calcImCoord = function (canvas, importance) {
        return canvas.height * this.imToCoord[importance] / 4 + canvas.height / 20;
    };
    UrimPlaneManager.prototype.calcUrCoord = function (canvas, urgency) {
        return this.urToCoord(urgency) * canvas.width / 20;
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
    UrimPlaneManager.prototype.renderToDo = function (canvas, ctx, toDoDatas) {
        var _this = this;
        var fontSize = canvas.width / 70;
        ctx.font = fontSize + "px Arial";
        toDoDatas.forEach(function (toDoData) {
            // CellManager呼んで、格納する？別のメソッドで呼ぶ？
            // データの格納
            if (_this.urimCell[_this.imToCoord[toDoData.importance]][1][0] !== -1) {
                _this.urimCell[_this.imToCoord[toDoData.importance]][1].push(toDoData.id);
            }
            else {
                _this.urimCell[_this.imToCoord[toDoData.importance]][1] = [toDoData.id];
            }
        });
        this.urimCell.forEach(function (imArray) {
            imArray.forEach(function (cell) {
                if (cell[0] !== -1) {
                    cell.forEach(function (id, index) {
                        // TODO: スマートに四角形の大きさとか決める
                        console.log(toDoDatas[id].urgency, _this.urToCoord(toDoDatas[id].urgency));
                        ctx.rect(_this.calcUrCoord(canvas, toDoDatas[id].urgency), _this.calcImCoord(canvas, toDoDatas[id].importance) - canvas.height / 40, canvas.width / 20, canvas.height / 32);
                        ctx.stroke();
                        ctx.fillText(toDoDatas[id].title, _this.calcUrCoord(canvas, toDoDatas[id].urgency), _this.calcImCoord(canvas, toDoDatas[id].importance));
                    });
                }
            });
        });
    };
    UrimPlaneManager.prototype.render = function (canvas, container, toDoDatas) {
        var ctx = this.setupCanvas(canvas);
        this.renderAxis(canvas, ctx);
        this.renderToDo(canvas, ctx, toDoDatas);
    };
    return UrimPlaneManager;
}());
exports["default"] = UrimPlaneManager;
//# sourceMappingURL=urimPlaneManager.js.map