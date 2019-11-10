import AxisManager from './axisManager';
import ToDoData from './ToDoData';
import ToDoTip from './ToDoTip';
import Common from './common';
import PageManager from './pageManager';
import settingsDataManager from './settingsDataManager';

export interface UrimCell {
    ids: string[],
    pm: PageManager
}

/**
 * urim画面の描画処理を管理する
 */
export class UrimPlaneManager {
    public urAxis: AxisManager;
    public imAxis: AxisManager;
    private height: number;
    private width: number;
    private sdm: settingsDataManager;
    public urimCell: UrimCell[][]; // 4 * 20の要素　各要素に入るデータ数は異なる
    // cell[importance][urgency].ids[index]: 各importance, urgencyでのtoDoデータIDを格納する
    private widthPartitionPerSpan: number;
    private urgencySpans: number[];
    private heightPartitionPerImportance: number;   // 表示セル数 + 2（1はページ管理用ボタンで1は余白用）
    private importanceNumber: number;
    private urgencyNumber: number;
    private fontScale: number;
    private widthScale: number;

    /**
     * 4 * 20のセルを作成する
     */
    constructor() {
        this.sdm = new settingsDataManager();
        this.sdm.import();
        this.urgencySpans = [21, 33, 81, 240];
        this.widthPartitionPerSpan = 2;
        this.heightPartitionPerImportance = 5;
        this.importanceNumber = 4 * this.heightPartitionPerImportance;
        this.urgencyNumber = this.widthPartitionPerSpan * this.urgencySpans.length;
        this.fontScale = 0.6;
        this.widthScale = 0.9;

        this.urimCell = new Array(this.importanceNumber);
        for (let iIm = 0; iIm < this.importanceNumber; iIm++) {
            this.urimCell[iIm] = new Array(this.urgencyNumber);
            for (let iUr = 0; iUr < this.urgencyNumber; iUr++) {
                this.urimCell[iIm][iUr] = {
                    ids: [''],
                    pm: new PageManager()
                }
            }
        }
    }

    /**
     * 各セルのサイズと位置を決定後、各セルに格納するtodoデータのidをcreateUrimCell()によって決定する
     * 
     * @param canvas 
     * @param toDoDatas 全todoデータ
     */
    public setupCanvas(canvas: HTMLCanvasElement, toDoDatas: ToDoData[]) {
        const common = new Common();
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.urAxis = new AxisManager(0, canvas.height / 2, canvas.width, canvas.height / 2, [0, 5, -20, 5, -20, 15]);
        this.imAxis = new AxisManager(canvas.width / 2, canvas.height, canvas.width / 2, 0, [0, 5, -20, 5, -20, 15]);


        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        this.width = canvas.width = rect.width * dpr;
        this.height = canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);

        for (let iIm = 0; iIm < this.importanceNumber; iIm++) {
            for (let iUr = 0; iUr < this.urgencyNumber; iUr++) {
                this.urimCell[iIm][iUr].ids = [''];
                this.urimCell[iIm][iUr].pm.maxPage = 0;
                this.urimCell[iIm][iUr].pm.minPage = 0;
                this.urimCell[iIm][iUr].pm.left = iUr * canvas.width / this.urgencyNumber + canvas.width * (1 - this.widthScale) / (this.urgencyNumber * 2);
                this.urimCell[iIm][iUr].pm.width = canvas.width * this.widthScale / this.urgencyNumber;
                this.urimCell[iIm][iUr].pm.height = canvas.height / this.importanceNumber;
                this.urimCell[iIm][iUr].pm.top = this.calcImCoord(canvas, Object.keys(common.imToNum).filter(v => { return common.imToNum[v] == iIm })[0]) + (this.heightPartitionPerImportance - 2) * this.urimCell[iIm][iUr].pm.height;
            }
        }

        this.createUrimCell(toDoDatas);

        return ctx;
    }

    /**
     * 緊急度から緊急度インデックス（緊急でない 0 - 20 緊急）を算出している
     * 
     * @param urgency 緊急度（現状[要検討]20分割している）
     */
    public urToCoord(urgency: number) {
        if (urgency <= 0) {
            return this.urgencyNumber - 1;
        } else if (urgency >= 1 && urgency <= this.urgencySpans[0]) {
            return this.urgencyNumber - 1 - Math.floor((urgency - 1) * this.widthPartitionPerSpan / this.urgencySpans[0]);
        } else if (urgency >= this.urgencySpans[0] + 1 && urgency <= this.urgencySpans[1]) {
            return this.urgencyNumber - this.widthPartitionPerSpan - 1 - Math.floor((urgency - this.urgencySpans[0] - 1) * this.widthPartitionPerSpan / this.urgencySpans[1]);
        } else if (urgency >= this.urgencySpans[1] + 1 && urgency <= this.urgencySpans[2]) {
            return this.urgencyNumber - 2 * this.widthPartitionPerSpan - 1 - Math.floor((urgency - this.urgencySpans[0] - this.urgencySpans[1] - 1) * this.widthPartitionPerSpan / this.urgencySpans[2]);
        } else if (urgency >= this.urgencySpans[2] + 1 && urgency <= this.urgencySpans[3]) {
            return this.urgencyNumber - 3 * this.widthPartitionPerSpan - 1 - Math.floor((urgency - this.urgencySpans[0] - this.urgencySpans[1] - this.urgencySpans[2] - 1) * this.widthPartitionPerSpan / this.urgencySpans[3]);
        } else if (urgency >= this.urgencySpans[3] + 1) {
            return 0;
        }
    }

    /**
     * 重要度から重要度canvas座標を算出する
     * 
     * @param canvas 
     * @param importance 重要度（S, A, B, C）
     */
    private calcImCoord(canvas: HTMLCanvasElement, importance: string): number {
        const common = new Common();
        return canvas.height * common.imToNum[<keyof { [s: string]: number }>importance] / 4 + canvas.height / (2 * this.importanceNumber);
    }

    /**
     * 緊急度から緊急度canvas座標を算出する
     * 
     * @param canvas 
     * @param urgency 緊急度
     */
    private calcUrCoord(canvas: HTMLCanvasElement, urgency: number): number {
        return this.urToCoord(urgency) * canvas.width / this.urgencyNumber;
    }

    /**
     * 各セルが保持するtodoデータのidをurimCell配列に格納する
     * 
     * @param toDoDatas 全todoデータ
     */
    private createUrimCell(toDoDatas: ToDoData[]) {
        const common = new Common();
        // urimCellにデータ格納する
        // ToDO: UtimCellクラス作るかどうか考える
        toDoDatas.forEach((toDoData: ToDoData) => {
            if (this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].ids[0] !== '') {
                this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].ids.push(toDoData.getId());
            } else {
                this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].ids = [toDoData.getId()];
            }
        });
    }

    /**
     * 各todoの座標や配置するページ番号を算出する
     * 
     * @param canvas 
     * @param toDoDatas 全todoデータ
     */
    public createToDoTips(canvas: HTMLCanvasElement, toDoDatas: ToDoData[]): ToDoTip[] {
        const common = new Common();
        let toDoTips: ToDoTip[] = new Array();

        this.urimCell.forEach((imArray: UrimCell[]) => {
            imArray.forEach((cell: UrimCell) => {
                if (cell.ids[0] !== '') {
                    cell.ids.forEach((id: string, index: number) => {
                        // urimCellに格納されたidと一致するtoDoDataを検索して代入
                        const toDoData: ToDoData = (id => {
                            return toDoDatas.find(tDD => tDD.getId() === id);
                        })(id);

                        // toDoTipの作成
                        // - left
                        // - right
                        // - top
                        // - bottom
                        // を計算する
                        let toDoTip = new ToDoTip(toDoData);

                        toDoTip.width = canvas.width * this.widthScale / this.urgencyNumber;
                        toDoTip.height = canvas.height / this.importanceNumber;
                        toDoTip.left = this.calcUrCoord(canvas, toDoData.getUrgency()) + (canvas.width / this.urgencyNumber - toDoTip.width) / 2;
                        toDoTip.top = this.calcImCoord(canvas, toDoData.getImportance()) + (index % (this.heightPartitionPerImportance - 2)) * toDoTip.height;
                        toDoTip.bottom = toDoTip.top + toDoTip.height;

                        toDoTip.page = Math.floor(index / (this.heightPartitionPerImportance - 2));

                        if (toDoTip.page == 0) {
                            toDoTip.isOnPage = true;
                        } else {
                            toDoTip.isOnPage = false;
                        }

                        // 最大ページを求める
                        this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.maxPage = Math.max(this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.maxPage, toDoTip.page);

                        if (index > (this.heightPartitionPerImportance - 2)) {
                            this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.hasPages = true;
                        } else if (index <= (this.heightPartitionPerImportance - 2)) {
                            this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.hasPages = false;
                        }

                        toDoTip.right = toDoTip.left + toDoTip.width;
                        toDoTip.setTextPosition(toDoTip.left, toDoTip.top + toDoTip.height * (1 - this.fontScale) / 2);

                        toDoTip.urgencyNumber = this.urgencyNumber;
                        toDoTip.importanceNumber = this.importanceNumber;
                        toDoTip.fontScale = this.fontScale;

                        toDoTips.push(toDoTip);
                    });
                }
            });
        });

        return toDoTips;
    }

    /**
     * 緊急度軸、重要度軸の軸矢印と軸名を描画する
     * 
     * @param canvas 
     * @param ctx 
     */
    private renderAxis(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.urAxis.startY = canvas.height / 2;
        this.urAxis.endX = canvas.width - canvas.width / 60;
        this.urAxis.endY = canvas.height / 2;

        this.imAxis.startX = canvas.width / 2;
        this.imAxis.startY = canvas.height;
        this.imAxis.endX = canvas.width / 2;
        this.imAxis.endY = canvas.height / 30;

        this.urAxis.create(ctx);
        this.imAxis.create(ctx);

        // 軸名の描画
        ctx.beginPath();
        let fontSize = canvas.width / 80;

        ctx.font = `900 ${fontSize}pt 'Font Awesome 5 Free'`

        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.textAlign = 'center';

        ctx.fillText('重要度', canvas.width / 2, parseInt(ctx.font));
        ctx.textAlign = 'start';

        const vFillText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
            const textList = text.split('\n');
            const lineHeight = ctx.measureText('あ').width;
            textList.forEach(elm => {
                Array.prototype.forEach.call(elm, (ch: string, j: number) => {
                    ctx.fillText(ch, x - lineHeight, y + lineHeight * (j - 1));
                });
            });
        };

        vFillText(ctx, '緊急度', canvas.width, canvas.height / 2);
    }

    /**
     * 各todoを描画する
     * 
     * @param toDoTip todoチップ（canvas上に配置するためのデータ構造）
     * @param canvas 
     * @param ctx 
     */
    private renderToDo(toDoTip: ToDoTip, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        // toDoDataの矩形描画開始
        ctx.beginPath();

        // toDoDataの描画矩形の設定
        ctx.rect(toDoTip.left, toDoTip.top, toDoTip.width, toDoTip.height);

        // toDoDataの色設定
        // ジャンルIDに応じた背景色に設定する
        ctx.fillStyle = this.sdm.settingsData.getGenreData().find(gd => gd.getId() === toDoTip.toDoData.getGenreId()).getColor();
        ctx.fill();


        // toDoDataの文字描画開始
        ctx.beginPath();
        let fontSize = canvas.height * this.fontScale / this.importanceNumber;

        // today用の星描画
        let todayIcon = '\uf005';

        ctx.font = toDoTip.toDoData.getIsToday() ? `900 ${fontSize}px 'Font Awesome 5 Free'` : `400 ${fontSize}px 'Font Awesome 5 Free'`;

        ctx.fillStyle = 'rgb(0, 0, 0)';

        ctx.textBaseline = 'top';
        ctx.fillText(todayIcon, toDoTip.getTextPosition().x, toDoTip.getTextPosition().y);

        ctx.font = `900 ${fontSize}px 'Font Awesome 5 Free'`;

        let title = toDoTip.toDoData.getTitle();
        toDoTip.shortTitle = title;

        if (ctx.measureText(todayIcon).width * 1.25 + ctx.measureText(title).width >= toDoTip.width) {
            console.log('超えた', toDoTip.shortTitle);
            while (true) {
                if (ctx.measureText(todayIcon).width * 1.25 + ctx.measureText(`${title}..`).width < toDoTip.width) {
                    toDoTip.shortTitle = title + '..';
                    break;
                }
                title = title.slice(0, -1);
            }
        }

        ctx.textBaseline = 'top';
        ctx.fillText(toDoTip.shortTitle, toDoTip.getTextPosition().x + ctx.measureText(todayIcon).width * 1.25, toDoTip.getTextPosition().y);
    }

    /**
     * 重要度に応じて背景色を描画する
     * 
     * @param canvas 
     * @param ctx 
     */
    private renderImBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const common = new Common();

        common.backgroundColor.forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(0, canvas.height / 4 * index, canvas.width, canvas.height / 4);
        })
    }

    /**
     * ページ管理用のボタンを配置する
     * 
     * @param canvas 
     * @param ctx 
     */
    private renderPageController(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        for (let iIm = 0; iIm < 4; iIm++) {
            for (let iUr = 0; iUr < this.urgencyNumber; iUr++) {
                if (this.urimCell[iIm][iUr].pm.hasPages) {
                    // 矢印描画
                    let fontSize = canvas.height / this.importanceNumber;
                    ctx.font = `900 ${fontSize}px 'Font Awesome 5 Free'`;
                    ctx.fillStyle = 'rgb(0, 0, 0)';

                    ctx.textBaseline = 'top';
                    ctx.fillText('\uf0d9', this.urimCell[iIm][iUr].pm.left, this.urimCell[iIm][iUr].pm.top);
                    ctx.textAlign = 'end';
                    ctx.fillText('\uf0da', this.urimCell[iIm][iUr].pm.left + this.urimCell[iIm][iUr].pm.width, this.urimCell[iIm][iUr].pm.top);
                    ctx.textAlign = 'start';
                }
            }
        }
    }

    /**
     * 描画に関する関数を呼び出す
     * 
     * @param canvas 
     * @param ctx 
     * @param toDoTips 全todoチップ（canvas上に配置するためのデータ構造）
     */
    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, toDoTips: ToDoTip[]) {
        const common = new Common();

        canvas.height = this.height;
        canvas.width = this.width;

        this.renderImBackground(canvas, ctx);
        this.renderAxis(canvas, ctx);

        toDoTips.forEach(toDoTip => {
            if (toDoTip.page == this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].pm.page) {
                this.renderToDo(toDoTip, canvas, ctx);
                toDoTip.isOnPage = true;
            } else {
                toDoTip.isOnPage = false;
            }
        });

        this.renderPageController(canvas, ctx);
    }
}
