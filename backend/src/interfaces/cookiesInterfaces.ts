import { UUID } from 'crypto';

export interface AcessTokenPayload {
    id: UUID;
    nome: string;
    email: string;
    tokenVersion: number;
}