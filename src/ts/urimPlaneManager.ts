import AxisManager from './axisManager';
import ToDoData from './ToDoData';
import ToDoTip from './ToDoTip';

interface IImToCoord {
    S: number;
    A: number;
    B: number;
    C: number;
}

class UrimPlaneManager {
    public urAxis: AxisManager;
    public imAxis: AxisManager;
    private height: number;
    private width: number;
    private imToCoord: IImToCoord = {
        'S': 0,
        'A': 1,
        'B': 2,
        'C': 3
    };
    private urimCell: string[][][]; // 4 * 20の要素　各要素に入るデータ数は異なる
    // cell[importance][urgency][index]: 各importance, urgencyでのtoDoデータIDを格納する

    constructor(canvas: HTMLCanvasElement, toDoDatas: ToDoData[]) {
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.urAxis = new AxisManager(0, canvas.height / 2, canvas.width, canvas.height / 2, [0, 5, -20, 5, -20, 15]);
        this.imAxis = new AxisManager(canvas.width / 2, canvas.height, canvas.width / 2, 0, [0, 5, -20, 5, -20, 15]);

        this.urimCell = [
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']],
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']],
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']],
            [[''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']]
        ];

        this.createUrimCell(toDoDatas);
    }

    public setupCanvas(canvas: HTMLCanvasElement) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        this.width = canvas.width = rect.width * dpr;
        this.height = canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');

        ctx.scale(dpr, dpr);

        return ctx;
    }

    private urToCoord(urgency: number) {
        if (urgency >= 1 && urgency <= 5) {
            return 20 - urgency;
        }
        else if (urgency >= 6 && urgency <= 30) {
            return (urgency - 5) % 5 !== 0 ? 20 - 6 - Math.floor((urgency - 5) / 5) : 20 - 5 - Math.floor((urgency - 5) / 5);
        }
        else if (urgency >= 31 && urgency <= 90) {
            return (urgency - 30) % 12 !== 0 ? 20 - 11 - Math.floor((urgency - 30) / 12) : 20 - 10 - Math.floor((urgency - 30) / 12);
        }
        else if (urgency >= 91) {
            return (urgency - 90) % 30 !== 0 ? 20 - 16 - Math.floor((urgency - 30) / 18) : 20 - 15 - Math.floor((urgency - 90) / 18);
        }
        else if (urgency >= 163) {
            return 0;
        }
    }

    private calcImCoord(canvas: HTMLCanvasElement, importance: string): number {
        return canvas.height * this.imToCoord[<keyof IImToCoord>importance] / 4 + canvas.height / 20;
    }

    private calcUrCoord(canvas: HTMLCanvasElement, urgency: number): number {
        return this.urToCoord(urgency) * canvas.width / 20;
    }

    private createUrimCell(toDoDatas: ToDoData[]) {
        // urimCellにデータ格納する
        // ToDO: UtimCellクラス作るかどうか考える
        toDoDatas.forEach((toDoData: ToDoData) => {
            if (this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())][0] !== '') {
                this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())].push(toDoData.getId());
            } else {
                this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.getImportance()]][this.urToCoord(toDoData.getUrgency())] = [toDoData.getId()];
            }
        });
    }

    public createToDoTips(canvas: HTMLCanvasElement, toDoDatas: ToDoData[]): ToDoTip[] {
        let toDoTips: ToDoTip[] = new Array();

        this.urimCell.forEach((imArray: string[][]) => {
            imArray.forEach((cell: string[]) => {
                if (cell[0] !== '') {
                    cell.forEach((id: string, index: number) => {
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
                        toDoTip.bottom = this.calcImCoord(canvas, toDoData.getImportance()) + (index % 7) * toDoTip.height;

                        toDoTip.page = 0;
                        // TODO: 7個(index:6)以上の場合は、一番下に右矢印と左矢印を用意しておく
                        // クリックしたら、次/前のToDoが表示されるようにする
                        // 何ページ目のtoDoかを記憶するプロパティが必要
                        // toDo描画時に、1ページ目のtoDoのみを描画する論理を追加する
                        // 複数ページ持つ場合は、次へ/→へボタンが表示されるようにする
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


    private renderAxis(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        canvas.height = this.height;
        canvas.width = this.width;

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

    private renderToDo(toDoTip: ToDoTip, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        // toDoDataの矩形描画開始
        ctx.beginPath();

        // toDoDataの描画矩形の設定
        ctx.rect(toDoTip.left, toDoTip.top, toDoTip.width, toDoTip.height);

        // toDoDataの色設定
        // todayかどうかで色が決まる
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.stroke();


        // toDoDataの文字描画開始
        ctx.beginPath();
        let fontSize = canvas.width / 80;

        // today用の星描画
        let todayIcon = '\uf005';

        ctx.font = toDoTip.toDoData.getToday() ? `900 ${fontSize}px 'Font Awesome 5 Free'` : `400 ${fontSize}px 'Font Awesome 5 Free'`;

        ctx.fillStyle = 'rgb(0, 0, 0)';

        ctx.fillText(todayIcon, toDoTip.getTextPosition().x, toDoTip.getTextPosition().y);

        ctx.font = `900 ${fontSize}px 'Font Awesome 5 Free'`;

        let title = toDoTip.toDoData.getTitle();

        if (ctx.measureText(todayIcon + title).width >= toDoTip.width) {
            while (true) {
                if (ctx.measureText(`${todayIcon}${title}..`).width < toDoTip.width) {
                    title += '..';
                    break;
                }
                title = title.slice(0, -1);
            }
        }

        ctx.fillText(title, toDoTip.getTextPosition().x + toDoTip.width / 3, toDoTip.getTextPosition().y);
    }

    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, toDoTips: ToDoTip[]) {
        this.renderAxis(canvas, ctx);

        toDoTips.forEach(toDoTip => {
            if (toDoTip.page === 0) {
                this.renderToDo(toDoTip, canvas, ctx);
            }
        });
    }
}

export default UrimPlaneManager;
