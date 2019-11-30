import FormInfoManager from './formInfoManager';
import selectedDataManager from './selectedDataManager';

window.onload = () => {
    const fim = new FormInfoManager();
    const selectDataMng = new selectedDataManager();
    fim.expireForm();
    fim.setPlaceHolder(selectDataMng.getSelectedId());
};

let createBtn = document.getElementById("expire_btn");
createBtn.addEventListener("click", () => {
    const fim = new FormInfoManager();
    if (fim.checkInputFilled()) {
        fim.expireTask(fim.getTaskInfo());
        location.href = '../html/index.html';
    } else {
        // "入力が不足しています"
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    location.href = '../html/index.html';
}, false);


