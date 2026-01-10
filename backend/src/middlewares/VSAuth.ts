// * Imports
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import CookieUtils from '@utils/cookies';
import type { Response, NextFunction } from 'express';
import type { AccessTokenPayload } from '@schemas/shared/cookies';
import type { RequestCustomVS } from '@schemas/shared/request';
import SessionModel from '@models/session';
import { type UUID, createHash } from 'node:crypto';
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

    // * Booleano para decidir se vai atualizar a sessão (access token expirado)
    let tryRefresh = false;

    try {
        // * Valida o access token
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
            const visitorId = req.headers['x-fingerprint-visitorid'];
            if(!visitorId)
                return next(new Errors.InvalidCredentialsError('Não foi possível identificar sua sessão.', 'VS_AUTH_REQUIRED'));
            // * Usa o decode pois aqui só pode ser um token expirado
            const accessPayload = jwt.decode(accessToken) as AccessTokenPayload;

            // * Faz o hash do Refresh Token e do visitorId
            const deviceHash = DeviceUtils.createDeviceHash(visitorId);
            const refreshHash = createHash('sha256').update(refreshToken).digest('hex');

            // * Busca no banco baseado nos dois
            const sessionData = await SessionModel.findInfoByUserAndSessionId(accessPayload.id, sessionId as UUID);

            // * Se não achou limpa os cookies e dá sessão inválida ou expirada
            if(!sessionData){
                CookieUtils.clearAllCookiesAuth(res);
                return next(new Errors.InvalidCredentialsError('Sessão inválida ou expirada.', 'VS_AUTH_EXPIRED'));
            };

            const isValidCredentials = refreshHash===sessionData.token && deviceHash===sessionData.device_hash;
            
            // * Se os dados estão inválidos dá sessão inválida ou expirada e limpa do banco
            if(!isValidCredentials) {
                await SessionModel.deleteByUserAndSessionId(accessPayload.id, sessionId);
                CookieUtils.clearAllCookiesAuth(res);
                return next(new Errors.InvalidCredentialsError('Sessão inválida ou expirada.', 'VS_AUTH_EXPIRED'));
            };

            // * Extrai os dados do usuário
            const {id, name, email, token_version} = sessionData.users;
            const userId = id as UUID;
            const remember = sessionData.remember_me;

            // * Gera a nova sessao
            const newAcessToken = CookieUtils.generateAccessToken(userId, name, email, token_version);
            const newRefreshToken = CookieUtils.generateRefreshToken();
            const newSessionId = CookieUtils.generateSessionId();

            // * Salva a nova sessão no banco e apaga a antiga
            await AuthService.refreshSession(newRefreshToken, userId, remember, sessionData.device_name, sessionData.device_hash, newSessionId, sessionId as UUID);

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
