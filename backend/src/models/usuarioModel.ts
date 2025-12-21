import prisma from "@config/db";
import type { UUID } from "crypto";

class UsuarioModel {

    static async buscarLoginInfoPorEmail(email: string){
        const resultado = await prisma.usuarios.findUniqueOrThrow({
            where: {email},
            select: {
                id: true,
                nome: true,
                senha: true,
                token_version: true
            }
        });
        return resultado
    }

    static async buscarTokenVersionPorId(id: UUID){
        const resultado = await prisma.usuarios.findUnique({
            where: {id},
            select: { token_version: true }
        });
        return resultado?.token_version;
    }

}

export default UsuarioModel;