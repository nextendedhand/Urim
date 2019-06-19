import AxisManager from './axisManager';
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

    constructor(canvas: HTMLCanvasElement) {
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.urAxis = new AxisManager(0, canvas.height / 2, canvas.width, canvas.height / 2, [0, 5, -20, 5, -20, 15]);
        this.imAxis = new AxisManager(canvas.width / 2, canvas.height, canvas.width / 2, 0, [0, 5, -20, 5, -20, 15]);
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

    private calcImpCoord(canvas: HTMLCanvasElement, importance: string): number {

        return canvas.height * this.imToCoord[<keyof IImToCoord>importance] / 4 + canvas.height / 20;
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

    private renderToDo(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const toDoDatas = [{
            title: 'hoge',
            importance: 'S',
            urgency: '2'
        }, {
            title: 'fuga',
            importance: 'A',
            urgency: '5'
        }];


        let fontSize = canvas.width / 70;

        ctx.font = `${fontSize}px Arial`;

        toDoDatas.forEach(toDoData => {
            ctx.fillText(toDoData.title, canvas.width / 10, this.calcImpCoord(canvas, toDoData.importance));
        });

    }

    public render(canvas: HTMLCanvasElement, container: HTMLElement) {
        const ctx = this.setupCanvas(canvas);

        this.renderAxis(canvas, ctx);

        this.renderToDo(canvas, ctx);
    }
}

export default UrimPlaneManager;
