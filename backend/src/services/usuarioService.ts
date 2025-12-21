import prisma from "@config/db";
import Argon2Utils from "@utils/argon2Utils";
import ValidarCampos from "@utils/validarCampos";
import Erros from '@utils/erroClasses';

class UsuarioService {

    static async cadastrarUsuario(nome: string, email: string, senha: string){

        ValidarCampos.validarTamanhoMin(nome, 3, 'Nome');
        nome = ValidarCampos.validarTamanhoMax(nome, 100, 'Nome');
        email = ValidarCampos.validarEmail(email);
        senha = ValidarCampos.validarTamanhoMin(senha, 8, 'Senha');

        const senhaCriptografada = await Argon2Utils.criptografarSenha(senha);

        if(!senhaCriptografada) throw new Erros.ErroDeValidacao('Erro ao criptografar senha.')

        const novoUsuario = await prisma.usuarios.create({
            select: {id: true, token_version: true},
            data: {
                nome, email,
                senha: senhaCriptografada
            }
        })
        return novoUsuario;
        
    }

}

export default UsuarioService;