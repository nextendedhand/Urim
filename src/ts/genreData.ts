/**
* This is a class for genre data.
* It contains color and name of genre data.
*/
export default  class genreData {
    private id: string;
    private color: string;
    private name: string;

    /**
    * This is a constructor.
    * @param color
    * @param name
    */
    constructor(color : string, name: string) {
        this.id = this.generateId();
        this.color = color;
        this.name = name;
    }

    /**
    * This is a function to generate ID.
    * @param void
    * @returns id
    */
    private generateId(){
        // characters which is used as id
        var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        // Number of digits
        var len = 10;
         
        // generate id
        var id = "";
        for(var i=0;i<len;i++){
          id += str.charAt(Math.floor(Math.random() * str.length));
        }

        return id;        
    }

    /**
    * This is getter for genre data id.
    * @param void
    * @returns id
    */
    public getId() {
        return this.id;
    }

    /**
    * This is getter for color of genre data.
    * @param void
    * @returns color
    */
    public getColor() {
        return this.color;
    }

    /**
    * This is getter for genre name.
    * @param void
    * @returns name
    */
    public getName() {
        return this.name;
    }

    /**
    * This is setter for color.
    * @param color
    * @returns void
    */
    public setColor(color: string) {
        this.color = color;
    }

    /**
    * This is setter for name of genre data.
    * @param name
    * @returns void
    */
    public setName(name: string) {
        this.name = name;
    }
}