const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
};

Object.defineProperty(exports, '__esModule', { value: true });
exports.generateRandomString = exports.isDidValid = exports.parseDid = exports.generateDid = exports.generateIpnsName = exports.pemToBuffer = void 0;
const pify_1 = __importDefault(require('pify'));
const libp2p_crypto_1 = __importDefault(require('libp2p-crypto'));
const buffer_1 = require('buffer');
const peer_id_1 = require('peer-id');
const errors_1 = require('./errors');
const pemToBuffer = async (pem, password) => {
    const key = await pify_1.default(libp2p_crypto_1.default.keys.import)(pem, password);

    return key.bytes;
};

exports.pemToBuffer = pemToBuffer;
const generateIpnsName = async (key) => {
    const peerId = await pify_1.default(peer_id_1.createFromPrivKey)(buffer_1.Buffer.from(key));

    return peerId.toB58String();
};

exports.generateIpnsName = generateIpnsName;
const generateDid = async (key) => {
    const identifier = await exports.generateIpnsName(key);

    return `did:ipid:${identifier}`;
};

exports.generateDid = generateDid;
const parseDid = (did) => {
    const match = did.match(/did:(\w+):(\w+).*/);

    if (!match) {
        throw new errors_1.InvalidDid(did);
    }

    return { method: match[1], identifier: match[2] };
};

exports.parseDid = parseDid;
const isDidValid = (did) => {
    try {
        exports.parseDid(did);

        return true;
    } catch (err) {
        return false;
    }
};

exports.isDidValid = isDidValid;
const generateRandomString = () => Math.random()
.toString(36)
.substring(2);

exports.generateRandomString = generateRandomString;
