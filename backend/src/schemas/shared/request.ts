import type { Request } from 'express';
import type { AccessTokenPayload, SessionId } from './cookies';

export interface RequestCustomVS extends Request {
    cookies: {
        accessToken?: string;
        refreshToken?: string;
        sessionId?: SessionId;
    };
    user?: AccessTokenPayload;
}

export interface RequestAuthVS extends Request {
    cookies: {
        accessToken: string;
        refreshToken: string;
        sessionId: SessionId;
    };
    user: AccessTokenPayload;
}