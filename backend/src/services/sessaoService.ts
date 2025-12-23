import prisma from "@config/db";
import { UUID, createHash } from "node:crypto";

class SessaoService {

    static async criarNovaSessao(newRefreshToken: string, usuario_id: UUID, lembre_me: boolean, dispositivo_nome: string, dispositivo_hash: string, newSessionId: UUID, oldSessionId?: UUID){
        await prisma.$transaction(async(tx)=>{
            if(oldSessionId) await tx.sessoes.deleteMany({
                where: {
                    session_id: oldSessionId,
                    usuario_id
                }
            });

            const expira_em = lembre_me ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 2 * 60 * 60 * 1000);
            const refreshHash = createHash('sha256').update(newRefreshToken).digest('hex');
            await tx.sessoes.create({
                data: {
                    expira_em,
                    token: refreshHash,
                    session_id: newSessionId,
                    usuario_id,
                    lembre_me,
                    dispositivo_nome,
                    dispositivo_hash
                }
            })
        })
    }

    static async encerrarSessao(session_id: UUID, usuario_id: UUID){
        await prisma.sessoes.deleteMany({
            where: {
                session_id,
                usuario_id
            }
        })
    }

    static async encerrarTodasSessoes(usuario_id: UUID){
        await prisma.$transaction(async (tx)=>{
            await tx.sessoes.deleteMany({
                where: {usuario_id}
            });
            await tx.usuarios.update({
                where: {id: usuario_id},
                data: {
                    token_version: {
                        increment: 1
                    }
                }
            });
        });
    }

}

export default SessaoService;