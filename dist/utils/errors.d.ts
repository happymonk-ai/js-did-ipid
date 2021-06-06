export class BaseError extends Error {
    constructor(message: any, code: any, props: any);
}
export class DuplicateAuthentication extends BaseError {
    constructor(id: any);
}
export class InvalidAuthentication extends BaseError {
    constructor(message: any);
}
export class DuplicatePublicKey extends BaseError {
    constructor(id: any);
}
export class InvalidPublicKey extends BaseError {
    constructor(message: any);
}
export class DuplicateService extends BaseError {
    constructor(id: any);
}
export class InvalidService extends BaseError {
    constructor(message: any);
}
export class InvalidDid extends BaseError {
}
export class IllegalCreate extends BaseError {
    constructor(message: any);
}
export class UnavailableIpfs extends BaseError {
    constructor(message: any);
}
export class InvalidDocument extends BaseError {
    constructor(message: any);
}
export class InvalidIdPrefix extends BaseError {
    constructor();
}
//# sourceMappingURL=errors.d.ts.map