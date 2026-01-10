import prisma from "@configs/db";
import SessionModel from "@models/session";
import UserModel from "@models/user";
import { createHash, type UUID } from "node:crypto";
import Errors from '@utils/errorClasses';
import Argon2Utils from "@utils/argon2";
import CookieUtils from "@utils/cookies";
import DeviceUtils from "@utils/device";
import { SESSION_MS_WITH_REMEMBER, SESSION_MS_WITHOUT_REMEMBER } from "@utils/constants";

class AuthService {

    static async login(email: string, password: string, remembreMe: boolean, userAgent: string, visitorId: string, ip: string, oldSessionId?: UUID){

        const newSession = await prisma.$transaction(async (tx)=>{
            const user = await UserModel.findLoginInfoByEmail(email, tx);

            if(!user || !await Argon2Utils.validatePassword(user.password, password))
                throw new Errors.InvalidCredentialsError('Credenciais inválidas.');

            const { id, name, token_version } = user;
            const userId = id as UUID;
            const accessToken = CookieUtils.generateAccessToken(userId, name, email, token_version);
            const refreshToken = CookieUtils.generateRefreshToken();
            const newSessionId = CookieUtils.generateSessionId();
            const deviceName = DeviceUtils.getDeviceName(userAgent, ip);
            const deviceHash = DeviceUtils.createDeviceHash(visitorId);
            const expiresIn = remembreMe ?
                new Date(Date.now() + SESSION_MS_WITH_REMEMBER) :
                new Date(Date.now() + SESSION_MS_WITHOUT_REMEMBER);

            const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

            if(oldSessionId) await SessionModel.deleteByUserAndSessionId(userId, oldSessionId, tx);
            await SessionModel.create(userId, tokenHash, newSessionId, remembreMe, deviceName, deviceHash, expiresIn, tx);

            return {accessToken, refreshToken, newSessionId};
        })

        return newSession;

    }

    static async logout(sessionId: UUID, userId: UUID){

        await SessionModel.deleteByUserAndSessionId(userId, sessionId);

    }

    static async remoteLogout(sessionId: UUID, userId: UUID){

        await SessionModel.deleteByUserAndSessionId(userId, sessionId);

    }

    static async globalLogout(userId: UUID){

        await prisma.$transaction(async (tx)=>{
            await SessionModel.deleteManyByUserId(userId, tx);
            await UserModel.updateTokenVersionById(userId, tx);
        })

    }

    static async refreshSession(newRefreshToken: string, userId: UUID, remembreMe: boolean, deviceName: string, deviceHash: string, newSessionId: UUID, oldSessionId: UUID){

        const expiresIn = remembreMe ?
            new Date(Date.now() + SESSION_MS_WITH_REMEMBER) :
            new Date(Date.now() + SESSION_MS_WITHOUT_REMEMBER);
        const tokenHash = createHash('sha256').update(newRefreshToken).digest('hex');

        await prisma.$transaction(async (tx)=>{
            await SessionModel.deleteByUserAndSessionId(userId, oldSessionId, tx);
            await SessionModel.create(userId, tokenHash, newSessionId, remembreMe, deviceName, deviceHash, expiresIn, tx);
        });

    }

}

export default AuthService;