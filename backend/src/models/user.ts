import prisma from "@configs/db";
import type { UUID } from "node:crypto";
import { ClientOrTransaction } from "@schemas/shared/prisma";

class UserModel {

    static async create(name: string, email: string, passwordHash: string, db: ClientOrTransaction = prisma){
        await db.users.create({
            data: {name, email, password: passwordHash}
        });
    }

    static async updateTokenVersionById(id: UUID, db: ClientOrTransaction = prisma){
        await db.users.update({
            data: {
                token_version: {
                    increment: 1
                }
            },
            where: {id}
        })
    }

    static async findLoginInfoByEmail(email: string, db: ClientOrTransaction = prisma){
        const result = await db.users.findUnique({
            where: {email},
            select: {
                id: true,
                name: true,
                password: true,
                token_version: true
            }
        });
        return result;
    }

    static async findTokenVersionById(id: UUID, db: ClientOrTransaction = prisma){
        const result = await db.users.findUnique({
            where: {id},
            select: { token_version: true }
        });
        return result?.token_version;
    }

}

export default UserModel;