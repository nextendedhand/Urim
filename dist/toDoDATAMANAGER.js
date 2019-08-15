"use strict";
exports.__esModule = true;
var toDoData_1 = require("./toDoData");
var fs = require("fs");
/**
* This is a class for a manager.
* It contains a list for toDoAbstData.
*/
var toDoDataManager = /** @class */ (function () {
    /**
    * This is a constructor.
    * @param void
    */
    function toDoDataManager() {
        this.importPathToFile = "../data/todoData.json";
        this.exportPathToFile = "../data/new/todoData.json";
        this.toDoDataArray = [];
    }
    /**
    * This is a function to import TODO data from a JSON file.
    * @param void
    * @returns boolean
    */
    toDoDataManager.prototype["import"] = function () {
        try {
            console.log('loading JSON file...');
            var toDoDataArray = JSON.parse(fs.readFileSync(this.importPathToFile, 'utf8'));
            for (var index in toDoDataArray) {
                var tmpToDoData = toDoDataArray[index];
                var data = new toDoData_1["default"](tmpToDoData['title'], tmpToDoData['importance'], tmpToDoData['urgency'], tmpToDoData['manHour'], tmpToDoData['genreId'], tmpToDoData['deadline'], tmpToDoData['content'], tmpToDoData['place'], tmpToDoData['today']);
                this.toDoDataArray.push(data);
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log('Complete.');
        return true;
    };
    /**
    * This is a function to export TODO data to a JSON file.
    * @param void
    * @returns boolean
    */
    toDoDataManager.prototype["export"] = function () {
        try {
            console.log("exporting JSON file...");
            var json_text = JSON.stringify(this.toDoDataArray);
            fs.writeFileSync(this.exportPathToFile, json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    /**
    * This is a function to delete todo data from toDoDataArray.
    * @param id
    * @returns void
    */
    toDoDataManager.prototype["delete"] = function (id) {
        var isDeleted = false;
        for (var index in this.toDoDataArray) {
            if (this.toDoDataArray[index]['id'] == id) {
                delete this.toDoDataArray[index];
                isDeleted = true;
            }
        }
        if (!isDeleted) {
            console.log("Cannot find todo data(id: " + id + " )");
        }
    };
    return toDoDataManager;
}());
exports["default"] = toDoDataManager;
//# sourceMappingURL=toDoDATAMANAGER.js.map