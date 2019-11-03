import { UrimCell, UrimPlaneManager } from './urimPlaneManager';
import ToDoTip from './ToDoTip';
import toDoData from './toDoData';
import ToDoDataManager from './toDoDataManager';
import Common from './common';
import settingsDataManager from './settingsDataManager';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

const tddm = new ToDoDataManager();

const sdm = new settingsDataManager();

const upm = new UrimPlaneManager();

const common = new Common();

let toDoTips: ToDoTip[];
let ctx: CanvasRenderingContext2D;

const render = (toDoDatas: toDoData[]) => {
    ctx = upm.setupCanvas(canvas, toDoDatas);
    toDoTips = upm.createToDoTips(canvas, toDoDatas);
    upm.render(canvas, ctx, toDoTips);
}

/**
 * toDoを右クリック時に、todayの星の色がトグルする
 */
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
        // TODO: upmにページ判定関数として定義する
        if (toDoTip.page == upm.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][upm.urToCoord(toDoTip.toDoData.getUrgency())].pm.page) {
            if (toDoTip.isClicked(point)) {
                toDoTip.toggleToday(canvas, ctx);
            }
        }
    });

});

/**
 * [未実装]
 * todoをダブルクリックすると、詳細画面に遷移する
 */
canvas.addEventListener('dblclick', e => {
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
            // ToDo: 詳細画面に遷移する
            // ToDoDataを渡すと詳細画面を描画するAPIが欲しい
            console.log(toDoTip.toDoData.getDetailData());
        }
    });

});

/**
 * ◀/▶をクリックすると、同一セル内の前/次ページのtodoを表示する
 */
canvas.addEventListener('click', e => {
    e.preventDefault();

    const dpr = window.devicePixelRatio || 1;
    const canvasRect = canvas.getBoundingClientRect();

    const point = {
        x: e.clientX * dpr - canvasRect.left * dpr,
        y: e.clientY * dpr - canvasRect.top * dpr
    };

    // クリック判定処理
    // upm.pgcを全探索して、hasPageのやつだけ、クリック判定する
    upm.urimCell.forEach((imArray: UrimCell[]) => {
        imArray.forEach((cell: UrimCell) => {
            if (cell.pm.hasPages) {
                if (cell.pm.isPrevClicked(point)) {
                    cell.pm.page -= 1;
                    if (cell.pm.page < cell.pm.minPage) {
                        cell.pm.page = cell.pm.maxPage;
                    }
                    upm.render(canvas, ctx, toDoTips);
                }
                else if (cell.pm.isNextClicked(point)) {
                    cell.pm.page += 1;
                    if (cell.pm.page > cell.pm.maxPage) {
                        cell.pm.page = cell.pm.minPage;
                    }
                    upm.render(canvas, ctx, toDoTips);
                }
            }
        })
    })
});

/**
 * html読み込み完了後、electron-storeからデータを読み込む
 * データ読み込み後に、描画処理
 */
window.onload = () => {
    tddm.import();
    sdm.import();
    render(tddm.toDoDataArray);
};

/**
 * ウィンドウをリサイズする度に、描画し直す
 */
window.addEventListener('resize', () => { render(tddm.toDoDataArray) }, false);

const abstBtn = document.getElementById('abst-btn');

/**
 * 概要モードボタンをクリックすると、概要モード画面へ遷移する
 */
abstBtn.addEventListener('click', () => {
    tddm.export();
    sdm.export();
    location.href = '../html/abst.html';
}, false);

const createBtn = document.getElementById('create-btn');

/**
 * 作成ボタンをクリックすると、todo作成画面へ遷移する
 */
createBtn.addEventListener('click', () => {
    tddm.export();
    sdm.export();
    location.href = '../html/form.html';
}, false);
