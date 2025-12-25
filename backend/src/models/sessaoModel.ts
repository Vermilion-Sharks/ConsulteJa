import prisma from "@config/db";
import type { UUID } from "node:crypto";

class SessaoModel {

    static async criarEDeletarAnterior(refreshTokenHash: string, usuarioId: UUID, lembreMe: boolean, dispositivoNome: string, dispositivoHash: string, expiraEm: Date, newSessionId: UUID, oldSessionId?: UUID){
        await prisma.$transaction(async(tx)=>{
            if(oldSessionId) await tx.sessoes.deleteMany({
                where: {
                    session_id: oldSessionId,
                    usuario_id: usuarioId
                }
            });

            await tx.sessoes.create({
                data: {
                    expira_em: expiraEm,
                    token: refreshTokenHash,
                    session_id: newSessionId,
                    usuario_id: usuarioId,
                    lembre_me: lembreMe,
                    dispositivo_nome: dispositivoNome,
                    dispositivo_hash: dispositivoHash
                }
            });
        });
    }

    static async deletarPorUsuarioESessionId(sessionId: UUID, usuarioId: UUID){
        await prisma.sessoes.deleteMany({
            where: {
                session_id: sessionId,
                usuario_id: usuarioId
            }
        });
    }

    static async deletarVariasERevogarPorUsuarioId(usuarioId: UUID){
        await prisma.$transaction(async (tx)=>{
            await tx.sessoes.deleteMany({
                where: {
                    usuario_id: usuarioId
                }
            });
            await tx.usuarios.update({
                where: {
                    id: usuarioId
                },
                data: {
                    token_version: {
                        increment: 1
                    }
                }
            });
        });
    }

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