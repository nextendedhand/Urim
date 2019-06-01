"use strict";
exports.__esModule = true;
var urimPlaneManager_1 = require("./urimPlaneManager");
var container = document.getElementById('urim-plain-container');
var canvas = document.getElementById('urim-plain');
var urimPlane = new urimPlaneManager_1["default"](canvas);
var render = function () {
    urimPlane.render(canvas, container);
};
window.onload = render;
window.addEventListener('resize', render, false);
//# sourceMappingURL=renderer.js.map