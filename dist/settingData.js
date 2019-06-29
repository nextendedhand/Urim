"use strict";
exports.__esModule = true;
var fs = require("fs");
/**
* This is a class for settings.
* It contains urgencyScale and array of genre data.
*/
var settingData = /** @class */ (function () {
    /**
    * This is a constructor.
    * @param void
    */
    function settingData() {
        this.exportGenreDataPathToFile = "../data/new/genreData.json";
        this.importSettingsDataPathToFile = "../data/settingsData.json";
        this.exportSettingsDataPathToFile = "../data/new/settingsData.json";
        this.urgencyScale = 1;
        this.importSettingsData();
    }
    /**
    * This is getter for genre data array.
    * @param void
    * @returns genreArray
    */
    settingData.prototype.getGenreData = function () {
        return this.genreArray;
    };
    /**
    * This is getter for urgency scale.
    * @param void
    * @returns urgencyScale
    */
    settingData.prototype.getUrgencyScale = function () {
        return this.urgencyScale;
    };
    /**
    * This is setter for genre data.
    * @param genreData
    * @returns void
    */
    settingData.prototype.setGenreData = function (genreData) {
        //let id = this.generateId();
        //genreData.setId(id);
        this.genreArray.push(genreData);
    };
    /**
    * This is setter for urgency scale.
    * @param urgencyScale
    * @returns void
    */
    settingData.prototype.setUrgencyScale = function (urgencyScale) {
        this.urgencyScale = urgencyScale;
    };
    /**
    * This is a function to delete genre data from genreDataArray.
    * @param id
    * @returns void
    */
    settingData.prototype.deleteGenreData = function (id) {
        var isDeleted = false;
        for (var index in this.genreArray) {
            if (this.genreArray[index]['id'] == id) {
                delete this.genreArray[index];
                isDeleted = true;
            }
        }
        if (!isDeleted) {
            console.log("Cannot find todo data(id: " + id + " )");
        }
    };
    /**
    * This is a function to import genre data from a JSON file.
    * @param void
    * @returns boolean
    */
    settingData.prototype.importGenreData = function () {
        try {
            console.log('loading GenreData JSON file...');
            var genreDataArray = JSON.parse(fs.readFileSync(this.importGenreDataPathToFile, 'utf8'));
            this.genreArray = genreDataArray;
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Loading GenreData Complete.");
        return true;
    };
    /**
    * This is a function to export genre data to a JSON file.
    * @param void
    * @returns boolean
    */
    settingData.prototype.exportGenreData = function () {
        try {
            console.log("exporting GenreData JSON file...");
            var json_text = JSON.stringify(this.genreArray);
            fs.writeFileSync(this.exportGenreDataPathToFile, json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    /**
    * This is a function to import settings data from a JSON file.
    * @param void
    * @returns boolean
    */
    settingData.prototype.importSettingsData = function () {
        try {
            console.log('loading SettingsData JSON file...');
            var settingsDataArray = JSON.parse(fs.readFileSync(this.importSettingsDataPathToFile, 'utf8'));
            this.importGenreDataPathToFile = settingsDataArray[0]['genreData'];
            this.urgencyScale = Number(settingsDataArray[0]['urgencyScale']);
            this.importGenreData();
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Loading SettingsData Complete.");
        return true;
    };
    /**
    * This is a function to export settings data to a JSON file.
    * @param void
    * @returns boolean
    */
    settingData.prototype.exportSettingsData = function () {
        try {
            console.log("exporting SettingsData JSON file...");
            var settingsData = {};
            settingsData['genreData'] = this.importGenreDataPathToFile;
            settingsData['urgencyScale'] = this.urgencyScale;
            var json_text = JSON.stringify(settingsData);
            fs.writeFileSync(this.exportSettingsDataPathToFile, json_text);
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