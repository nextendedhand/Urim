import ToDoData from './ToDoData';
/**
 * - クリック判定
 * - toggleToday
 * のメソッド持つ
 */
interface TextPos {
    x: number,
    y: number
}

class ToDoTip {
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;
    public width: number;
    public height: number;
    public page: number;
    private text: TextPos;
    public toDoData: ToDoData;

    constructor(toDoData: ToDoData) {
        this.toDoData = toDoData;
    }

    public setTextPosition(xPos: number, yPos: number) {
        this.text = {
            x: xPos,
            y: yPos
        };
    }

    public getTextPosition(): TextPos {
        return this.text;
    }

    public isClicked(p: { x: number, y: number }) {
        return (this.left <= p.x && p.x <= this.right) && (this.top <= p.y && p.y <= this.bottom);
    }

    public toggleToday(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.toDoData.setToday(!this.toDoData.getToday());
        ctx.beginPath();

        // toDoDataの描画矩形の設定
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.stroke();

        ctx.fillStyle = 'rgb(234, 234, 234)';

        ctx.fill();

        // toDoDataの文字描画開始
        ctx.beginPath();
        let fontSize = canvas.width / 80;

        let todayIcon = '\uf005';

        ctx.font = this.toDoData.getToday() ? `900 ${fontSize}px 'Font Awesome 5 Free'` : `400 ${fontSize}px 'Font Awesome 5 Free'`;

        ctx.fillStyle = 'rgb(0, 0, 0)';

        ctx.fillText(todayIcon, this.getTextPosition().x, this.getTextPosition().y);

        ctx.font = `900 ${fontSize}px 'Font Awesome 5 Free'`;
        ctx.fillText(this.toDoData.getTitle(), this.getTextPosition().x + this.width / 3, this.getTextPosition().y);
    }
}

export default ToDoTip;
