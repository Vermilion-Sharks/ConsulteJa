import prisma from "@configs/db";
import SessionModel from "@models/session";
import UserModel from "@models/user";
import { createHash, type UUID } from "node:crypto";
import Errors from '@utils/errorClasses';
import Argon2Utils from "@utils/argon2";
import CookieUtils from "@utils/cookies";
import DeviceUtils from "@utils/device";
import { GOOGLE_CLIENT_ID, SESSION_MS_WITH_REMEMBER, SESSION_MS_WITHOUT_REMEMBER } from "@utils/constants";
import googleClient from "@configs/googleAuth";
import { CreateSessionDataService, GoogleLoginService, LoginService } from "@schemas/services/auth";

class AuthService {

    static async login(data: LoginService){

        const { email, password } = data;

        const user = await UserModel.findLoginInfoByEmail(email);

        if(user){
            if(!user.password)
                throw new Errors.ValidationError('Esta conta utiliza login com Google. Crie uma senha ou entre com o Google.');
            const passwordValid = await Argon2Utils.validatePassword(user.password, password);
            if(!passwordValid)
                throw new Errors.InvalidCredentialsError('Credenciais inválidas.');
        } else throw new Errors.InvalidCredentialsError('Credenciais inválidas.');

        const { id, name, token_version } = user;
        const userId = id as UUID;

        const newSession = await  AuthService.createSessionData({
            ...data,
            id: userId, name,
            tokenVersion: token_version
        });

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

    static async refreshSession(newRefreshToken: string, userId: UUID, rememberMe: boolean, deviceName: string, deviceHash: string, newSessionId: UUID, oldSessionId: UUID){

        const expiresIn = rememberMe ?
            new Date(Date.now() + SESSION_MS_WITH_REMEMBER) :
            new Date(Date.now() + SESSION_MS_WITHOUT_REMEMBER);
        const tokenHash = createHash('sha256').update(newRefreshToken).digest('hex');

        await prisma.$transaction(async (tx)=>{
            await SessionModel.deleteByUserAndSessionId(userId, oldSessionId, tx);
            await SessionModel.create(userId, tokenHash, newSessionId, rememberMe, deviceName, deviceHash, expiresIn, tx);
        });

    }

    private static async createSessionData(data: CreateSessionDataService){

        const { id, ip, name, rememberMe, tokenVersion, userAgent, visitorId, email } = data;

        const accessToken = CookieUtils.generateAccessToken(id, name, email, tokenVersion);
        const refreshToken = CookieUtils.generateRefreshToken();
        const newSessionId = CookieUtils.generateSessionId();
        const deviceName = DeviceUtils.getDeviceName(userAgent, ip);
        const deviceHash = DeviceUtils.createDeviceHash(visitorId);
        const expiresIn = rememberMe ?
            new Date(Date.now() + SESSION_MS_WITH_REMEMBER) :
            new Date(Date.now() + SESSION_MS_WITHOUT_REMEMBER);
        const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex');

        const newSession = await prisma.$transaction(async (tx)=>{
            await SessionModel.deleteByUserIdAndDeviceHash(id, deviceHash, tx);
            await SessionModel.create(id, refreshTokenHash, newSessionId, rememberMe, deviceName, deviceHash, expiresIn, tx);
            return {accessToken, refreshToken, newSessionId};
        });

        return newSession;

    }

    static async googleLogin(data: GoogleLoginService){

        const { idToken } = data;

        const ticket = await googleClient.verifyIdToken({
            idToken, audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if(!payload)
            throw new Errors.InvalidCredentialsError('ID Token do Google inválido.');

        const googleId = payload.sub;
        const googleEmail = payload.email!;
        const googleName = payload.name!;

        let userTokenVersion: number;
        let userId: UUID;
        let userName = googleName;

        const user = await UserModel.findByGoogleId(googleId);
        if(!user){
            const userUpsert = await UserModel.upsertGoogleUser({
                email: googleEmail,
                name: googleName,
                googleId
            });
            userName = userUpsert.name;
            userTokenVersion = userUpsert.token_version;
            userId = userUpsert.id as UUID;
        } else{
            userName = user.name;
            userTokenVersion = user.token_version;
            userId = user.id as UUID;
        }

        const newSession = await AuthService.createSessionData({
            ...data,
            email: googleEmail,
            id: userId,
            tokenVersion: userTokenVersion,
            name: userName,
            rememberMe: true
        });

        return newSession;        

    }

}

export default AuthService;