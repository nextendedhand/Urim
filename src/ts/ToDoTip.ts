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

    public isClicked(p: { x: number, y: number }) {
        return (this.left <= p.x && p.x <= this.right) && (this.top <= p.y && p.y <= this.bottom);
    }

    public toggleToday(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.today = !this.today;
        // ToDo: 共有データのtodayプロパティもtoggleする

        ctx.beginPath();

        // toDoDataの描画矩形の設定
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.stroke();

        ctx.fillStyle = this.today ? 'rgb(192, 80, 77)' : 'rgb(234, 234, 234)';

        ctx.fill();

        // toDoDataの文字描画開始
        ctx.beginPath();
        let fontSize = canvas.width / 70;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillText(this.title, this.getTextPosition().x, this.getTextPosition().y);
    }
}

export default ToDoTip;
