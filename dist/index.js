"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDid = void 0;
const document_1 = __importStar(require("./document"));
const utils_1 = require("./utils");
const errors_1 = require("./utils/errors");
class Ipid {
    constructor(ipfs, lifetime) {
        this.#publish = async (pem, content) => {
            const keyName = this.#generateKeyName();
            await this.#importKey(keyName, pem);
            try {
                const cid = await this.#ipfs.dag.put(content);
                const path = `/ipfs/${cid.toBaseEncodedString()}`;
                await this.#ipfs.name.publish(path, {
                    lifetime: this.#lifetime,
                    ttl: this.#lifetime,
                    key: keyName,
                });
                return content;
            }
            finally {
                await this.#removeKey(keyName);
            }
        };
        this.#removeKey = async (keyName) => {
            const keysList = await this.#ipfs.key.list();
            const hasKey = keysList.some(({ name }) => name === keyName);
            if (!hasKey) {
                return;
            }
            await this.#ipfs.key.rm(keyName);
        };
        this.#importKey = async (keyName, pem, password) => {
            await this.#removeKey(keyName);
            await this.#ipfs.key.import(keyName, pem, password);
        };
        this.#generateKeyName = () => `js-ipid-${utils_1.generateRandomString()}`;
        this.#ipfs = ipfs;
        this.#lifetime = lifetime || '87600h';
    }
    #ipfs;
    #lifetime;
    async resolve(did) {
        const { identifier } = utils_1.parseDid(did);
        try {
            const { path } = await this.#ipfs.name.resolve(identifier);
            const cidStr = path.replace(/^\/ipfs\//, '');
            const { value: content } = await this.#ipfs.dag.get(cidStr);
            document_1.assertDocument(content);
            return content;
        }
        catch (err) {
            if (err.code === 'INVALID_DOCUMENT') {
                throw err;
            }
            throw new errors_1.InvalidDid(did, `Unable to resolve document with DID: ${did}`, { originalError: err.message });
        }
    }
    async create(pem, operations) {
        const did = await exports.getDid(pem);
        try {
            await this.resolve(did);
        }
        catch (err) {
            const document = document_1.default(did);
            operations(document);
            return this.#publish(pem, document.getContent());
        }
        throw new errors_1.IllegalCreate();
    }
    async update(pem, operations) {
        const did = await exports.getDid(pem);
        const content = await this.resolve(did);
        const document = document_1.default(did, content);
        operations(document);
        return this.#publish(pem, document.getContent());
    }
    #publish;
    #removeKey;
    #importKey;
    #generateKeyName;
}
const getDid = async (pem) => {
    const key = await utils_1.pemToBuffer(pem);
    return utils_1.generateDid(key);
};
exports.getDid = getDid;
// @ts-ignore
const createIpid = (ipfs, { lifetime } = {}) => {
    if (typeof ipfs.isOnline === 'function' && !ipfs.isOnline()) {
        throw new errors_1.UnavailableIpfs();
    }
    return new Ipid(ipfs, lifetime);
};
exports.default = createIpid;
