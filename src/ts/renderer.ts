import UrimPlaneManager from './urimPlaneManager';
import ToDoTip from './ToDoTip';
import toDoData from './toDoData';
import ToDoDataManager from './toDoDataManager';

const container: HTMLElement = <HTMLElement>document.getElementById('urim-plain-container');
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

const tddMng = new ToDoDataManager();

let upm: UrimPlaneManager;
let toDoTips: ToDoTip[];
let ctx: CanvasRenderingContext2D;

const render = (toDoDatas: toDoData[]) => {
    upm = new UrimPlaneManager(canvas, toDoDatas);
    ctx = upm.setupCanvas(canvas);
    toDoTips = upm.createToDoTips(canvas, toDoDatas);
    upm.render(canvas, ctx, toDoTips);
}

canvas.addEventListener('contextmenu', e => {
    e.preventDefault();

    const dpr = window.devicePixelRatio || 1;
    const canvasRect = canvas.getBoundingClientRect();

    const point = {
        x: e.clientX * dpr - canvasRect.left * dpr,
        y: e.clientY * dpr - canvasRect.top * dpr
    };

    // クリック判定処理
    toDoTips.forEach(toDoTip => {
        if (toDoTip.isClicked(point)) {
            toDoTip.toggleToday(canvas, ctx);
        }
    });

});

// 初期読み込み時は、renderに加えて、json読み込みとか行う
window.onload = () => {
    tddMng.import();
    render(tddMng.toDoDataArray);
};

// リサイズのたびに、toDoDataを読み込んでrenderする
window.addEventListener('resize', () => { render(tddMng.toDoDataArray) }, false);
