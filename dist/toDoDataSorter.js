"use strict";
exports.__esModule = true;
// import
var abstRenderer_1 = require("./abstRenderer");
// importance list
var IMPORTANCE_LIST = ["S", "A", "B", "C", "D"];
// today mark
var TODAY_LIST = ["★", ""];
// man hour unit
var MANHOUR_UNIT_LIST = ["Y", "M", "D", "h"];
// sub sort setting
exports.subSortSetting = [3, 4, 2]; // initial settings: importance, urgency, title
/**
 * This function needs to work after data settings of abstRenderer.
 * Don't execute onload function.
 */
function tableInitialize() {
    initializeSortSetting();
    setRowClickSetting();
    abstRenderer_1.GENRE_ARRAY.sort();
}
exports["default"] = tableInitialize;
/**
 * Event Handler function
 * Need to be called after drawing table.
 */
var initializeSortSetting = function () {
    var _loop_1 = function (i) {
        document.getElementById("sort0" + i + "-button").addEventListener('click', function () {
            if (!abstRenderer_1.enableDeleteList)
                mySortToDoList(i);
        });
    };
    for (var i = 1; i < 7; ++i) {
        _loop_1(i);
    }
};
/**
 * Setting for showing detail dialog.
 * Add "double click" event to each row.
 */
var setRowClickSetting = function () {
    var tbl = document.getElementById("ListTable");
    var numofrow = tbl.rows.length;
    var _loop_2 = function (i) {
        tbl.rows[i].addEventListener('dblclick', function () {
            abstRenderer_1.showDetailDialog(i);
        });
    };
    for (var i = 1; i < numofrow; ++i) {
        _loop_2(i);
    }
};
/**
 * Select sort function and re-setting
 * @param index - index of sort target, that is pressed button
 */
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
            return;
    }
    setRowClickSetting();
};
/**
 * Return sort order
 * Also change button innerText
 * @param index - index of pressed button
 */
var getSortOrder = function (index) {
    var $sort_button = document.getElementById("sort0" + index + "-button");
    var cld = $sort_button.lastChild;
    var cname = cld.className;
    if (cname.indexOf('up') != -1) {
        cld.className = cname.replace('up', 'down');
        console.log("sort in ascending order.");
        return true;
    }
    else if (cname.indexOf('down') != -1) {
        cld.className = cname.replace('down', 'up');
        console.log("sort in descending order.");
        return false;
    }
};
/**
 * Sort by Today
 * @param order - sort order: true is ascending order, false is descending order
 * @param subsorton - execute sub-sort. default is false.
 * @param pos - sort position. default is all. array is [start, end, change],
 * "change" is the first position of exchanging.
 */
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
/**
 * Sort by Title
 * @param order - sort order: true is ascending order, false is descending order
 * @param start_index - first item of sort range
 * @param end_index - last item of sort range
 */
var mySort02 = function (order, start_index, end_index) {
    if (start_index === void 0) { start_index = 1; }
    if (end_index === void 0) { end_index = -1; }
    var $listtable = document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_JapaneseString($listtable, order, start_index, end_index);
};
/**
 * Sort by importance
 * @param order - sort order: true is ascending order, false is descending order
 * @param subsorton -execute sub-sort. default is false;
 * @param pos - sort position. default is all. array is [start, end, change],
 * "change" is the first position of exchanging.
 */
var mySort03 = function (order, subsorton, pos) {
    if (subsorton === void 0) { subsorton = false; }
    if (pos === void 0) { pos = [1, -1, 1]; }
    var i, posGR = [];
    var list = IMPORTANCE_LIST;
    if (!order)
        list = IMPORTANCE_LIST.slice().reverse();
    for (i = 0; i < IMPORTANCE_LIST.length; ++i) {
        posGR.push(pos[0]);
        if (sortBySpecifiedCharacterPriority(3, list[i], pos) == false)
            posGR.pop();
    }
    if (subsorton) {
        posGR.push(-1); // last item was pushed in above roop, and it is unnecessary.
        subSort(1, order, posGR);
    }
};
/**
 * Sort by urgency
 * @param order - sort order: true is ascending order, false is descending order
 * @param start_index - first item of sort range
 * @param end_index - last item of sort range
 */
var mySort04 = function (order, start_index, end_index) {
    if (start_index === void 0) { start_index = 1; }
    if (end_index === void 0) { end_index = -1; }
    var $listtable = document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_Number($listtable, order, 4, start_index, end_index);
};
/**
 * Sort by manhour
 * @param order - sort order: true is ascending order, false is descending order
 * @param start_index - first item of sort range
 * @param end_index - last item of sort range
 */
var mySort05 = function (order, start_index, end_index) {
    if (start_index === void 0) { start_index = 1; }
    if (end_index === void 0) { end_index = -1; }
    var $listtable = document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_Number($listtable, order, 5, start_index, end_index);
};
/**
 * Sort by genre
 * @param order - sort order: true is ascending order, false is descending order
 * @param subsorton -execute sub-sort. default is false;
 * @param pos - sort position. default is all. array is [start, end, change],
 * "change" is the first position of exchanging.
 */
var mySort06 = function (order, subsorton, pos) {
    if (subsorton === void 0) { subsorton = false; }
    if (pos === void 0) { pos = [1, -1, 1]; }
    var i, posGR = [];
    var list = abstRenderer_1.GENRE_ARRAY;
    if (!order)
        list = abstRenderer_1.GENRE_ARRAY.slice().reverse();
    for (i = 0; i < abstRenderer_1.GENRE_ARRAY.length; ++i) {
        posGR.push(pos[0]);
        sortBySpecifiedCharacterPriority(6, list[i], pos);
    }
    if (subsorton) {
        posGR.push(-1); // last item was pushed in above roop, and it is unnecessary.
        subSort(2, order, posGR);
    }
};
/**
 * Execute sub sort
 * @param index - what to sort by?
 * @param order - sort order: true is ascending order, false is descending order
 * @param pos - sort position. default is all. array is [start, end, change],
 * "change" is the first position of exchanging.
 */
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
            case 2: //NG
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort02(order, pos[i], pos[i + 1] - 1);
                break;
            case 4: //NG
                for (var i = 0; i < pos.length - 1; ++i)
                    mySort04(order, pos[i], pos[i + 1] - 1);
                break;
            case 5: //NG
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
/**
 * General quick sort
 * sort by number not string.
 * @param table - sort target table
 * @param order - sort order: true is ascending order, false is descending order
 * @param index - column index, this is provided by what to sort by.
 * @param start_index - first item of sort range
 * @param end_index - last item of sort range
 */
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
/**
 * Return manhour by type number. used in quick sort function
 * @param row_index - row index of target cell
 * @param column_index - column index of target cell
 */
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
/**
 * General quick sort
 * sort by string, not number.
 * @param table - sort target table
 * @param order - sort order: true is ascending order, false is descending order
 * @param start_index - first item of sort range
 * @param end_index - last item of sort range
 */
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
/**
 * 2-divide sort
 * @param index - target column index
 * @param s_char - specified character
 * @param pos - pos[start_pos, end_pos, change_pos]
 * start_pos  : start position. normally 1.
 * end_pos    : end position. if it is -1, sort by array-end
 * change_pos : normally 1. if you sort this function with other char, this helps sorting.
 */
var sortBySpecifiedCharacterPriority = function (index, s_char, pos) {
    var $listtable = document.getElementById("ListTable");
    if (pos[1] < 0)
        pos[1] = $listtable.rows.length - 1;
    var isit = false;
    var checkRow = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr");
    for (var i = pos[0]; i <= pos[1]; ++i) {
        var checkColumn = checkRow[i].getElementsByTagName("td");
        if (checkColumn[index].textContent == s_char) {
            if (i != pos[2]) {
                replaceRows($listtable, pos[2], i);
                isit = true;
            }
            ++pos[2];
        }
    }
    pos[0] = pos[2];
    return isit;
};
/**
 * replace two rows
 * @param table - target table
 * @param row1_index - target 1
 * @param row2_index - target 2
 */
var replaceRows = function (table, row1_index, row2_index) {
    var clone1 = table.rows[row1_index].cloneNode(true);
    var clone2 = table.rows[row2_index].cloneNode(true);
    table.rows[row1_index].parentNode.replaceChild(clone2, table.rows[row1_index]);
    table.rows[row2_index].parentNode.replaceChild(clone1, table.rows[row2_index]);
};
//# sourceMappingURL=toDoDataSorter.js.map