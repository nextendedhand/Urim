import toDoData from './toDoData';
import LS from './localStorageManager';


interface FormItems {
    title: string;
    importance: string;
    urgency: number;
    manHour: number;
    genreId: number;
    contents: string;
    deadline: string;
    place: string;
    isToday: boolean;
}

let createBtn = document.getElementById("create_btn");
createBtn.addEventListener("click", () => {
    if (checkInputFilled()) {
        let item: FormItems = getTaskInfo();
        registerTask(item);
        //location.href = '../html/index.html';
    } else {
        // "入力が不足しています"
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    location.href = '../html/index.html';
}, false);

function getTaskInfo(): FormItems {
    // title(string)
    const title = getTitle();
    // importance(string)
    const importance = getImportance();
    // urgency(number)
    const urgency = getUrgency();
    // manHour: 工数(number: hour)
    const manHour = getManHour();
    // genreId: タスク内容のジャンル(number)
    const genreId = getGenreId();
    // contents: タスク内容
    const contents = getContents();
    // deadLine: タスク締め切り(string: 標準表記"yyyy-mm-dd")
    const deadline = getDeadline();
    // place: タスクを行う場所
    const place = getPlace();
    // isToday: タスクが本日中かどうか
    const isToday = getIsToday();

    // TODO: error判定: deadlineが今日より前の場合もerror
    // TODO: 定義域check
    const items: FormItems = {
        title: title,
        importance: importance,
        urgency: urgency,
        manHour: manHour,
        genreId: genreId,
        contents: contents,
        deadline: deadline,
        place: place,
        isToday: isToday
    }
    console.log(items);

    return items;
}

function registerTask(items: FormItems) {
    console.log(items);
    const tmpManHour = {
        "year": 1,
        "month": 12,
        "day": 2,
        "hour": 1
    };
    const tmpDeadline = {
        "year": 2019,
        "month": 12,
        "day": 2
    }

    const abst = new toDoData(
        items.title, items.importance,
        tmpManHour, items.genreId, tmpDeadline,
        items.contents, items.place, items.isToday);
    let mng = new DATAMANAGER();
    // TODO: データ出力
    // mng.import();
    // mng.toDoDataArray.push(abst);
    // mng.export();
}

function getTitle(): string {
    return (document.getElementById("title") as HTMLInputElement).value;
}

function getImportance(): string {
    return (document.getElementById("importance") as HTMLInputElement).value;
}

function getUrgency(): number {
    // TODO: use calculateUrgency()
    return 1;
}

function getManHour(): number {
    const hour = (document.getElementById("man_hour") as HTMLInputElement).value;
    return parseFloat(hour);
}

function getGenreId(): number {
    const genre = (document.getElementById("genre") as HTMLInputElement).value;
    // const genreArray = settings.getGenreData();
    // TODO: get genreId
    // for (let genreData of genreArray) {
    //   if (genreData.getName() == genre) {
    //     return Number(genreData.getId());
    //   }
    // }
    return 1;
}

function getContents(): string {
    return (document.getElementById("contents") as HTMLInputElement).value;
}

function getDeadline(): string {
    return (document.getElementById("deadline") as HTMLInputElement).value;
}

function getPlace(): string {
    return (document.getElementById("place") as HTMLInputElement).value;
}

function getIsToday(): boolean {
    return (document.getElementById("today") as HTMLInputElement).checked;
}

// TODO:getTaskInfo内にもエラー必要
function checkInputFilled(): boolean {
    let is_filled = true;
    if ((document.getElementById("title") as HTMLInputElement).value == "") {
        console.log("title is none");
        is_filled = false;
    }
    if ((document.getElementById("deadline") as HTMLInputElement).value == "") {
        console.log("deadline is none");
        is_filled = false;
    }

    return is_filled;
}
