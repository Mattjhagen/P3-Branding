"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJsonRpcResult = exports.formatJsonRpcRequest = exports.payloadId = void 0;
function payloadId() {
    const date = Date.now() * Math.pow(10, 3);
    const extra = Math.floor(Math.random() * Math.pow(10, 3));
    return date + extra;
}
exports.payloadId = payloadId;
function formatJsonRpcRequest(method, params, id) {
    return {
        id: id || payloadId(),
        jsonrpc: "2.0",
        method,
        params,
    };
}
exports.formatJsonRpcRequest = formatJsonRpcRequest;
function formatJsonRpcResult(id, result) {
    return {
        id,
        jsonrpc: "2.0",
        result,
    };
}
exports.formatJsonRpcResult = formatJsonRpcResult;
//# sourceMappingURL=jsonRpcUtils.js.map