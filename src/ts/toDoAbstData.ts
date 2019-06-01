export default class toDoAbstData {

    private title: string;
    private importance: string;
    private urgency: Number;
    private manHour: Number;
    private genreId: Number;
    private detailDataId: Number;
    private today : boolean;

    constructor(title :string, importance :string, urgency :Number, manHour :Number, genreId :Number, detailDataId:Number, today:boolean) {
        this.title = title;
        this.importance = importance;
        this.urgency = urgency;
        this.manHour = manHour;
        this.genreId = genreId;
        this.detailDataId = detailDataId;
        this.today = today;
    }

    //getter
    getTitle():string {
        return this.title;
    }

    getImportance():string {
        return this.importance;
    }

    getUrgency():Number {
        return this.urgency;
    }

    getManHour():Number {
        return this.manHour;
    }

    getGenreId():Number {
        return this.genreId;
    }

    getDetailDataId():Number {
        return this.detailDataId;
    }

    getToday():boolean {
        return this.today;
    }

    //setter
    setTitle(title: string){
        this.title = title;
    }

    setImportance(importance: string) {
        this.importance = importance;
    }

    setUrgency(urgency: Number){
        this.urgency = urgency;
    }

    setManHour(manHour: Number){
        this.manHour = manHour;
    }

    setGenreId(genreId: Number){
        this.genreId = genreId;
    }

    setDetailDataId(detailDataId: Number){
        this.detailDataId = detailDataId;
    }

    setToday(today: boolean){
        this.today = today;
    }
};
