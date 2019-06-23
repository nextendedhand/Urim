import UrimPlaneManager from './urimPlaneManager';

namespace Urim.Renderer {
    const container: HTMLElement = <HTMLElement>document.getElementById('urim-plain-container');
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

    // todo情報を読み取る(最初のロード時・todoデータが作成・削除・編集されるたびに実行)
    const toDoDatas = [{
        title: 'hoge',
        importance: 'S',
        urgency: 1,
        id: 0
    }, {
        title: 'fuga',
        importance: 'A',
        urgency: 2,
        id: 1
    }, {
        title: 'piyo',
        importance: 'A',
        urgency: 3,
        id: 2
    }, {
        title: 'huga',
        importance: 'A',
        urgency: 4,
        id: 3
    }, {
        title: 'foge',
        importance: 'B',
        urgency: 5,
        id: 4
    }, {
        title: 'piyo',
        importance: 'C',
        urgency: 6,
        id: 5
    }, {
        title: 'hoge',
        importance: 'A',
        urgency: 11,
        id: 6
    }];


    const render = () => {
        let upm: UrimPlaneManager = new UrimPlaneManager(canvas);
        upm.render(canvas, container, toDoDatas);
        upm = null;
    }

    window.onload = render;
    window.addEventListener('resize', render, false);
}
