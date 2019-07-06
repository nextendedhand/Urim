"use strict";
exports.__esModule = true;
var axisManager_1 = require("./axisManager");
var ToDoTip_1 = require("./ToDoTip");
var UrimPlaneManager = /** @class */ (function () {
    // cell[importance][urgency][index]: 各importance, urgencyでのtoDoデータIDを格納する
    function UrimPlaneManager(canvas, toDoDatas) {
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
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']],
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']],
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']],
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']]
        ];
        this.createUrimCell(toDoDatas);
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
    UrimPlaneManager.prototype.createUrimCell = function (toDoDatas) {
        var _this = this;
        // urimCellにデータ格納する
        // ToDO: UtimCellクラス作るかどうか考える
        toDoDatas.forEach(function (toDoData) {
            if (_this.urimCell[_this.imToCoord[toDoData.importance]][1][0] !== '') {
                _this.urimCell[_this.imToCoord[toDoData.importance]][1].push(toDoData.id);
            }
            else {
                _this.urimCell[_this.imToCoord[toDoData.importance]][1] = [toDoData.id];
            }
        });
    };
    UrimPlaneManager.prototype.createToDoTips = function (canvas, toDoDatas) {
        var _this = this;
        var toDoTips = new Array();
        this.urimCell.forEach(function (imArray) {
            imArray.forEach(function (cell) {
                if (cell[0] !== '') {
                    cell.forEach(function (id) {
                        // urimCellに格納されたidと一致するtoDoDataを検索して代入
                        var toDoData = (function (id) {
                            return toDoDatas.find(function (tDD) { return tDD.id === id; });
                        })(id);
                        // toDoTipの作成
                        // - left
                        // - right
                        // - top
                        // - bottom
                        // を計算する
                        var toDoTip = new ToDoTip_1["default"]();
                        toDoTip.title = toDoData.title;
                        toDoTip.importance = toDoData.importance;
                        toDoTip.urgency = toDoData.urgency;
                        toDoTip.today = toDoData.today;
                        toDoTip.id = toDoData.id;
                        toDoTip.left = _this.calcUrCoord(canvas, toDoData.urgency);
                        toDoTip.top = _this.calcImCoord(canvas, toDoData.importance);
                        toDoTip.width = canvas.width / 20;
                        toDoTip.height = canvas.height / 32;
                        toDoTip.right = toDoTip.left + toDoTip.width;
                        toDoTip.bottom = toDoTip.top - toDoTip.height;
                        toDoTip.setTextPosition(toDoTip.left, toDoTip.top + canvas.height / 40);
                        toDoTips.push(toDoTip);
                    });
                }
            });
        });
        return toDoTips;
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
    UrimPlaneManager.prototype.renderToDo = function (toDoTip, canvas, ctx) {
        // toDoDataの矩形描画開始
        ctx.beginPath();
        // toDoDataの描画矩形の設定
        ctx.rect(toDoTip.left, toDoTip.top, toDoTip.width, toDoTip.height);
        // toDoDataの色設定
        // todayかどうかで色が決まる
        if (toDoTip.today) {
            ctx.fillStyle = 'rgb(192, 80, 77)';
            ctx.fill();
        }
        else {
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.stroke();
        }
        // toDoDataの文字描画開始
        ctx.beginPath();
        var fontSize = canvas.width / 70;
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillText(toDoTip.title, toDoTip.getTextPosition().x, toDoTip.getTextPosition().y);
    };
    UrimPlaneManager.prototype.render = function (canvas, ctx, toDoTips) {
        var _this = this;
        this.renderAxis(canvas, ctx);
        toDoTips.forEach(function (toDoTip) {
            _this.renderToDo(toDoTip, canvas, ctx);
        });
    };
    return UrimPlaneManager;
}());
exports["default"] = UrimPlaneManager;
//# sourceMappingURL=urimPlaneManager.js.map