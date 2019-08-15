import * as fs from 'fs';
import genreData from './genreData';

/**
* This is a class for settings.
* It contains urgencyScale and array of genre data.
*/
export default class settingData {
    private genreArray: genreData[];
    private urgencyScale: number;
    //importとexportを分けているのは今後修正
    private importGenreDataPathToFile: string;
    private exportGenreDataPathToFile: string;
    private importSettingsDataPathToFile: string;
    private exportSettingsDataPathToFile: string;

    /**
    * This is a constructor.
    * @param void
    */
    constructor() {
        this.exportGenreDataPathToFile = "../data/new/genreData.json";

        this.importSettingsDataPathToFile = "../data/settingsData.json";
        this.exportSettingsDataPathToFile = "../data/new/settingsData.json";
        this.urgencyScale = 1;
        this.importSettingsData();
    }

    /**
    * This is getter for genre data array.
    * @param void
    * @returns genreArray
    */
    public getGenreData() {
        return this.genreArray;
    }

    /**
    * This is getter for urgency scale.
    * @param void
    * @returns urgencyScale
    */
    public getUrgencyScale() {
        return this.urgencyScale;
    }

    /**
    * This is setter for genre data.
    * @param genreData
    * @returns void
    */
    public setGenreData(genreData: genreData) {
        //let id = this.generateId();
        //genreData.setId(id);
        this.genreArray.push(genreData);
    }

    /**
    * This is setter for urgency scale.
    * @param urgencyScale
    * @returns void
    */
    public setUrgencyScale(urgencyScale: number) {
        this.urgencyScale = urgencyScale;
    }

    /**
    * This is a function to delete genre data from genreDataArray.
    * @param id
    * @returns void
    */
    public deleteGenreData(id: string) {
        var isDeleted = false;

        for (let index in this.genreArray) {
            if (this.genreArray[index]['id'] == id) {
                delete this.genreArray[index];
                isDeleted = true;
            }
        }

        if (!isDeleted) {
            console.log("Cannot find todo data(id: " + id + " )")
        }
    }

    /**
    * This is a function to import genre data from a JSON file.
    * @param void
    * @returns boolean
    */
    public importGenreData() {
        try {
            console.log('loading GenreData JSON file...');
            let genreDataArray = JSON.parse(fs.readFileSync(this.importGenreDataPathToFile, 'utf8'));
            this.genreArray = genreDataArray;
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Loading GenreData Complete.")
        return true;
    }

    /**
    * This is a function to export genre data to a JSON file.
    * @param void
    * @returns boolean
    */
    public exportGenreData() {
        try {
            console.log("exporting GenreData JSON file...");
            let json_text = JSON.stringify(this.genreArray);
            fs.writeFileSync(this.exportGenreDataPathToFile, json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

    /**
    * This is a function to import settings data from a JSON file.
    * @param void
    * @returns boolean
    */
    public importSettingsData() {
        try {
            console.log('loading SettingsData JSON file...');
            let settingsDataArray = JSON.parse(fs.readFileSync(this.importSettingsDataPathToFile, 'utf8'));

            this.importGenreDataPathToFile = settingsDataArray[0]['genreData'];
            this.urgencyScale = Number(settingsDataArray[0]['urgencyScale']);
            this.importGenreData();
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
    public exportSettingsData() {
        try {
            console.log("exporting SettingsData JSON file...");
            let settingsData: any = {};
            settingsData['genreData'] = this.importGenreDataPathToFile;
            settingsData['urgencyScale'] = this.urgencyScale;
            let json_text = JSON.stringify(settingsData);
            fs.writeFileSync(this.exportSettingsDataPathToFile, json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

}
