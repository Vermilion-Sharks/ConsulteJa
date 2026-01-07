import type { UUID } from 'crypto';

export interface AccessTokenPayload {
    id: UUID;
    name: string;
    email: string;
    tokenVersion: number;
}

export type SessionId = UUID;