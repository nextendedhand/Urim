import toDoData from './toDoData';
import LS from './localStorageManager';

interface ManHour {
    "year": number;
    "month": number;
    "day": number;
    "hour": number;
}

interface Deadline {
    "year": number;
    "month": number;
    "day": number;
}

interface FormItems {
    title: string;
    importance: string;
    manHour: ManHour;
    genreId: number;
    contents: string;
    deadline: Deadline;
    place: string;
    isToday: boolean;
}

let createBtn = document.getElementById("create_btn");
createBtn.addEventListener("click", () => {
    if (checkInputFilled()) {
        let item: FormItems = getTaskInfo();
        registerTask(item);
        location.href = '../html/index.html';
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
    // manHour: 工数(ManHour)
    const manHour = getManHour();
    // genreId: タスク内容のジャンル(number)
    const genreId = getGenreId();
    // contents: タスク内容
    const contents = getContents();
    // deadLine: タスク締め切り(Deadline)
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
    // TODO: ここのas anyの無い版
    const toDoDataItems = new toDoData(
        items.title, items.importance,
        items.manHour as any, items.genreId, items.deadline as any,
        items.contents, items.place, items.isToday);
    // let ls = new LS();
    // ls.getValueしてtoDoDataArray型へ
    // 末尾にtoDoDataItemsをpushし、setValue
    
    // ls.setValue(JSON.stringify(toDoDataItems));
}

function getTitle(): string {
    return (document.getElementById("title") as HTMLInputElement).value;
}

function getImportance(): string {
    return (document.getElementById("importance") as HTMLInputElement).value;
}

function getManHour(): ManHour {
    const hour = (document.getElementById("man_hour") as HTMLInputElement).value;
    // TODO: other form
    const manHour:ManHour = {
        year: 0,
        month: 0,
        day: 0,
        hour: parseFloat(hour),
    }
    return manHour;
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

function getDeadline(): Deadline {
    const date = (document.getElementById("deadline") as HTMLInputElement).value;
    const dateData = new Date(date);
    const deadLine:Deadline = {
        year: dateData.getFullYear(),
        month: dateData.getMonth(),
        day: dateData.getDay(),
    }
    return deadLine;
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
