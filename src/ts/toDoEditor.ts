import FormInfoManager from './formInfoManager';
import selectedDataManager from './selectedDataManager';

window.onload = () => {
    const fim = new FormInfoManager();
    const selectDataMng = new selectedDataManager();
    fim.expireEditForm(selectDataMng.getSelectedId());
};

let createBtn = document.getElementById("expire_btn");
createBtn.addEventListener("click", () => {
    const fim = new FormInfoManager();
    const selectDataMng = new selectedDataManager();
    const titleAlarm = document.getElementById("title_alarm") as HTMLInputElement;
    const deadlineAlarm = document.getElementById("deadline_alarm") as HTMLInputElement;
    titleAlarm.innerText = "";
    deadlineAlarm.innerText = "";
    if (!fim.IsTitleFilled() || !fim.IsDeadlineFilled()) {
        if (!fim.IsTitleFilled()) {
            titleAlarm.innerText = "入力必須の項目です";
        }
        if (!fim.IsDeadlineFilled()) {
            deadlineAlarm.innerText = "入力必須の項目です";
        }
    } else {
        // 編集画面では締切が過去の日付でも許容している
        // successfully input
        fim.expireTask(fim.getTaskInfo(), selectDataMng.getSelectedId());
        history.back();
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    history.back();
}, false);
