"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const errors_1 = require("../utils/errors");
const SEPARATOR = utils_1.SEPARATORS.PUBLIC_KEY;
const REQUIRED = ['id', 'type', 'controller'];
const ENCODINGS = [
    'publicKeyPem',
    'publicKeyJwk',
    'publicKeyHex',
    'publicKeyBase64',
    'publicKeyBase58',
    'publicKeyMultibase',
];
const assertId = (publicKey, publicKeys) => {
    const collision = publicKeys.some((key) => utils_1.isEquivalentId(key.id, publicKey.id, SEPARATOR));
    if (collision) {
        throw new errors_1.DuplicatePublicKey(publicKey.id);
    }
};
const assertRequired = (publicKey) => {
    REQUIRED.forEach((key) => {
        if (!publicKey[key]) {
            throw new errors_1.InvalidPublicKey(`PublicKey requires \`${key}\` to be defined.`);
        }
    });
};
const assertEncodings = (publicKey) => {
    const encodings = Object.keys(publicKey).filter((key) => key.includes('publicKey'));
    if (encodings.length !== 1) {
        throw new errors_1.InvalidPublicKey('Property prefixed by `publicKey` is required and must be unique');
    }
    if (!ENCODINGS.includes(encodings[0])) {
        throw new errors_1.InvalidPublicKey(`Encoding \`${encodings[0]}\` is invalid`);
    }
};
const assert = (publicKey, publicKeys) => {
    assertId(publicKey, publicKeys);
    assertRequired(publicKey);
    assertEncodings(publicKey);
};
exports.default = {
    assert,
    separator: SEPARATOR,
    createId: (did, fragment, options) => utils_1.createId(did, fragment, SEPARATOR, options),
};
