/************************* imports *************************/
import tableInitialize from './toDoDataSorter';
import { subSortSetting as SUB_SORT_MODE } from './toDoDataSorter';
import toDoData from './toDoData';
import genreData from './genreData';
import toDoDataManager from './toDoDataManager';
import settingDataManager from './settingsDataManager';
import DetailDialogManager from './detailDialogManager';
/************************* global instances *************************/
const tddm = new toDoDataManager();
const sdm = new settingDataManager();
const ddlgm = new DetailDialogManager();
/************************* variables & constances *************************/

// column number 
const TABLE_COLUMN_NUM: number = 8;

// Header
const TEABLE_HEADER_STRINGS: string[] =
    ["削除", "本日", "タイトル", "重要度", "緊急度(残日数)", "工数", "ジャンル", "ID"];

// Genre array
export var GENRE_ARRAY: string[] = [];

// table name
const TABLE_NAME: string = "ToDoList_TABLE";

// div name of table region in html
const MY_TABLE_DIV: HTMLElement = document.getElementById(TABLE_NAME);

// delete mode flag
export var enableDeleteList: boolean = false;

//error number: ex) " : XXX Error"
var error_s: string = null;

/************************* functions *************************/

/**
 * Called in loading window.
 * All initialization must be executed in this function.
 */
window.onload = (): void => {

    /* start message */
    console.log("abst on load...");

    /* test */
    // tddm.resetDataForDebug();
    // sdm.resetDataForDebug();

    // date import
    dataSetting();

    // make and show table
    makeTable();

    // register each event of table
    tableInitialize();

    // additional registering to table
    my_addEventListener();

    // Initial table settings
    changePartofDisplay(false);

    // residual processing
    init_Others();

    // error display
    error_Check();

    // end message
    console.log("Load complete");

}

/**
 * Import todo-data and setting data
 */
const dataSetting = (): void => {

    // todo data
    tddm.import();

    // setting data
    sdm.import();

    // genre data
    sdm.settingsData.getGenreData().forEach(elm => {
        GENRE_ARRAY.push(elm['name']);
    });

}

/**
 * Table action event
 */
const my_addEventListener = (): void => {

    // delete function button
    let modechange_button: Element = document.getElementById('modechange-button');
    modechange_button.addEventListener('click', (): void => {
        changeDeleteMode()
    });

    // cancel button
    let return_button: Element = document.getElementById('return-button');
    return_button.addEventListener('click', (): void => {
        changeDeleteMode()
    });

    // execute delete button
    let delete_button: Element = document.getElementById('delete-button');
    delete_button.addEventListener('click', (): void => {
        toDoListDelete()
    });

    // urim button
    let urim_button: Element = document.getElementById('urim-button');
    urim_button.addEventListener('click', (): void => {
        tddm.export();
        sdm.export();
        location.href = '../html/index.html';
    });

    // create button
    let create_button: Element = document.getElementById('create-button');
    create_button.addEventListener('click', (): void => {
        tddm.export();
        sdm.export();
        location.href = '../html/register_form.html';
    });

}

/**
 * Make and show table
 */
const makeTable = (): void => {

    if (tddm.toDoDataArray == null) {
        error_s = "No todo data";
    }
    else {

        var rows: any[] = [], cell: any;
        var i: number, j: number;
        var table: HTMLTableElement = document.createElement("table");
        let dataNum: number = tddm.toDoDataArray.length + 1;   // consideration on header

        for (i = 0; i < dataNum; ++i) {

            rows.push(table.insertRow(-1));

            if (i == 0) {    // header

                for (j = 0; j < TABLE_COLUMN_NUM; ++j) {

                    // add new cell
                    cell = rows[i].insertCell(-1);

                    cell.appendChild(document.createTextNode(TEABLE_HEADER_STRINGS[j]));

                    // add sort button
                    if (0 < j && j < 7) {
                        var sortbtn: HTMLElement = document.createElement("button");
                        sortbtn.id = "sort0" + String(j) + "-button";
                        sortbtn.className = "mdl-button mdl-js-button mdl-button--icon";
                        var sortIcon: HTMLElement = document.createElement("i");
                        if (j == 2 || j == 3 || j == 6) sortIcon.className = "fas fa-sort-alpha-up";
                        else if (j == 4 || j == 5) sortIcon.className = "fas fa-sort-numeric-up";
                        else if (j == 1) sortIcon.className = "fas fa-sort-up";
                        sortbtn.appendChild(sortIcon);
                        cell.appendChild(sortbtn);
                    }

                    // add subsort button
                    if (j == 1 || j == 3 || j == 6) {
                        // cell.appendChild(document.createElement('br'));
                        // cell.appendChild(document.createTextNode("subsort:"));
                        cell.appendChild(createSelectBoxForSubSort(j)); //Note: not display in case of using mdl, materialize
                    }

                    // text align
                    cell.style = "text-align: center";

                }

            } else {

                for (j = 0; j < TABLE_COLUMN_NUM; ++j) {

                    // addnew cell
                    cell = rows[i].insertCell(-1);

                    // set
                    if (j == 0) {  //checkbox for delete function
                        let $clabel: HTMLElement = document.createElement('label');
                        let $cspan: HTMLElement = document.createElement('span');
                        let $checkbox: HTMLInputElement = document.createElement("input");
                        $checkbox.type = 'checkbox';
                        $checkbox.name = 'isDelete';
                        $checkbox.className = "filled-in";
                        $clabel.appendChild($checkbox);
                        $clabel.appendChild($cspan);
                        cell.appendChild($clabel);
                    }
                    else if (j == 1)
                        cell.appendChild(returnColumnStar(tddm.toDoDataArray[i - 1]));
                    else
                        cell.appendChild(document.createTextNode(returnColumnValue(j, tddm.toDoDataArray[i - 1])));

                    if (j == 2) {   // title
                        cell.className = "title_cell";
                    }
                    // text align
                    cell.style = "text-align: center";
                    // if (j == 1 || j == 2 || j == 3 || j == 6)
                    //     cell.style = "text-align: center";
                    // else if (j == 4 || j == 5)
                    //     cell.style = "text-align: right";
                }

            }

        }

        // give id
        table.id = "ListTable";

        // highlight setting
        table.className = "highlight";

        // show table
        MY_TABLE_DIV.appendChild(table);

    }

    error_Check();

}

/**
 * Return content to set today cell.
 * Use star icon.
 * @param data - todo-data to set
 */
const returnColumnStar = (data: toDoData): any => {
    if (data['isToday']) {
        let sIcon: HTMLElement = document.createElement("i");
        sIcon.className = "fas fa-star"
        sIcon.id = "today_star";
        return sIcon;
    }
    else {
        let noIcon: HTMLElement = document.createElement("p");
        noIcon.textContent = " ";
        return noIcon;
    }
}

/**
 * Return content to set cell
 * @param columnIndex - column index. attention hidden column.
 * @param data - todo-data to set
 */
const returnColumnValue = (columnIndex: number, data: toDoData): string => {

    switch (columnIndex) {
        case 2:// title
            return data['title'];
        case 3:// importance
            return data['importance'];
        case 4:// urgency
            return String(data['urgency']);
        case 5:// manHour
            let str: string = "";
            if (0 < data['manHour'].year) str = String(data['manHour'].year) + "Y";
            if (0 < data['manHour'].month) {
                if (str == "") str = String(data['manHour'].month) + "M";
                else str = " " + String(data['manHour'].month) + "M";
            }
            if (0 < data['manHour'].day) {
                if (str = "") str = String(data['manHour'].day) + "D";
                else str = " " + String(data['manHour'].day) + "D";
            }
            if (0 < data['manHour'].hour) {
                if (str == "") str = String(data['manHour'].hour) + "h";
                else str = " " + String(data['manHour'].hour) + "h";
            }
            return str;
        case 6:// genre
            let id: string = data['genreId'];
            let temp: genreData[] = sdm.settingsData.getGenreData();
            let genre: string;
            temp.forEach(elm => {
                if (elm['id'] == id) genre = elm['name'];
            });
            return genre;
        case 7://ID
            return data['id'];
        default:
            return "null";
    }

}

/**
 * Selector in subsort compornent
 * @param index - column index
 */
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

/**
 * Subsort setting when changed select target
 */
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

/**
 * Mode change to delete/normal mode.
 * Flag reset and display/hide some buttons column.
 */
const changeDeleteMode = (): void => {
    changePartofDisplay(!enableDeleteList);
    enableDeleteList = !enableDeleteList;
}

/**
 * Execute todo-data delete
 */
const toDoListDelete = (): void => {

    var deleteList: number[] = [];
    var deleteId: string[] = [];
    deleteId = getDeleteList(deleteList);
    let last: number = deleteList.length;
    if (0 < last) {
        let i: number;
        let $listtable: HTMLTableElement = <HTMLTableElement>document.getElementById("ListTable");
        for (i = last - 1; -1 < i; --i)
            $listtable.deleteRow(1 + deleteList[i]);    // consideration on header
    }
    changeDeleteMode();
    afterToDoDelete(deleteId);
}

/**
 * Serach and collect delete target.
 * @param deleteList - array of index which should be deleted. Use empty array.
 * Return id array of deleteList.
 */
const getDeleteList = (deleteList: number[]): string[] => {

    var checkboxList: NodeListOf<HTMLInputElement> = <NodeListOf<HTMLInputElement>>document.getElementsByName("isDelete");
    let i: number;
    const last: number = checkboxList.length;
    for (i = 0; i < last; ++i)
        if (checkboxList[i].checked)
            deleteList.push(i);

    return keepDeleteID(deleteList);

}

/**
 * uncheck checklist when cacncel delete mode.
 */
const Uncheck = (): void => {

    var checkboxList: NodeListOf<HTMLInputElement> = <NodeListOf<HTMLInputElement>>document.getElementsByName("isDelete");
    let i: number;
    const last: number = checkboxList.length;
    for (i = 0; i < last; ++i)
        if (checkboxList[i].checked)
            checkboxList[i].checked = false;

}

/**
 * Display and hide buttons and columns
 * @param isDiplay 
 */
const changePartofDisplay = (isDiplay: boolean): void => {
    if (isDiplay) {
        // hide buttons
        document.getElementById('modechange-button').style.display = "none";
        document.getElementById('urim-button').style.display = "none";
        document.getElementById('create-button').style.display = "none";

        // display buttons
        document.getElementById("delete-button").style.display = "block";
        document.getElementById("return-button").style.display = "block";

        // display columns
        let checkRow: HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
        for (let i: number = 0; i < checkRow.length; ++i) {
            let checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "block";
        }
    } else {
        // display buttons
        document.getElementById('modechange-button').style.display = "block";
        document.getElementById('urim-button').style.display = "block";
        document.getElementById('create-button').style.display = "block";

        // hide buttons
        document.getElementById("delete-button").style.display = "none";
        document.getElementById("return-button").style.display = "none";

        // uncheck all checkboxes
        Uncheck();

        // hide columns
        let checkRow: HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
        for (let i: number = 0; i < checkRow.length; ++i) {
            let checkColumn = checkRow[i].getElementsByTagName("td");
            checkColumn[0].style.display = "none";
        }
    }
}

/**
 * hide id column.
 */
const init_Others = (): void => {
    // hide id column
    let checkRow: HTMLCollectionOf<HTMLTableRowElement> = MY_TABLE_DIV.getElementsByTagName("tr");
    for (let i: number = 0; i < checkRow.length; ++i) {
        let checkColumn = checkRow[i].getElementsByTagName("td");
        checkColumn[TABLE_COLUMN_NUM - 1].style.display = "none";
    }
}

/**
 * Return array of id which intend to delete
 * @param index - array of row index which intend to delete
 */
const keepDeleteID = (index: number[]): string[] => {

    var isDeleteID: string[] = [];

    let checkRow: HTMLCollectionOf<HTMLTableRowElement> = document.getElementById(TABLE_NAME).getElementsByTagName("tr");
    for (let i: number = 0; i < index.length; ++i) {
        let checkColumn: HTMLCollectionOf<HTMLTableDataCellElement> = checkRow[index[i] + 1].getElementsByTagName("td");    //ヘッダを考慮
        isDeleteID.push(checkColumn[TABLE_COLUMN_NUM - 1].textContent);
    }

    return isDeleteID;

}

/**
 * data save after deleting data.
 * @param deleteId - array of row index which intend to delete
 */
const afterToDoDelete = (deleteId: string[]): void => {

    try {
        if (deleteId == null) return;

        // delete object
        deleteId.forEach(elm => {
            tddm.delete(elm);
        });

        // data save
        tddm.export();

    } catch (e) {
        error_s = " :Error in writing electron-store";
    }

    tableInitialize();

    error_Check();

}

/**
 * Show detail dialog
 * @param rowindex - target data, table row
 */
export function showDetailDialog(rowindex: number): void {
    // get todo data id where clicked row
    let row: HTMLCollectionOf<HTMLTableRowElement> = document.getElementById(TABLE_NAME).getElementsByTagName("tr");
    let column: HTMLCollectionOf<HTMLTableDataCellElement> = row[rowindex].getElementsByTagName("td");
    let id: string = column[TABLE_COLUMN_NUM - 1].textContent;
    // get corresponding todo data
    tddm.toDoDataArray.forEach(elm => {
        if (elm['id'] == id) {
            // show dialog
            ddlgm.renderContents(elm);
        }
    });

}

// diaplay error message
const error_Check = (): void => {
    if (error_s != null) {
        alert(error_s);
        error_s = null;
    }
}
