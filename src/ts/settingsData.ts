import genreData from './genreData';

/**
* This is a class for settings.
* It contains urgencyScale and array of genre data.
*/
export default class settingsData {
    private genreArray: genreData[];
    private textSize: number;
    private urgencyScale: number;

    /**
    * This is a constructor.
    * @param void
    */
    constructor(genreArray: genreData[], textSize: number, urgencyScale: number) {
        this.genreArray = [];
        genreArray.forEach(gd => this.genreArray.push(new genreData(gd['color'], gd['name'], gd['timestamp'], gd['id'])));
        this.textSize = textSize;
        this.urgencyScale = urgencyScale;
    }

    /**
    * This is getter for genre data array.
    * @param void
    * @returns genreArray
    */
    public getGenreData(): genreData[] {
        this.genreArray.sort((a: genreData, b: genreData) => {
            if (a.getTimestamp() < b.getTimestamp()) return -1;
            if (a.getTimestamp() > b.getTimestamp()) return 1;
            return 0;
        });
        return this.genreArray;
    }

    /**
    * This is getter for text size.
    * @param void
    * @returns textSize
    */
    public getTextSize(): number {
        return this.textSize;
    }

    /**
    * This is getter for urgency scale.
    * @param void
    * @returns urgencyScale
    */
    public getUrgencyScale(): number {
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
    * This is setter for text size.
    * @param textSize
    * @returns void
    */
    public setTextSize(textSize: number) {
        this.textSize = textSize;
        console.error("set text size")
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
        this.genreArray = this.genreArray.filter(genreData => {
            if (genreData.getId() === id) {
                isDeleted = true;
            }

            return genreData.getId() != id;
        });

        if (!isDeleted) {
            console.log("Cannot find todo data(id: " + id + " )")
        }
    }
    /**
    * This is a function to delete all genre data from genreDataArray.
    * @param id
    * @returns void
    */
    public deleteAllGenreData(): void {
        this.genreArray = [];
    }
}
