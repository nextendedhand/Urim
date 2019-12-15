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
    if (!fim.IsNeededItemFilled()) {
        // input is needed
    } else if(!fim.IsDeadlineFuture()) {
        console.log("deadline is past");
    } else {
        // successfully input
        fim.expireTask(fim.getTaskInfo(), selectDataMng.getSelectedId());
        history.back();
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    history.back();
}, false);


