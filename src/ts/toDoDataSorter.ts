import { enableDeleteList as IS_DELETE_MODE, GENRE_ARRAY as GENRE_LIST, showDetailDialog as showDetailDialog } from './abstRenderer';

// importance list
const IMPORTANCE_LIST: string[] = ["S", "A", "B", "C", "D"];

// today mark
const TODAY_LIST: string[] = ["★", ""];

// man hour unit
const MANHOUR_UNIT_LIST: string[] = ["Y", "M", "D", "h"];

// sub sort setting
export var subSortSetting: number[] = [3, 4, 2];

export default function tableInitialize(): void {
    initializeSortSetting();
    setRowClickSetting();
    GENRE_LIST.sort();
}

// ボタンのイベントハンドラ登録実行関数
// テーブル作成後に呼び出す。
const initializeSortSetting = (): void => {

    // イベントハンドラ登録用定数
    const sort01_button: Element = document.getElementById('sort01-button');
    const sort02_button: Element = document.getElementById('sort02-button');
    const sort03_button: Element = document.getElementById('sort03-button');
    const sort04_button: Element = document.getElementById('sort04-button');
    const sort05_button: Element = document.getElementById('sort05-button');
    const sort06_button: Element = document.getElementById('sort06-button');

    // イベントハンドラ登録
    if (sort01_button != null) {
        sort01_button.addEventListener('click', (clickEvent: Event): void => {
            if (!IS_DELETE_MODE)
                mySortToDoList(1)
        });
    } else {
        console.log("event handler error: sort01 button");
    }

    if (sort02_button != null) {
        sort02_button.addEventListener('click', (clickEvent: Event): void => {
            if (!IS_DELETE_MODE)
                mySortToDoList(2)
        });
    } else {
        console.log("event handler error: sort02 button");
    }

    if (sort03_button != null) {
        sort03_button.addEventListener('click', (clickEvent: Event): void => {
            if (!IS_DELETE_MODE)
                mySortToDoList(3)
        });
    } else {
        console.log("event handler error: sort03 button");
    }

    if (sort04_button != null) {
        sort04_button.addEventListener('click', (clickEvent: Event): void => {
            if (!IS_DELETE_MODE)
                mySortToDoList(4)
        });
    } else {
        console.log("event handler error: sort04 button");
    }

    if (sort05_button != null) {
        sort05_button.addEventListener('click', (clickEvent: Event): void => {
            if (!IS_DELETE_MODE)
                mySortToDoList(5)
        });
    } else {
        console.log("event handler error: sort05 button");
    }

    if (sort06_button != null) {
        sort06_button.addEventListener('click', (clickEvent: Event): void => {
            if (!IS_DELETE_MODE)
                mySortToDoList(6)
        });
    } else {
        console.log("event handler error: sort06 button");
    }

}

// table event setting
const setRowClickSetting = (): void => {
    // 行ダブルクリック
    let tbl: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
    const numofrow: number = tbl.rows.length
    for (let i: number = 1; i < numofrow; ++i) {
        tbl.rows[i].addEventListener('dblclick', (): void => {
            showDetailDialog(i);
        });
    }
}

// List sort
const mySortToDoList = (index: number): void => {
    switch (index) {
        case 1: // 本日
            mySort01(getSortOrder(index), true);
            console.log("sorted by 'today'.");
            setRowClickSetting();
            break;
        case 2: // タイトル
            mySort02(getSortOrder(index));
            console.log("sorted by 'title'.");
            setRowClickSetting();
            break;
        case 3: // 重要度
            mySort03(getSortOrder(index), true);
            console.log("sorted by 'importance'.");
            setRowClickSetting();
            break;
        case 4: // 緊急度
            mySort04(getSortOrder(index));
            console.log("sorted by 'urgency'.");
            setRowClickSetting();
            break;
        case 5: // 工数
            mySort05(getSortOrder(index));
            console.log("sorted by 'manHour'.");
            setRowClickSetting();
            break;
        case 6: // ジャンル
            mySort06(getSortOrder(index), true);
            console.log("sorted by 'genre'.");
            setRowClickSetting();
            break;
        default:
            // no case
            break;
    }
}

// ascending or descending order?
const getSortOrder = (index: Number): boolean => {
    return changeButtonText(index);
}

// change button display
// return value --> true:ascending order, false:descending order
const changeButtonText = (index: Number): boolean => {
    var $sort_button: HTMLElement = document.getElementById('sort0' + String(index) + "-button");
    if ($sort_button.textContent == "▲") {
        $sort_button.textContent = "▼";
        console.log("sort in ascending order.");
        return true;
    } else {
        $sort_button.textContent = "▲";
        console.log("sort in descending order.");
        return false;
    }
}

// sort function 1
// true:ascending order, false:descending order
const mySort01 = (order: boolean, subsorton: boolean = false, pos: number[] = [1, -1, 1]): void => {

    if (order)
        sortBySpecifiedCharacterPriority(1, TODAY_LIST[0], pos);
    else
        sortBySpecifiedCharacterPriority(1, TODAY_LIST[1], pos);

    if (subsorton)
        subSort(0, order, pos);

}

// sort function 2
// true:ascending order, false:descending order
const mySort02 = (order: boolean, start_index: number = 1, end_index: number = -1): void => {
    var $listtable: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_JapaneseString($listtable, order, start_index, end_index);
}

// sort function 3
// true:ascending order, false:descending order
const mySort03 = (order: boolean, subsorton: boolean = false, pos: number[] = [1, -1, 1]): void => {
    var i: number, posGR: number[] = [];
    if (order) {
        for (i = 0; i < IMPORTANCE_LIST.length; ++i) {
            posGR.push(pos[0]);
            if (sortBySpecifiedCharacterPriority(3, IMPORTANCE_LIST[i], pos) == false)
                posGR.pop();
        }
    } else {
        for (i = 0; i < IMPORTANCE_LIST.length; ++i) {
            posGR.push(pos[0]);
            if (sortBySpecifiedCharacterPriority(3, IMPORTANCE_LIST.slice().reverse()[i], pos) == false)
                posGR.pop();
        }
    }

    if (subsorton) {
        posGR.push(-1);
        subSort(1, order, posGR);
    }

}

// sort function 4
// true:ascending order, false:descending order
const mySort04 = (order: boolean, start_index: number = 1, end_index: number = -1): void => {
    var $listtable: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_Number($listtable, order, 4, start_index, end_index);
}

// sort function 5
// true:ascending order, false:descending order
const mySort05 = (order: boolean, start_index: number = 1, end_index: number = -1): void => {
    var $listtable: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
    if (end_index < 0)
        end_index = $listtable.rows.length - 1;
    quickSort_Number($listtable, order, 5, start_index, end_index);
}

// sort function 6
// true:ascending order, false:descending order
const mySort06 = (order: boolean, subsorton: boolean = false, pos: number[] = [1, -1, 1]): void => {
    var i: number, posGR: number[] = [];
    if (order) {
        for (i = 0; i < GENRE_LIST.length; ++i) {
            posGR.push(pos[0]);
            sortBySpecifiedCharacterPriority(6, GENRE_LIST[i], pos);
        }
    } else {
        for (i = 0; i < GENRE_LIST.length; ++i) {
            posGR.push(pos[0]);
            sortBySpecifiedCharacterPriority(6, GENRE_LIST.slice().reverse()[i], pos);
        }
    }

    if (subsorton) {
        posGR.push(-1);
        subSort(2, order, posGR);
    }

}

// sub sort
const subSort = (index: number, order: boolean, pos: number[]): void => {
    if (index == 0) { // today:
        switch (subSortSetting[0]) {
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
    } else if (index == 1) { // importance
        if (pos.length < 2)
            return;
        switch (subSortSetting[1]) {
            case 1:
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort01(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            case 2://NG
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort02(order, pos[i], pos[i + 1] - 1);
                break;
            case 4://NG
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort04(order, pos[i], pos[i + 1] - 1);
                break;
            case 5://NG
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort05(order, pos[i], pos[i + 1] - 1);
                break;
            case 6:
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort06(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            default:
                break;
        }
    } else if (index == 2) { // genre
        if (pos.length < 2)
            return;
        switch (subSortSetting[2]) {
            case 1:
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort01(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            case 2:
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort02(order, pos[i], pos[i + 1] - 1);
                break;
            case 3:
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort03(order, false, [pos[i], pos[i + 1] - 1, pos[i]]);
                break;
            case 4:
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort04(order, pos[i], pos[i + 1] - 1);
                break;
            case 5:
                for (let i: number = 0; i < pos.length - 1; ++i)
                    mySort05(order, pos[i], pos[i + 1] - 1);
                break;
            default:
                break;
        }
    }
}

// general quick sort ver.table1
// sort by number, not string.
const quickSort_Number = (table: HTMLTableElement, order: boolean, index: number, start_index: number, end_index: number) => {

    var left: number = start_index, right: number = end_index;
    let pivot: number = getNumber(Math.floor((left + right) / 2), index);

    if (order) {
        while (true) {

            let left_value: number;
            while (true) {
                left_value = getNumber(left, index);
                if (!(left_value < pivot))
                    break;
                ++left;
            }

            let right_value: number;
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
    } else {
        while (true) {

            let left_value: number;
            while (true) {
                left_value = getNumber(left, index);
                if (!(pivot < left_value))
                    break;
                ++left;
            }

            let right_value: number;
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

}

// get number.
// used in quick sort function
const getNumber = (row_index: number, column_index: number): number => {
    if (column_index == 4) {
        return Number(document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[row_index].getElementsByTagName("td")[4].textContent);
    } else if (column_index == 5) {
        let manhour: string = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[row_index].getElementsByTagName("td")[5].textContent;
        let unit: string = manhour.slice(-1);
        let temp: number = Number(manhour.slice(0, -1));
        if (unit == MANHOUR_UNIT_LIST[0]) { // Y
            temp = temp * 365;
        } else if (unit == MANHOUR_UNIT_LIST[1]) { // M
            // 1 month = 30 days
            temp = temp * 30;
        } else if (unit == MANHOUR_UNIT_LIST[2]) { // D
            // no process
        } else if (unit == MANHOUR_UNIT_LIST[3]) { // H
            temp = temp / 24.0;
        }
        return temp;
    } else {
        return -1;
    }
}

// general quick sort ver.table2
// sort by string(japanese), not number.
const quickSort_JapaneseString = (table: HTMLTableElement, order: boolean, start_index: number, end_index: number): void => {

    var left: number = start_index, right: number = end_index;
    let pivot: string = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[Math.floor((left + right) / 2)].getElementsByTagName("td")[2].textContent;

    if (order) {
        while (true) {

            let left_value: string;
            while (true) {
                left_value = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[left].getElementsByTagName("td")[2].textContent;
                if (-1 < left_value.localeCompare(pivot, 'ja'))
                    break;
                ++left;
            }

            let right_value: string;
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
    } else {
        while (true) {

            let left_value: string;
            while (true) {
                left_value = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr")[left].getElementsByTagName("td")[2].textContent;
                if (-1 < pivot.localeCompare(left_value, 'ja'))
                    break;
                ++left;
            }

            let right_value: string;
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

}

// Sort by Specified Character priority
// index      : target column index
// s_char     : specified character
// pos[start_pos, end_pos, change_pos]
// start_pos  : start position. normally 1.
// end_pos    : end position. if it is -1, sort by array-end
// change_pos : normally 1. if you sort this function with other char, this helps sorting.
// id s_char is nothig in start ~ end, return false.
const sortBySpecifiedCharacterPriority = (index: number, s_char: string, pos: number[]): boolean => {

    var $listtable: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
    if (pos[1] < 0)
        pos[1] = $listtable.rows.length - 1;

    var isit: boolean = false;
    let checkRow: HTMLCollectionOf<HTMLTableRowElement> = document.getElementById("ToDoList_TABLE").getElementsByTagName("tr");
    for (let i: number = pos[0]; i <= pos[1]; ++i) {
        let checkColumn: HTMLCollectionOf<HTMLTableDataCellElement> = checkRow[i].getElementsByTagName("td");
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
}

// replace rows
const replaceRows = (table: HTMLTableElement, row1_index: number, row2_index: number): void => {
    let clone1 = table.rows[row1_index].cloneNode(true);
    let clone2 = table.rows[row2_index].cloneNode(true);
    table.rows[row1_index].parentNode.replaceChild(clone2, table.rows[row1_index]);
    table.rows[row2_index].parentNode.replaceChild(clone1, table.rows[row2_index]);
}

