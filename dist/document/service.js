"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const errors_1 = require("../utils/errors");
const SEPARATOR = utils_1.SEPARATORS.SERVICE;
const REQUIRED = ['type', 'serviceEndpoint'];
const assertId = (service, services) => {
    const collision = services.find((key) => utils_1.isEquivalentId(key.id, service.id, SEPARATOR));
    if (collision) {
        throw new errors_1.DuplicateService(service.id);
    }
};
const assertRequired = (publicKey) => {
    REQUIRED.forEach((key) => {
        if (!publicKey[key]) {
            throw new errors_1.InvalidService(`Service requires \`${key}\` to be defined.`);
        }
    });
};
const assert = (service, services) => {
    assertId(service, services);
    assertRequired(service);
};
exports.default = {
    assert,
    separator: SEPARATOR,
    createId: (did, fragment, options) => utils_1.createId(did, fragment, SEPARATOR, options),
};
