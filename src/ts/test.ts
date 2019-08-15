import abstData from './toDoData';
import DATAMANAGER from './toDoDATAMANAGER';
import genreData from './genreData';
import settingData from './settingData';

// init
var abst = new abstData('test', 'im', 1, 2, 3, 'XXXX/XX/XX', 'content', 'Japan', false);
var mng = new DATAMANAGER();
var genre = new genreData('red', 'test');
var settingsData = new settingData();

//settingsData.importSettingsData();

console.log("import tododata")
mng.import();
mng.delete('0')
mng.delete('3')

console.log("test1: check the abstData object");
// check the init
console.log(abst);

// check getter function and setter function
console.log(abst.getTitle());
abst.setTitle("ahaha");
console.log(abst);

console.log("\n")
console.log("test2: check the DATAMANAGER object");
console.log(mng);
mng.toDoDataArray.push(abst);
console.log(mng);


console.log("\n")
console.log("test3: check the genreData object");

console.log(genre);
// check getter function and setter function
console.log(genre.getColor());
genre.setColor("ahaha");
console.log(genre);


console.log("\n")
console.log("test4: check the settingsData object");
console.log("before");
console.log(settingsData);

settingsData.setGenreData(genre);
console.log("after")
console.log(settingsData);

settingsData.deleteGenreData('0')

settingsData.exportGenreData();
console.log("exported")
settingsData.exportSettingsData();
