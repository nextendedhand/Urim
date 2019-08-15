import detailData from './toDoDetailData';

/**
* This is a class for data container of TODO items.
* It contains title, importance value, urgency value etc.
*/
export default class toDoData {

    private id: string;
    private title: string;
    private importance: string;
    private urgency: number;
    private manHour: number;
    private genreId: number;
    private detailData: detailData;
    private today: boolean;

    /**
    * This is a constructor.
    * @param title - TODO item's title
    * @param importance - TODO items's importance.(1,2,3,4)
    * @param urgency - TODO item's urgency. It calculates from the remaining days.
    * @param manHour - TODO items's man hour.(days?)
    * @param genreId - TODO item's genreId.
    * @param deadline - TODO items's deadline.
    * @param content - TODO item's content.
    * @param place - Place where you do this action.
    * @param today - A flag whether you should do this action today.
    */
    constructor(title: string, importance: string, urgency: number, manHour: number, genreId: number,
        deadline: string, content: string, place: string, today: boolean) {
        this.id = this.generateId();
        this.title = title;
        this.importance = importance;
        this.urgency = urgency;
        this.manHour = manHour;
        this.genreId = genreId;
        this.today = today;
        this.detailData = new detailData(deadline, content, place);
    }

    /**
    * This is a function to generate ID.
    * @param void
    * @returns id
    */
    private generateId() {
        // characters which is used as id
        var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        // Number of digits
        var len = 10;

        // generate id
        var id = "";
        for (var i = 0; i < len; i++) {
            id += str.charAt(Math.floor(Math.random() * str.length));
        }

        return id;
    }

    /**
    * This is getter for TODO item's id.
    * @param void
    * @returns id
    */
    public getId(): string {
        return this.id;
    }

    /**
    * This is getter for TODO item's title.
    * @param void
    * @returns title
    */
    public getTitle(): string {
        return this.title;
    }

    /**
    * This is getter for TODO item's importance.
    * @param void
    * @returns importance
    */
    public getImportance(): string {
        return this.importance;
    }

    /**
    * This is getter for TODO item's urgency.
    * @param void
    * @returns urgency
    */
    public getUrgency(): number {
        return this.urgency;
    }

    /**
    * This is getter for TODO item's man hour.
    * @param void
    * @returns manHour
    */
    public getManHour(): number {
        return this.manHour;
    }

    /**
    * This is getter for TODO item's genre id.
    * @param void
    * @returns genreId
    */
    public getGenreId(): number {
        return this.genreId;
    }

    /**
    * This is getter for TODO item's detail data.
    * @param void
    * @returns detailData
    */
    public getDetailData(): detailData {
        return this.detailData;
    }

    /**
    * This is getter for the flag whether you should do this action today.
    * @param void
    * @returns today
    */
    public getToday(): boolean {
        return this.today;
    }

    /**
    * This is setter for TODO item's title.
    * @param title
    * @returns void
    */
    public setTitle(title: string) {
        this.title = title;
    }

    /**
    * This is setter for TODO item's importance.
    * @param importance
    * @returns void
    */
    public setImportance(importance: string) {
        this.importance = importance;
    }

    /**
    * This is setter for TODO item's urgency.
    * @param urgency
    * @returns void
    */
    public setUrgency(urgency: number) {
        this.urgency = urgency;
    }

    /**
    * This is setter for TODO item's man hour.
    * @param manHour
    * @returns void
    */
    public setManHour(manHour: number) {
        this.manHour = manHour;
    }

    /**
    * This is setter for TODO item's detail data.
    * @param content - TODO item's content.
    * @param deadline - TODO items's deadline.
    * @param place - Place where you do this action.
    * @returns void
    */
    public setDetailData(content: string, deadline: string, place: string) {
        this.detailData.setContent(content);
        this.detailData.setDeadLine(deadline);
        this.detailData.setPlace(place);
    }

    /**
    * This is setter for a flag whether you should do this action today.
    * @param today
    * @returns void
    */
    public setToday(today: boolean) {
        this.today = today;
    }
};
