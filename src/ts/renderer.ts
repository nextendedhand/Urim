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

let isDoubleClick = false;

const delay = 300;

let timer: NodeJS.Timeout;

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
     * todoをダブルクリックすると、詳細画面に遷移する
     */
    canvas.addEventListener('dblclick', e => {
        clearTimeout(timer);
        isDoubleClick = true;

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

        timer = setTimeout(function () {
            if (!isDoubleClick) {
                // todoのクリック判定処理
                if (document.getElementById('delete-btn').style.visibility == 'visible') {
                    // 削除モード時では、削除リストに追加される
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
                } else if (document.getElementById('delete-btn').style.visibility == 'hidden') {
                    // 通常モードでは、☆をtoggleする
                    upm.toDoTips.forEach(toDoTip => {
                        // TODO: upmにページ判定関数として定義する
                        if (toDoTip.page == upm.urimCell[common.imToNum[<keyof { [s: string]: number }>toDoTip.toDoData.getImportance()]][upm.urToCoord(toDoTip.toDoData.getUrgency())].pm.page) {
                            if (toDoTip.isOn(point)) {
                                toDoTip.toggleToday(canvas, ctx, sdm.settingsData);
                            }
                        }
                    });
                }
            }
            isDoubleClick = false;
        }, delay);

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
    document.getElementById('delete-mode-change-btn').addEventListener('click', () => {
        document.getElementById('abst-btn').style.visibility = 'hidden';
        document.getElementById('create-btn').style.visibility = 'hidden';
        document.getElementById('setting-btn').style.visibility = 'hidden';
        document.getElementById('cancel-btn').style.visibility = 'visible';
        document.getElementById('delete-btn').style.visibility = 'visible';
        document.getElementById('delete-mode-change-btn').style.visibility = 'hidden';

        let deleteModeChangeBtn = document.getElementById('delete-mode-change-btn');
        let cancelBtn = document.getElementById('cancel-btn');
        let tmp = cancelBtn.nextSibling;
        deleteModeChangeBtn.parentNode.insertBefore(cancelBtn, deleteModeChangeBtn);
        cancelBtn.parentNode.insertBefore(deleteModeChangeBtn, tmp);

        let createBtn = document.getElementById('create-btn');
        let deleteBtn = document.getElementById('delete-btn');
        tmp = deleteBtn.nextSibling;
        createBtn.parentNode.insertBefore(deleteBtn, createBtn);
        deleteBtn.parentNode.insertBefore(createBtn, tmp);
    });

    /**
    * 削除ボタンを押下時に、削除候補を削除、削除ボタンを無効化、キャンセルボタンの消去、レンダリングし直しをする
    */
    document.getElementById('delete-btn').addEventListener('click', () => {
        document.getElementById('abst-btn').style.visibility = 'visible';
        document.getElementById('create-btn').style.visibility = 'visible';
        document.getElementById('setting-btn').style.visibility = 'visible';
        document.getElementById('cancel-btn').style.visibility = 'hidden';
        document.getElementById('delete-btn').style.visibility = 'hidden';
        document.getElementById('delete-mode-change-btn').style.visibility = 'visible';

        let cancelBtn = document.getElementById('cancel-btn');
        let deleteModeChangeBtn = document.getElementById('delete-mode-change-btn');
        let tmp = deleteModeChangeBtn.nextSibling;
        cancelBtn.parentNode.insertBefore(deleteModeChangeBtn, cancelBtn);
        deleteModeChangeBtn.parentNode.insertBefore(cancelBtn, tmp);

        let deleteBtn = document.getElementById('delete-btn');
        let createBtn = document.getElementById('create-btn');
        tmp = createBtn.nextSibling;
        deleteBtn.parentNode.insertBefore(createBtn, deleteBtn);
        createBtn.parentNode.insertBefore(deleteBtn, tmp);

        upm.deleteToDoTips(tddm);
        tddm.export();
        sdm.export();
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
        document.getElementById('abst-btn').style.visibility = 'visible';
        document.getElementById('create-btn').style.visibility = 'visible';
        document.getElementById('setting-btn').style.visibility = 'visible';
        document.getElementById('cancel-btn').style.visibility = 'hidden';
        document.getElementById('delete-btn').style.visibility = 'hidden';
        document.getElementById('delete-mode-change-btn').style.visibility = 'visible';

        let cancelBtn = document.getElementById('cancel-btn');
        let deleteModeChangeBtn = document.getElementById('delete-mode-change-btn');
        let tmp = deleteModeChangeBtn.nextSibling;
        cancelBtn.parentNode.insertBefore(deleteModeChangeBtn, cancelBtn);
        deleteModeChangeBtn.parentNode.insertBefore(cancelBtn, tmp);

        let deleteBtn = document.getElementById('delete-btn');
        let createBtn = document.getElementById('create-btn');
        tmp = createBtn.nextSibling;
        deleteBtn.parentNode.insertBefore(createBtn, deleteBtn);
        createBtn.parentNode.insertBefore(deleteBtn, tmp);

        upm.toDoTips.forEach(toDoTip => {
            if (toDoTip.isDeleteCandidate) {
                toDoTip.toggleBackgroundColor(canvas, ctx, sdm.settingsData);
            }
        })
    });
};

function onClickDeleteNode(randnum: string): void {
    let elem = document.getElementById(randnum);
    let elem2 = elem.parentNode.parentNode;
    elem2.parentNode.removeChild(elem2);
};
