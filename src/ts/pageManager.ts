/**
 * 各セルの大きさや位置、ページを管理する
 */
class PageManager {
    public page: number;
    public minPage: number;
    public maxPage: number;
    public hasPages: boolean;
    public left: number;
    public top: number;
    public width: number;
    public height: number;

    /**
     * - 現在のページ番号を0にする
     * - 最小ページ番号を0にする
     * - 最大ページ番号を0にする
     * - ページを複数持つかどうか：false
     * - 左端位置を0にする
     * - 上端位置を0にする
     * - 幅を0にする
     * - 高さを0にする
     */
    constructor() {
        this.page = 0;
        this.minPage = 0;
        this.maxPage = 0;
        this.hasPages = false;
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
    }

    /**
     * ◀をクリックしたかどうかを判定する
     * ひとまず枠内の左半分というガバ判定
     * 
     * @param p クリック時のcanvas座標
     */
    public isPrevClicked(p: { x: number, y: number }) {
        return (this.left <= p.x && p.x <= this.left + this.width / 2) && (this.top <= p.y && p.y <= this.top + this.height);
    }

    /**
     * ▶をクリックしたかどうかを判定する
     * ひとまず枠内の右半分というガバ判定
     * 
     * @param p クリック時のcanvas座標
     */
    public isNextClicked(p: { x: number, y: number }) {
        return (this.left + this.width / 2 < p.x && p.x <= this.left + this.width) && (this.top <= p.y && p.y <= this.top + this.height);
    }
}

export default PageManager;
