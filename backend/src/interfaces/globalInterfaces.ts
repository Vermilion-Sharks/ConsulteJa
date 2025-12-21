import type { Request } from 'express';
import type { AcessTokenPayload } from './cookiesInterfaces';

export interface RequestCustomVS extends Request {
    cookies: {
        acessToken?: string;
        refreshToken?: string;
        sessionId?: string;
    };
    user?: AcessTokenPayload;
}

export interface RequestAuthVS extends Request {
    cookies: {
        acessToken: string;
        refreshToken: string;
        sessionId: string;
    };
    user: AcessTokenPayload;
}