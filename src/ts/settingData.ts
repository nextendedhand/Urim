import genreData from './genreData';
//import * as fs from 'fs';

export default  class settingData {
    private genreArray: genreData[];
    private urgencyScale: Number ;
    //https://qiita.com/ConquestArrow/items/494d798a4e0788c41a7c を参考に設定変数だけ外に出す
    private pathToFile:string = "../data/genreData.json";

    constructor() {
        this.genreArray = [];
        this.urgencyScale = 1;
        this.import();
    }

    //getter : get all genre data
    getGenreData() {
        return this.genreArray;
    }

    getUrgencyScale() {
        return this.urgencyScale;
    }

    //setter totyu
    setGenreData(genreData: genreData) {
        this.genreArray.push(genreData);
    }

    setUrgencyScale(urgencyScale: Number) {
        this.urgencyScale = urgencyScale;
    }

    // delete a genre data from genreArray
    delete(id : number){
        
    }

    // import a genre data from JSON file into genreArray
    import(){
        try {
            console.log('loading JSON file...');
            //let genreDataArray = JSON.parse(fs.readFileSync(this.pathToFile,'utf8'));
            //this.genreArray = genreDataArray;   
        }
        catch(e){
            console.log(e);
            return false;
        }
        return true;
    }

    // export genreArray into a JSON file
    export(){
        try {
            console.log("exporting JSON file...");
            //let json_text = JSON.stringify(this.genreArray);
        }
        catch(e){
            console.log(e);
            return false;
        }
        return true;
    }

}