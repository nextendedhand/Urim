import ToDoDataObject from './ToDoDataObject';
/**
 * - クリック判定
 * - toggleToday
 * のメソッド持つ
 */
interface TextPos {
    x: number,
    y: number
}

class ToDoTip extends ToDoDataObject {
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;
    public width: number;
    public height: number;
    private text: TextPos;

    public setTextPosition(xPos: number, yPos: number) {
        this.text = {
            x: xPos,
            y: yPos
        };
    }

    public getTextPosition(): TextPos {
        return this.text;
    }
}

export default ToDoTip;
