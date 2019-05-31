export class toDoAbstData {
    
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
    get getTitle() {
        return this.title;
    }

    get getImportance() {
        return this.importance;
    }

    get getUrgency() {
        return this.urgency;
    }

    get getManHour() {
        return this.manHour;
    }

    get getGenreId() {
        return this.genreId;
    }

    get getDetailDataId() {
        return this.detailDataId;
    }

    get getToday() {
        return this.today;
    }

    //setter
    set setTitle(title: string) {
        this.title = title;
    }

    set setImportance(importance: string) {
        this.importance = importance;
    }

    set setUrgency(urgency: Number) {
        this.urgency = urgency;
    }

    set setManHour(manHour: Number) {
        this.manHour = manHour;
    }

    set setGenreId(genreId: Number) {
        this.genreId = genreId;
    }
    set setDetailDataId(detailDataId: Number) {
        this.detailDataId = detailDataId;
    }
    set setToday(today: boolean) {
        this.today = today;
    }
};
