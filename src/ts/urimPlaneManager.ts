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

    /**
     * 4 * 20のセルを作成する
     */
    constructor() {
        this.sdm = new settingsDataManager();
        this.sdm.import();

        this.urimCell = new Array(4);
        for (let iIm = 0; iIm < 4; iIm++) {
            this.urimCell[iIm] = new Array(20);
            for (let iUr = 0; iUr < 20; iUr++) {
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

        for (let iIm = 0; iIm < 4; iIm++) {
            for (let iUr = 0; iUr < 20; iUr++) {
                this.urimCell[iIm][iUr].ids = [''];
                this.urimCell[iIm][iUr].pm.maxPage = 0;
                this.urimCell[iIm][iUr].pm.minPage = 0;
                this.urimCell[iIm][iUr].pm.left = iUr * canvas.width / 20;;
                this.urimCell[iIm][iUr].pm.width = canvas.width / 20;
                this.urimCell[iIm][iUr].pm.height = canvas.height / 32;
                this.urimCell[iIm][iUr].pm.top = this.calcImCoord(canvas, Object.keys(common.imToNum).filter(v => { return common.imToNum[v] == iIm })[0]) + 6 * this.urimCell[iIm][iUr].pm.height - this.urimCell[iIm][iUr].pm.height;
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
        if (urgency >= 1 && urgency <= 5) {
            return 20 - urgency;
        }
        else if (urgency >= 6 && urgency <= 30) {
            return (urgency - 5) % 5 !== 0 ? 20 - 6 - Math.floor((urgency - 5) / 5) : 20 - 5 - Math.floor((urgency - 5) / 5);
        }
        else if (urgency >= 31 && urgency <= 90) {
            return (urgency - 30) % 12 !== 0 ? 20 - 11 - Math.floor((urgency - 30) / 12) : 20 - 10 - Math.floor((urgency - 30) / 12);
        }
        else if (urgency >= 91 && urgency <= 242) {
            return (urgency - 90) % 30 !== 0 ? 20 - 16 - Math.floor((urgency - 90) / 30) : 20 - 15 - Math.floor((urgency - 90) / 30);
        }
        else if (urgency >= 243) {
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
        return canvas.height * common.imToNum[<keyof { [s: string]: number }>importance] / 4 + canvas.height / 20;
    }

    /**
     * 緊急度から緊急度canvas座標を算出する
     * 
     * @param canvas 
     * @param urgency 緊急度
     */
    private calcUrCoord(canvas: HTMLCanvasElement, urgency: number): number {
        return this.urToCoord(urgency) * canvas.width / 20;
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

                        toDoTip.width = canvas.width / 20;
                        toDoTip.height = canvas.height / 32;
                        toDoTip.left = this.calcUrCoord(canvas, toDoData.getUrgency());
                        toDoTip.bottom = this.calcImCoord(canvas, toDoData.getImportance()) + (index % 6) * toDoTip.height;

                        toDoTip.page = Math.floor(index / 6);

                        // 最大ページを求める
                        this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.maxPage = Math.max(this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.maxPage, toDoTip.page);

                        if (index > 6) {
                            this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.hasPages = true;
                        } else if (index <= 6) {
                            this.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].pm.hasPages = false;
                        }

                        toDoTip.right = toDoTip.left + toDoTip.width;
                        toDoTip.top = toDoTip.bottom - toDoTip.height;
                        toDoTip.setTextPosition(toDoTip.left, toDoTip.top + canvas.height / 40);

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
        ctx.fillStyle = this.sdm.settingsData.getGenreData()[toDoTip.toDoData.getGenreId()]['color'];
        ctx.fill();


        // toDoDataの文字描画開始
        ctx.beginPath();
        let fontSize = canvas.width / 80;

        // today用の星描画
        let todayIcon = '\uf005';

        ctx.font = toDoTip.toDoData.getIsToday() ? `900 ${fontSize}px 'Font Awesome 5 Free'` : `400 ${fontSize}px 'Font Awesome 5 Free'`;

        ctx.fillStyle = 'rgb(0, 0, 0)';

        ctx.fillText(todayIcon, toDoTip.getTextPosition().x, toDoTip.getTextPosition().y);

        ctx.font = `900 ${fontSize}px 'Font Awesome 5 Free'`;

        let title = toDoTip.toDoData.getTitle();
        toDoTip.shortTitle = title;

        if (ctx.measureText(todayIcon + title).width >= toDoTip.width) {
            while (true) {
                if (ctx.measureText(`${todayIcon}${title}..`).width < toDoTip.width) {
                    toDoTip.shortTitle = title + '..';
                    break;
                }
                title = title.slice(0, -1);
            }
        }

        ctx.fillText(toDoTip.shortTitle, toDoTip.getTextPosition().x + toDoTip.width / 3, toDoTip.getTextPosition().y);
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
            for (let iUr = 0; iUr < 20; iUr++) {
                if (this.urimCell[iIm][iUr].pm.hasPages) {
                    ctx.fillStyle = '#000';
                    ctx.rect(this.urimCell[iIm][iUr].pm.left, this.urimCell[iIm][iUr].pm.top, this.urimCell[iIm][iUr].pm.width, this.urimCell[iIm][iUr].pm.height);
                    ctx.stroke();

                    // 矢印描画
                    let fontSize = canvas.width / 60;
                    ctx.font = `900 ${fontSize}px 'Font Awesome 5 Free'`;
                    ctx.fillStyle = 'rgb(0, 0, 0)';

                    ctx.fillText('\uf0d9', this.urimCell[iIm][iUr].pm.left + this.urimCell[iIm][iUr].pm.width / 10, this.urimCell[iIm][iUr].pm.top + canvas.height / 40);
                    ctx.fillText('\uf0da', this.urimCell[iIm][iUr].pm.left + this.urimCell[iIm][iUr].pm.width * 8 / 10, this.urimCell[iIm][iUr].pm.top + canvas.height / 40);
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
            }
        });

        this.renderPageController(canvas, ctx);
    }
}
