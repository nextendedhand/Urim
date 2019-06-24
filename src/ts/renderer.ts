import UrimPlaneManager from './urimPlaneManager';

const container: HTMLElement = <HTMLElement>document.getElementById('urim-plain-container');
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

// todo情報を読み取る(最初のロード時・todoデータが作成・削除・編集されるたびに実行)
const toDoDatas = [{
    title: 'hoge',
    importance: 'S',
    urgency: 1,
    id: '9SPpJfkb32'
}, {
    title: 'fuga',
    importance: 'A',
    urgency: 2,
    id: '9SPpdgrkb3'
}, {
    title: 'piyo',
    importance: 'A',
    urgency: 3,
    id: 'fdsfdskb32'
}, {
    title: 'huga',
    importance: 'A',
    urgency: 4,
    id: 'hogefuga31'
}, {
    title: 'foge',
    importance: 'B',
    urgency: 5,
    id: 'piyoSdfe32'
}, {
    title: 'piyo',
    importance: 'C',
    urgency: 6,
    id: 'dskrj42edf'
}, {
    title: 'hoge',
    importance: 'A',
    urgency: 11,
    id: 'fdspIRW3Sd'
}];


const render = () => {
    let upm: UrimPlaneManager = new UrimPlaneManager(canvas);
    upm.render(canvas, container, toDoDatas);
    upm = null;
}

window.onload = render;
window.addEventListener('resize', render, false);
