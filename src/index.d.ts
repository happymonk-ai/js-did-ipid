export function getDid(pem: any): Promise<string>;
export default createIpid;
declare function createIpid(ipfs: any, { lifetime }?: {
    lifetime: any;
}): Ipid;
declare class Ipid {
    constructor(ipfs: any, lifetime: any);
    resolve(did: any): Promise<any>;
    create(pem: any, operations: any): Promise<any>;
    update(pem: any, operations: any): Promise<any>;
    #private;
}
//# sourceMappingURL=index.d.ts.map