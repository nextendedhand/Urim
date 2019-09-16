import genreData from './genreData';

/**
* This is a class for settings.
* It contains urgencyScale and array of genre data.
*/
export default class settingsData {
    private genreArray: genreData[];
    private urgencyScale: number;

    /**
    * This is a constructor.
    * @param void
    */
    constructor(genreArray: genreData[], urgencyScale: number) {
        this.genreArray = genreArray;
        this.urgencyScale = urgencyScale;
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
}
