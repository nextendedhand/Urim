export default  class genreData {
    private id: Number;
    private color: string;
    private name: string;

    //　id　dousiyou
    constructor(color : string, name: string) {
        this.color = color;
        this.name = name;
    }

    //getter
    getId() {
        return this.id;
    }

    getColor() {
        return this.color;
    }

    getName() {
        return this.name;
    }

    //setter
    setId(id: Number) {
        this.id = id;
    }

    setColor(color: string) {
        this.color = color;
    }

    setName(name: string) {
        this.name = name;
    }
}