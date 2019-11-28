import FormInfoManager from './formInfoManager';

window.onload = () => {
    const fim = new FormInfoManager();
    fim.expireForm();
};

let createBtn = document.getElementById("create_btn");
createBtn.addEventListener("click", () => {
    const fim = new FormInfoManager();
    if (fim.checkInputFilled()) {
        fim.registerTask(fim.getTaskInfo());
        location.href = '../html/index.html';
    } else {
        // "入力が不足しています"
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    location.href = '../html/index.html';
}, false);


