import toDoData from './toDoData';
import * as fs from 'fs';
import * as path from 'path';

/**
* This is a class for a manager.
* It contains a list for toDoAbstData.
*/
export default class toDoDataManager {
    public importPathToFile: string;
    public exportPathToFile: string;
    public toDoDataArray: toDoData[];

    /**
    * This is a constructor.
    * @param void
    */
    constructor() {
        this.importPathToFile = path.resolve(__dirname, '../data/todoData.json');
        this.exportPathToFile = path.resolve(__dirname, '../data/new/todoData.json');
        this.toDoDataArray = [];
    }

    /**
    * This is a function to import TODO data from a JSON file.
    * @param void
    * @returns boolean
    */
    public import() {
        try {
            console.log('loading JSON file...');
            let toDoDataArray = JSON.parse(fs.readFileSync(this.importPathToFile, 'utf8'));

            for (let index in toDoDataArray) {
                let tmpToDoData = toDoDataArray[index];
                let data = new toDoData(tmpToDoData['title'], tmpToDoData['importance'],
                    tmpToDoData['urgency'], tmpToDoData['manHour'],
                    tmpToDoData['genreId'], tmpToDoData['deadline'],
                    tmpToDoData['content'], tmpToDoData['place'], tmpToDoData['today']);
                this.toDoDataArray.push(data);
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log('Complete.');
        return true;
    }

    /**
    * This is a function to export TODO data to a JSON file.
    * @param void
    * @returns boolean
    */
    public export() {
        try {
            console.log('exporting JSON file...');
            let json_text = JSON.stringify(this.toDoDataArray);
            fs.writeFileSync(this.exportPathToFile, json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

    /**
    * This is a function to delete todo data from toDoDataArray.
    * @param id
    * @returns void
    */
    public delete(id: string) {
        var isDeleted = false;

        for (let index in this.toDoDataArray) {
            if (this.toDoDataArray[index]['id'] == id) {
                delete this.toDoDataArray[index];
                isDeleted = true;
            }
        }

        if (!isDeleted) {
            console.log(`Cannot find todo data(id: ${id})`);
        }
    }
}
