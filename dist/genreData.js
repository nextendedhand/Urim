"use strict";
exports.__esModule = true;
var genreData = /** @class */ (function () {
    //　id　dousiyou
    function genreData(color, name) {
        this.color = color;
        this.name = name;
    }
    //getter
    genreData.prototype.getId = function () {
        return this.id;
    };
    genreData.prototype.getColor = function () {
        return this.color;
    };
    genreData.prototype.getName = function () {
        return this.name;
    };
    //setter
    genreData.prototype.setId = function (id) {
        this.id = id;
    };
    genreData.prototype.setColor = function (color) {
        this.color = color;
    };
    genreData.prototype.setName = function (name) {
        this.name = name;
    };
    return genreData;
}());
exports["default"] = genreData;
//# sourceMappingURL=genreData.js.map