import AxisManager from './axisManager';

class UrimPlaneManager {
    public urAxis: AxisManager;
    public imAxis: AxisManager;

    constructor(canvas: HTMLCanvasElement) {
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.urAxis = new AxisManager(0, canvas.height / 2, canvas.width, canvas.height / 2, [0, 5, -20, 5, -20, 15]);
        this.imAxis = new AxisManager(canvas.width / 2, canvas.height, canvas.width / 2, 0, [0, 5, -20, 5, -20, 15]);
    }

    public render(canvas: HTMLCanvasElement, container: HTMLElement) {
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        this.urAxis.startY = canvas.height / 2;
        this.urAxis.endX = canvas.width;
        this.urAxis.endY = canvas.height / 2;

        this.imAxis.startX = canvas.width / 2;
        this.imAxis.startY = canvas.height;
        this.imAxis.endX = canvas.width / 2;

        this.urAxis.create(ctx);
        this.imAxis.create(ctx);
    }
}

export default UrimPlaneManager;
