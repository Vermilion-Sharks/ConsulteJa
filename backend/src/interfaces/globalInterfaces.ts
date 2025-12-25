import type { Request } from 'express';
import type { AcessTokenPayload } from './cookiesInterfaces';
import { UUID } from 'node:crypto';

export interface RequestCustomVS extends Request {
    cookies: {
        acessToken?: string;
        refreshToken?: string;
        sessionId?: UUID;
    };
    user?: AcessTokenPayload;
}

export interface RequestAuthVS extends Request {
    cookies: {
        acessToken: string;
        refreshToken: string;
        sessionId: UUID;
    };
    user: AcessTokenPayload;
}