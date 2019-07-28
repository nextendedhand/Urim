"use strict";
exports.__esModule = true;
/**
* This is a class for detail data container of TODO items.
* It contains content, deadline and place information.
*/
var toDoDetailData = /** @class */ (function () {
    /**
    * This is a constructor.
    * @param content - TODO item's content.
    * @param deadline - TODO items's deadline.
    * @param place - Place where you do this action.
    */
    function toDoDetailData(deadline, content, place) {
        this.content = content;
        this.deadline = deadline;
        this.place = place;
    }
    /**
    * This is getter for TODO item's deadline.
    * @param void
    * @returns deadline
    */
    toDoDetailData.prototype.getDeadLine = function () {
        return this.deadline;
    };
    /**
    * This is getter for TODO item's content.
    * @param void
    * @returns content
    */
    toDoDetailData.prototype.getContent = function () {
        return this.content;
    };
    /**
    * This is getter for place you should do this.
    * @param void
    * @returns place
    */
    toDoDetailData.prototype.getPlace = function () {
        return this.place;
    };
    /**
    * This is setter for TODO item's deadline.
    * @param deadline - TODO items's deadline.
    * @returns void
    */
    toDoDetailData.prototype.setDeadLine = function (deadline) {
        this.deadline = deadline;
    };
    /**
    * This is setter for TODO contents.
    * @param content - TODO item's content.
    * @returns void
    */
    toDoDetailData.prototype.setContent = function (content) {
        this.content = content;
    };
    /**
    * This is setter for place you should do this.
    * @param place - Place where you do this action.
    * @returns void
    */
    toDoDetailData.prototype.setPlace = function (place) {
        this.place = place;
    };
    return toDoDetailData;
}());
exports["default"] = toDoDetailData;
;
//# sourceMappingURL=toDoDetailData.js.map