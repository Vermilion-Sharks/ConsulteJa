import prisma from "@config/db";
import type { UUID } from "node:crypto";

class ApisModel {

    static async criar(apiKey: string, usuarioId: UUID){
        const resultado = await prisma.apis.create({
            data: {
                api_key: apiKey,
                usuario_id: usuarioId
            },
            select: {
                id: true
            }
        });
        return resultado;
    }


    static async atualizarApiKeyPorIdEUsuario(apiKey: string, id: UUID, usuarioId: UUID){
        await prisma.apis.update({
            data: {
                api_key: apiKey
            },
            where: {
                id,
                usuario_id: usuarioId,
                ativa: true
            }
        });
    }

    static async buscarApisAtivasPorUsuarioId(usuario_id: UUID){
        const resultado = await prisma.apis.findMany({
            select: {
                id: true,
                data_criacao: true,
                data_atualizacao: true,
                ultimo_uso: true
            },
            where: {
                usuario_id,
                ativa: true
            },
            orderBy: {
                data_atualizacao: 'desc'
            }
        });
        return resultado;
    }

    static async buscarApisPorUsuarioId(usuario_id: UUID){
        const resultado = await prisma.apis.findMany({
            select: {
                id: true,
                data_criacao: true,
                data_atualizacao: true,
                ultimo_uso: true,
                ativa: true,
                data_desativacao: true,
                // produtos: {
                //     select: {
                //         id: true,
                //         codigo: true,
                //         nome: true,
                //         marca: true,
                //         descricao: true,
                //         preco: true,
                //         imagem: true,
                //         importado: true,
                //         data_criacao: true,
                //         data_atualizacao: true
                //     }
                // }
            },
            where: {usuario_id},
            orderBy: {
                ativa: 'desc',
                data_atualizacao: 'desc'
            }
        });
        return resultado;
    }

}

export default ApisModel;