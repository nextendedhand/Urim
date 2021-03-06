/**
 * 緊急度軸や重要度軸の矢印描画のためのデータの管理及び描画処理を行う
 */
class AxisManager {
    public startX: number;
    public startY: number;
    public endX: number;
    public endY: number;
    public controlPoints: number[];

    /**
     * 始点、終点、制御点を設定する
     * 
     * @param startX 始点canvasX座標
     * @param startY 始点canvasY座標
     * @param endX 終点canvasX座標
     * @param endY 終点canvasY座標
     * @param controlPoints 制御点
     */
    constructor(startX: number, startY: number, endX: number, endY: number, controlPoints: number[]) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.controlPoints = controlPoints;
    }

    /**
     * Draw arrow by specifying a start point, end point, and control points.
     *
     * @remarks
     * This method is additional method of CanvasRenderingContext2D interface.
     * The origin is upper left in canvas element.
     * x direction is right direction.
     * y direction is down direction.
     *
     * @param ctx - The 2D rendering context to rendering in canvas element
     * @param startX - The x coordinate of start point
     * @param startY - The y coordinate of start point
     * @param endX - The x coordinate of end point
     * @param endY - The y coordinate of end point
     * @param controlPoints - The coordinates of control points which is relative coordinates
     *                        from start point or end point.
     *                        Odd-numbered value is x coordinate.
     *                        Positive value is from the start point and negative is from end   point.
     *                        Even-numbered value is y coordinate.
     *
     * @returns void
     */
    public create(ctx: CanvasRenderingContext2D, style: string) {
        let dx = this.endX - this.startX;
        let dy = this.endY - this.startY;
        let len: number = Math.sqrt(dx * dx + dy * dy);
        let sin: number = dy / len;
        let cos: number = dx / len;
        let pathPoints: number[] = [];

        pathPoints.push(0, 0);

        for (let i = 0; i < this.controlPoints.length; i += 2) {
            let x = this.controlPoints[i];
            let y = this.controlPoints[i + 1];

            pathPoints.push(x < 0 ? len + x : x, y);
        }

        pathPoints.push(len, 0);

        for (let i = this.controlPoints.length; i > 0; i -= 2) {
            let x = this.controlPoints[i - 2];
            let y = this.controlPoints[i - 1];

            pathPoints.push(x < 0 ? len + x : x, -y);
        }

        pathPoints.push(0, 0);


        ctx.beginPath();
        let fillColor = 'rgb(226,194,97)';
        ctx.fillStyle = fillColor;
        if (style === 'gradient') {
            let fillColor = ctx.createLinearGradient(this.startX, this.startY, this.endX, this.endY);
            fillColor.addColorStop(0.0, 'rgb(159,159,150)');
            fillColor.addColorStop(0.5, 'rgb(226,194,97)');
            fillColor.addColorStop(1.0, 'rgb(245,195,68)');
            ctx.fillStyle = fillColor;
        }

        for (let i = 0; i < pathPoints.length; i += 2) {
            let x = pathPoints[i] * cos - pathPoints[i + 1] * sin + this.startX;
            let y = pathPoints[i] * sin + pathPoints[i + 1] * cos + this.startY;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fill();
    }
}

export default AxisManager;
