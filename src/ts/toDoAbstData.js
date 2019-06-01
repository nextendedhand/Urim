var toDoAbstData = (function () {
    function toDoAbstData(title, importance, urgency, manHour, genreId, detailDataId, today) {
        this.title = title;
        this.importance = importance;
        this.urgency = urgency;
        this.manHour = manHour;
        this.genreId = genreId;
        this.detailDataId = detailDataId;
        this.today = today;
    }
    //getter
    toDoAbstData.prototype.getTitle = function () {
        return this.title;
    };
    toDoAbstData.prototype.getImportance = function () {
        return this.importance;
    };
    toDoAbstData.prototype.getUrgency = function () {
        return this.urgency;
    };
    toDoAbstData.prototype.getManHour = function () {
        return this.manHour;
    };
    toDoAbstData.prototype.getGenreId = function () {
        return this.genreId;
    };
    toDoAbstData.prototype.getDetailDataId = function () {
        return this.detailDataId;
    };
    toDoAbstData.prototype.getToday = function () {
        return this.today;
    };
    //setter
    toDoAbstData.prototype.setTitle = function (title) {
        this.title = title;
    };
    toDoAbstData.prototype.setImportance = function (importance) {
        this.importance = importance;
    };
    toDoAbstData.prototype.setUrgency = function (urgency) {
        this.urgency = urgency;
    };
    toDoAbstData.prototype.setManHour = function (manHour) {
        this.manHour = manHour;
    };
    toDoAbstData.prototype.setGenreId = function (genreId) {
        this.genreId = genreId;
    };
    toDoAbstData.prototype.setDetailDataId = function (detailDataId) {
        this.detailDataId = detailDataId;
    };
    toDoAbstData.prototype.setToday = function (today) {
        this.today = today;
    };
    return toDoAbstData;
})();
exports.default = toDoAbstData;
;
