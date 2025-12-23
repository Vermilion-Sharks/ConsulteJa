import prisma from "@config/db";
import type { UUID } from "node:crypto";

class RefreshTokenModel {

    static async buscarRefreshTokenInfoPorUsuarioESessionId(session_id: UUID, usuario_id: UUID, tokenHash: string, dispositivoHash: string){
        const agora = new Date();
        const resultado = await prisma.refresh_tokens.findFirst({
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

}

export default RefreshTokenModel;