import ToDoDataManager from './toDoDataManager';
import settingsDataManager from './settingsDataManager';
import genreData from './genreData';
import toDoData from './toDoData';
import { Interface } from 'readline';

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

    public expireRegisterForm() {
        // 最新のgenreDataを取得
        const sdm = new settingsDataManager();
        sdm.import();
        console.log(sdm.settingsData);
        let gArray = new Array();
        const gDataObj = sdm.settingsData.getGenreData();
        for (let i = 0; i < gDataObj.length; i++) {
            gArray[i] = new genreData(gDataObj[i]["color"],
                                gDataObj[i]["name"], gDataObj[i]["id"]);
        }
        this.updateGenreData(gArray);
    }

    public expireEditForm(selected_id: string) {
        const tddm = new ToDoDataManager();
        tddm.import();
        let tdArray = new Array();
        const tdDataObj = tddm.toDoDataArray;
        for (let i = 0; i < tdDataObj.length; i++) {
            tdArray[i] = new toDoData(tdDataObj[i]["title"],
                            tdDataObj[i]["importance"],
                            tdDataObj[i]["manHour"],
                            tdDataObj[i]["genreId"],
                            tdDataObj[i]["detailData"]["deadline"],
                            tdDataObj[i]["detailData"]["contents"],
                            tdDataObj[i]["detailData"]["place"],
                            tdDataObj[i]["isToday"],
                            tdDataObj[i]["id"]);
        }

        let target_index = tdArray.length;
        for (let i = 0; i < tdArray.length; i++) {
            if (selected_id == tdArray[i].getId()) {
                target_index = i;
            }
        }

        const target = tdArray[target_index];
        const details = target.getDetailData();

        // ***titleの書き込み
        document.getElementById("title")
                .setAttribute("value", target.getTitle());

        // ***detailの書き込み
        const detailTextForm = document.getElementById("detail_text");
        detailTextForm.textContent = details.getContents();

        // ***importanceの選択
        document.getElementById(target.getImportance())
                .setAttribute("checked", "yes");

        // ***placeの書き込み
        document.getElementById("place")
                .setAttribute("value", details.getPlace());
        
        // ***genreのoptionの動的な設定と選択
        const sdm = new settingsDataManager();
        sdm.import();
        let gArray = new Array();
        const gDataObj = sdm.settingsData.getGenreData();
        for (let i = 0; i < gDataObj.length; i++) {
            gArray[i] = new genreData(gDataObj[i]["color"],
                                gDataObj[i]["name"], gDataObj[i]["id"]);
        }

        let genre_list = document.getElementById("genre");
        for (let i = 0; i < gArray.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", gArray[i].getId());
            if (gArray[i].getId() == target.getGenreId()) {
                option.setAttribute("selected", "yes");
            }
            option.innerHTML = gArray[i].getName();
            genre_list.appendChild(option);
        }

        // ***deadlineの設定
        const deadlineObj = details.getDeadLine();
        let deadline_month;
        if (Number(deadlineObj["month"]) <= 9) {
            deadline_month = "0" + deadlineObj["month"];
        } else {
            deadline_month = deadlineObj["month"];
        }
        let deadline_day;
        if (Number(deadlineObj["day"]) <= 9) {
            deadline_day = "0" + deadlineObj["day"];
        } else {
            deadline_day = deadlineObj["day"];
        }
        const deadlineStr = deadlineObj["year"] + "-"
                            + deadline_month + "-" + deadline_day;
        document.getElementById("deadline")
                .setAttribute("value", deadlineStr);

        // ***manHourの書き込み
        const manHourObj = target.getManHour();
        document.getElementById("man_hour_m")
                .setAttribute("value", manHourObj["month"]);
        document.getElementById("man_hour_d")
                .setAttribute("value", manHourObj["day"]);
        document.getElementById("man_hour_h")
                .setAttribute("value", manHourObj["hour"]);
        
        // ***isTodayの選択
        if (target.getIsToday()) {
            document.getElementById("today")
                    .setAttribute("checked", "yes");
        } else {
            document.getElementById("notoday")
                    .setAttribute("checked", "yes");
        }
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
    
    // toDoDataArrayの末尾にtoDoDataを追加しexport
    public registerTask(items: FormItems) {
        const tddm = new ToDoDataManager();
        tddm.import();

        const toDoDataItems = new toDoData(
            items.title, items.importance,
            items.manHour as any, items.genreId, items.deadline as any,
            items.contents, items.place, items.isToday);
    
        tddm.toDoDataArray.push(toDoDataItems);
        tddm.export();
    }

    // toDoDataArrayの対象のtoDoDataを更新しexport
    public expireTask(items: FormItems, selected_id: string) {
        const tddm = new ToDoDataManager();
        tddm.import();

        let target_index = tddm.toDoDataArray.length;
        for (let i = 0; i < tddm.toDoDataArray.length; i++) {
            if (tddm.toDoDataArray[i].getId() == selected_id) {
                target_index = i;
            }
        }

        const toDoDataItems = new toDoData(
            items.title, items.importance,
            items.manHour as any, items.genreId, items.deadline as any,
            items.contents, items.place, items.isToday,
            selected_id);

        tddm.toDoDataArray.splice(target_index, 1, toDoDataItems);
        tddm.export();
    }

    public checkInputFilled(): boolean {
        let is_filled = true;
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
        let month = (document.getElementById("man_hour_m") as HTMLInputElement).value;
        let day = (document.getElementById("man_hour_d") as HTMLInputElement).value;
        let hour = (document.getElementById("man_hour_h") as HTMLInputElement).value;
        month = month ? month : "0";
        day = day ? day : "0";
        hour = hour ? hour : "0";

        const manHour: ManHour = {
            year: 0,
            month: parseInt(month),
            day: parseInt(day),
            hour: parseInt(hour),
        }
        return manHour;
    }
    
    private getGenreId(): string {
        return (document.getElementById("genre") as HTMLInputElement).value;
    }
    
    private getContents(): string {
        return (document.getElementById("detail_text") as HTMLInputElement).value;
    }
    
    private getDeadline(): Deadline {
        const date = (document.getElementById("deadline") as HTMLInputElement).value;
        
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