import AxisManager from './axisManager';
import { Certificate } from 'crypto';
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
    private imToCoord = {
        'S': 0,
        'A': 1,
        'B': 2,
        'C': 3
    } as IImToCoord;
    private urimCell: number[][][]; // 4 * 20の要素　各要素に入るデータ数は異なる
    // cell[importance][urgency][index]: 各importance, urgencyでのtoDoデータIDを格納する

    constructor(canvas: HTMLCanvasElement) {
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.urAxis = new AxisManager(0, canvas.height / 2, canvas.width, canvas.height / 2, [0, 5, -20, 5, -20, 15]);
        this.imAxis = new AxisManager(canvas.width / 2, canvas.height, canvas.width / 2, 0, [0, 5, -20, 5, -20, 15]);

        this.urimCell = [
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]],
            [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1]]
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

    private renderToDo(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, toDoDatas: any) {
        let fontSize = canvas.width / 70;

        ctx.font = `${fontSize}px Arial`;

        toDoDatas.forEach((toDoData: any) => {
            // CellManager呼んで、格納する？別のメソッドで呼ぶ？
            // データの格納
            if (this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.importance]][1][0] !== -1) {
                this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.importance]][1].push(toDoData.id);
            } else {
                this.urimCell[this.imToCoord[<keyof IImToCoord>toDoData.importance]][1] = [toDoData.id];
            }
        });

        this.urimCell.forEach((imArray: any) => {
            imArray.forEach((cell: any) => {
                if (cell[0] !== -1) {
                    cell.forEach((id: number, index: number) => {
                        // TODO: スマートに四角形の大きさとか決める
                        console.log(toDoDatas[id].urgency, this.urToCoord(toDoDatas[id].urgency));
                        ctx.rect(this.calcUrCoord(canvas, toDoDatas[id].urgency), this.calcImCoord(canvas, toDoDatas[id].importance) - canvas.height / 40, canvas.width / 20, canvas.height / 32);
                        ctx.stroke();

                        ctx.fillText(toDoDatas[id].title, this.calcUrCoord(canvas, toDoDatas[id].urgency), this.calcImCoord(canvas, toDoDatas[id].importance));
                    });
                }
            });
        });



    }

    public render(canvas: HTMLCanvasElement, container: HTMLElement, toDoDatas: any) {
        const ctx = this.setupCanvas(canvas);

        this.renderAxis(canvas, ctx);

        this.renderToDo(canvas, ctx, toDoDatas);
    }
}

export default UrimPlaneManager;
