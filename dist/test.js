"use strict";
exports.__esModule = true;
var toDoAbstData_1 = require("./toDoAbstData");
var toDoDATAMANAGER_1 = require("./toDoDATAMANAGER");
var genreData_1 = require("./genreData");
var settingData_1 = require("./settingData");
// init
var abst = new toDoAbstData_1["default"]('test', 'im', 1, 2, 3, 'XXXX/XX/XX', 'content', 'Japan', false);
var mng = new toDoDATAMANAGER_1["default"]();
var genre = new genreData_1["default"]('red', 'test');
var settingsData = new settingData_1["default"]();
console.log("test1: check the abstData object");
// check the init
console.log(abst);
// check getter function and setter function
console.log(abst.getTitle());
abst.setTitle("ahaha");
console.log(abst);
console.log("\n");
console.log("test2: check the DATAMANAGER object");
console.log(mng);
mng.toDoAbstArray.push(abst);
console.log(mng);
console.log("\n");
console.log("test3: check the genreData object");
console.log(genre);
// check getter function and setter function
console.log(genre.getColor());
genre.setColor("ahaha");
console.log(genre);
console.log("\n");
console.log("test4: check the settingsData object");
console.log("before");
console.log(settingsData);
settingsData.setGenreData(genre);
console.log("after");
console.log(settingsData);
settingsData["export"]();
console.log("exported");
//# sourceMappingURL=test.js.map