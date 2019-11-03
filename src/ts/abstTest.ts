import ToDoDataManager from './toDoDataManager';
import settingsDataManager from './settingsDataManager';

const tddm = new ToDoDataManager();
const sdm = new settingsDataManager();

tddm.import();
console.log(tddm.toDoDataArray);

sdm.import();
console.log(sdm.settingsData);
