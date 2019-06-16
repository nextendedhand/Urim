"use strict";
exports.__esModule = true;
var toDoDetailData_1 = require("./toDoDetailData");
/**
* This is a claas for data container of TODO items.
* It contains title, importance value, urgency value etc.
*/
var toDoAbstData = /** @class */ (function () {
    /**
    * This is a constructor.
    * @param title - TODO item's title
    * @param importance - TODO items's importance.(1,2,3,4)
    * @param urgency - TODO item's urgency. It calculates from the remaining days.
    * @param manHour - TODO items's man hour.(days?)
    * @param genreId - TODO item's genreId.
    * @param deadline - TODO items's deadline.
    * @param content - TODO item's content.
    * @param place - Place where you do this action.
    * @param today - A flag whether you should do this action today.
    */
    function toDoAbstData(title, importance, urgency, manHour, genreId, deadline, content, place, today) {
        this.title = title;
        this.importance = importance;
        this.urgency = urgency;
        this.manHour = manHour;
        this.genreId = genreId;
        this.today = today;
        this.detailData = new toDoDetailData_1["default"](deadline, content, place);
    }
    /**
    * This is getter for TODO item's title.
    * @param void
    * @returns title
    */
    toDoAbstData.prototype.getTitle = function () {
        return this.title;
    };
    /**
    * This is getter for TODO item's importance.
    * @param void
    * @returns importance
    */
    toDoAbstData.prototype.getImportance = function () {
        return this.importance;
    };
    /**
    * This is getter for TODO item's urgency.
    * @param void
    * @returns urgency
    */
    toDoAbstData.prototype.getUrgency = function () {
        return this.urgency;
    };
    /**
    * This is getter for TODO item's man hour.
    * @param void
    * @returns manHour
    */
    toDoAbstData.prototype.getManHour = function () {
        return this.manHour;
    };
    /**
    * This is getter for TODO item's genre id.
    * @param void
    * @returns genreId
    */
    toDoAbstData.prototype.getGenreId = function () {
        return this.genreId;
    };
    /**
    * This is getter for TODO item's detail data.
    * @param void
    * @returns detailData
    */
    toDoAbstData.prototype.getDetailData = function () {
        return this.detailData;
    };
    /**
    * This is getter for the flag whether you should do this action today.
    * @param void
    * @returns today
    */
    toDoAbstData.prototype.getToday = function () {
        return this.today;
    };
    /**
    * This is setter for TODO item's title.
    * @param title
    * @returns void
    */
    toDoAbstData.prototype.setTitle = function (title) {
        this.title = title;
    };
    /**
    * This is setter for TODO item's importance.
    * @param importance
    * @returns void
    */
    toDoAbstData.prototype.setImportance = function (importance) {
        this.importance = importance;
    };
    /**
    * This is setter for TODO item's urgency.
    * @param urgency
    * @returns void
    */
    toDoAbstData.prototype.setUrgency = function (urgency) {
        this.urgency = urgency;
    };
    /**
    * This is setter for TODO item's man hour.
    * @param manHour
    * @returns void
    */
    toDoAbstData.prototype.setManHour = function (manHour) {
        this.manHour = manHour;
    };
    /**
    * This is setter for TODO item's genre id.
    * @param genreId
    * @returns void
    */
    toDoAbstData.prototype.setGenreId = function (genreId) {
        this.genreId = genreId;
    };
    /**
    * This is setter for TODO item's detail data.
    * @param content - TODO item's content.
    * @param deadline - TODO items's deadline.
    * @param place - Place where you do this action.
    * @returns void
    */
    toDoAbstData.prototype.setDetailData = function (content, deadline, place) {
        this.detailData.setContent(content);
        this.detailData.setDeadLine(deadline);
        this.detailData.setPlace(place);
    };
    /**
    * This is setter for a flag whether you should do this action today.
    * @param today
    * @returns void
    */
    toDoAbstData.prototype.setToday = function (today) {
        this.today = today;
    };
    return toDoAbstData;
}());
exports["default"] = toDoAbstData;
;
//# sourceMappingURL=toDoAbstData.js.map