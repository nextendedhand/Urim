import * as fs from 'fs';
import * as path from 'path';
import settingsData from './settingsData';
import LocalStorage from './localStorageManager';
import Common from './common';
import * as Store from 'electron-store';

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
    }

    /**
    * This is a function to import settings data from a JSON file.
    * @param void
    * @returns boolean
    */
    public import() {
        try {
            console.log('loading SettingsData by electron-store...');
            let settingsDataArray = this.store.get(this.common.key.settingsData);

            let genreDataArray = settingsDataArray.genreArray;

            this.settingsData = new settingsData(genreDataArray, Number(settingsDataArray.urgencyScale));
            console.log(this.settingsData);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Loading SettingsData Complete.")

        return true;
    }

    /**
* This is a function to import settings data from local storage.
* @param void
* @returns boolean
*/
    public importFromLocalStorage() {
        try {
            console.log('loading SettingsData from local storage...');
            const ls = new LocalStorage();
            const common = new Common();

            let tmpSettingsData = ls.getValue(common.key.settingsData);

            this.settingsData = new settingsData((<settingsData>tmpSettingsData)['genreArray'], Number((<settingsData>tmpSettingsData)['urgencyScale']));
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Loading SettingsData Complete.")

        return true;
    }

    /**
    * This is a function to export settings data to a JSON file.
    * @param void
    * @returns boolean
    */
    public export() {
        try {
            console.log("exporting SettingData by electron-store...");
            this.store.set(this.common.key.settingsData, this.settingsData);
            console.log(this.settingsData);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Expoting SettingData Complete.");

        return true;
    }

    /**
    * This is a function to export settings data to local stoarage.
    * @param void
    * @returns boolean
    */
    public exportToLocalStorage() {
        try {
            console.log("exporting SettingData to local storage...");
            const ls = new LocalStorage();
            const common = new Common();

            ls.setValue(common.key.settingsData, this.settingsData);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Expoting SettingData Complete.")

        return true;
    }

    /**
     * [For-Debug-Function]
     * [デバッグ用関数]
     * This is a function to reset all settings data to local json files.
     */
    public resetDataForDebug() {
        try {
            console.log('loading SettingsData JSON file...');
            const importSettingsDataPathToFile = path.resolve(__dirname, "../data/settingsData.json");
            let settingsDataArray = JSON.parse(fs.readFileSync(importSettingsDataPathToFile, 'utf8'));

            const importGenreDataPathToFile = settingsDataArray[0]['genreData'];
            let genreDataArray;

            try {
                console.log('loading GenreData JSON file...');

                genreDataArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, importGenreDataPathToFile), 'utf8'));
            }
            catch (e) {
                console.log(e);
                return false;
            }
            console.log("Loading GenreData Complete.");

            this.settingsData = new settingsData(genreDataArray, Number(settingsDataArray[0]['urgencyScale']));

            this.store.set(this.common.key.settingsData, this.settingsData);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Loading SettingsData Complete.")

        return true;

    }
}
