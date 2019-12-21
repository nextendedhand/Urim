import toDoData from './toDoData';
import LocalStorage from './localStorageManager';
import Common from './common';
import * as fs from 'fs';
import * as path from 'path';
import * as Store from 'electron-store';

/**
* This is a class for a manager.
* It contains a list for toDoAbstData.
*/
export default class toDoDataManager {
    private store: Store;
    private common: Common;
    public toDoDataArray: toDoData[];

    /**
    * This is a constructor.
    * @param void
    */
    constructor() {
        this.toDoDataArray = [];
        this.store = new Store();
        this.common = new Common();
    }

    /**
    * This is a function to import TODO data from a JSON file.
    * @param void
    * @returns boolean
    */
    public import() {
        try {
            console.log('Loading todo data by electron-store...');
            let toDoDataArray = this.store.get(this.common.key.toDoData);
            //console.log(toDoDataArray)

            for (let index in toDoDataArray) {
                let tmpToDoData = toDoDataArray[index];
                let data = new toDoData(tmpToDoData.title, tmpToDoData.importance, tmpToDoData.manHour, tmpToDoData.genreId, tmpToDoData.detailData.deadline, tmpToDoData.detailData.contents, tmpToDoData.detailData.place, tmpToDoData.isToday, tmpToDoData.id);
                this.toDoDataArray.push(data);
            }

            //console.log('toDoDataArray: ', this.toDoDataArray);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log('Completed todo data loading by electron-store.');
        return true;
    }

    /**
    * This is a function to import TODO data from local storage.
    * @param void
    * @returns boolean
    */
    public importFromLocalStorage() {
        try {
            console.log('Loading todo data from local storage...');
            const ls = new LocalStorage();

            let toDoDataArray = ls.getValue(this.common.key.toDoData);

            (<toDoData[]>toDoDataArray).forEach(tdd => {
                let data = new toDoData(tdd['title'], tdd['importance'],
                    tdd['manHour'],
                    tdd['genreId'], tdd['detailData']['deadline'],
                    tdd['detailData']['contents'], tdd['detailData']['place'], tdd['isToday']);
                this.toDoDataArray.push(data);
            });
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log('Completed todo data loading from local storage.');
        return true;
    }

    /**
    * This is a function to export TODO data to a JSON file.
    * @param void
    * @returns boolean
    */
    public export() {
        try {
            console.log('Exporting todo data by electron-store...');
            this.store.set(this.common.key.toDoData, this.toDoDataArray);
            console.log(this.toDoDataArray);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log('Completed todo data exporting by electron-store.');
        return true;
    }

    /**
    * This is a function to export TODO data to local storage.
    * @param void
    * @returns boolean
    */
    public exportToLocalStorage() {
        try {
            console.log('Exporting todo data to local storage...');
            const ls = new LocalStorage();

            ls.setValue(this.common.key.toDoData, this.toDoDataArray);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log('Completed todo data exporting to local storage.');
        return true;
    }

    /**
    * This is a function to delete todo data from toDoDataArray.
    * @param id
    * @returns void
    */
    public delete(id: string) {
        var isDeleted = false;

        this.toDoDataArray = this.toDoDataArray.filter(todoData => {
            if (todoData.getId() === id) {
                isDeleted = true;
            }
            return todoData.getId() !== id;
        });

        if (!isDeleted) {
            console.log(`Cannot find todo data(id: ${id})`);
        }
    }

    /**
     * [For-Debug-Function]
     * [デバッグ用関数]]
     * This is a function to reset todo datas to local json files.
     */
    public resetDataForDebug() {
        try {
            const importPathToFile = path.resolve(__dirname, '../data/todoData.json');

            console.log('Resetting todo data...');
            let toDoDataArray = JSON.parse(fs.readFileSync(importPathToFile, 'utf8'));

            for (let index in toDoDataArray) {
                let tmpToDoData = toDoDataArray[index];
                let data = new toDoData(tmpToDoData['title'], tmpToDoData['importance'],
                    tmpToDoData['manHour'],
                    tmpToDoData['genreId'], tmpToDoData['deadline'],
                    tmpToDoData['contents'], tmpToDoData['place'], tmpToDoData['today'], tmpToDoData['id']);
                this.toDoDataArray.push(data);
            }

            this.store.set(this.common.key.toDoData, this.toDoDataArray);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log('Completed todo data resetting.');
        return true;
    }
}
