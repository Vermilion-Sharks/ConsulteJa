import jwt from 'jsonwebtoken';
import type { CookieOptions, Response } from 'express';
import type { UUID } from 'crypto';
import crypto from 'crypto';
import { AccessTokenPayload } from '@schemas/shared/cookiesSchema';
import { JWT_SECRET, SESSION_MS_WITH_REMEMBER, SESSION_MS_WITHOUT_REMEMBER } from './constants';

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
};

class CookieUtils {

    static generateAccessToken(id: UUID, name: string, email: string, tokenVersion: number){
        const accessToken = jwt.sign({ id, name, email, tokenVersion } satisfies AccessTokenPayload, JWT_SECRET, { expiresIn: '15m' });
        return accessToken;
    }

    static generateRefreshToken(){
        const refreshToken = crypto.randomBytes(64).toString('hex');
        return refreshToken;
    }

    static generateSessionId(){
        const sessionId = crypto.randomUUID();
        return sessionId;
    }

    static saveCookieAccessToken(res: Response, accessToken: string, rememberMe: boolean){
        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: rememberMe ? SESSION_MS_WITH_REMEMBER : SESSION_MS_WITHOUT_REMEMBER
        });
    }

    static saveCookieRefreshToken(res: Response, refreshToken: string, rememberMe: boolean){
        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: rememberMe ? SESSION_MS_WITH_REMEMBER : SESSION_MS_WITHOUT_REMEMBER
        });
    }

    static saveCookieSessionId(res: Response, sessionId: UUID, rememberMe: boolean){
        res.cookie('sessionId', sessionId, {
            ...cookieOptions,
            maxAge: rememberMe ? SESSION_MS_WITH_REMEMBER : SESSION_MS_WITHOUT_REMEMBER
        });
    }

    static clearCookieAccessToken(res: Response) {
        res.clearCookie('accessToken', cookieOptions);
    }

    static clearCookieRefreshToken(res: Response) {
        res.clearCookie('refreshToken', cookieOptions);
    }

    static clearCookieSessionId(res: Response){
        res.clearCookie('sessionId', cookieOptions);
    }

    static clearAllCookiesAuth(res: Response) {
        CookieUtils.clearCookieAccessToken(res);
        CookieUtils.clearCookieRefreshToken(res);
        CookieUtils.clearCookieSessionId(res);
    }

    static validateJWT(token: string){
      try {
          jwt.verify(token, JWT_SECRET);
          return true;
      } catch {
          return false;
      }
    }

};

export default CookieUtils;