"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimUncompressedPrefix = exports.ensureUncompressed = exports.ensureCompressed = exports.isCompressed = exports.computeSharedSecret = void 0;
var address_1 = require("@celo/base/lib/address");
var crypto_1 = require("crypto");
function computeSharedSecret(privateKey, publicKey) {
    var ecdh = (0, crypto_1.createECDH)('secp256k1');
    ecdh.setPrivateKey(Buffer.from((0, address_1.trimLeading0x)(privateKey), 'hex'));
    return ecdh.computeSecret(Buffer.from(ensureCompressed(publicKey), 'hex'));
}
exports.computeSharedSecret = computeSharedSecret;
function isCompressed(publicKey) {
    var noLeading0x = (0, address_1.trimLeading0x)(publicKey);
    if (noLeading0x.length === 64) {
        return true;
    }
    return noLeading0x.length === 66 && (noLeading0x.startsWith('02') || noLeading0x.startsWith('03'));
}
exports.isCompressed = isCompressed;
function ensureCompressed(publicKey) {
    // NOTE: elliptic is disabled elsewhere in this library to prevent
    // accidental signing of truncated messages.
    // tslint:disable-next-line:import-blacklist
    var EC = require('elliptic').ec;
    var ec = new EC('secp256k1');
    return ec.keyFromPublic(ensureUncompressedPrefix(publicKey), 'hex').getPublic(true, 'hex');
}
exports.ensureCompressed = ensureCompressed;
function ensureUncompressed(publicKey) {
    var noLeading0x = (0, address_1.trimLeading0x)(publicKey);
    // NOTE: elliptic is disabled elsewhere in this library to prevent
    // accidental signing of truncated messages.
    // tslint:disable-next-line:import-blacklist
    var EC = require('elliptic').ec;
    var ec = new EC('secp256k1');
    var uncompressed = ec
        .keyFromPublic(ensureUncompressedPrefix(noLeading0x), 'hex')
        .getPublic(false, 'hex');
    return uncompressed;
}
exports.ensureUncompressed = ensureUncompressed;
function trimUncompressedPrefix(publicKey) {
    var noLeading0x = (0, address_1.trimLeading0x)(publicKey);
    if (noLeading0x.length === 130 && noLeading0x.startsWith('04')) {
        return noLeading0x.slice(2);
    }
    return noLeading0x;
}
exports.trimUncompressedPrefix = trimUncompressedPrefix;
function ensureUncompressedPrefix(publicKey) {
    var noLeading0x = (0, address_1.trimLeading0x)(publicKey);
    if (noLeading0x.length === 128) {
        return "04".concat(noLeading0x);
    }
    return noLeading0x;
}
//# sourceMappingURL=ecdh.js.map