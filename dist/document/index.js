"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertDocument = void 0;
// @ts-ignore
const lodash_1 = require("lodash");
const service_1 = __importDefault(require("./service"));
const publicKey_1 = __importDefault(require("./publicKey"));
const authentication_1 = __importDefault(require("./authentication"));
const utils_1 = require("./utils");
Object.defineProperty(exports, "assertDocument", { enumerable: true, get: function () { return utils_1.assertDocument; } });
class Document {
    constructor(content) {
        this.#refreshUpdated = () => {
            this.#content.updated = new Date().toISOString();
        };
        this.#content = {
            publicKey: [],
            authentication: [],
            service: [],
            ...content,
        };
    }
    #content;
    getContent() {
        return lodash_1.omitBy(this.#content, (prop) => lodash_1.isUndefined(prop) || (lodash_1.isArray(prop) && prop.length === 0));
    }
    addPublicKey(props, ...options) {
        // @ts-ignore
        const { idPrefix } = { ...options };
        props.id = publicKey_1.default.createId(this.#content.id, props.id, { prefix: idPrefix });
        props.controller = props.controller || this.#content.id;
        publicKey_1.default.assert(props, this.#content.publicKey);
        this.#content.publicKey.push(props);
        this.#refreshUpdated();
        return props;
    }
    revokePublicKey(id) {
        const filter = this.#content.publicKey.filter((key) => !utils_1.isEquivalentId(key.id, id, publicKey_1.default.separator));
        if (this.#content.publicKey.length === filter.length) {
            return;
        }
        this.removeAuthentication(id);
        this.#content.publicKey = filter;
        this.#refreshUpdated();
    }
    addAuthentication(auth) {
        const key = this.#content.publicKey.find((pk) => utils_1.isEquivalentId(pk.id, auth, publicKey_1.default.separator)) || {};
        authentication_1.default.assert(key.id, this.#content.authentication);
        this.#content.authentication.push(key.id);
        this.#refreshUpdated();
        return key.id;
    }
    removeAuthentication(id) {
        const filter = this.#content.authentication.filter((auth) => !utils_1.isEquivalentId(id, authentication_1.default.parseId(auth), publicKey_1.default.separator));
        if (this.#content.authentication.length === filter.length) {
            return;
        }
        this.#content.authentication = filter;
        this.#refreshUpdated();
    }
    addService(props, options) {
        // @ts-ignore
        const { idPrefix } = { ...options };
        props.id = service_1.default.createId(this.#content.id, props.id, { prefix: idPrefix });
        service_1.default.assert(props, this.#content.service);
        this.#content.service.push(props);
        this.#refreshUpdated();
        return props;
    }
    removeService(id) {
        const filter = this.#content.service.filter((srvc) => !utils_1.isEquivalentId(srvc.id, id, service_1.default.separator));
        if (this.#content.service.length === filter.length) {
            return;
        }
        this.#content.service = filter;
        this.#refreshUpdated();
    }
    #refreshUpdated;
}
const createDocument = (did, content) => {
    if (!content) {
        content = utils_1.generateDocument(did);
    }
    return new Document(content);
};
exports.default = createDocument;
