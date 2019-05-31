import abstData = require('./toDoAbstData');
import DataManager = require('./toDoDataManager');
import genreData = require('./genreData');
import settingsData = require('./settingsData');


var abst = new abstData.toDoAbstData('test','im',1,2,3,4,false);    
var mng = new DataManager.toDoDataManager();

var genre = new genreData.genreData('red','test');
var settingsData = new settingsData.settingsData();

console.log(mng);
mng.toDoAbstArray.push(abst);

console.log("test1");
console.log(abst);
console.log("test2");
console.log(mng);


console.log("test3");
console.log(genre);
console.log("test4");
console.log(settingsData);
