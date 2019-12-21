import FormInfoManager from './formInfoManager';

window.onload = () => {
    const fim = new FormInfoManager();
    fim.expireRegisterForm();
};

let createBtn = document.getElementById("create_btn");
createBtn.addEventListener("click", () => {
    const fim = new FormInfoManager();
    const titleAlarm = document.getElementById("title_alarm") as HTMLInputElement;
    const deadlineAlarm = document.getElementById("deadline_alarm") as HTMLInputElement;
    titleAlarm.innerText="";
    deadlineAlarm.innerText="";
    if (!fim.IsTitleFilled() || !fim.IsDeadlineFilled()){
        if (!fim.IsTitleFilled()) {
            titleAlarm.innerText="入力必須の項目です";
        }
        if (!fim.IsDeadlineFilled()) {
            deadlineAlarm.innerText="入力必須の項目です";
        }
    } else if(!fim.IsDeadlineFuture()) {
        deadlineAlarm.innerText="締切には過去の日付を設定できません";
    } else {
       // successfully input
       fim.registerTask(fim.getTaskInfo());
       history.back();
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    history.back();
}, false);


