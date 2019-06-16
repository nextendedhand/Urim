"use strict";
exports.__esModule = true;
var fs = require("fs");
var settingData = /** @class */ (function () {
    function settingData() {
        this.pathToFile = "../data/genreData.json";
        //this.genreArray = [];
        this.urgencyScale = 1;
        this["import"]();
        this.genreIndexNumber = this.genreArray.length;
    }
    //getter : get all genre data
    settingData.prototype.getGenreData = function () {
        return this.genreArray;
    };
    settingData.prototype.getUrgencyScale = function () {
        return this.urgencyScale;
    };
    //setter totyu
    settingData.prototype.setGenreData = function (genreData) {
        genreData.setId(this.genreIndexNumber);
        this.genreIndexNumber = this.genreIndexNumber + 1;
        this.genreArray.push(genreData);
    };
    settingData.prototype.setUrgencyScale = function (urgencyScale) {
        this.urgencyScale = urgencyScale;
    };
    // delete a genre data from genreArray
    settingData.prototype["delete"] = function (id) {
    };
    // import a genre data from JSON file into genreArray
    settingData.prototype["import"] = function () {
        try {
            console.log('loading JSON file...');
            var genreDataArray = JSON.parse(fs.readFileSync(this.pathToFile, 'utf8'));
            this.genreArray = genreDataArray;
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    // export genreArray into a JSON file
    settingData.prototype["export"] = function () {
        try {
            console.log("exporting JSON file...");
            var json_text = JSON.stringify(this.genreArray);
            fs.writeFileSync('../data/new/genreData.json', json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    return settingData;
}());
exports["default"] = settingData;
//# sourceMappingURL=settingData.js.map