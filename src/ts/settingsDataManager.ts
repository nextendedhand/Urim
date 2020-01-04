import * as fs from 'fs';
import * as path from 'path';
import settingsData from './settingsData';
import Common from './common';
import * as Store from 'electron-store';
import genreData from './genreData';

/**
* This is a class for settingsData manager.
* It contains urgencyScale and array of genre data.
*/
export default class settingsDataManager {
    private store: Store;
    private common: Common;
    public settingsData: settingsData;

    /**
    * This is a constructor.
    * @param void
    */
    constructor() {
        this.store = new Store();
        this.common = new Common();

        if (this.store.has('settingsData')) {
            this.settingsData = new settingsData([new genreData('#DFDFDF', 'other', '99999999999999', 'other_default')], this.store.get(this.common.key.settingsData).textSize, 0);
        } else {
            this.settingsData = new settingsData([new genreData('#DFDFDF', 'other', '99999999999999', 'other_default')], 60, 0);
        }
    }

    /**
    * This is a function to import settings data from a JSON file.
    * @param void
    * @returns boolean
    */
    public import() {
        try {
            console.log('Loading settings data by electron-store...');
            let settingsDataArray = this.store.get(this.common.key.settingsData);

            let genreDataArray = settingsDataArray.genreArray;

            this.settingsData = new settingsData(genreDataArray, Number(settingsDataArray.textSize), Number(settingsDataArray.urgencyScale));
            console.log(this.settingsData);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Completed settings data loading by electron-store.")

        return true;
    }

    /**
    * This is a function to export settings data to a JSON file.
    * @param void
    * @returns boolean
    */
    public export() {
        try {
            console.log("Exporting settings data by electron-store...");
            this.store.set(this.common.key.settingsData, this.settingsData);
            console.log(this.settingsData);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Completed settings data expoting by electron-store.");

        return true;
    }

    /**
     * [For-Debug-Function]
     * [デバッグ用関数]
     * This is a function to reset all settings data to local json files.
     */
    public resetDataForDebug() {
        try {
            console.log('Resetting settings data...');
            const importSettingsDataPathToFile = path.resolve(__dirname, "../data/settingsData.json");
            let settingsDataArray = JSON.parse(fs.readFileSync(importSettingsDataPathToFile, 'utf8'));

            const importGenreDataPathToFile = settingsDataArray[0]['genreData'];
            let genreDataArray;

            try {
                console.log('Resetting genre data...');

                genreDataArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, importGenreDataPathToFile), 'utf8'));
            }
            catch (e) {
                console.log(e);
                return false;
            }
            console.log("Completed genre data resetting.");

            this.settingsData = new settingsData(genreDataArray, Number(settingsDataArray[0]['textSize']), Number(settingsDataArray[0]['urgencyScale']));

            this.store.set(this.common.key.settingsData, this.settingsData);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Completed settings data resetting.")

        return true;

    }
}
