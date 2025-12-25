import jwt from 'jsonwebtoken';
import type { CookieOptions, Response } from 'express';
import type { UUID } from 'crypto';
import crypto from 'crypto';
import { AcessTokenPayload } from '@interfaces/cookiesInterfaces';

const SECRET_KEY = process.env.JWT_SECRET!;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};

export function limparCookieAcessToken(res: Response) {
  res.clearCookie('acessToken', cookieOptions);
}

export function limparCookieRefreshToken(res: Response) {
  res.clearCookie('refreshToken', cookieOptions);
}

export function limparCookieSessionId(res: Response){
  res.clearCookie('sessionId', cookieOptions);
}

export function limparTodosCookiesDeAutenticacao(res: Response) {
  limparCookieAcessToken(res);
  limparCookieRefreshToken(res);
  limparCookieSessionId(res);
}

export function salvarCookieAcessToken(res: Response, acessToken: string, lembreMe: boolean){
  res.cookie('acessToken', acessToken, {
    ...cookieOptions,
    maxAge: lembreMe ? 30*24*60*60*1000 : 2*60*60*1000
  });
}

export function salvarCookieRefreshToken(res: Response, refreshToken: string, lembreMe: boolean){
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: lembreMe ? 30*24*60*60*1000 : 2*60*60*1000
  });
}

export function salvarCookieSessionId(res: Response, sessionId: UUID, lembreMe: boolean){
  res.cookie('sessionId', sessionId, {
    ...cookieOptions,
    maxAge: lembreMe ? 30*24*60*60*1000 : 2*60*60*1000
  });
}

export function validarCookieToken(tkn: string){
  try {
    jwt.verify(tkn, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export function gerarAcessToken(id: UUID, nome: string, email: string, tokenVersion: number){
  const acessToken = jwt.sign({ id, nome, email, tokenVersion } satisfies AcessTokenPayload, SECRET_KEY, { expiresIn: '15m' });
  return acessToken;
}

export function gerarRefreshToken(){
  const refreshToken = crypto.randomBytes(64).toString("hex");
  return refreshToken;
}

export function gerarSessionId(){
  const sessionId = crypto.randomUUID();
  return sessionId;
}