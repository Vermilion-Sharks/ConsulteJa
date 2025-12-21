import argon2 from 'argon2';

class Argon2Utils {

    static async criptografarSenha(senha: string) {

        try {
            const hash = await argon2.hash(senha, {
                type: argon2.argon2id,
                memoryCost: 2**17,
                timeCost: 3,
                parallelism: 2
            });
            return hash;
        } catch (erro) {
            console.error('Erro ao criptografar senha:', erro);
            return false;
        }

    }

    static async validarSenha(hash: string, senhaFornecida: string) {

        try {
            return await argon2.verify(hash, senhaFornecida);
        } catch (erro) {
            console.error('Erro ao validar senha:', erro);
            return false;
        }

    }

}

export default Argon2Utils;