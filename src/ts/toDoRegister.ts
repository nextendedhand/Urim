import FormInfoManager from './formInfoManager';

window.onload = () => {
    const fim = new FormInfoManager();
    fim.expireRegisterForm();
};

let createBtn = document.getElementById("create_btn");
createBtn.addEventListener("click", () => {
    const fim = new FormInfoManager();
    if (!fim.IsNeededItemFilled()) {
        // input is needed
    } else if(!fim.IsDeadlineFuture()) {
        console.log("deadline is past");
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


