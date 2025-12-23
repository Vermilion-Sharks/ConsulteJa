import prisma from "@config/db";
import type { UUID } from "node:crypto";

class SessaoModel {

    static async buscarRefreshTokenInfoPorUsuarioESessionId(session_id: UUID, usuario_id: UUID, tokenHash: string, dispositivoHash: string){
        const agora = new Date();
        const resultado = await prisma.sessoes.findFirst({
            where: {
                token: tokenHash,
                session_id,
                usuario_id,
                dispositivo_hash: dispositivoHash,
                expira_em: { gt: agora }
            },
            select: {
                lembre_me: true,
                dispositivo_hash: true,
                dispositivo_nome: true,
                usuarios: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        token_version: true
                    }
                }
            }
        });
        return resultado;
    }

    static async buscarSessoesPorUsuarioId(usuario_id: UUID){
        const resultado = await prisma.sessoes.findMany({
            where: {usuario_id},
            select: {
                session_id: true,
                lembre_me: true,
                dispositivo_nome: true,
                data_criacao: true,
                expira_em: true
            },
            orderBy: {data_criacao: 'desc'}
        });
        return resultado;
    }

}

export default SessaoModel;