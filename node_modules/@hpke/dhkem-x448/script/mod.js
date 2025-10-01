(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./src/dhkemX448.js", "./src/hkdfSha512.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HkdfSha512 = exports.X448 = exports.DhkemX448HkdfSha512 = void 0;
    var dhkemX448_js_1 = require("./src/dhkemX448.js");
    Object.defineProperty(exports, "DhkemX448HkdfSha512", { enumerable: true, get: function () { return dhkemX448_js_1.DhkemX448HkdfSha512; } });
    Object.defineProperty(exports, "X448", { enumerable: true, get: function () { return dhkemX448_js_1.X448; } });
    var hkdfSha512_js_1 = require("./src/hkdfSha512.js");
    Object.defineProperty(exports, "HkdfSha512", { enumerable: true, get: function () { return hkdfSha512_js_1.HkdfSha512; } });
});
