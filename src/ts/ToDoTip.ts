import ToDoData from './ToDoData';
import settingsData from './settingsData';
import Common from './common';

/**
 * - クリック判定
 * - toggleToday
 * のメソッド持つ
 */
interface TextPos {
    x: number,
    y: number
}

/**
 * todoチップ
 * todoデータをcanvas上に配置するためのデータ構造
 */
class ToDoTip {
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;
    public width: number;
    public height: number;
    public page: number;    // 存在するページ番号
    public isOnPage: boolean;   // 今一番表示されているかどうか
    private text: TextPos;
    public shortTitle: string
    public toDoData: ToDoData;
    public urgencyNumber: number;
    public importanceNumber: number;
    public fontScale: number;

    /**
     * todoデータをコピーする
     * 
     * @param toDoData todoデータ
     */
    constructor(toDoData: ToDoData) {
        this.toDoData = toDoData;
    }

    /**
     * テキスト開始canvas座標のsetter
     * 
     * @param xPos canvasX座標
     * @param yPos canvasY座標
     */
    public setTextPosition(xPos: number, yPos: number) {
        this.text = {
            x: xPos,
            y: yPos
        };
    }

    /**
     * テキスト開始canvas座標のgetter
     */
    public getTextPosition(): TextPos {
        return this.text;
    }

    /**
     * todoチップ（自身）をクリックしたかどうかを判定する
     * 
     * @param p クリック時のcanvas座標
     */
    public isClicked(p: { x: number, y: number }) {
        if (!this.isOnPage) return false;
        return (this.left <= p.x && p.x <= this.right) && (this.top <= p.y && p.y <= this.bottom);
    }

    /**
     * todayの星マークの色をtoggleする
     * 
     * @param canvas 
     * @param ctx 
     */
    public toggleToday(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, settingsData: settingsData) {
        this.toDoData.setToday(!this.toDoData.getIsToday());
        ctx.beginPath();

        // toDoDataの描画矩形の設定
        // ジャンルIDに応じた背景色に設定する
        ctx.rect(this.left, this.top, this.width, this.height);
        ctx.fillStyle = settingsData.getGenreData().find(gd => gd.getId() === this.toDoData.getGenreId()).getColor();
        ctx.fill();

        // toDoDataの文字描画開始
        ctx.beginPath();
        let fontSize = canvas.height * this.fontScale / this.importanceNumber;

        let todayIcon = '\uf005';

        ctx.font = this.toDoData.getIsToday() ? `900 ${fontSize}px 'Font Awesome 5 Free'` : `400 ${fontSize}px 'Font Awesome 5 Free'`;

        ctx.fillStyle = 'rgb(0, 0, 0)';

        ctx.fillText(todayIcon, this.getTextPosition().x, this.getTextPosition().y);

        ctx.font = `900 ${fontSize}px 'Font Awesome 5 Free'`;
        ctx.fillText(this.shortTitle, this.getTextPosition().x + ctx.measureText(todayIcon).width * 1.25, this.getTextPosition().y);
    }
}

export default ToDoTip;
