import UrimPlaneManager from './urimPlaneManager';
import ToDoTip from './ToDoTip';

const container: HTMLElement = <HTMLElement>document.getElementById('urim-plain-container');
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

// todo情報を読み取る(最初のロード時・todoデータが作成・削除・編集されるたびに実行)
const toDoDatas = [{
    title: '1:S2',
    importance: 'S',
    urgency: 2,
    today: true,
    id: '1SPpJ'
}, {
    title: '2:A2',
    importance: 'A',
    urgency: 2,
    today: true,
    id: '2SPpd'
}, {
    title: '3:A2',
    importance: 'A',
    urgency: 2,
    today: false,
    id: '3dsfd'
}, {
    title: '4:A4',
    importance: 'A',
    urgency: 4,
    today: true,
    id: '4ogef'
}, {
    title: '5:B5',
    importance: 'B',
    urgency: 5,
    today: false,
    id: '5iyoS'
}, {
    title: '6:C6',
    importance: 'C',
    urgency: 6,
    today: true,
    id: '6skrj'
}, {
    title: '7:A11',
    importance: 'A',
    urgency: 11,
    today: false,
    id: '7dspI'
}];

let upm: UrimPlaneManager;
let toDoTips: ToDoTip[];
let ctx: CanvasRenderingContext2D;

const render = () => {
    upm = new UrimPlaneManager(canvas, toDoDatas);
    ctx = upm.setupCanvas(canvas);
    toDoTips = upm.createToDoTips(canvas, toDoDatas);
    upm.render(canvas, ctx, toDoTips);
}

// 無名関数の部分はtoggleToday関数作成する
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

window.onload = render;
window.addEventListener('resize', render, false);
