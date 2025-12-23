import type { ErrorCustomVS } from '@interfaces/errorInterfaces';
import type { RequestCustomVS } from '@interfaces/globalInterfaces';
import UsuarioModel from '@models/usuarioModel';
import type { Response, NextFunction } from 'express';
import Erros from '@utils/erroClasses';
import { limparTodosCookiesDeAutenticacao, salvarCookieAcessToken, salvarCookieRefreshToken, salvarCookieSessionId } from '@utils/cookieUtils';
import type { UUID } from 'node:crypto';
import RefreshTokenService from 'services/refreshTokenService';
import Argon2Utils from '@utils/argon2Utils';
import DispositivoUtils from '@utils/dispositivoUtils';

class LoginController {

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

            await RefreshTokenService.criarNovaSessao(refreshToken, usuarioId, lembrar, dispositivoNome, dispositivoHash, newSessionId, oldSessionId);

            res.status(200).json({ message: 'Logado com sucesso!'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'Credenciais inválidas.';
            next(erro);
        }
    }

    static async deslogar(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const oldSessionId = req.cookies.sessionId as UUID | undefined;
            if(oldSessionId){
                await RefreshTokenService.encerrarSessao(oldSessionId);
            }
            
            limparTodosCookiesDeAutenticacao(res);

            res.status(200).json({ message: 'Logout realizado com sucesso' });
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

}

export default LoginController;