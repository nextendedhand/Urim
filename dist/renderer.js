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
        var todoData = {};
        var render = function () {
            var upm = new urimPlaneManager_1["default"](canvas);
            upm.render(canvas, container);
            upm = null;
        };
        window.onload = render;
        window.addEventListener('resize', render, false);
    })(Renderer = Urim.Renderer || (Urim.Renderer = {}));
})(Urim || (Urim = {}));
//# sourceMappingURL=renderer.js.map