import type { ErrorCustomVS } from '@schemas/shared/error';
import type { RequestAuthVS, RequestCustomVS } from '@schemas/shared/request';
import type { Response, NextFunction } from 'express';
import type { UUID } from 'node:crypto';
import { googleLoginSchema, loginSchema } from '@schemas/controllers/auth';
import AuthService from '@services/auth';
import CookieUtils from '@utils/cookies';
import SessionModel from '@models/session';
import { ResponseVS } from '@utils/response';

class AuthController {

    static async login(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const data = loginSchema.parse(req.body);
            
            const remember = !!data.rememberMe;
            const userAgent = req.headers['user-agent'] ?? '';
            const ip = req.ip ?? '0.0.0.0';

            const newSession = await AuthService.login({
                ...data, rememberMe: remember,
                userAgent, ip
            });
            const { accessToken, refreshToken, newSessionId } = newSession;

            CookieUtils.saveCookieAccessToken(res, accessToken, remember);
            CookieUtils.saveCookieRefreshToken(res, refreshToken, remember);
            CookieUtils.saveCookieSessionId(res, newSessionId, remember);

            ResponseVS(res, {message: 'Logado com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async logout(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const oldSessionId = req.cookies.sessionId;

            await AuthService.logout(oldSessionId, id);
            
            CookieUtils.clearAllCookiesAuth(res);

            ResponseVS(res, {message: 'Logout realizado com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async list(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const sessoes = await SessionModel.findManyByUserId(id);
            ResponseVS(res, {data: sessoes});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async globalLogout(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;

            await AuthService.globalLogout(id);
            CookieUtils.clearAllCookiesAuth(res);
            
            ResponseVS(res, {message: 'Logout global realizado com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async remoteLogout(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const { sessionId } = req.params;
            await AuthService.remoteLogout(sessionId as UUID, id);
            ResponseVS(res, {message: 'Logout remoto realizado com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async googleLogin(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const data = googleLoginSchema.parse(req.body);

            const userAgent = req.headers['user-agent'] ?? '';
            const ip = req.ip ?? '0.0.0.0';

            const newSession = await AuthService.googleLogin({
                ...data,
                userAgent, ip
            })
            const { accessToken, refreshToken, newSessionId } = newSession;

            CookieUtils.saveCookieAccessToken(res, accessToken, true);
            CookieUtils.saveCookieRefreshToken(res, refreshToken, true);
            CookieUtils.saveCookieSessionId(res, newSessionId, true);

            ResponseVS(res, {message: 'Logado com sucesso.'});
        } catch (err) {
            next(err);
        }
    }

}

export default AuthController;