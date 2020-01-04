import AxisManager from './axisManager';
import toDoData from './toDoData';
import ToDoTip from './ToDoTip';
import Common from './common';
import PageManager from './pageManager';
import settingsDataManager from './settingsDataManager';
import toDoDataManager from './toDoDataManager';
import * as Store from 'electron-store';

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
    public toDoTips: ToDoTip[];
    private startXCanvas: number;
    private startYCanvas: number;
    private endXCanvas: number;
    private endYCanvas: number;
    private startXPlain: number;
    private startYPlain: number;
    private endXPlain: number;
    private endYPlain: number;
    private startXToDoPlain: number;
    private startYToDoPlain: number;
    private endXToDoPlain: number;
    private endYToDoPlain: number;
    private store: Store;

    /**
     * 4 * 20のセルを作成する
     */
    constructor(toDoDatas: toDoData[]) {
        this.sdm = new settingsDataManager();
        this.sdm.import();
        this.urgencySpans = [2, 4, 14, 30];
        this.store = new Store();
        const common = new Common();

        this.widthPartitionPerSpan = 2;
        this.heightPartitionPerImportance = 5;
        this.importanceNumber = 4 * this.heightPartitionPerImportance;
        this.urgencyNumber = this.widthPartitionPerSpan * this.urgencySpans.length;
        if (this.store.has('settingsData')) {
            this.fontScale = 0.0035 * this.sdm.settingsData.getTextSize() + 0.25; //0 -> 0.25, 20 -> 0.32, 40 -> 0.39, 60 -> 0.46, 80 -> 0.53. 100 -> 0.6
        } else {
            this.fontScale = 0.46;
        }
        this.widthScale = 0.8;

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

        this.toDoTips = new Array();
        toDoDatas.forEach((toDoData: toDoData) => {
            let toDoTip = new ToDoTip(toDoData);
            this.toDoTips.push(toDoTip);
        });
    }

    /**
     * 各セルのサイズと位置を決定後、各セルに格納するtodoデータのidをcreateUrimCell()によって決定する
     * 
     * @param canvas 
     * @param toDoDatas 全todoデータ
     */
    public setupCanvas(canvas: HTMLCanvasElement) {
        const common = new Common();
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);


        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        this.width = canvas.width = rect.width * dpr;
        this.height = canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);

        this.startXCanvas = 0;
        this.startYCanvas = 0;
        this.endXCanvas = canvas.width;
        this.endYCanvas = canvas.height;
        this.startXPlain = canvas.width * 2.5 / 43.5;
        this.startYPlain = canvas.height * 2.5 / 25.0;
        this.endXPlain = canvas.width * 41.0 / 43.5;
        this.endYPlain = canvas.height;
        this.startXToDoPlain = canvas.width * 2.5 / 43.5;
        this.startYToDoPlain = canvas.height * 4.0 / 25.0;
        this.endXToDoPlain = canvas.width * 39.5 / 43.5;
        this.endYToDoPlain = canvas.height;

        this.urAxis = new AxisManager(this.startXToDoPlain, this.startYToDoPlain + (this.endYToDoPlain - this.startYToDoPlain) / 2, this.endXPlain, this.startYToDoPlain + (this.endYToDoPlain - this.startYToDoPlain) / 2, [0, canvas.height / 50.0, this.endXToDoPlain - this.startXToDoPlain, canvas.height / 50, this.endXToDoPlain - this.startXToDoPlain, canvas.height / 25]);
        this.imAxis = new AxisManager(this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) / 2, this.endYToDoPlain, this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) / 2, this.startYPlain, [0, canvas.height / 50, this.endYToDoPlain - this.startYToDoPlain, canvas.height / 50, this.endYToDoPlain - this.startYToDoPlain, canvas.height / 25]);

        for (let iIm = 0; iIm < this.importanceNumber; iIm++) {
            for (let iUr = 0; iUr < this.urgencyNumber; iUr++) {
                this.urimCell[iIm][iUr].ids = [''];
                this.urimCell[iIm][iUr].pm.maxPage = 0;
                this.urimCell[iIm][iUr].pm.minPage = 0;
                this.urimCell[iIm][iUr].pm.left = this.startXToDoPlain + iUr * (this.endXToDoPlain - this.startXToDoPlain) / this.urgencyNumber + (this.endXToDoPlain - this.startXToDoPlain) * (1 - this.widthScale) / (this.urgencyNumber * 2);
                this.urimCell[iIm][iUr].pm.width = (this.endXToDoPlain - this.startXToDoPlain) * this.widthScale / this.urgencyNumber;
                this.urimCell[iIm][iUr].pm.height = (this.endYToDoPlain - this.startYToDoPlain) / this.importanceNumber;
                this.urimCell[iIm][iUr].pm.top = this.calcImCoord(canvas, Object.keys(common.imToNum).filter(v => { return common.imToNum[v] == iIm })[0]) + (this.heightPartitionPerImportance - 2) * this.urimCell[iIm][iUr].pm.height;
            }
        }

        this.createUrimCell();

        return ctx;
    }

    /**
     * 緊急度から緊急度インデックス（緊急でない 0 - 7 緊急）を算出している
     * 
     * @param urgency 緊急度（現状8分割している）
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
        return this.startYToDoPlain + (this.endYToDoPlain - this.startYToDoPlain) * common.imToNum[<keyof { [s: string]: number }>importance] / 4 + (this.endYToDoPlain - this.startYToDoPlain) / (2 * this.importanceNumber);
    }

    /**
     * 緊急度から緊急度canvas座標を算出する
     * 
     * @param canvas 
     * @param urgency 緊急度
     */
    private calcUrCoord(canvas: HTMLCanvasElement, urgency: number): number {
        return this.startXToDoPlain + this.urToCoord(urgency) * (this.endXToDoPlain - this.startXToDoPlain) / this.urgencyNumber;
    }

    /**
     * 各セルが保持するtodoデータのidをurimCell配列に格納する
     * 
     * @param toDoDatas 全todoデータ
     */
    private createUrimCell() {
        const common = new Common();
        // urimCellにデータ格納する
        this.toDoTips.forEach((toDoTip: ToDoTip) => {
            if (this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].ids[0] !== '') {
                this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].ids.push(toDoTip.toDoData.getId());
            } else {
                this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].ids = [toDoTip.toDoData.getId()];
            }
        });
    }

    /**
     * 各todoの座標や配置するページ番号を算出する
     * 
     * @param canvas 
     * @param toDoDatas 全todoデータ
     */
    public createToDoTips(canvas: HTMLCanvasElement) {
        const common = new Common();

        this.urimCell.forEach((imArray: UrimCell[]) => {
            imArray.forEach((cell: UrimCell) => {
                if (cell.ids[0] !== '') {
                    cell.ids.forEach((id: string, index: number) => {
                        // urimCellに格納されたidと一致するtoDoDataを検索して代入
                        const toDoTip: ToDoTip = (id => {
                            return this.toDoTips.find(tDT => tDT.toDoData.getId() === id);
                        })(id);

                        // - left
                        // - right
                        // - top
                        // - bottom
                        // を計算する


                        toDoTip.width = (this.endXToDoPlain - this.startXToDoPlain) * this.widthScale / this.urgencyNumber;
                        toDoTip.height = (this.endYToDoPlain - this.startYToDoPlain) / this.importanceNumber;
                        toDoTip.left = this.calcUrCoord(canvas, toDoTip.toDoData.getUrgency()) + ((this.endXToDoPlain - this.startXToDoPlain) / this.urgencyNumber - toDoTip.width) / 2;
                        toDoTip.top = this.calcImCoord(canvas, toDoTip.toDoData.getImportance()) + (index % (this.heightPartitionPerImportance - 2)) * toDoTip.height;
                        toDoTip.bottom = toDoTip.top + toDoTip.height;

                        toDoTip.page = Math.floor(index / (this.heightPartitionPerImportance - 2));

                        if (toDoTip.page == 0) {
                            toDoTip.isOnPage = true;
                        } else {
                            toDoTip.isOnPage = false;
                        }



                        // 最大ページを求める
                        this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].pm.maxPage = Math.max(this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].pm.maxPage, toDoTip.page);

                        if (index > (this.heightPartitionPerImportance - 3)) {
                            this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].pm.hasPages = true;
                        } else if (index <= (this.heightPartitionPerImportance - 3)) {
                            this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].pm.hasPages = false;
                        }

                        toDoTip.right = toDoTip.left + toDoTip.width;
                        toDoTip.setTextPosition(toDoTip.left + toDoTip.height / 10, toDoTip.top + toDoTip.height * (1 - this.fontScale) / 2);

                        toDoTip.urgencyNumber = this.urgencyNumber;
                        toDoTip.importanceNumber = this.importanceNumber;
                        toDoTip.fontScale = this.fontScale;
                    });
                }
            });
        });
    }

    public deleteToDoTips(tddm: toDoDataManager) {
        this.toDoTips.forEach(toDoTip => {
            if (toDoTip.isDeleteCandidate) {
                tddm.delete(toDoTip.toDoData.getId());
            }
        });

        this.toDoTips = this.toDoTips.filter(toDoTip => !toDoTip.isDeleteCandidate);
    }

    /**
     * 緊急度軸、重要度軸の軸矢印と軸名を描画する
     * 
     * @param canvas 
     * @param ctx 
     */
    private renderAxis(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.urAxis.create(ctx, 'gradient');
        this.imAxis.create(ctx, 'fill');

        // 軸名の描画
        ctx.beginPath();
        let fontSize = canvas.width / 80;

        ctx.font = `500 ${fontSize}pt 'Font Awesome 5 Free'`

        ctx.fillStyle = 'rgb(223, 223, 223)';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText('重要度', this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) / 2, this.startYPlain * 1.75 / 2.5);
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

        vFillText(ctx, '緊急度', this.endXCanvas * 42.0 / 43.5, this.startYToDoPlain + (this.endYToDoPlain - this.startYToDoPlain) / 2);
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

            ctx.fillRect(this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) / 2 * (index % 2), this.startYToDoPlain + (this.endYToDoPlain - this.startYToDoPlain) / 4 * Math.floor(index / 2), (this.endXToDoPlain - this.startXToDoPlain) / 2, (this.endYToDoPlain - this.startYToDoPlain) / 4);
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
                    ctx.fillStyle = 'rgb(223, 223, 223)';

                    ctx.textBaseline = 'top';
                    ctx.fillText('\uf0d9', this.urimCell[iIm][iUr].pm.left, this.urimCell[iIm][iUr].pm.top);
                    ctx.textAlign = 'end';
                    ctx.fillText('\uf0da', this.urimCell[iIm][iUr].pm.left + this.urimCell[iIm][iUr].pm.width, this.urimCell[iIm][iUr].pm.top);
                    ctx.textAlign = 'start';
                }
            }
        }
    }

    private renderLineDash(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.setLineDash([5, 10]);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgb(223, 223, 223)'
        ctx.moveTo(this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) / 8, this.startYToDoPlain);
        for (let i = 1; i < 8; i++) {
            if (i !== 4) {
                ctx.lineTo(this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) * i / 8, this.endYToDoPlain);
            }
            ctx.moveTo(this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) * (i + 1) / 8, this.startYToDoPlain);
        }
        ctx.stroke();
    }

    private renderRemainDays(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        let fontSize = canvas.height * this.fontScale / this.importanceNumber;

        ctx.font = `500 ${fontSize}px 'Font Awesome 5 Free'`;

        ctx.fillStyle = 'rgb(240, 240, 240)';

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        const remeinDaysArray = ['31日-', '21日-30日', '14日-20日', '7日-13日', '5日-6日', '3日-4日', '2日', '1日']

        for (let i = 0; i < 8; i++) {
            ctx.fillText(remeinDaysArray[i], this.startXToDoPlain + (this.endXToDoPlain - this.startXToDoPlain) * i / 8 + (this.endXToDoPlain - this.startXToDoPlain) / 16, this.startYToDoPlain + (this.endYToDoPlain - this.startYToDoPlain) / 2);
        }
    }

    /**
     * 描画に関する関数を呼び出す
     * 
     * @param canvas 
     * @param ctx 
     * @param toDoTips 全todoチップ（canvas上に配置するためのデータ構造）
     */
    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const common = new Common();

        canvas.height = this.height;
        canvas.width = this.width;

        this.renderImBackground(canvas, ctx);
        this.renderAxis(canvas, ctx);
        this.renderRemainDays(canvas, ctx);
        this.renderLineDash(canvas, ctx);

        this.toDoTips.forEach(toDoTip => {
            if (toDoTip.page == this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][this.urToCoord(toDoTip.toDoData.getUrgency())].pm.page) {
                toDoTip.render(canvas, ctx, this.sdm.settingsData)
                toDoTip.isOnPage = true;
            } else {
                toDoTip.isOnPage = false;
            }
        });

        this.renderPageController(canvas, ctx);
    }
}
