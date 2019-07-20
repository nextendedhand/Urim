// とりあえずjson読み出しのToDoListデータを使用して作成する。
// ヘッダ行はhtmlでやればよかったと後ほど気付いたが、修正が面倒なので放置している。

/************************* imports *************************/
import * as fs from 'fs';
import * as path from 'path';
import initializeSortSetting from './toDoDataSorter';
import {subSortSetting as SUB_SORT_MODE} from './toDoDataSorter';

/************************* variables *************************/

// テーブルの列数
const TABLE_COLUMN_NUM:number = 7;

// データファイルへのパス
const PATH_TO_DATA_FILE:string = "../data/testData.json";

// テーブルのヘッダ行
const TEABLE_HEADER_STRINGS:string[] = 
    [ "削除", "本日", "タイトル", "重要度", "緊急度(残日数)", "工数", "ジャンル" ];

// 暫定ジャンルデータ
export const GENRE_ARRAY:string[] = ["プライベート", "仕事", "副業"];

// テーブル名
const TABLE_NAME:string = "ToDoList_TABLE";

// テーブル領域取得 ※テーブルではない
const MY_TABLE_DIV:HTMLElement = document.getElementById(TABLE_NAME);

// リスト削除モードの判定フラグ
export var enableDeleteList:boolean = false;

/************************* functions *************************/

// ウィンドウオンロード時に初期化する
window.onload = ():void => {
    windowInitialize();
}

// 初期化関数
const windowInitialize = ():void => {

    // テーブルを作成し表示する
    makeTable();

    // ソート用ボタンのイベントハンドラを登録する
    initializeSortSetting();

    // イベントハンドラ登録
    my_addEventListener();
    
    // 一部のボタンとカラムを非表示にする
    changePartofDisplay(false);
    
}

// イベントハンドラ登録
const my_addEventListener = ():void => {
    
    // モード変更ボタン(初期表示の削除ボタン)
    let modechange_button:Element = document.querySelector('.modechange-button');
    modechange_button.addEventListener('click', (clickEvent:Event):void => {
        changeDeleteMode()
    });

    // 中止ボタン
    let return_button:Element = document.querySelector('.return-button');
    return_button.addEventListener('click', (clickEvent:Event):void => {
        changeDeleteMode()
    });

    // 削除実行ボタン
    let delete_button:Element = document.querySelector('.delete-button');
    delete_button.addEventListener('click', (clickEvent:Event):void => {
        toDoListDelete()
    });

}

// テーブル作成 & テキスト書き込み
const makeTable = ():void => {

    let dataList:any = getToDoData();
    if(dataList != null){

        var rows:any[] = [], cell:any;
        var i:number, j:number;
        var table:HTMLTableElement = document.createElement("table");
        let dataNum:number = dataList.length + 1;   // ヘッダ行を考慮

        for(i = 0; i < dataNum; ++i){

            rows.push(table.insertRow(-1));
        
            if(i == 0){    // ヘッダ行
                
                for(j = 0; j < TABLE_COLUMN_NUM; ++j){
                    
                    // 列にセルを追加
                    cell = rows[i].insertCell(-1);

                    // セルにテキストを追加
                    if(j == 0)  // 削除用チェックボックス
                        cell.appendChild(document.createTextNode(TEABLE_HEADER_STRINGS[0]));
                    else
                        cell.appendChild(document.createTextNode("　" + TEABLE_HEADER_STRINGS[j]));
                    
                    // ソートボタン"sort01"~"sort06"を追加
                    if(j != 0){
                        let $button:HTMLButtonElement = document.createElement("button");
                        $button.textContent = "▲";  // 初期は昇順ソートを提供する
                        $button.id = "sort0" + String(j) + "-button";
                        cell.appendChild($button);
                    }

                    if(j == 1 || j == 3 || j == 6){
                        cell.appendChild(document.createElement('br'));
                        cell.appendChild(document.createTextNode("subsort:"));
                        cell.appendChild(createSelectBoxForSubSort(j));
                    }
                    
                }

            }else{

                for(j = 0; j < TABLE_COLUMN_NUM; ++j){
                    
                    // 列にセルを追加
                    cell = rows[i].insertCell(-1);

                    // セルにテキストを追加
                    if(j == 0){  // 削除用チェックボックス
                        let $checkbox:HTMLInputElement = document.createElement("input");
                        $checkbox.type = 'checkbox';
                        $checkbox.name = 'isDelete';
                        cell.appendChild($checkbox);
                    }
                    else
                        cell.appendChild(document.createTextNode(returnColumnValue(j, dataList[i -1])));

                }

            }
        }

        // id付与
        table.id = "ListTable";

        // テーブルをウィンドウに反映
        MY_TABLE_DIV.appendChild(table);

    }

}

// 列番号に従い、セルに代入するテキストを決定する
const returnColumnValue = (columnIndex:number, data:any):string => {
    
    switch(columnIndex){
        case 0:// checkbox
            break;
        case 1:// today
            if(data.today)
                return "★";
            else
                return "";
        case 2:// title
            return String(data.title);
        case 3:// importance
            return String(data.importance);
        case 4:// urgency
            return String(data.urgency);
        case 5:// manHour
            if(0 < data.manHour[0].year)
                return String(data.manHour[0].year) + "Y";
            else if(0 < data.manHour[0].month)
                return String(data.manHour[0].month) + "M";
            else if(0 < data.manHour[0].day)
                return String(data.manHour[0].day) + "D";
            else
                return String(data.manHour[0].hour) + "h";
        case 6:// genre
            if(0 <= data.genreId && data.genreId < GENRE_ARRAY.length)
                return GENRE_ARRAY[data.genreId];
            else
                return "error";
        default:
            return "null";
    } 
                    
}

// add selector
const createSelectBoxForSubSort = (index:number):HTMLSelectElement => {
    var $select:HTMLSelectElement = document.createElement("select");
    $select.name = "ss-selector";
    $select.onchange = subSortSetting_Changed;

    if(index == 1){
        $select.add(new Option("title","t_title",false));
        $select.add(new Option("importance","t_importance",true, true));
        $select.add(new Option("urgency","t_urgency",false));
        $select.add(new Option("manhour","t_manhour",false));
        $select.add(new Option("genre","t_genre",false));
    }else if(index == 3){
        $select.add(new Option("today","i_today",false));
        $select.add(new Option("title","i_title",false));
        $select.add(new Option("urgency","i_urgency",true, true));
        $select.add(new Option("manhour","i_manhour",false));
        $select.add(new Option("genre","i_genre",false));
    }else if(index == 6){
        $select.add(new Option("today","g_today",false));
        $select.add(new Option("title","g_title",true, true));
        $select.add(new Option("importance","g_importance",false));
        $select.add(new Option("urgency","g_urgency",false));
        $select.add(new Option("manhour","g_manhour",false));
    }
    
    return $select;
}

const subSortSetting_Changed = () => {
    let ss:NodeListOf<HTMLElement> = document.getElementsByName("ss-selector");
    let columnm1:HTMLSelectElement = <HTMLSelectElement>ss[0];
    let columnm3:HTMLSelectElement = <HTMLSelectElement>ss[1];
    let columnm6:HTMLSelectElement = <HTMLSelectElement>ss[2];

    SUB_SORT_MODE[0] = columnm1.selectedIndex + 2;
    if(columnm3.selectedIndex < 2)
        SUB_SORT_MODE[1] = columnm3.selectedIndex + 1;
    else
        SUB_SORT_MODE[1] = columnm3.selectedIndex + 2;
    SUB_SORT_MODE[2] = columnm6.selectedIndex + 1;
}

// 暫定：jsonファイル読み出し
const getToDoData = ():void => {

    // 取得方法
    // json読み出し or 変数共有
    try {
        let data:any = JSON.parse(fs.readFileSync(path.join(__dirname, PATH_TO_DATA_FILE),'utf8'));
        return data;
    }catch(ex){
        console.log(ex);
    }
    return null;
}


// リスト削除モードオン
const changeDeleteMode = ():void => {
    if(enableDeleteList){
        // 削除モード終了
        changePartofDisplay(false);
        enableDeleteList = false;
    }
    else{
        // 削除モードへ移行
        changePartofDisplay(true);
        enableDeleteList = true;
    }
}

// リスト削除
const toDoListDelete = ():void => {
    var deleteList:number[] = getDeleteList();
    let last:number = deleteList.length;
    if(0 < last){
        let i:number;
        let $listtable:HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
        for(i = last -1; -1 < i; --i){
            $listtable.deleteRow(1+deleteList[i]);    // ヘッダ行を考慮
        }
    }
    changeDeleteMode();
}

// 削除するリストのindex配列を返す
const getDeleteList = ():number[] => {

    var deleteList:number[] = [];
    var checkboxList:NodeListOf<HTMLInputElement> = <NodeListOf<HTMLInputElement>>document.getElementsByName("isDelete");
    let i:number, last:number = checkboxList.length;
    for(i = 0; i < last; ++i)
        if(checkboxList[i].checked)
            deleteList.push(i);
    
    return deleteList;
    
}

// ボタンとカラムの表示/非表示切り替え
const changePartofDisplay = (isDiplay:boolean):void => {
    if(isDiplay){
        // ボタン非表示
        let modechange_button:HTMLElement = document.getElementById('modechange-button');
        modechange_button.style.display = "none";
        
        // ボタン表示
        let deleteButton:HTMLElement = document.getElementById("delete-button");
        deleteButton.style.display = "block";

        let returnButton:HTMLElement = document.getElementById("return-button");
        returnButton.style.display = "block";

        // カラム表示
        let checkRow:HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
        for (let i:number = 0; i<checkRow.length; ++i){
            let checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "block";
        }
    }else{
        // ボタン表示
        let modechange_button:HTMLElement = document.getElementById('modechange-button');
        modechange_button.style.display = "block";
        
        // ボタン非表示
        let deleteButton:HTMLElement = document.getElementById("delete-button");
        deleteButton.style.display = "none";

        let returnButton:HTMLElement = document.getElementById("return-button");
        returnButton.style.display = "none";

        // カラム非表示
        let checkRow:HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
        for (let i:number = 0; i<checkRow.length; ++i){
            let checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "none";
        }
    }
}