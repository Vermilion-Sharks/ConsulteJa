import type { ErrorCustomVS } from '@interfaces/errorInterfaces';
import type { RequestAuthVS, RequestCustomVS } from '@interfaces/globalInterfaces';
import UsuarioModel from '@models/usuarioModel';
import type { Response, NextFunction } from 'express';
import Erros from '@utils/erroClasses';
import { limparTodosCookiesDeAutenticacao, salvarCookieAcessToken, salvarCookieRefreshToken, salvarCookieSessionId } from '@utils/cookieUtils';
import type { UUID } from 'node:crypto';
import SessaoService from 'services/sessaoService';
import Argon2Utils from '@utils/argon2Utils';
import DispositivoUtils from '@utils/dispositivoUtils';
import SessaoModel from '@models/sessaoModel';

class AuthController {

    static async logar(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const { email, senha, lembreMe } = req.body as {email: string, senha: string, lembreMe?: boolean};

            if(!email || !senha) throw new Erros.ErroDeValidacao('Email e senha precisam ser fornecidos para o login.');

            const usuario = await UsuarioModel.buscarLoginInfoPorEmail(email);

            if(!await Argon2Utils.validarSenha(usuario.senha, senha)) throw new Erros.ErroDeCredenciaisInvalidas('Credenciais inválidas.');

            const oldSessionId = req.cookies.sessionId as UUID | undefined;
            
            const lembrar = !!lembreMe;
            const usuarioId = usuario.id as UUID;

            const refreshToken = salvarCookieRefreshToken(res, lembrar);
            const newSessionId = salvarCookieSessionId(res, lembrar);
            salvarCookieAcessToken(res, usuarioId, usuario.nome, email, lembrar, usuario.token_version);
            
            const userAgent = req.headers['user-agent'] ?? '';
            const dispositivoNome = DispositivoUtils.pegarDispositivoNome(userAgent);
            const dispositivoHash = DispositivoUtils.criarDispositivoHash(userAgent);

            await SessaoService.criarNovaSessao(refreshToken, usuarioId, lembrar, dispositivoNome, dispositivoHash, newSessionId, oldSessionId);

            res.status(200).json({ message: 'Logado com sucesso!'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'Credenciais inválidas.';
            next(erro);
        }
    }

    static async deslogar(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const oldSessionId = req.cookies.sessionId as UUID;

            await SessaoService.encerrarSessao(oldSessionId, id);
            
            limparTodosCookiesDeAutenticacao(res);

            res.status(200).json({ message: 'Logout realizado com sucesso' });
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async listar(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const sessoes = await SessaoModel.buscarSessoesPorUsuarioId(id);
            res.status(200).json(sessoes);
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async deslogarGlobal(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            await SessaoService.encerrarTodasSessoes(id);
            res.status(200).json({ message: 'Logout global realizado com sucesso.' });
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async deslogarRemoto(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const { session_id } = req.params;
            await SessaoService.encerrarSessao(session_id as UUID, id);
            res.status(200).json({ message: 'Logout remoto realizado com sucesso.' });
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

}

export default AuthController;