"use strict";
exports.__esModule = true;
var urimPlaneManager_1 = require("./urimPlaneManager");
var Urim;
(function (Urim) {
    var Renderer;
    (function (Renderer) {
        var container = document.getElementById('urim-plain-container');
        var canvas = document.getElementById('urim-plain');
        // todo情報を読み取る(最初のロード時・todoデータが作成・削除・編集されるたびに実行)
        var toDoDatas = [{
                title: 'hoge',
                importance: 'S',
                urgency: 1,
                id: 0
            }, {
                title: 'fuga',
                importance: 'A',
                urgency: 2,
                id: 1
            }, {
                title: 'piyo',
                importance: 'A',
                urgency: 3,
                id: 2
            }, {
                title: 'huga',
                importance: 'A',
                urgency: 4,
                id: 3
            }, {
                title: 'foge',
                importance: 'B',
                urgency: 5,
                id: 4
            }, {
                title: 'piyo',
                importance: 'C',
                urgency: 6,
                id: 5
            }, {
                title: 'hoge',
                importance: 'A',
                urgency: 11,
                id: 6
            }];
        var render = function () {
            var upm = new urimPlaneManager_1["default"](canvas);
            upm.render(canvas, container, toDoDatas);
            upm = null;
        };
        window.onload = render;
        window.addEventListener('resize', render, false);
    })(Renderer = Urim.Renderer || (Urim.Renderer = {}));
})(Urim || (Urim = {}));
//# sourceMappingURL=renderer.js.map