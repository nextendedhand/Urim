class PageManager {
    public page: number;
    public minPage: number;
    public maxPage: number;
    public hasPages: boolean;
    public left: number;
    public top: number;
    public width: number;
    public height: number;

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

    // ひとまず枠内の左半分というガバ判定
    public isPrevClicked(p: { x: number, y: number }) {
        return (this.left <= p.x && p.x <= this.left + this.width / 2) && (this.top <= p.y && p.y <= this.top + this.height);
    }

    // ひとまず枠内の右半分というガバ判定
    public isNextClicked(p: { x: number, y: number }) {
        return (this.left + this.width / 2 < p.x && p.x <= this.left + this.width) && (this.top <= p.y && p.y <= this.top + this.height);
    }
}

export default PageManager;
