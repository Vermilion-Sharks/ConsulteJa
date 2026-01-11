import type { UUID } from "node:crypto";

export interface LoginService {
    email: string;
    password: string;
    rememberMe: boolean;
    userAgent: string;
    visitorId: string;
    ip: string;
    oldSessionId?: UUID
}

export interface CreateSessionDataService {
    id: UUID;
    name: string;
    tokenVersion: number;
    userAgent: string;
    ip: string;
    visitorId: string;
    rememberMe: boolean;
    email: string;
}

export interface GoogleLoginService {
    idToken: string;
    userAgent: string;
    visitorId: string;
    ip: string;
    oldSessionId?: UUID
}