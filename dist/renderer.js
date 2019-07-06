"use strict";
exports.__esModule = true;
var urimPlaneManager_1 = require("./urimPlaneManager");
var container = document.getElementById('urim-plain-container');
var canvas = document.getElementById('urim-plain');
// todo情報を読み取る(最初のロード時・todoデータが作成・削除・編集されるたびに実行)
var toDoDatas = [{
        title: 'hoge',
        importance: 'S',
        urgency: 1,
        today: true,
        id: '9SPpJfkb32'
    }, {
        title: 'fuga',
        importance: 'A',
        urgency: 2,
        today: true,
        id: '9SPpdgrkb3'
    }, {
        title: 'piyo',
        importance: 'A',
        urgency: 3,
        today: false,
        id: 'fdsfdskb32'
    }, {
        title: 'huga',
        importance: 'A',
        urgency: 4,
        today: true,
        id: 'hogefuga31'
    }, {
        title: 'foge',
        importance: 'B',
        urgency: 5,
        today: false,
        id: 'piyoSdfe32'
    }, {
        title: 'piyo',
        importance: 'C',
        urgency: 6,
        today: true,
        id: 'dskrj42edf'
    }, {
        title: 'hoge',
        importance: 'A',
        urgency: 11,
        today: false,
        id: 'fdspIRW3Sd'
    }];
var upm;
var toDoTips;
var render = function () {
    upm = new urimPlaneManager_1["default"](canvas, toDoDatas);
    var ctx = upm.setupCanvas(canvas);
    toDoTips = upm.createToDoTips(canvas, toDoDatas);
    upm.render(canvas, ctx, toDoTips);
};
// 無名関数の部分はtoggleToday関数作成する
canvas.addEventListener('click', function (e) {
    var canvasRect = canvas.getBoundingClientRect();
    var point = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top
    };
    // クリック判定処理
    toDoTips.forEach(function (toDoTip) {
        console.log(toDoTip.left);
    });
});
window.onload = render;
window.addEventListener('resize', render, false);
//# sourceMappingURL=renderer.js.map