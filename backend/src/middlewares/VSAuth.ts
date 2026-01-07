// * Imports
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import CookieUtils from '@utils/cookies';
import type { Response, NextFunction } from 'express';
import type { AccessTokenPayload } from '@schemas/shared/cookies';
import type { RequestCustomVS } from '@schemas/shared/request';
import SessionModel from '@models/session';
import { UUID, createHash } from 'node:crypto';
import UserModel from '@models/user';
import DeviceUtils from '@utils/device';
import Errors from '@utils/errorClasses';
import AuthService from '@services/auth';

// * Chave secreta para o JWT
const JWT_SECRET = process.env.JWT_SECRET!;

// * Autenticação JWT
export async function VSAuth(req: RequestCustomVS, res: Response, next: NextFunction) {

    const { accessToken, refreshToken, sessionId } = req.cookies;

    // * Valida os três pois todos são criados simultaneamente ao fazer login, ou seja se não tiver um tem algo errado
    if(!refreshToken || !sessionId || !accessToken)
        return next(new Errors.InvalidCredentialsError('Você não está logado.', 'VS_AUTH_REQUIRED'));

    // * Inicializa user como null para depois atribuir os valores
    let user: AccessTokenPayload | null = null;

    // * Booleano para decidir se vai atualizar a sessão (acess token expirado)
    let tryRefresh = false;

    try {
        // * Valida o acess token
        user = jwt.verify(accessToken, JWT_SECRET) as AccessTokenPayload;
        // * Se está tudo certo valida a token version para garantir que não foi revogado
        const tokenVersion = await UserModel.findTokenVersionById(user.id);
        if(user.tokenVersion !== tokenVersion) {
            // ? Aqui não deleta o refresh token no banco, pois se a token version atualizou é pq todos os refresh tokens foram apagados
            CookieUtils.clearAllCookiesAuth(res);
            return next(new Errors.InvalidCredentialsError('Sessão inválida.', 'VS_AUTH_INVALID'));
        }
    } catch (erro) {
        if(erro instanceof TokenExpiredError){
            // * Se foi erro de expired pede refresh
            tryRefresh = true;
        } else {
            // * Se não, já invalida
            CookieUtils.clearAllCookiesAuth(res);
            return next(new Errors.InvalidCredentialsError('Sessão inválida.', 'VS_AUTH_INVALID'));
        }
    }

    if(tryRefresh){
        try {
            // * Usa o decoded pois aqui só pode ser um token expirado
            const acessPayload = jwt.decode(accessToken) as AccessTokenPayload;
            // * Faz o hash do Refresh Token e do user-agent
            const refreshHash = createHash("sha256").update(refreshToken).digest("hex");
            const userAgent = req.headers['user-agent'] ?? '';
            const dispositivoHash = DeviceUtils.createDeviceHash(userAgent);

            // * Busca no banco baseado nos dois
            const tokenData = await SessionModel.findValidSessionInfo(sessionId as UUID, acessPayload.id, refreshHash, dispositivoHash);
            // * Se nao achou dá sessão inválida ou expirada
            if(!tokenData) {
                CookieUtils.clearAllCookiesAuth(res);
                return next(new Errors.InvalidCredentialsError('Sessão inválida ou expirada.', 'VS_AUTH_EXPIRED'));
            };

            // * Extrai os dados do usuário
            const {id, name, email, token_version} = tokenData.users;
            const userId = id as UUID;
            const remember = tokenData.remember_me;

            // * Gera a nova sessao
            const newAcessToken = CookieUtils.generateAccessToken(userId, name, email, token_version);
            const newRefreshToken = CookieUtils.generateRefreshToken();
            const newSessionId = CookieUtils.generateSessionId();

            // * Salva a nova sessão no banco e apaga a antiga
            await AuthService.refreshSession(newRefreshToken, userId, remember, tokenData.device_name, tokenData.device_hash, newSessionId, sessionId as UUID);

            // * Salva os cookies com a nova sessao
            CookieUtils.saveCookieAccessToken(res, newAcessToken, remember);
            CookieUtils.saveCookieRefreshToken(res, newRefreshToken, remember);
            CookieUtils.saveCookieSessionId(res, newSessionId, remember);

            // * Passa os dados para user
            user = {
                id: userId, name, email, tokenVersion: token_version
            };
        } catch {
            CookieUtils.clearAllCookiesAuth(res);
            // * Se deu algum erro (provavelmente do banco) retorna 500
            return next(new Errors.ServerError('Erro ao verificar token.'));
        }
    }

    // * Se der algum problema com user tem uma validação de garantia
    if (!user) {
        CookieUtils.clearAllCookiesAuth(res);
        return next(new Errors.InvalidCredentialsError('Não autenticado.', 'VS_AUTH_INVALID'));
    }
    // * Passa o user para a próxima função
    req.user = user;
    next();
}
