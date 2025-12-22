import prisma from "@config/db";
import type { UUID } from "node:crypto";

class RefreshTokenModel {

    static async buscarRefreshTokenInfoPorUsuarioESessionId(session_id: UUID, usuario_id: UUID, refreshHash: string){
        const agora = new Date();
        const resultado = await prisma.refresh_tokens.findFirst({
            where: {
                token: refreshHash,
                session_id,
                usuario_id,
                expira_em: { gt: agora }
            },
            select: {
                token: true,
                lembre_me: true,
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

}

export default RefreshTokenModel;