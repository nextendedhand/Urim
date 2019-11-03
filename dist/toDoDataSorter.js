"use strict";
exports.__esModule = true;
var abstRenderer_1 = require("./abstRenderer");
// importance list
var IMPORTANCE_LIST = ["S", "A", "B", "C", "D"];
// today mark
var TODAY_LIST = ["★", ""];
// man hour unit
var MANHOUR_UNIT_LIST = ["Y", "M", "D", "h"];
// sub sort setting
exports.subSortSetting = [3, 4, 2];
// ボタンのイベントハンドラ登録実行関数
// テーブル作成後に呼び出す。
function initializeSortSetting() {
    // イベントハンドラ登録用定数
    var sort01_button = document.getElementById('sort01-button');
    var sort02_button = document.getElementById('sort02-button');
    var sort03_button = document.getElementById('sort03-button');
    var sort04_button = document.getElementById('sort04-button');
    var sort05_button = document.getElementById('sort05-button');
    var sort06_button = document.getElementById('sort06-button');
    // イベントハンドラ登録
    if (sort01_button != null) {
        sort01_button.addEventListener('click', function (clickEvent) {
            if (!abstRenderer_1.enableDeleteList)
                mySortToDoList(1);
        });
    }
    else {
        console.log("event handler error: sort01 button");
    }
    if (sort02_button != null) {
        sort02_button.addEventListener('click', function (clickEvent) {
            if (!abstRenderer_1.enableDeleteList)
                mySortToDoList(2);
        });
    }
    else {
        console.log("event handler error: sort02 button");
    }
    if (sort03_button != null) {
        sort03_button.addEventListener('click', function (clickEvent) {
            if (!abstRenderer_1.enableDeleteList)
                mySortToDoList(3);
        });
    }
    else {
        console.log("event handler error: sort03 button");
    }
    if (sort04_button != null) {
        sort04_button.addEventListener('click', function (clickEvent) {
            if (!abstRenderer_1.enableDeleteList)
                mySortToDoList(4);
        });
    }
    else {
        console.log("event handler error: sort04 button");
    }
    if (sort05_button != null) {
        sort05_button.addEventListener('click', function (clickEvent) {
            if (!abstRenderer_1.enableDeleteList)
                mySortToDoList(5);
        });
    }
    else {
        console.log("event handler error: sort05 button");
    }
    if (sort06_button != null) {
        sort06_button.addEventListener('click', function (clickEvent) {
            if (!abstRenderer_1.enableDeleteList)
                mySortToDoList(6);
        });
    }
    else {
        console.log("event handler error: sort06 button");
    }
}
exports["default"] = initializeSortSetting;
// List sort
var mySortToDoList = function (index) {
    switch (index) {
        case 1: // 本日
            mySort01(getSortOrder(index), true);
            console.log("sorted by 'today'.");
            break;
        case 2: // タイトル
            mySort02(getSortOrder(index));
            console.log("sorted by 'title'.");
            break;
        case 3: // 重要度
            mySort03(getSortOrder(index), true);
            console.log("sorted by 'importance'.");
            break;
        case 4: // 緊急度
            mySort04(getSortOrder(index));
            console.log("sorted by 'urgency'.");
            break;
        case 5: // 工数
            mySort05(getSortOrder(index));
            console.log("sorted by 'manHour'.");
            break;
        case 6: // ジャンル
            mySort06(getSortOrder(index), true);
            console.log("sorted by 'genre'.");
            break;
        default:
            // no case
            break;
    }
};
// ascending or descending order?
var getSortOrder = function (index) {
    return changeButtonText(index);
};
// change button display
// return value --> true:ascending order, false:descending order
var changeButtonText = function (index) {
    var $sort_button = document.getElementById('sort0' + String(index) + "-button");
    if ($sort_button.textContent == "▲") {
        $sort_button.textContent = "▼";
        console.log("sort in ascending order.");
        return true;
    }
    else {
        $sort_button.textContent = "▲";
        console.log("sort in descending order.");
        return false;
    }
};
// sort function 1
// true:ascending order, false:descending order
var mySort01 = function (order, subsorton, pos) {
    if (subsorton === void 0) { subsorton = false; }
    if (pos === void 0) { pos = [1, -1, 1]; }
    if (order)
        sortBySpecifiedCharacterPriority(1, TODAY_LIST[0], pos);
    else
        sortBySpecifiedCharacterPriority(1, TODAY_LIST[1], pos);
    if (subsorton)
        subSort(0, order, pos);
};
// sort function 2
// true:ascending order, false:descending order
var mySort02 = function (order, start_index, end_index) {
    if (start_index === void 0) { start_index = 1; }
    if (end_index === void 0) { end_index = -1; }
    var $listtable = document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_JapaneseString($listtable, order, start_index, end_index);
};
// sort function 3
// true:ascending order, false:descending order
var mySort03 = function (order, subsorton, pos) {
    if (subsorton === void 0) { subsorton = false; }
    if (pos === void 0) { pos = [1, -1, 1]; }
    var i, posGR = [];
    if (order) {
        for (i = 0; i < IMPORTANCE_LIST.length; ++i) {
            posGR.push(pos[0]);
            sortBySpecifiedCharacterPriority(3, IMPORTANCE_LIST[i], pos);
        }
    }
    else {
        for (i = 0; i < IMPORTANCE_LIST.length; ++i) {
            posGR.push(pos[0]);
            sortBySpecifiedCharacterPriority(3, IMPORTANCE_LIST.slice().reverse()[i], pos);
        }
    }
    if (subsorton) {
        posGR.push(-1);
        subSort(1, order, posGR);
    }
};
// sort function 4
// true:ascending order, false:descending order
var mySort04 = function (order, start_index, end_index) {
    if (start_index === void 0) { start_index = 1; }
    if (end_index === void 0) { end_index = -1; }
    var $listtable = document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_Number($listtable, order, 4, start_index, end_index);
};
// sort function 5
// true:ascending order, false:descending order
var mySort05 = function (order, start_index, end_index) {
    if (start_index === void 0) { start_index = 1; }
    if (end_index === void 0) { end_index = -1; }
    var $listtable = document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_Number($listtable, order, 5, start_index, end_index);
};
// sort function 6
// true:ascending order, false:descending order
var mySort06 = function (order, subsorton, pos) {
    if (subsorton === void 0) { subsorton = false; }
    if (pos === void 0) { pos = [1, -1, 1]; }
    var i, posGR = [];
    if (order) {
        for (i = 0; i < abstRenderer_1.GENRE_ARRAY.length; ++i) {
            posGR.push(pos[0]);
            sortBySpecifiedCharacterPriority(6, abstRenderer_1.GENRE_ARRAY[i], pos);
        }
    }
    else {
        for (i = 0; i < abstRenderer_1.GENRE_ARRAY.length; ++i) {
            posGR.push(pos[0]);
            sortBySpecifiedCharacterPriority(6, abstRenderer_1.GENRE_ARRAY.slice().reverse()[i], pos);
        }
    }
    if (subsorton) {
        posGR.push(-1);
        subSort(2, order, posGR);
    }
};
// sub sort
var subSort = function (index, order, pos) {
    if (index == 0) { // today:
        switch (exports.subSortSetting[0]) {
            case 2:
                mySort02(order, 1, pos[2] - 1);
                mySort02(order, pos[2], -1);
                break;
            case 3:
                mySort03(order, false, [1, pos[2] - 1, 1]);
                mySort03(order, false, [pos[2], -1, pos[2]]);
                break;
            case 4:
                mySort04(order, 1, pos[2] - 1);
                mySort04(order, pos[2], -1);
                break;
            case 5:
                mySort05(order, 1, pos[2] - 1);
                mySort05(order, pos[2], -1);
                break;
            case 6:
                mySort06(order, false, [1, pos[2] - 1, 1]);
                mySort06(order, false, [pos[2], -1, pos[2]]);
                break;
            default:
                break;
        }
    }
    else if (index == 1) { // importance
        if (pos.length < 2)
            return;
        switch (exports.subSortSetting[1]) {
            case 1:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort01(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            case 2:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort02(order, pos[i], pos[i + 1] - 1);
                break;
            case 4:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort04(order, pos[i], pos[i + 1] - 1);
                break;
            case 5:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort05(order, pos[i], pos[i + 1] - 1);
                break;
            case 6:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort06(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            default:
                break;
        }
    }
    else if (index == 2) { // genre
        if (pos.length < 2)
            return;
        switch (exports.subSortSetting[2]) {
            case 1:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort01(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            case 2:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort02(order, pos[i], pos[i + 1] - 1);
                break;
            case 3:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort03(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            case 4:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort04(order, pos[i], pos[i + 1] - 1);
                break;
            case 5:
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort05(order, pos[i], pos[i + 1] - 1);
                break;
            default:
                break;
        }
    }
};
// general quick sort ver.table1
// sort by number, not string.
var quickSort_Number = function (table, order, index, start_index, end_index) {
    var left = start_index, right = end_index;
    var pivot = getNumber(Math.floor((left + right) / 2), index);
    if (order) {
        while (true) {
            var left_value = void 0;
            while (true) {
                left_value = getNumber(left, index);
                if (!(left_value < pivot))
                    break;
                ++left;
            }
            var right_value = void 0;
            while (true) {
                right_value = getNumber(right, index);
                if (!(pivot < right_value))
                    break;
                --right;
            }
            if (right <= left)
                break;
            replaceRows(table, left, right);
            ++left;
            --right;
        }
    }
    else {
        while (true) {
            var left_value = void 0;
            while (true) {
                left_value = getNumber(left, index);
                if (!(pivot < left_value))
                    break;
                ++left;
            }
            var right_value = void 0;
            while (true) {
                right_value = getNumber(right, index);
                if (!(right_value < pivot))
                    break;
                --right;
            }
            if (right <= left)
                break;
            replaceRows(table, left, right);
            ++left;
            --right;
        }
    }
    if (start_index < left - 1)
        quickSort_Number(table, order, index, start_index, left - 1);
    if (right + 1 < end_index)
        quickSort_Number(table, order, index, right + 1, end_index);
};
// get number.
// used in quick sort function
var getNumber = function (row_index, column_index) {
    if (column_index == 4) {
        return Number(document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[row_index].getElementsByTagName("td")[4].textContent);
    }
    else if (column_index == 5) {
        var manhour = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[row_index].getElementsByTagName("td")[5].textContent;
        var unit = manhour.slice(-1);
        var temp = Number(manhour.slice(0, -1));
        if (unit == MANHOUR_UNIT_LIST[0]) { // Y
            temp = temp * 365;
        }
        else if (unit == MANHOUR_UNIT_LIST[1]) { // M
            // 1 month = 30 days
            temp = temp * 30;
        }
        else if (unit == MANHOUR_UNIT_LIST[2]) { // D
            // no process
        }
        else if (unit == MANHOUR_UNIT_LIST[3]) { // H
            temp = temp / 24.0;
        }
        return temp;
    }
    else {
        return -1;
    }
};
// general quick sort ver.table2
// sort by string(japanese), not number.
var quickSort_JapaneseString = function (table, order, start_index, end_index) {
    var left = start_index, right = end_index;
    var pivot = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[Math.floor((left + right) / 2)].getElementsByTagName("td")[2].textContent;
    if (order) {
        while (true) {
            var left_value = void 0;
            while (true) {
                left_value = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[left].getElementsByTagName("td")[2].textContent;
                if (-1 < left_value.localeCompare(pivot, 'ja'))
                    break;
                ++left;
            }
            var right_value = void 0;
            while (true) {
                right_value = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[right].getElementsByTagName("td")[2].textContent;
                if (-1 < pivot.localeCompare(right_value, 'ja'))
                    break;
                --right;
            }
            if (right <= left)
                break;
            replaceRows(table, left, right);
            ++left;
            --right;
        }
    }
    else {
        while (true) {
            var left_value = void 0;
            while (true) {
                left_value = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[left].getElementsByTagName("td")[2].textContent;
                if (-1 < pivot.localeCompare(left_value, 'ja'))
                    break;
                ++left;
            }
            var right_value = void 0;
            while (true) {
                right_value = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[right].getElementsByTagName("td")[2].textContent;
                if (-1 < right_value.localeCompare(pivot, 'ja'))
                    break;
                --right;
            }
            if (right <= left)
                break;
            replaceRows(table, left, right);
            ++left;
            --right;
        }
    }
    if (start_index < left - 1)
        quickSort_JapaneseString(table, order, start_index, left - 1);
    if (right + 1 < end_index)
        quickSort_JapaneseString(table, order, right + 1, end_index);
};
// Sort by Specified Character priority
// index      : target column index
// s_char     : specified character
// pos[start_pos, end_pos, change_pos]
// start_pos  : start position. normally 1.
// end_pos    : end position. if it is -1, sort by array-end
// change_pos : normally 1. if you sort this function with other char, this helps sorting.
var sortBySpecifiedCharacterPriority = function (index, s_char, pos) {
    var $listtable = document.getElementById("ListTable");
    if (pos[1] < 0)
        pos[1] = $listtable.rows.length - 1;
    var checkRow = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr");
    for (var i = pos[0]; i <= pos[1]; ++i) {
        var checkColumn = checkRow[i].getElementsByTagName("td");
        if (checkColumn[index].textContent == s_char) {
            if (i != pos[2])
                replaceRows($listtable, pos[2], i);
            ++pos[2];
        }
    }
    pos[0] = pos[2];
};
// replace rows
var replaceRows = function (table, row1_index, row2_index) {
    var clone1 = table.rows[row1_index].cloneNode(true);
    var clone2 = table.rows[row2_index].cloneNode(true);
    table.rows[row1_index].parentNode.replaceChild(clone2, table.rows[row1_index]);
    table.rows[row2_index].parentNode.replaceChild(clone1, table.rows[row2_index]);
};
//# sourceMappingURL=toDoDataSorter.js.map