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
        id: '9SPpJfkb32'
    }, {
        title: 'fuga',
        importance: 'A',
        urgency: 2,
        id: '9SPpdgrkb3'
    }, {
        title: 'piyo',
        importance: 'A',
        urgency: 3,
        id: 'fdsfdskb32'
    }, {
        title: 'huga',
        importance: 'A',
        urgency: 4,
        id: 'hogefuga31'
    }, {
        title: 'foge',
        importance: 'B',
        urgency: 5,
        id: 'piyoSdfe32'
    }, {
        title: 'piyo',
        importance: 'C',
        urgency: 6,
        id: 'dskrj42edf'
    }, {
        title: 'hoge',
        importance: 'A',
        urgency: 11,
        id: 'fdspIRW3Sd'
    }];
var render = function () {
    var upm = new urimPlaneManager_1["default"](canvas);
    upm.render(canvas, container, toDoDatas);
    upm = null;
};
window.onload = render;
window.addEventListener('resize', render, false);
//# sourceMappingURL=renderer.js.map