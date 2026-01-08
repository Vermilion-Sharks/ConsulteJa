import prisma from "@configs/db";
import type { UUID } from "node:crypto";
import { ClientOrTransaction } from "@schemas/shared/prisma";

class CjapiModel {

    static async create(userId: UUID, apiKeyHash: string, db: ClientOrTransaction = prisma){
        const result = await db.cj_apis.create({
            data: {
                usuario_id: userId,
                api_key: apiKeyHash
            },
            select: {
                id: true
            }
        });
        return result;
    }

    static async updateApiKeyByIdAndUserId(id: UUID, userId: UUID, apiKeyHash: string, db: ClientOrTransaction = prisma){
        await db.cj_apis.update({
            data: { api_key: apiKeyHash },
            where: { id, usuario_id: userId }
        })
    }

    static async findManyByUserId(userId: UUID, db: ClientOrTransaction = prisma){
        const result = await db.cj_apis.findMany({
            select: {
                id: true,
                ativa: true,
                data_criacao: true,
                data_atualizacao: true,
                data_desativacao: true,
                ultimo_uso: true
            },
            where: {usuario_id: userId}
        });
        return result;
    }

    static async findByIdAndUserId(id: UUID, userId: UUID, db: ClientOrTransaction = prisma){
        const result = await db.cj_apis.findUnique({
            select: {
                ativa: true,
                data_criacao: true,
                data_atualizacao: true,
                data_desativacao: true,
                ultimo_uso: true
            },
            where: {
                id, usuario_id: userId
            }
        });
        return result;
    }

}

export default CjapiModel;