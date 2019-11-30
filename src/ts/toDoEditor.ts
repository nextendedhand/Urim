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
    if (fim.checkInputFilled()) {
        fim.expireTask(fim.getTaskInfo(), selectDataMng.getSelectedId());
        history.back();
    } else {
        // "入力が不足しています"
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    history.back();
}, false);


