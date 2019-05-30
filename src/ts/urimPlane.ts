let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myCanvas');
let context: CanvasRenderingContext2D = canvas.getContext("2d");
context.beginPath();
context.arrow(context, 0, 0, 200, 100, [0, 5, -20, 5, -20, 15]);
context.fill();