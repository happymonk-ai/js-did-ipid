const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
};

Object.defineProperty(exports, '__esModule', { value: true });
const index_1 = __importDefault(require('../index'));
const mocks_1 = require('./mocks');

// @ts-ignore
global.Date = class Date {
    constructor() {
        this.toISOString = () => '2019-03-18T15:55:38.636Z';
    }
};
jest.mock('../utils', () => ({
    ...jest.requireActual('../utils'),
    generateRandomString: jest.fn(() => 'randomString'),
}));
let mockIpfs;

beforeEach(() => {
    jest.clearAllMocks();
    mockIpfs = mocks_1.createMockIpfs();
});
describe('factory', () => {
    it('should create ipid with all specification methods', () => {
        const ipid = index_1.default(mockIpfs);

        expect(typeof ipid.resolve).toEqual('function');
        expect(typeof ipid.create).toEqual('function');
        expect(typeof ipid.update).toEqual('function');
    });
    it('should not create ipid if ipfs is not online', () => {
        expect(() => index_1.default({ isOnline: () => false })).toThrow('IPFS node is unavailable');
    });
    it('should account for isOnline not being available (e.g.: using HTTP Client)', () => {
        index_1.default({ isOnline: undefined });
    });
});
describe('resolve', () => {
    it('should resolve successfully', async () => {
        const ipid = index_1.default(mockIpfs);
        const document = await ipid.resolve(mocks_1.mockDid);

        expect(document).toEqual(mocks_1.mockDocument);
        expect(mockIpfs.name.resolve).toHaveBeenCalledTimes(1);
        expect(mockIpfs.name.resolve.mock.calls[0][0]).toEqual(mocks_1.mockIpnsHash);
        expect(mockIpfs.dag.get).toHaveBeenCalledTimes(1);
        expect(mockIpfs.dag.get.mock.calls[0][0]).toEqual(mocks_1.mockHash);
    });
    it('should fail if no ipns record found', async () => {
        const ipfs = { ...mockIpfs, name: { resolve: jest.fn(async () => { throw new Error('foo'); }) } };
        const ipid = index_1.default(ipfs);

        await expect(ipid.resolve(mocks_1.mockDid)).rejects.toThrow('Unable to resolve document with DID: did:ipid:QmUTE4cxTxihntPEFqTprgbqyyS9YRaRcC8FXp6PACEjFG');
        expect(ipfs.name.resolve).toHaveBeenCalledTimes(1);
        expect(ipfs.name.resolve.mock.calls[0][0]).toEqual(mocks_1.mockIpnsHash);
        expect(ipfs.dag.get).toHaveBeenCalledTimes(0);
    });
    it('should fail if can\'t get file', async () => {
        const ipfs = { ...mockIpfs, dag: { get: jest.fn(async () => { throw new Error('foo'); }) } };
        const ipid = index_1.default(ipfs);

        await expect(ipid.resolve(mocks_1.mockDid)).rejects.toThrow('Unable to resolve document with DID: did:ipid:QmUTE4cxTxihntPEFqTprgbqyyS9YRaRcC8FXp6PACEjFG');
        expect(ipfs.name.resolve).toHaveBeenCalledTimes(1);
        expect(ipfs.name.resolve.mock.calls[0][0]).toEqual(mocks_1.mockIpnsHash);
        expect(ipfs.dag.get).toHaveBeenCalledTimes(1);
        expect(ipfs.dag.get.mock.calls[0][0]).toEqual(mocks_1.mockHash);
    });
    it('should fail if document content is invalid', async () => {
        const ipfs = { ...mockIpfs, dag: { get: jest.fn(async () => ({ content: '123' })) } };
        const ipid = index_1.default(ipfs);

        await expect(ipid.resolve(mocks_1.mockDid)).rejects.toThrow('Document content must be a plain object.');
        expect(ipfs.name.resolve).toHaveBeenCalledTimes(1);
        expect(ipfs.name.resolve.mock.calls[0][0]).toEqual(mocks_1.mockIpnsHash);
        expect(ipfs.dag.get).toHaveBeenCalledTimes(1);
        expect(ipfs.dag.get.mock.calls[0][0]).toEqual(mocks_1.mockHash);
    });
});
describe('create', () => {
    it('should create successfully', async () => {
        const operations = jest.fn();
        const ipid = index_1.default(mockIpfs);

        ipid.resolve = jest.fn(() => { throw new Error('foo'); });
        const document = await ipid.create(mocks_1.mockPem, operations);

        expect(ipid.resolve).toHaveBeenCalledTimes(1);
        expect(ipid.resolve).toHaveBeenCalledWith(mocks_1.mockDid);
        expect(operations).toHaveBeenCalledTimes(1);
        expect(operations.mock.calls[0][0].constructor.name).toEqual('Document');
        expect(mockIpfs.key.list).toHaveBeenCalledTimes(2);
        expect(mockIpfs.key.import).toHaveBeenCalledTimes(1);
        expect(mockIpfs.key.import).toHaveBeenCalledWith('js-ipid-randomString', mocks_1.mockPem, undefined);
        expect(mockIpfs.key.rm).toHaveBeenCalledTimes(1);
        expect(mockIpfs.dag.put).toHaveBeenCalledTimes(1);
        expect(mockIpfs.dag.put).toHaveBeenCalledWith(document);
        expect(mockIpfs.name.publish).toHaveBeenCalledTimes(1);
        expect(mockIpfs.name.publish).toHaveBeenCalledWith('/ipfs/zdpuApA2CCoPHQEoP4nResbK2dq2zawFX3verNkMFmNbpDnXZ', { key: 'js-ipid-randomString', lifetime: '87600h', ttl: '87600h' });
    });
    it('should fail if document already exists', async () => {
        const operations = jest.fn();
        const ipid = index_1.default(mockIpfs);

        await expect(ipid.create(mocks_1.mockPem, operations)).rejects.toThrow('Document already exists.');
        expect(operations).toHaveBeenCalledTimes(0);
    });
    it('should fail if a document operation fails', async () => {
        const operations = jest.fn(() => { throw new Error('Operation Failed'); });
        const ipid = index_1.default(mockIpfs);

        ipid.resolve = jest.fn(() => { throw new Error('foo'); });
        await expect(ipid.create(mocks_1.mockPem, operations)).rejects.toThrow('Operation Failed');
        expect(operations).toHaveBeenCalledTimes(1);
    });
});
describe('update', () => {
    it('should update successfully', async () => {
        const operations = jest.fn();
        const ipid = index_1.default(mockIpfs);

        // @ts-ignore
        ipid.resolve = jest.fn(() => mocks_1.mockDocument);
        const document = await ipid.update(mocks_1.mockPem, operations);

        expect(ipid.resolve).toHaveBeenCalledTimes(1);
        expect(ipid.resolve).toHaveBeenCalledWith(mocks_1.mockDid);
        expect(operations).toHaveBeenCalledTimes(1);
        expect(operations.mock.calls[0][0].constructor.name).toEqual('Document');
        expect(mockIpfs.key.list).toHaveBeenCalledTimes(2);
        expect(mockIpfs.key.import).toHaveBeenCalledTimes(1);
        expect(mockIpfs.key.import).toHaveBeenCalledWith('js-ipid-randomString', mocks_1.mockPem, undefined);
        expect(mockIpfs.key.rm).toHaveBeenCalledTimes(1);
        expect(mockIpfs.dag.put).toHaveBeenCalledTimes(1);
        expect(mockIpfs.dag.put).toHaveBeenCalledWith(document);
        expect(mockIpfs.name.publish).toHaveBeenCalledTimes(1);
        expect(mockIpfs.name.publish).toHaveBeenCalledWith('/ipfs/zdpuApA2CCoPHQEoP4nResbK2dq2zawFX3verNkMFmNbpDnXZ', { key: 'js-ipid-randomString', lifetime: '87600h', ttl: '87600h' });
    });
    it('should fail if no document available', async () => {
        const operations = jest.fn();
        const ipid = index_1.default(mockIpfs);

        ipid.resolve = jest.fn(() => { throw new Error('foo'); });
        await expect(ipid.update(mocks_1.mockPem, operations)).rejects.toThrow('foo');
        expect(ipid.resolve).toHaveBeenCalledTimes(1);
        expect(ipid.resolve).toHaveBeenCalledWith(mocks_1.mockDid);
    });
});
