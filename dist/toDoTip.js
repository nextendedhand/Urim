"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ToDoDataObject_1 = require("./ToDoDataObject");
var ToDoTip = /** @class */ (function (_super) {
    __extends(ToDoTip, _super);
    function ToDoTip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToDoTip.prototype.setTextPosition = function (xPos, yPos) {
        this.text = {
            x: xPos,
            y: yPos
        };
    };
    ToDoTip.prototype.getTextPosition = function () {
        return this.text;
    };
    ToDoTip.prototype.isClicked = function (p) {
        return (this.left <= p.x && p.x <= this.right) && (this.top <= p.y && p.y <= this.bottom);
    };
    ToDoTip.prototype.toggleToday = function (canvas, ctx) {
        this.today = !this.today;
        // ToDo: 共有データのtodayプロパティもtoggleする
        ctx.beginPath();
        // toDoDataの描画矩形の設定
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.stroke();
        ctx.fillStyle = this.today ? 'rgb(192, 80, 77)' : 'rgb(234, 234, 234)';
        ctx.fill();
        // toDoDataの文字描画開始
        ctx.beginPath();
        var fontSize = canvas.width / 70;
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillText(this.title, this.getTextPosition().x, this.getTextPosition().y);
    };
    return ToDoTip;
}(ToDoDataObject_1["default"]));
exports["default"] = ToDoTip;
//# sourceMappingURL=ToDoTip.js.map