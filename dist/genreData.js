"use strict";
exports.__esModule = true;
/**
* This is a class for genre data.
* It contains color and name of genre data.
*/
var genreData = /** @class */ (function () {
    /**
    * This is a constructor.
    * @param color
    * @param name
    */
    function genreData(color, name) {
        this.id = this.generateId();
        this.color = color;
        this.name = name;
    }
    /**
    * This is a function to generate ID.
    * @param void
    * @returns id
    */
    genreData.prototype.generateId = function () {
        // characters which is used as id
        var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        // Number of digits
        var len = 10;
        // generate id
        var id = "";
        for (var i = 0; i < len; i++) {
            id += str.charAt(Math.floor(Math.random() * str.length));
        }
        return id;
    };
    /**
    * This is getter for genre data id.
    * @param void
    * @returns id
    */
    genreData.prototype.getId = function () {
        return this.id;
    };
    /**
    * This is getter for color of genre data.
    * @param void
    * @returns color
    */
    genreData.prototype.getColor = function () {
        return this.color;
    };
    /**
    * This is getter for genre name.
    * @param void
    * @returns name
    */
    genreData.prototype.getName = function () {
        return this.name;
    };
    /**
    * This is setter for color.
    * @param color
    * @returns void
    */
    genreData.prototype.setColor = function (color) {
        this.color = color;
    };
    /**
    * This is setter for name of genre data.
    * @param name
    * @returns void
    */
    genreData.prototype.setName = function (name) {
        this.name = name;
    };
    return genreData;
}());
exports["default"] = genreData;
//# sourceMappingURL=genreData.js.map