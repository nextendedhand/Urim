"use strict";
exports.__esModule = true;
var toDoDetailData = /** @class */ (function () {
    function toDoDetailData(deadline, content, place) {
        this.content = content;
        this.deadline = deadline;
        this.place = place;
    }
    //getter
    toDoDetailData.prototype.getDeadLine = function () {
        return this.deadline;
    };
    toDoDetailData.prototype.getContent = function () {
        return this.content;
    };
    toDoDetailData.prototype.getToday = function () {
        return this.place;
    };
    //setter
    toDoDetailData.prototype.setDeadLine = function (deadline) {
        this.deadline = deadline;
    };
    toDoDetailData.prototype.setContent = function (content) {
        this.content = content;
    };
    toDoDetailData.prototype.setPlace = function (place) {
        this.place = place;
    };
    return toDoDetailData;
}());
exports["default"] = toDoDetailData;
;
//# sourceMappingURL=toDoDetailData.js.map