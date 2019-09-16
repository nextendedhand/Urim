import Common from './common';

const common = new Common();

let toDoDataArray = JSON.parse(localStorage.getItem(common.key.toDoData));
console.log(toDoDataArray);

let settingsData = JSON.parse(localStorage.getItem(common.key.settingsData));
console.log(settingsData);
