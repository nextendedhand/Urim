// ヘッダ行はhtmlでやればよかったと後ほど気付いたが、修正が面倒なので放置している。

/************************* imports *************************/
import * as fs from 'fs';
import * as path from 'path';
import initializeSortSetting from './toDoDataSorter';
import { subSortSetting as SUB_SORT_MODE } from './toDoDataSorter';
import my_LS from './localStorageManager';
import { LocalStorage_All as master_LS } from './localStorageManager';
// import toDoData_class from './toDoData';
/************************* variables & constances *************************/

// ToDoListの受け渡し法
// 1: localStorage
// 5: JSONファイル
var DEAL_TO_DO_DATA_LIST: number = 1;

// リスト削除前に　バックアップを取るか
var IS_BACKUP: boolean = false;

// バックアップ方法
// 1: localStorage
// 5: JSONファイル
var BACKUP_TO_DO_DATA_LIST: number = 5;

// テーブルの列数
const TABLE_COLUMN_NUM: number = 8;

// データファイルへのパス
const PATH_TO_DATA_FILE: string = "../data/testData.json";

// テーブルのヘッダ行
const TEABLE_HEADER_STRINGS: string[] =
    ["削除", "本日", "タイトル", "重要度", "緊急度(残日数)", "工数", "ジャンル", "ID"];

// 暫定ジャンルデータ
export const GENRE_ARRAY: string[] = ["プライベート", "仕事", "副業"];

// テーブル名
const TABLE_NAME: string = "ToDoList_TABLE";

// テーブル領域取得 ※テーブルではない
const MY_TABLE_DIV: HTMLElement = document.getElementById(TABLE_NAME);

// リスト削除モードの判定フラグ
export var enableDeleteList: boolean = false;

// backupファイルパス
const backupFilePath: string = "data/backup/";

//error number: ex) " : XXX Error"
var error_s: string = null;

/************************* functions *************************/

// ウィンドウオンロード時に初期化する
window.onload = (): void => {
    windowInitialize();
    if (IS_BACKUP)
        if (BACKUP_TO_DO_DATA_LIST == 5)
            if (!fs.existsSync(backupFilePath))   // バックアップファイルパスの確認
                fs.mkdirSync(backupFilePath);   // フォルダが無ければつくる
}



// 初期化関数
const windowInitialize = (): void => {

    /* test */
    // let ls: my_LS = new my_LS();
    // ls.setValue(JSON.stringify(getToDoDataFromJSON()));
    // console.log("OK");
    // console.log(ls.getValue());

    // テーブルを作成し表示する
    makeTable();

    // ソート用ボタンのイベントハンドラを登録する
    initializeSortSetting();

    // イベントハンドラ登録
    my_addEventListener();

    // 一部のボタンとカラムを非表示にする
    changePartofDisplay(false);

    // 残処理
    init_Others();
}



// イベントハンドラ登録
const my_addEventListener = (): void => {

    // モード変更ボタン(初期表示の削除ボタン)
    let modechange_button: Element = document.querySelector('.modechange-button');
    modechange_button.addEventListener('click', (clickEvent: Event): void => {
        changeDeleteMode()
    });

    // 中止ボタン
    let return_button: Element = document.querySelector('.return-button');
    return_button.addEventListener('click', (clickEvent: Event): void => {
        changeDeleteMode()
    });

    // 削除実行ボタン
    let delete_button: Element = document.querySelector('.delete-button');
    delete_button.addEventListener('click', (clickEvent: Event): void => {
        toDoListDelete()
    });

}



// テーブル作成 & テキスト書き込み
const makeTable = (): void => {

    let dataList: any[] = getToDoData();

    // console.log(dataList);  /* debug */

    if (dataList != null) {

        var rows: any[] = [], cell: any;
        var i: number, j: number;
        var table: HTMLTableElement = document.createElement("table");
        let dataNum: number = dataList.length + 1;   // ヘッダ行を考慮

        for (i = 0; i < dataNum; ++i) {

            rows.push(table.insertRow(-1));

            if (i == 0) {    // ヘッダ行

                for (j = 0; j < TABLE_COLUMN_NUM; ++j) {

                    // 列にセルを追加
                    cell = rows[i].insertCell(-1);

                    // セルにテキストを追加
                    if (j == 0)  // 削除用チェックボックス
                        cell.appendChild(document.createTextNode(TEABLE_HEADER_STRINGS[0]));
                    else
                        cell.appendChild(document.createTextNode("　" + TEABLE_HEADER_STRINGS[j]));

                    // ソートボタン"sort01"~"sort06"を追加
                    if (j != 0) {
                        let $button: HTMLButtonElement = document.createElement("button");
                        $button.textContent = "▲";  // 初期は昇順ソートを提供する
                        $button.id = "sort0" + String(j) + "-button";
                        cell.appendChild($button);
                    }

                    // サブソートボタンを追加
                    if (j == 1 || j == 3 || j == 6) {
                        cell.appendChild(document.createElement('br'));
                        cell.appendChild(document.createTextNode("subsort:"));
                        cell.appendChild(createSelectBoxForSubSort(j));
                    }

                }

            } else {

                for (j = 0; j < TABLE_COLUMN_NUM; ++j) {

                    // 列にセルを追加
                    cell = rows[i].insertCell(-1);

                    // セルにテキストを追加
                    if (j == 0) {  // 削除用チェックボックス
                        let $checkbox: HTMLInputElement = document.createElement("input");
                        $checkbox.type = 'checkbox';
                        $checkbox.name = 'isDelete';
                        cell.appendChild($checkbox);
                    }
                    else
                        cell.appendChild(document.createTextNode(returnColumnValue(j, dataList[i - 1])));

                }

            }
        }

        // id付与
        table.id = "ListTable";

        // テーブルをウィンドウに反映
        MY_TABLE_DIV.appendChild(table);

    }

    error_Check();

}



// 列番号に従い、セルに代入するテキストを決定する
const returnColumnValue = (columnIndex: number, data: any): string => {

    switch (columnIndex) {
        case 1:// today
            if (data['today'])
                return "★";
            else
                return "";
        case 2:// title
            return data['title'];
        case 3:// importance
            return data['importance'];
        case 4:// urgency
            return String(data['urgency']);
        case 5:// manHour
            if (0 < data['manHour'].year)
                return String(data['manHour'].year) + "Y";
            else if (0 < data['manHour'].month)
                return String(data['manHour'].month) + "M";
            else if (0 < data['manHour'].day)
                return String(data['manHour'].day) + "D";
            else
                return String(data['manHour'].hour) + "h";
        case 6:// genre
            let box: number = Number(data['genreId']);
            if (0 <= box && box < GENRE_ARRAY.length)
                return GENRE_ARRAY[box];
            else
                return "error";
        case 7://ID
            return data['id'];
        default:
            return "null";
    }

    /* doDoData class */
    // switch (columnIndex) {
    //     case 1:// today
    //         if (data.getIsToday())
    //             return "★";
    //         else
    //             return "";
    //     case 2:// title
    //         return data.getTitle();
    //     case 3:// importance
    //         return data.getImportance();
    //     case 4:// urgency
    //         return String(data.getUrgency());
    //     case 5:// manHour
    //         if (0 < data.getManHour().year)
    //             return String(data.getManHour().year) + "Y";
    //         else if (0 < data.getManHour().month)
    //             return String(data.getManHour().month) + "M";
    //         else if (0 < data.getManHour().day)
    //             return String(data.getManHour().day) + "D";
    //         else
    //             return String(data.getManHour().hour) + "h";
    //     case 6:// genre
    //         let box: number = data.getGenreId();
    //         if (0 <= box && box < GENRE_ARRAY.length)
    //             return GENRE_ARRAY[box];
    //         else
    //             return "error";
    //     case 7://ID
    //         return data.getId();
    //     default:
    //         return "null";
    // }

}



// add selector
const createSelectBoxForSubSort = (index: number): HTMLSelectElement => {
    var $select: HTMLSelectElement = document.createElement("select");
    $select.name = "ss-selector";
    $select.onchange = subSortSetting_Changed;

    if (index == 1) {
        $select.add(new Option("title", "t_title", false));
        $select.add(new Option("importance", "t_importance", true, true));
        $select.add(new Option("urgency", "t_urgency", false));
        $select.add(new Option("manhour", "t_manhour", false));
        $select.add(new Option("genre", "t_genre", false));
    } else if (index == 3) {
        $select.add(new Option("today", "i_today", false));
        $select.add(new Option("title", "i_title", false));
        $select.add(new Option("urgency", "i_urgency", true, true));
        $select.add(new Option("manhour", "i_manhour", false));
        $select.add(new Option("genre", "i_genre", false));
    } else if (index == 6) {
        $select.add(new Option("today", "g_today", false));
        $select.add(new Option("title", "g_title", true, true));
        $select.add(new Option("importance", "g_importance", false));
        $select.add(new Option("urgency", "g_urgency", false));
        $select.add(new Option("manhour", "g_manhour", false));
    }

    return $select;
}



const subSortSetting_Changed = () => {
    let ss: NodeListOf<HTMLElement> = document.getElementsByName("ss-selector");
    let columnm1: HTMLSelectElement = <HTMLSelectElement>ss[0];
    let columnm3: HTMLSelectElement = <HTMLSelectElement>ss[1];
    let columnm6: HTMLSelectElement = <HTMLSelectElement>ss[2];

    SUB_SORT_MODE[0] = columnm1.selectedIndex + 2;
    if (columnm3.selectedIndex < 2)
        SUB_SORT_MODE[1] = columnm3.selectedIndex + 1;
    else
        SUB_SORT_MODE[1] = columnm3.selectedIndex + 2;
    SUB_SORT_MODE[2] = columnm6.selectedIndex + 1;
}


/* 要修正 */
// 読み込んだデータをtoDoData型で取得する
const getToDoData = (): any[] => {

    return getToDoData_objects();
    // var ToDoData_objects: any = getToDoData_objects();
    // if (ToDoData_objects == null) return null;

}


// any型でデータ取得
const getToDoData_objects = (): any => {
    if (DEAL_TO_DO_DATA_LIST == 1) {
        console.log("use localStorage.");
        return getToDoDataFromlocalStorage();
    }
    else if (DEAL_TO_DO_DATA_LIST == 5) {
        console.log("use JSON file.");
        return getToDoDataFromJSON();
    }
}



// jsonファイル読み出し
const getToDoDataFromJSON = (): any => {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, PATH_TO_DATA_FILE), 'utf8'));
    } catch (ex) {
        error_s = " :Error in Reading JSON File";
        console.log(ex);
    }
    return null;
}



// localStorage読み込み
const getToDoDataFromlocalStorage = (): any => {

    let ls: my_LS = new my_LS();
    try {
        return JSON.parse(ls.getValue());
    } catch (ex) {
        error_s = " :Error in Reading localStorage";
        console.log(ex);
    }
    return null;

}



// リスト削除モードオン
const changeDeleteMode = (): void => {
    if (enableDeleteList) {
        // 削除モード終了
        changePartofDisplay(false);
        enableDeleteList = false;
    }
    else {
        // 削除モードへ移行
        changePartofDisplay(true);
        enableDeleteList = true;
    }
}



// リスト削除
const toDoListDelete = (): void => {

    if (IS_BACKUP) beforeToDoDelete();

    var deleteList: number[] = [];
    var deleteId: string[] = [];
    deleteId = getDeleteList(deleteList);
    let last: number = deleteList.length;
    if (0 < last) {
        let i: number;
        let $listtable: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
        for (i = last - 1; -1 < i; --i) {
            $listtable.deleteRow(1 + deleteList[i]);    // ヘッダ行を考慮
        }
    }
    changeDeleteMode();
    afterToDoDelete(deleteId);
}



// 削除するリストのindex配列を返す
const getDeleteList = (deleteList: number[]): string[] => {

    var checkboxList: NodeListOf<HTMLInputElement> = <NodeListOf<HTMLInputElement>>document.getElementsByName("isDelete");
    let i: number;
    const last: number = checkboxList.length;
    for (i = 0; i < last; ++i)
        if (checkboxList[i].checked)
            deleteList.push(i);

    if (DEAL_TO_DO_DATA_LIST == 1) {
        return keepDeleteID(deleteList);
    }

    return null;

}



// ボタンとカラムの表示/非表示切り替え
const changePartofDisplay = (isDiplay: boolean): void => {
    if (isDiplay) {
        // ボタン非表示
        let modechange_button: HTMLElement = document.getElementById('modechange-button');
        modechange_button.style.display = "none";

        // ボタン表示
        let deleteButton: HTMLElement = document.getElementById("delete-button");
        deleteButton.style.display = "block";

        let returnButton: HTMLElement = document.getElementById("return-button");
        returnButton.style.display = "block";

        // カラム表示
        let checkRow: HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
        for (let i: number = 0; i < checkRow.length; ++i) {
            let checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "block";
        }
    } else {
        // ボタン表示
        let modechange_button: HTMLElement = document.getElementById('modechange-button');
        modechange_button.style.display = "block";

        // ボタン非表示
        let deleteButton: HTMLElement = document.getElementById("delete-button");
        deleteButton.style.display = "none";

        let returnButton: HTMLElement = document.getElementById("return-button");
        returnButton.style.display = "none";

        // カラム非表示
        let checkRow: HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
        for (let i: number = 0; i < checkRow.length; ++i) {
            let checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "none";
        }
    }
}



const init_Others = (): void => {
    // IDカラム非表示
    let checkRow: HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
    for (let i: number = 0; i < checkRow.length; ++i) {
        let checkColumn = checkRow[i].getElementsByTagName("td");
        checkColumn[TABLE_COLUMN_NUM - 1].style.display = "none";
    }
}



const beforeToDoDelete = (): void => {

    if (BACKUP_TO_DO_DATA_LIST == 1) {
        // localStorageにbackup出力
        let ms_ls: master_LS = new master_LS();
        let temp: string = ms_ls.LS_GetValue("toDoDataArray");
        ms_ls.LS_Write("backup", temp);
    } else if (BACKUP_TO_DO_DATA_LIST == 5) {
        // jsonファイルにbackup出力
        let table_value: string[][] = setTableDataForString();
        toJsonFile(JSON.stringify(table_value));
    }

    error_Check();
}



// 削除するタスクのID配列を返す
const keepDeleteID = (index: number[]): string[] => {

    var isDeleteID: string[] = [];

    let checkRow: HTMLCollectionOf<HTMLTableRowElement> = document.getElementById(TABLE_NAME).getElementsByTagName("tr");
    for (let i: number = 0; i < index.length; ++i) {
        let checkColumn: HTMLCollectionOf<HTMLTableDataCellElement> = checkRow[index[i] + 1].getElementsByTagName("td");    //ヘッダを考慮
        isDeleteID.push(checkColumn[TABLE_COLUMN_NUM - 1].textContent);
    }

    return isDeleteID;

}



const afterToDoDelete = (deleteId: string[]): void => {

    if (DEAL_TO_DO_DATA_LIST == 1) { // localstorageに保存
        try {
            if (deleteId == null) return;

            let ls: my_LS = new my_LS();
            let temp_data: any[] = JSON.parse(ls.getValue());
            console.log(temp_data);

            // 削除したリストを取得してオブジェクトから削除する
            for (let j: number = 0; j < deleteId.length; ++j) {
                for (let i: number = 0; i < temp_data.length; ++i) {
                    let box: any = temp_data[i];
                    if (deleteId[j] == box['id']) {
                        temp_data.splice(i, 1);
                        break;
                    }
                }
            }

            ls.setValue(JSON.stringify(temp_data));
        } catch (e) {
            error_s = " :Error in writing localStorage";
        }
    }
    else if (DEAL_TO_DO_DATA_LIST == 5) {   // jsonファイルに出力
        let table_value: string[][] = setTableDataForString();
        toJsonFile(JSON.stringify(table_value));
    }

    error_Check();

}



const toJsonFile = (backupdata: string): void => {
    try {
        let today: Date = new Date();
        let today_string: string = today.getFullYear() + ("00" + (today.getMonth() + 1)).slice(-2) + ("00" + today.getDate()).slice(-2)
        fs.writeFile(backupFilePath + "ToDoList_" + today_string + Date.now().toString() + ".json", backupdata, function (err) {
            if (err) throw err;
            else console.log("exported backup JSON file");
        });
    }
    catch (e) {
        error_s = " :Error in Making JSON File"
        console.log(e);
    }
}



// tableから全てのセル値を取り出す
const setTableDataForString = (): string[][] => {
    var row_length: number;
    var table_value: string[][] = [
        [TEABLE_HEADER_STRINGS[1], TEABLE_HEADER_STRINGS[2], TEABLE_HEADER_STRINGS[3], TEABLE_HEADER_STRINGS[4], TEABLE_HEADER_STRINGS[5], TEABLE_HEADER_STRINGS[6], TEABLE_HEADER_STRINGS[7]]
    ];

    let $listtable: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
    {
        row_length = $listtable.rows.length - 1;
    }

    let checkRow: HTMLCollectionOf<HTMLTableRowElement> = document.getElementById(TABLE_NAME).getElementsByTagName("tr");
    for (let i: number = 1; i <= row_length; ++i) { // ヘッダ行は不要
        let checkColumn: HTMLCollectionOf<HTMLTableDataCellElement> = checkRow[i].getElementsByTagName("td");
        let temp_row: string[] = [];
        {
            for (let j: number = 1; j < TABLE_COLUMN_NUM; ++j) {   // 削除用チェックリスト列は不要
                temp_row.push(checkColumn[j].textContent);
            }
            table_value.push(temp_row);
        }
    }

    return table_value;

}



// エラーがあれば表示する
const error_Check = (): void => {
    if (error_s != null) {
        alert(error_s);
        error_s = null;
    }
}
