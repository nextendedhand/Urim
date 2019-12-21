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
    public isDeleteCandidate: boolean;

    /**
     * todoデータをコピーする
     * 
     * @param toDoData todoデータ
     */
    constructor(toDoData: ToDoData) {
        this.toDoData = toDoData;
        this.isDeleteCandidate = false;
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
     * todoチップ（自身）を上にマウスが存在するかを判定する
     * 
     * @param p マウスのcanvas座標
     */
    public isOn(p: { x: number, y: number }) {
        if (!this.isOnPage) return false;
        return (this.left <= p.x && p.x <= this.right) && (this.top <= p.y && p.y <= this.bottom);
    }

    /**
     * 角丸四角を描画する
     * 
     * @param ctx 
     * @param left 
     * @param top 
     * @param width 
     * @param height 
     * @param radius 
     */
    private fillRoundedRect(ctx: CanvasRenderingContext2D, left: number, top: number, width: number, height: number, radius: number) {
        ctx.beginPath();
        ctx.arc(left + radius, top + radius, radius, - Math.PI, - 0.5 * Math.PI, false);
        ctx.arc(left + width - radius, top + radius, radius, - 0.5 * Math.PI, 0, false);
        ctx.arc(left + width - radius, top + height - radius, radius, 0, 0.5 * Math.PI, false);
        ctx.arc(left + radius, top + height - radius, radius, 0.5 * Math.PI, Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * todayの星マークの色をtoggleする
     * 
     * @param canvas 
     * @param ctx 
     */
    public toggleToday(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, settingsData: settingsData) {
        this.toDoData.setToday(!this.toDoData.getIsToday());
        this.render(canvas, ctx, settingsData);
    }

    public toggleBackgroundColor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, settingsData: settingsData) {
        this.isDeleteCandidate = !this.isDeleteCandidate;
        this.render(canvas, ctx, settingsData);
    }

    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, settingsData: settingsData) {
        // toDoDataの矩形描画開始
        ctx.beginPath();

        // toDoDataの描画矩形の設定
        this.fillRoundedRect(ctx, this.left, this.top, this.width, this.height, this.height / 4);

        // toDoDataの色設定
        // ジャンルIDに応じた背景色に設定する
        ctx.fillStyle = this.isDeleteCandidate ? '#f00' : settingsData.getGenreData().find(gd => gd.getId() === this.toDoData.getGenreId()).getColor();
        ctx.fill();


        // toDoDataの文字描画開始
        ctx.beginPath();
        let fontSize = canvas.height * this.fontScale / this.importanceNumber;

        // today用の星描画
        let todayIcon = '\uf005';

        ctx.font = this.toDoData.getIsToday() ? `900 ${fontSize}px 'Font Awesome 5 Free'` : `400 ${fontSize}px 'Font Awesome 5 Free'`;

        ctx.fillStyle = 'rgb(0, 0, 0)';

        ctx.textBaseline = 'top';
        ctx.textAlign = 'start';

        ctx.fillText(todayIcon, this.getTextPosition().x, this.getTextPosition().y);

        ctx.font = `500 ${fontSize}px 'Font Awesome 5 Free'`;

        let title = this.toDoData.getTitle();
        this.shortTitle = title;

        if (ctx.measureText(todayIcon).width * 1.25 + ctx.measureText(title).width >= this.width) {
            console.log('超えた', this.shortTitle);
            while (true) {
                if (ctx.measureText(todayIcon).width * 1.25 + ctx.measureText(`${title}..`).width < this.width) {
                    this.shortTitle = title + '..';
                    break;
                }
                title = title.slice(0, -1);
            }
        }

        ctx.textBaseline = 'top';
        ctx.fillText(this.shortTitle, this.getTextPosition().x + ctx.measureText(todayIcon).width * 1.25, this.getTextPosition().y);

    }
}

export default ToDoTip;
