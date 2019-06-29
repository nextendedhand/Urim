import AxisManager from './axisManager';
import { stringify } from 'querystring';

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

    constructor(canvas: HTMLCanvasElement) {
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
    }

    private setupCanvas(canvas: HTMLCanvasElement) {
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


    private renderAxis(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        canvas.height = this.height;
        canvas.width = this.width;

        this.urAxis.startY = canvas.height / 2;
        this.urAxis.endX = canvas.width;
        this.urAxis.endY = canvas.height / 2;

        this.imAxis.startX = canvas.width / 2;
        this.imAxis.startY = canvas.height;
        this.imAxis.endX = canvas.width / 2;

        this.urAxis.create(ctx);
        this.imAxis.create(ctx);
    }

    private renderToDo(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, toDoDatas: toDoDataObject[]) {
        let fontSize = canvas.width / 70;

        ctx.font = `${fontSize}px Arial`;

        // urimCellにデータ格納する
        toDoDatas.forEach((toDoData: toDoDataObject) => {
            if (this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.importance]][1][0] !== '') {
                this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.importance]][1].push(toDoData.id);
            } else {
                this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.importance]][1] = [toDoData.id];
            }
        });

        // urimCellに格納されたidから、toDoDatasにある同一idを探索
        // 探索したら、toDoDataを表示する
        this.urimCell.forEach((imArray: string[][]) => {
            imArray.forEach((cell: string[]) => {
                if (cell[0] !== '') {

                    cell.forEach((id: string) => {
                        const toDoData: toDoDataObject = (id => {
                            return toDoDatas.find(tDD => tDD.id === id);
                        })(id);

                        ctx.rect(this.calcUrCoord(canvas, toDoData.urgency), this.calcImCoord(canvas, toDoData.importance) - canvas.height / 40, canvas.width / 20, canvas.height / 32);
                        ctx.stroke();

                        ctx.fillText(toDoData.title, this.calcUrCoord(canvas, toDoData.urgency), this.calcImCoord(canvas, toDoData.importance));
                    });
                }
            });
        });
    }

    public render(canvas: HTMLCanvasElement, container: HTMLElement, toDoDatas: { title: string, importance: string, urgency: number, id: string }[]) {
        const ctx = this.setupCanvas(canvas);

        this.renderAxis(canvas, ctx);

        this.renderToDo(canvas, ctx, toDoDatas);
    }
}

export default UrimPlaneManager;
