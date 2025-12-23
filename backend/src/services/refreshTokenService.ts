import prisma from "@config/db";
import { UUID, createHash } from "node:crypto";

class RefreshTokenService {

    static async criarNovaSessao(newRefreshToken: string, usuario_id: UUID, lembre_me: boolean, dispositivo_nome: string, dispositivo_hash: string, newSessionId: UUID, oldSessionId?: UUID){
        await prisma.$transaction(async(tx)=>{
            if(oldSessionId) await tx.refresh_tokens.deleteMany({
                where: {session_id: oldSessionId}
            });

            const expira_em = lembre_me ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 2 * 60 * 60 * 1000);
            const refreshHash = createHash('sha256').update(newRefreshToken).digest('hex');
            await tx.refresh_tokens.create({
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

    static async encerrarSessao(session_id: UUID){
        await prisma.refresh_tokens.deleteMany({
            where: {session_id}
        })
    }

}

export default RefreshTokenService;