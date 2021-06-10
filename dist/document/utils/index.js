Object.defineProperty(exports, '__esModule', { value: true });
exports.assertDocument = exports.generateDocument = exports.isEquivalentId = exports.createId = exports.SEPARATORS = void 0;
const lodash_1 = require('lodash');
const utils_1 = require('../../utils');
const errors_1 = require('../../utils/errors');
const DEFAULT_CONTEXT = 'https://w3id.org/did/v1';

exports.SEPARATORS = {
    PUBLIC_KEY: '#',
    SERVICE: ';',
};
const createId = (did, fragment, separator, options) => {
    const { prefix = '' } = { ...options };

    if (typeof prefix !== 'string' || Object.values(exports.SEPARATORS).some((sep) => prefix.includes(sep))) {
        throw new errors_1.InvalidIdPrefix();
    }
    fragment = fragment || utils_1.generateRandomString();

    return `${did}${separator}${prefix}${fragment}`;
};

exports.createId = createId;
const isEquivalentId = (id1, id2, separator) => {
    if (!lodash_1.isString(id1) || !lodash_1.isString(id2)) {
        return false;
    }
    id1 = id1.includes(separator) ? id1.split(separator)[1] : id1;
    id2 = id2.includes(separator) ? id2.split(separator)[1] : id2;

    return id1 === id2;
};

exports.isEquivalentId = isEquivalentId;
const generateDocument = (did) => ({
    '@context': DEFAULT_CONTEXT,
    id: did,
    created: new Date().toISOString(),
});

exports.generateDocument = generateDocument;
const assertDocument = (content) => {
    if (!lodash_1.isPlainObject(content)) {
        throw new errors_1.InvalidDocument('Document content must be a plain object.');
    }
    const { '@context': context, id } = content;

    if (!context) {
        throw new errors_1.InvalidDocument('Document content must contain "@context" property.');
    } else if (Array.isArray(context)) {
        if (context[0] !== DEFAULT_CONTEXT) {
            throw new errors_1.InvalidDocument(`First "@context" value must be: "${DEFAULT_CONTEXT}". Found: "${context[0]}"`);
        }
    } else if (lodash_1.isString(context)) {
        if (context !== DEFAULT_CONTEXT) {
            throw new errors_1.InvalidDocument(`Document with only one "@context" value must be none other than: "${DEFAULT_CONTEXT}". Found: "${context}"`);
        }
    } else {
        throw new errors_1.InvalidDocument('Document "@context" value must be a string or an ordered set.');
    }
    if (!id) {
        throw new errors_1.InvalidDocument('Document content must contain "id" property.');
    } else if (!utils_1.isDidValid(id)) {
        throw new errors_1.InvalidDocument(`Document "id" must be a valid DID. Found: "${id}"`);
    }
};

exports.assertDocument = assertDocument;
