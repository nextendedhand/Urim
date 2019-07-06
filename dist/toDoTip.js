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
    return ToDoTip;
}(ToDoDataObject_1["default"]));
exports["default"] = ToDoTip;
//# sourceMappingURL=ToDoTip.js.map