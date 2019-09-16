import * as fs from 'fs';
import * as path from 'path';
import settingsData from './settingsData';

/**
* This is a class for settingsData manager.
* It contains urgencyScale and array of genre data.
*/
export default class settingsDataManager {
    //importとexportを分けているのは今後修正
    private importGenreDataPathToFile: string;
    private exportGenreDataPathToFile: string;
    private importSettingsDataPathToFile: string;
    private exportSettingsDataPathToFile: string;
    public settingsData: settingsData;

    /**
    * This is a constructor.
    * @param void
    */
    constructor() {
        this.exportGenreDataPathToFile = path.resolve(__dirname, "../data/new/genreData.json");

        this.importSettingsDataPathToFile = path.resolve(__dirname, "../data/settingsData.json");
        this.exportSettingsDataPathToFile = path.resolve(__dirname, "../data/new/settingsData.json");
    }

    /**
    * This is a function to import settings data from a JSON file.
    * @param void
    * @returns boolean
    */
    public import() {



        try {
            console.log('loading SettingsData JSON file...');
            let settingsDataArray = JSON.parse(fs.readFileSync(this.importSettingsDataPathToFile, 'utf8'));

            this.importGenreDataPathToFile = settingsDataArray[0]['genreData'];
            let genreDataArray;

            try {
                console.log('loading GenreData JSON file...');

                genreDataArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, this.importGenreDataPathToFile), 'utf8'));
            }
            catch (e) {
                console.log(e);
                return false;
            }
            console.log("Loading GenreData Complete.");

            this.settingsData = new settingsData(genreDataArray, Number(settingsDataArray[0]['urgencyScale']));
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
            console.log("exporting SettingData JSON file...");
            let json_text = JSON.stringify(this.settingsData);
            fs.writeFileSync(this.exportSettingsDataPathToFile, json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Expoting SettingData Complete.")

        try {
            console.log("exporting GenreData JSON file...");
            let json_text = JSON.stringify(this.settingsData.getGenreData());
            fs.writeFileSync(this.exportGenreDataPathToFile, json_text);
            console.log(json_text);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        console.log("Expoting GenreData Complete.")

        return true;
    }

}
