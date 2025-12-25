import Argon2Utils from "@utils/argon2Utils";
import ValidarCampos from "@utils/validarCampos";
import Erros from '@utils/erroClasses';
import UsuarioModel from "@models/usuarioModel";
import { UUID } from "node:crypto";

class UsuarioService {

    static async cadastrarUsuario(nome: string, email: string, senha: string){

        if(!email || !senha || !nome) throw new Erros.ErroDeValidacao('Informações faltando para o cadastro.');

        ValidarCampos.validarTamanhoMin(nome, 3, 'Nome');
        nome = ValidarCampos.validarTamanhoMax(nome, 100, 'Nome');
        email = ValidarCampos.validarEmail(email);
        senha = ValidarCampos.validarTamanhoMin(senha, 8, 'Senha');

        const senhaCriptografada = await Argon2Utils.criptografarSenha(senha);

        if(!senhaCriptografada) throw new Erros.ErroDeValidacao('Erro ao criptografar senha.');

        await UsuarioModel.criar(nome, email, senhaCriptografada)
        
    }

    static async validarLogin(email: string, senha: string){

        if(!email || !senha) throw new Erros.ErroDeValidacao('Email e senha precisam ser fornecidos para o login.');

        const usuario = await UsuarioModel.buscarLoginInfoPorEmail(email);

        if(!usuario || !await Argon2Utils.validarSenha(usuario.senha, senha))
            throw new Erros.ErroDeCredenciaisInvalidas('Credenciais inválidas.');

        return {
            id: usuario.id as UUID,
            nome: usuario.nome,
            tokenVersion: usuario.token_version
        };

    }

}

export default UsuarioService;