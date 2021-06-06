export namespace SEPARATORS {
    const PUBLIC_KEY: string;
    const SERVICE: string;
}
export function createId(did: any, fragment: any, separator: any, options: any): string;
export function isEquivalentId(id1: any, id2: any, separator: any): boolean;
export function generateDocument(did: any): {
    '@context': string;
    id: any;
    created: string;
};
export function assertDocument(content: any): void;
//# sourceMappingURL=index.d.ts.map