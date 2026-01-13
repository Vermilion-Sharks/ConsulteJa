import type { Request } from 'express';
import type { AccessTokenPayload, SessionId } from './cookiesSchema';
import { IncomingHttpHeaders } from 'node:http';
import type { UUID } from 'node:crypto';

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

export interface RequestCjApi extends Request {
    cjapiId?: UUID
}

export interface RequestAuthCjApi extends Request {
    cjapiId: UUID
}