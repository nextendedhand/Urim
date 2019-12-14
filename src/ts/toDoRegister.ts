import FormInfoManager from './formInfoManager';

window.onload = () => {
    const fim = new FormInfoManager();
    fim.expireRegisterForm();
};

let createBtn = document.getElementById("create_btn");
createBtn.addEventListener("click", () => {
    const fim = new FormInfoManager();
    if (fim.IsDeadlineFuture()) {
        fim.registerTask(fim.getTaskInfo());
        history.back();
    } else {
        console.log("deadline is past");
    }
}, false);

let cancelBtn = document.getElementById("cancel_btn");
cancelBtn.addEventListener("click", () => {
    history.back();
}, false);


