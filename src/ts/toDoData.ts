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
    private manHour: { [s: string]: number };
    private genreId: number;
    private detailData: detailData;
    private isToday: boolean;

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
    constructor(title: string, importance: string, manHour: { [s: string]: number }, genreId: number,
        deadline: { [s: string]: number }, contents: string, place: string, isToday: boolean) {
        this.id = this.generateId();
        this.title = title;
        this.importance = importance;
        this.manHour = manHour;
        this.genreId = genreId;
        this.isToday = isToday;
        this.detailData = new detailData(deadline, contents, place);
        this.urgency = this.calcUrgency();
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
    public getManHour(): { [s: string]: number } {
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
    * @returns isToday
    */
    public getIsToday(): boolean {
        return this.isToday;
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

    private calcUrgency(): number {
        // deadline - 現在日時から残日数を返す
        const nowDate = new Date();
        const deadlineDate = new Date(this.detailData.getDeadLine().year, this.detailData.getDeadLine().month - 1, this.detailData.getDeadLine().day, nowDate.getHours(), nowDate.getMinutes());

        return Math.floor((deadlineDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24)) + 2;
    }

    /**
    * This is setter for TODO item's man hour.
    * @param manHour
    * @returns void
    */
    public setManHour(manHour: { [s: string]: number }) {
        this.manHour = manHour;
    }

    /**
    * This is setter for TODO item's detail data.
    * @param content - TODO item's content.
    * @param deadline - TODO items's deadline.
    * @param place - Place where you do this action.
    * @returns void
    */
    public setDetailData(contents: string, deadline: { [s: string]: number }, place: string) {
        this.detailData.setContents(contents);
        this.detailData.setDeadLine(deadline);
        this.detailData.setPlace(place);
    }

    /**
    * This is setter for a flag whether you should do this action today.
    * @param isToday
    * @returns void
    */
    public setToday(isToday: boolean) {
        this.isToday = isToday;
    }
};
