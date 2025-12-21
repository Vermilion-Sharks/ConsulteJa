import type { ErrorCustomVS } from '@interfaces/errorInterfaces';
import { RequestCustomVS } from '@interfaces/globalInterfaces';
import { salvarCookieRefreshToken, salvarCookieAcessToken, salvarCookieSessionId } from '@utils/cookieUtils';
import type { NextFunction, Response } from 'express';
import type { UUID } from 'node:crypto';
import RefreshTokenService from 'services/refreshTokenService';
import UsuarioService from 'services/usuarioService';

class UsuarioController {

    static async cadastrar(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const { nome, email, senha } = req.body as {nome?: string, email?: string, senha?: string};

            if(!email || !senha || !nome) return res.status(404).json({ error: 'Informações faltando para o cadastro.' });

            const usuario = await UsuarioService.cadastrarUsuario(nome, email, senha);

            const usuarioId = usuario.id as UUID;

            const oldSessionId = req.cookies.sessionId as UUID | undefined;

            const refreshToken = salvarCookieRefreshToken(res, true);
            const newSessionId = salvarCookieSessionId(res, true);
            salvarCookieAcessToken(res, usuarioId, nome, email, true, usuario.token_version);

            await RefreshTokenService.criarNovaSessao(refreshToken, usuarioId, true, newSessionId, oldSessionId);

            res.status(201).json({ message: "Cadastro concluído com sucesso." });
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2002') erro.custom_message = "Email já cadastrado.";
            next(erro);
        }
    }

}

export default UsuarioController;