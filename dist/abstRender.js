"use strict";
// とりあえずjson読み出しのToDoListデータを使用して作成する。
// ヘッダ行はhtmlでやればよかったと後ほど気付いたが、修正が面倒なので放置している。
exports.__esModule = true;
/************************* imports *************************/
var fs = require("fs");
var path = require("path");
var toDoDataSorter_1 = require("./toDoDataSorter");
var toDoDataSorter_2 = require("./toDoDataSorter");
/************************* variables *************************/
// テーブルの列数
var TABLE_COLUMN_NUM = 7;
// データファイルへのパス
var PATH_TO_DATA_FILE = "../data/testData.json";
// テーブルのヘッダ行
var TEABLE_HEADER_STRINGS = ["削除", "本日", "タイトル", "重要度", "緊急度(残日数)", "工数", "ジャンル"];
// 暫定ジャンルデータ
exports.GENRE_ARRAY = ["プライベート", "仕事", "副業"];
// テーブル名
var TABLE_NAME = "ToDoList_TABLE";
// テーブル領域取得 ※テーブルではない
var MY_TABLE_DIV = document.getElementById(TABLE_NAME);
// リスト削除モードの判定フラグ
exports.enableDeleteList = false;
/************************* functions *************************/
// ウィンドウオンロード時に初期化する
window.onload = function () {
    windowInitialize();
};
// 初期化関数
var windowInitialize = function () {
    // テーブルを作成し表示する
    makeTable();
    // ソート用ボタンのイベントハンドラを登録する
    toDoDataSorter_1["default"]();
    // イベントハンドラ登録
    my_addEventListener();
    // 一部のボタンとカラムを非表示にする
    changePartofDisplay(false);
};
// イベントハンドラ登録
var my_addEventListener = function () {
    // モード変更ボタン(初期表示の削除ボタン)
    var modechange_button = document.querySelector('.modechange-button');
    modechange_button.addEventListener('click', function (clickEvent) {
        changeDeleteMode();
    });
    // 中止ボタン
    var return_button = document.querySelector('.return-button');
    return_button.addEventListener('click', function (clickEvent) {
        changeDeleteMode();
    });
    // 削除実行ボタン
    var delete_button = document.querySelector('.delete-button');
    delete_button.addEventListener('click', function (clickEvent) {
        toDoListDelete();
    });
};
// テーブル作成 & テキスト書き込み
var makeTable = function () {
    var dataList = getToDoData();
    if (dataList != null) {
        var rows = [], cell;
        var i, j;
        var table = document.createElement("table");
        var dataNum = dataList.length + 1; // ヘッダ行を考慮
        for (i = 0; i < dataNum; ++i) {
            rows.push(table.insertRow(-1));
            if (i == 0) { // ヘッダ行
                for (j = 0; j < TABLE_COLUMN_NUM; ++j) {
                    // 列にセルを追加
                    cell = rows[i].insertCell(-1);
                    // セルにテキストを追加
                    if (j == 0) // 削除用チェックボックス
                        cell.appendChild(document.createTextNode(TEABLE_HEADER_STRINGS[0]));
                    else
                        cell.appendChild(document.createTextNode("　" + TEABLE_HEADER_STRINGS[j]));
                    // ソートボタン"sort01"~"sort06"を追加
                    if (j != 0) {
                        var $button = document.createElement("button");
                        $button.textContent = "▲"; // 初期は昇順ソートを提供する
                        $button.id = "sort0" + String(j) + "-button";
                        cell.appendChild($button);
                    }
                    if (j == 1 || j == 3 || j == 6) {
                        cell.appendChild(document.createElement('br'));
                        cell.appendChild(document.createTextNode("subsort:"));
                        cell.appendChild(createSelectBoxForSubSort(j));
                    }
                }
            }
            else {
                for (j = 0; j < TABLE_COLUMN_NUM; ++j) {
                    // 列にセルを追加
                    cell = rows[i].insertCell(-1);
                    // セルにテキストを追加
                    if (j == 0) { // 削除用チェックボックス
                        var $checkbox = document.createElement("input");
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
};
// 列番号に従い、セルに代入するテキストを決定する
var returnColumnValue = function (columnIndex, data) {
    switch (columnIndex) {
        case 0: // checkbox
            break;
        case 1: // today
            if (data.today)
                return "★";
            else
                return "";
        case 2: // title
            return String(data.title);
        case 3: // importance
            return String(data.importance);
        case 4: // urgency
            return String(data.urgency);
        case 5: // manHour
            if (0 < data.manHour[0].year)
                return String(data.manHour[0].year) + "Y";
            else if (0 < data.manHour[0].month)
                return String(data.manHour[0].month) + "M";
            else if (0 < data.manHour[0].day)
                return String(data.manHour[0].day) + "D";
            else
                return String(data.manHour[0].hour) + "h";
        case 6: // genre
            if (0 <= data.genreId && data.genreId < exports.GENRE_ARRAY.length)
                return exports.GENRE_ARRAY[data.genreId];
            else
                return "error";
        default:
            return "null";
    }
};
// add selector
var createSelectBoxForSubSort = function (index) {
    var $select = document.createElement("select");
    $select.name = "ss-selector";
    $select.onchange = subSortSetting_Changed;
    if (index == 1) {
        $select.add(new Option("title", "t_title", false));
        $select.add(new Option("importance", "t_importance", true, true));
        $select.add(new Option("urgency", "t_urgency", false));
        $select.add(new Option("manhour", "t_manhour", false));
        $select.add(new Option("genre", "t_genre", false));
    }
    else if (index == 3) {
        $select.add(new Option("today", "i_today", false));
        $select.add(new Option("title", "i_title", false));
        $select.add(new Option("urgency", "i_urgency", true, true));
        $select.add(new Option("manhour", "i_manhour", false));
        $select.add(new Option("genre", "i_genre", false));
    }
    else if (index == 6) {
        $select.add(new Option("today", "g_today", false));
        $select.add(new Option("title", "g_title", true, true));
        $select.add(new Option("importance", "g_importance", false));
        $select.add(new Option("urgency", "g_urgency", false));
        $select.add(new Option("manhour", "g_manhour", false));
    }
    return $select;
};
var subSortSetting_Changed = function () {
    var ss = document.getElementsByName("ss-selector");
    var columnm1 = ss[0];
    var columnm3 = ss[1];
    var columnm6 = ss[2];
    toDoDataSorter_2.subSortSetting[0] = columnm1.selectedIndex + 2;
    if (columnm3.selectedIndex < 2)
        toDoDataSorter_2.subSortSetting[1] = columnm3.selectedIndex + 1;
    else
        toDoDataSorter_2.subSortSetting[1] = columnm3.selectedIndex + 2;
    toDoDataSorter_2.subSortSetting[2] = columnm6.selectedIndex + 1;
};
// 暫定：jsonファイル読み出し
var getToDoData = function () {
    // 取得方法
    // json読み出し or 変数共有
    try {
        var data = JSON.parse(fs.readFileSync(path.join(__dirname, PATH_TO_DATA_FILE), 'utf8'));
        return data;
    }
    catch (ex) {
        console.log(ex);
    }
    return null;
};
// リスト削除モードオン
var changeDeleteMode = function () {
    if (exports.enableDeleteList) {
        // 削除モード終了
        changePartofDisplay(false);
        exports.enableDeleteList = false;
    }
    else {
        // 削除モードへ移行
        changePartofDisplay(true);
        exports.enableDeleteList = true;
    }
};
// リスト削除
var toDoListDelete = function () {
    var deleteList = getDeleteList();
    var last = deleteList.length;
    if (0 < last) {
        var i = void 0;
        var $listtable = document.getElementById("ListTable");
        for (i = last - 1; -1 < i; --i) {
            $listtable.deleteRow(1 + deleteList[i]); // ヘッダ行を考慮
        }
    }
    changeDeleteMode();
};
// 削除するリストのindex配列を返す
var getDeleteList = function () {
    var deleteList = [];
    var checkboxList = document.getElementsByName("isDelete");
    var i, last = checkboxList.length;
    for (i = 0; i < last; ++i)
        if (checkboxList[i].checked)
            deleteList.push(i);
    return deleteList;
};
// ボタンとカラムの表示/非表示切り替え
var changePartofDisplay = function (isDiplay) {
    if (isDiplay) {
        // ボタン非表示
        var modechange_button = document.getElementById('modechange-button');
        modechange_button.style.display = "none";
        // ボタン表示
        var deleteButton = document.getElementById("delete-button");
        deleteButton.style.display = "block";
        var returnButton = document.getElementById("return-button");
        returnButton.style.display = "block";
        // カラム表示
        var checkRow = MY_TABLE_DIV.getElementsByTagName("tr");
        for (var i = 0; i < checkRow.length; ++i) {
            var checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "block";
        }
    }
    else {
        // ボタン表示
        var modechange_button = document.getElementById('modechange-button');
        modechange_button.style.display = "block";
        // ボタン非表示
        var deleteButton = document.getElementById("delete-button");
        deleteButton.style.display = "none";
        var returnButton = document.getElementById("return-button");
        returnButton.style.display = "none";
        // カラム非表示
        var checkRow = MY_TABLE_DIV.getElementsByTagName("tr");
        for (var i = 0; i < checkRow.length; ++i) {
            var checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "none";
        }
    }
};
//# sourceMappingURL=abstRender.js.map