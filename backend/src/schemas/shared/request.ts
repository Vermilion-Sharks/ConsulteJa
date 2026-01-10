import type { Request } from 'express';
import type { AccessTokenPayload, SessionId } from './cookies';
import { IncomingHttpHeaders } from 'node:http';

export interface RequestCustomVS extends Request {
    cookies: {
        accessToken?: string;
        refreshToken?: string;
        sessionId?: SessionId;
    };
    user?: AccessTokenPayload;
    headers: IncomingHttpHeaders & {
        'x-fingerprint-visitorid'?: string;
    };
}

export interface RequestAuthVS extends Request {
    cookies: {
        accessToken: string;
        refreshToken: string;
        sessionId: SessionId;
    };
    user: AccessTokenPayload;
    headers: IncomingHttpHeaders & {
        'x-fingerprint-visitorid'?: string;
    };
}