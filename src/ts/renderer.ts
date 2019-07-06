import UrimPlaneManager from './urimPlaneManager';
import ToDoTip from './ToDoTip';

const container: HTMLElement = <HTMLElement>document.getElementById('urim-plain-container');
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

// todo情報を読み取る(最初のロード時・todoデータが作成・削除・編集されるたびに実行)
const toDoDatas = [{
    title: 'hoge',
    importance: 'S',
    urgency: 1,
    today: true,
    id: '9SPpJ'
}, {
    title: 'fuga',
    importance: 'A',
    urgency: 2,
    today: true,
    id: '9SPpd'
}, {
    title: 'piyo',
    importance: 'A',
    urgency: 3,
    today: false,
    id: 'fdsfd'
}, {
    title: 'huga',
    importance: 'A',
    urgency: 4,
    today: true,
    id: 'hogef'
}, {
    title: 'foge',
    importance: 'B',
    urgency: 5,
    today: false,
    id: 'piyoS'
}, {
    title: 'piyo',
    importance: 'C',
    urgency: 6,
    today: true,
    id: 'dskrj'
}, {
    title: 'hoge',
    importance: 'A',
    urgency: 11,
    today: false,
    id: 'fdspI'
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
canvas.addEventListener('click', e => {
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
