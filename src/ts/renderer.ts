import { UrimCell, UrimPlaneManager } from './urimPlaneManager';
import ToDoDataManager from './toDoDataManager';
import Common from './common';
import settingsDataManager from './settingsDataManager';
import DetailDialogManager from './detailDialogManager';
import SettingsDialogManager from './settingsDialogManager';


const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('urim-plain');

const ddlgm = new DetailDialogManager();

const tddm = new ToDoDataManager();

const sdm = new settingsDataManager();

let upm: UrimPlaneManager;

const common = new Common();

let ctx: CanvasRenderingContext2D;

const sdlgm = new SettingsDialogManager();

/**
* html読み込み完了後、electron-storeからデータを読み込む
* データ読み込み後に、描画処理
*/
window.onload = () => {
    tddm.import();
    sdm.import();
    upm = new UrimPlaneManager(tddm.toDoDataArray);
    addEventListners();
    render();
};

const render = () => {
    ctx = upm.setupCanvas(canvas);
    upm.createToDoTips(canvas);
    upm.render(canvas, ctx);
}

const addEventListners = () => {
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
        upm.toDoTips.forEach(toDoTip => {
            // TODO: upmにページ判定関数として定義する
            if (toDoTip.page == upm.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][upm.urToCoord(toDoTip.toDoData.getUrgency())].pm.page) {
                if (toDoTip.isOn(point)) {
                    toDoTip.toggleToday(canvas, ctx, sdm.settingsData);
                }
            }
        });

    });

    /**
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
        upm.toDoTips.forEach(toDoTip => {
            if (toDoTip.isOn(point)) {
                ddlgm.renderContents(toDoTip.toDoData);
            }
        });

    });

    /**
     * todoや◀/▶のクリック判定処理
     */
    canvas.addEventListener('click', e => {
        e.preventDefault();

        const dpr = window.devicePixelRatio || 1;
        const canvasRect = canvas.getBoundingClientRect();

        const point = {
            x: e.clientX * dpr - canvasRect.left * dpr,
            y: e.clientY * dpr - canvasRect.top * dpr
        };

        // ◀/▶のクリック判定処理
        // upm.pgcを全探索して、hasPageのやつだけ、クリック判定する
        // クリックすると、同一セル内の前/次ページのtodoを表示する
        upm.urimCell.forEach((imArray: UrimCell[]) => {
            imArray.forEach((cell: UrimCell) => {
                if (cell.pm.hasPages) {
                    if (cell.pm.isPrevClicked(point)) {
                        cell.pm.page -= 1;
                        if (cell.pm.page < cell.pm.minPage) {
                            cell.pm.page = cell.pm.maxPage;
                        }
                        upm.render(canvas, ctx);
                    }
                    else if (cell.pm.isNextClicked(point)) {
                        cell.pm.page += 1;
                        if (cell.pm.page > cell.pm.maxPage) {
                            cell.pm.page = cell.pm.minPage;
                        }
                        upm.render(canvas, ctx);
                    }
                }
            })
        })

        // todoのクリック判定処理
        // クリックすると、削除機能が有効化される
        upm.toDoTips.forEach(toDoTip => {
            if (toDoTip.isOn(point)) {
                // 削除ボタンを有効化する
                document.getElementById('delete-btn').removeAttribute('disabled');
                // キャンセルボタンの追加
                document.getElementById('cancel-btn').style.visibility = 'visible';
                // 背景色を変更する
                toDoTip.toggleBackgroundColor(canvas, ctx, sdm.settingsData);
                // 削除リストに追加する
            }
        });
    });

    /**
     * todoか◀/▶上にマウスがある間、マウスアイコンを指にする
     */
    canvas.addEventListener('mousemove', e => {
        e.preventDefault();

        const dpr = window.devicePixelRatio || 1;
        const canvasRect = canvas.getBoundingClientRect();

        const point = {
            x: e.clientX * dpr - canvasRect.left * dpr,
            y: e.clientY * dpr - canvasRect.top * dpr
        };

        let isOnToDoOrPm = false;

        // クリック判定処理
        upm.toDoTips.forEach(toDoTip => {
            if (toDoTip.isOn(point)) {
                canvas.style.cursor = 'pointer';
                isOnToDoOrPm = true;
            }
        });

        upm.urimCell.forEach((imArray: UrimCell[]) => {
            imArray.forEach((cell: UrimCell) => {
                if (cell.pm.hasPages && cell.pm.isOn(point)) {
                    canvas.style.cursor = 'pointer';
                    isOnToDoOrPm = true;
                }
            });
        });

        if (!isOnToDoOrPm) {
            canvas.style.cursor = 'default';
        }
    })

    /**
     * ウィンドウをリサイズする度に、描画し直す
     */
    window.addEventListener('resize', () => { render() }, false);

    /**
     * 概要モードボタンをクリックすると、概要モード画面へ遷移する
     */
    document.getElementById('abst-btn').addEventListener('click', () => {
        tddm.export();
        sdm.export();
        location.href = '../html/abst.html';
    }, false);

    /**
     * 作成ボタンをクリックすると、todo作成画面へ遷移する
     */
    document.getElementById('create-btn').addEventListener('click', () => {
        tddm.export();
        sdm.export();
        location.href = '../html/register_form.html';
    }, false);

    /**
    * 削除ボタンを押下時に、削除候補を削除、削除ボタンを無効化、キャンセルボタンの消去、レンダリングし直しをする
    */
    document.getElementById('delete-btn').addEventListener('click', () => {
        document.getElementById('delete-btn').setAttribute('disabled', '');
        document.getElementById('cancel-btn').style.visibility = 'hidden';
        upm.deleteToDoTips(tddm);
        render();
    });

    /**
    * 歯車ボタンを押下時に、設定画面の表示
    */
    document.getElementById('setting-btn').addEventListener('click', () => {
        sdlgm.renderContents();
    });

    /**
     * キャンセルボタンを押下時に、削除ボタンを無効化、todoの色をもとに戻す、削除候補のリセット、キャンセルボタンの消去をする
     */
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('delete-btn').setAttribute('disabled', '');
        document.getElementById('cancel-btn').style.visibility = 'hidden';
        upm.toDoTips.forEach(toDoTip => {
            if (toDoTip.isDeleteCandidate) {
                toDoTip.toggleBackgroundColor(canvas, ctx, sdm.settingsData);
            }
        })
    });
};

function onClickDeleteNode(randnum:string):void{
    let elem = document.getElementById(randnum);
    let elem2 = elem.parentNode.parentNode;
    elem2.parentNode.removeChild(elem2);
};

