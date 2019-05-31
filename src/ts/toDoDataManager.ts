import module = require('./toDoAbstData');
export class toDoDataManager {
	public toDoAbstArray : module.toDoAbstData[];

    constructor() {
        this.toDoAbstArray = [];
    }
}