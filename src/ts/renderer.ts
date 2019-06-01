import UrimPlaneManager from './urimPlaneManager';

let container: HTMLElement = <HTMLElement>document.getElementById('urim-plain-container');
let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

let urimPlane: UrimPlaneManager = new UrimPlaneManager(canvas);

let render = () => {
    urimPlane.render(canvas, container);
}

window.onload = render;
window.addEventListener('resize', render, false);
