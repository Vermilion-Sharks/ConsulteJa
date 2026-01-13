import prisma from "@configs/db";
import { ClientOrTransaction } from "@schemas/shared/prismaSchema";
import type { UUID } from "node:crypto";

class SessionModel {

    static async create(userId: UUID, tokenHash: string, sessionId: UUID, remembreMe: boolean, deviceName: string, deviceHash: string, expiresIn: Date, db: ClientOrTransaction = prisma){
        await db.sessions.create({
            data: {
                user_id: userId,
                token: tokenHash,
                session_id: sessionId,
                remember_me: remembreMe,
                device_name: deviceName,
                device_hash: deviceHash,
                expires_in: expiresIn
            }
        });
    }

    static async deleteByUserAndSessionId(userId: UUID, sessionId: UUID, db: ClientOrTransaction = prisma){
        await db.sessions.deleteMany({
            where: {
                user_id: userId,
                session_id: sessionId
            }
        });
    }

    static async deleteManyByUserId(userId: UUID, db: ClientOrTransaction = prisma){
        await db.sessions.deleteMany({
            where: {
                user_id: userId
            }
        });
    }

    static async deleteByUserIdAndDeviceHash(userId: UUID, deviceHash: string, db: ClientOrTransaction = prisma){
        await db.sessions.deleteMany({
            where: {
                user_id: userId,
                device_hash: deviceHash
            }
        });
    }

    static async findInfoByUserAndSessionId(userId: UUID, sessionId: UUID, db: ClientOrTransaction = prisma){
        const now = new Date();
        const result = await db.sessions.findFirst({
            where: {
                session_id: sessionId,
                user_id: userId,
                expires_in: { gt: now }
            },
            select: {
                remember_me: true,
                device_hash: true,
                device_name: true,
                token: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        token_version: true
                    }
                }
            }
        });
        return result;
    }

    static async findManyByUserId(userId: UUID){
        const now = new Date();
        const result = await prisma.sessions.findMany({
            where: {
                user_id: userId,
                expires_in: { gt: now }
            },
            select: {
                session_id: true,
                remember_me: true,
                device_name: true,
                created_at: true,
                expires_in: true
            },
            orderBy: {created_at: 'desc'}
        });
        return result;
    }

}

export default SessionModel;