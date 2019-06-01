//import * as fs from 'fs';
var settingData = (function () {
    function settingData() {
        //https://qiita.com/ConquestArrow/items/494d798a4e0788c41a7c を参考に設定変数だけ外に出す
        this.pathToFile = "../data/genreData.json";
        this.genreArray = [];
        this.urgencyScale = 1;
        this.import();
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
        this.genreArray.push(genreData);
    };
    settingData.prototype.setUrgencyScale = function (urgencyScale) {
        this.urgencyScale = urgencyScale;
    };
    // delete a genre data from genreArray
    settingData.prototype.delete = function (id) {
    };
    // import a genre data from JSON file into genreArray
    settingData.prototype.import = function () {
        try {
            console.log('loading JSON file...');
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    // export genreArray into a JSON file
    settingData.prototype.export = function () {
        try {
            console.log("exporting JSON file...");
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    return settingData;
})();
exports.default = settingData;
