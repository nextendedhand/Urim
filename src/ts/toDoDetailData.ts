/**
* This is a class for detail data container of TODO items.
* It contains content, deadline and place information.
*/
export default class toDoDetailData {

    private content: string;
    private deadline: string;
    private place: string;

    /**
    * This is a constructor.
    * @param content - TODO item's content.
    * @param deadline - TODO items's deadline.
    * @param place - Place where you do this action.
    */
    constructor(deadline: string, content: string, place: string) {
        this.content = content;
        this.deadline = deadline;
        this.place = place;
    }

    /**
    * This is getter for TODO item's deadline.
    * @param void
    * @returns deadline
    */
    getDeadLine(): string {
        return this.deadline;
    }

    /**
    * This is getter for TODO item's content.
    * @param void
    * @returns content
    */
    getContent(): string {
        return this.content;
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
    setDeadLine(deadline: string) {
        this.deadline = deadline;
    }

    /**
    * This is setter for TODO contents.
    * @param content - TODO item's content.
    * @returns void
    */
    setContent(content: string) {
        this.content = content;
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
