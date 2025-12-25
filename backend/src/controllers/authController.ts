import type { ErrorCustomVS } from '@interfaces/errorInterfaces';
import type { RequestAuthVS, RequestCustomVS } from '@interfaces/globalInterfaces';
import UsuarioModel from '@models/usuarioModel';
import type { Response, NextFunction } from 'express';
import Erros from '@utils/erroClasses';
import { gerarAcessToken, gerarRefreshToken, gerarSessionId, limparTodosCookiesDeAutenticacao, salvarCookieAcessToken, salvarCookieRefreshToken, salvarCookieSessionId } from '@utils/cookieUtils';
import type { UUID } from 'node:crypto';
import SessaoService from '@services/sessaoService';
import Argon2Utils from '@utils/argon2Utils';
import DispositivoUtils from '@utils/dispositivoUtils';
import SessaoModel from '@models/sessaoModel';
import UsuarioService from '@services/usuarioService';

class AuthController {

    static async logar(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const { email, senha, lembreMe } = req.body;
            
            const lembrar = !!lembreMe;
            const oldSessionId = req.cookies.sessionId;
            const userAgent = req.headers['user-agent'] ?? '';

            const novaSessao = await SessaoService.iniciarSessao(email, senha, lembrar, userAgent, oldSessionId);
            const { acessToken, refreshToken, newSessionId } = novaSessao;

            salvarCookieAcessToken(res, acessToken, lembrar);
            salvarCookieRefreshToken(res, refreshToken, lembrar);
            salvarCookieSessionId(res, newSessionId, lembrar);

            res.status(200).json({ message: 'Logado com sucesso!'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
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