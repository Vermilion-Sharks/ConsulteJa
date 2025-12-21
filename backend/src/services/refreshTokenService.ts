import prisma from "@config/db";
import type { UUID } from "node:crypto";
import bcrypt from 'bcrypt';

class RefreshTokenService {

    static async criarNovaSessao(newRefreshToken: string, usuario_id: UUID, lembre_me: boolean, newSessionId: UUID, oldSessionId?: UUID){
        await prisma.$transaction(async(tx)=>{
            if(oldSessionId) await tx.refresh_tokens.deleteMany({
                where: {session_id: oldSessionId}
            });

            const expira_em = lembre_me ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 2 * 60 * 60 * 1000);
            const refreshCriptografado = await bcrypt.hash(newRefreshToken, 12);
            await tx.refresh_tokens.create({
                data: {
                    expira_em,
                    token: refreshCriptografado,
                    session_id: newSessionId,
                    usuario_id,
                    lembre_me
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