import UrimPlaneManager from './urimPlaneManager';

namespace Urim.Renderer {
    const container: HTMLElement = <HTMLElement>document.getElementById('urim-plain-container');
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

    // todo情報を読み取る(最初のロード時・todoデータが作成・削除・編集されるたびに実行)
    let todoData = {}

    const render = () => {
        let upm: UrimPlaneManager = new UrimPlaneManager(canvas);
        upm.render(canvas, container);
        upm = null;
    }

    window.onload = render;
    window.addEventListener('resize', render, false);
}
