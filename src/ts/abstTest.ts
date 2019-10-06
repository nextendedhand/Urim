import Common from './common';
import ToDoDataManager from './toDoDataManager';
import settingsDataManager from './settingsDataManager';

const common = new Common();
const tddm = new ToDoDataManager();
const sdm = new settingsDataManager();

let toDoDataArray = tddm.importFromLocalStorage();
console.log(tddm.toDoDataArray);

let settingsData = sdm.importFromLocalStorage();
console.log(sdm.settingsData);
