/**
* This is a class for detail data container of TODO items.
* It contains content, deadline and place information.
*/
export default class toDoDetailData {

    private contents: string;
    private deadline: { [s: string]: number };
    private place: string;

    /**
    * This is a constructor.
    * @param content - TODO item's content.
    * @param deadline - TODO items's deadline.
    * @param place - Place where you do this action.
    */
    constructor(deadline: { [s: string]: number }, contents: string, place: string) {
        this.contents = contents;
        this.deadline = deadline;
        this.place = place;
    }

    /**
    * This is getter for TODO item's deadline.
    * @param void
    * @returns deadline
    */
    getDeadLine(): { [s: string]: number } {
        return this.deadline;
    }

    /**
    * This is getter for TODO item's contents.
    * @param void
    * @returns contents
    */
    getContents(): string {
        return this.contents;
    }

    /**
    * This is getter for place you should do this.
    * @param void
    * @returns place
    */
    getPlace(): string {
        return this.place;
    }

    /**
    * This is setter for TODO item's deadline.
    * @param deadline - TODO items's deadline.
    * @returns void
    */
    setDeadLine(deadline: { [s: string]: number }) {
        this.deadline = deadline;
    }

    /**
    * This is setter for TODO contents.
    * @param contents - TODO item's content.
    * @returns void
    */
    setContents(contents: string) {
        this.contents = contents;
    }

    /**
    * This is setter for place you should do this.
    * @param place - Place where you do this action.
    * @returns void
    */
    setPlace(place: string) {
        this.place = place;
    }
};
