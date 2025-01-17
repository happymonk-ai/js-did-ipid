import pify from 'pify';
import crypto from 'libp2p-crypto';
import { Buffer } from 'buffer';
import { createFromPrivKey } from 'peer-id';
import { InvalidDid } from './errors';
import {customRandom, nanoid} from 'nanoid';

export const pemToBuffer = async (pem, password) => {
    const key = await pify(crypto.keys.import)(pem, password);

    return key.bytes;
};

export const generateIpnsName = async (key) => {
    const peerId = await pify(createFromPrivKey)(Buffer.from(key));

    return peerId.toB58String();
};

export const generateDid = async (key) => {
    const identifier = await generateIpnsName(key);

    return `did:ipid:${identifier}`;
};

export const parseDid = (did) => {
    const match = did.match(/did:(\w+):(\w+).*/);

    if (!match) {
        throw new InvalidDid(did);
    }

    return { method: match[1], identifier: match[2] };
};

export const isDidValid = (did) => {
    try {
        parseDid(did);

        return true;
    } catch (err) {
        return false;
    }
};

export const generateRandomString = () =>
    nanoid(36);
