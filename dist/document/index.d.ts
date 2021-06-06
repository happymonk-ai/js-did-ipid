export { assertDocument };
export default createDocument;
import { assertDocument } from "./utils";
declare function createDocument(did: any, content: any): Document;
declare class Document {
    constructor(content: any);
    getContent(): any;
    addPublicKey(props: any, ...options: any[]): any;
    revokePublicKey(id: any): void;
    addAuthentication(auth: any): any;
    removeAuthentication(id: any): void;
    addService(props: any, options: any): any;
    removeService(id: any): void;
    #private;
}
//# sourceMappingURL=index.d.ts.map