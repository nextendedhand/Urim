import ToDoDataManager from './toDoDataManager';
import settingsDataManager from './settingsDataManager';
import genreData from './genreData';
import toDoData from './toDoData';

export interface ManHour {
    "year": number;
    "month": number;
    "day": number;
    "hour": number;
}

export interface Deadline {
    "year": number;
    "month": number;
    "day": number;
}

export interface FormItems {
    title: string;
    importance: string;
    manHour: ManHour;
    genreId: string;
    contents: string;
    deadline: Deadline;
    place: string;
    isToday: boolean;
}

export default class FormInfoManager {
    constructor() {

    }

    public expireForm() {
        // 最新のgenreDataを取得
        const sdm = new settingsDataManager();
        sdm.import();
        console.log(sdm.settingsData);
        let gArray = new Array();
        const gDataObj = sdm.settingsData.getGenreData();
        for (let i = 0; i < gDataObj.length; i++) {
            gArray[i] = new genreData(gDataObj[i]["color"], gDataObj[i]["name"], gDataObj[i]["id"]);
        }
        this.updateGenreData(gArray);
    }

    public setPlaceHolder(task_id: String) {
        const tddm = new ToDoDataManager();
        tddm.import();
        let tdArray = new Array();
        const tdDataObj = tddm.toDoDataArray;
        for (let i = 0; i < tdDataObj.length; i++) {
            tdArray[i] = new toDoData(tdDataObj[i]["title"], tdDataObj[i]["importance"],
                    tdDataObj[i]["manHour"], tdDataObj[i]["genreId"], tdDataObj[i]["detailData"]["deadline"],
                    tdDataObj[i]["detailData"]["contents"], tdDataObj[i]["detailData"]["place"], tdDataObj[i]["isToday"], tdDataObj[i]["id"]);
        }
        
        // temp
        task_id = tdArray[0].getId()
        //

        let target_index = tdArray.length;
        for (let i = 0; i < tdArray.length; i++) {
            if (task_id == tdArray[i].getId()) {
                target_index = i;
            }
        }

        document.getElementById("title").setAttribute("value", tdArray[target_index].getTitle());
        document.getElementById("contents").setAttribute("value", tdArray[target_index].detailData.getContents());
        document.getElementById("place").setAttribute("value", tdArray[target_index].detailData.getPlace());
        document.getElementById("man_hour").setAttribute("value", tdArray[target_index].getManHour()); // キャスト

    }

    public getTaskInfo(): FormItems {
        // title(string)
        const title = this.getTitle();
        // importance(string)
        const importance = this.getImportance();
        // manHour: 工数(ManHour)
        const manHour = this.getManHour();
        // genreId: タスク内容のジャンル(string)
        const genreId = this.getGenreId();
        // contents: タスク内容
        const contents = this.getContents();
        // deadLine: タスク締め切り(Deadline)
        const deadline = this.getDeadline();
        // place: タスクを行う場所
        const place = this.getPlace();
        // isToday: タスクが本日中かどうか
        const isToday = this.getIsToday();
    
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
        return items;
    }
    
    public registerTask(items: FormItems) {
        console.log(items);
        // TODO: ここのas anyの無い版
        const toDoDataItems = new toDoData(
            items.title, items.importance,
            items.manHour as any, items.genreId, items.deadline as any,
            items.contents, items.place, items.isToday);
    
        // toDoDataArrayの末尾にtoDoDataを追加しexport
        const tddm = new ToDoDataManager();
        tddm.import();
        tddm.toDoDataArray.push(toDoDataItems);
        tddm.export();
    }

    public expireTask(items: FormItems) {

    }

    // TODO:getTaskInfo内にもエラー必要
    public checkInputFilled(): boolean {
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
    
    private updateGenreData(genreDataArray: genreData[]) {
        let genre_list = document.getElementById("genre");
        for (let i = 0; i < genreDataArray.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", genreDataArray[i].getId());
            option.innerHTML = genreDataArray[i].getName();
            genre_list.appendChild(option);
        }
    }

    private getTitle(): string {
        return (document.getElementById("title") as HTMLInputElement).value;
    }
    
    private getImportance(): string {
        if ((document.getElementById("S") as HTMLInputElement).checked) {
            return (document.getElementById("S") as HTMLInputElement).value;
        } else if ((document.getElementById("A") as HTMLInputElement).checked) {
            return (document.getElementById("A") as HTMLInputElement).value;
        } else if ((document.getElementById("B") as HTMLInputElement).checked) {
            return (document.getElementById("B") as HTMLInputElement).value;
        } else {
            return (document.getElementById("C") as HTMLInputElement).value;
        }
    }
    
    private getManHour(): ManHour {
        const hour = (document.getElementById("man_hour") as HTMLInputElement).value;
        // TODO: other form
        const manHour: ManHour = {
            year: 0,
            month: 0,
            day: 0,
            hour: parseInt(hour),
        }
        return manHour;
    }
    
    private getGenreId(): string {
        return (document.getElementById("genre") as HTMLInputElement).value;
    }
    
    private getContents(): string {
        return (document.getElementById("contents") as HTMLInputElement).value;
    }
    
    private getDeadline(): Deadline {
        const date = (document.getElementById("deadline") as HTMLInputElement).value;
        // TODO: 格納をよりスマートにできるか
        const dateInfo = date.split('-');
        const deadLine: Deadline = {
            year: parseInt(dateInfo[0]),
            month: parseInt(dateInfo[1]),
            day: parseInt(dateInfo[2]),
        }
        return deadLine;
    }
    
    private getPlace(): string {
        return (document.getElementById("place") as HTMLInputElement).value;
    }
    
    private getIsToday(): boolean {
        return (document.getElementById("today") as HTMLInputElement).checked;
    }
}