Object.defineProperty(exports, '__esModule', { value: true });
const lodash_1 = require('lodash');
const errors_1 = require('../utils/errors');
const parseId = (authentication) => lodash_1.isPlainObject(authentication) ? authentication.id : authentication;
const assertId = (id, authentications) => {
    const collision = authentications.some((auth) => parseId(auth) === id);

    if (collision) {
        throw new errors_1.DuplicateAuthentication(id);
    }
};
const assertType = (authentication) => {
    if (!lodash_1.isString(authentication)) {
        throw new errors_1.InvalidAuthentication();
    }
};
const assert = (authentication, authentications) => {
    assertType(authentication);
    assertId(parseId(authentication), authentications);
};

exports.default = {
    assert,
    parseId,
};
