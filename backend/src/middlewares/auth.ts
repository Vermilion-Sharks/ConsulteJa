// * Imports
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { gerarAcessToken, gerarRefreshToken, gerarSessionId, limparTodosCookiesDeAutenticacao, salvarCookieAcessToken, salvarCookieRefreshToken, salvarCookieSessionId } from '@utils/cookieUtils';
import type { Response, NextFunction } from 'express';
import type { AcessTokenPayload } from '@interfaces/cookiesInterfaces';
import type { RequestCustomVS } from '@interfaces/globalInterfaces';
import SessaoModel from '@models/sessaoModel';
import { UUID, createHash } from 'node:crypto';
import SessaoService from '@services/sessaoService';
import UsuarioModel from '@models/usuarioModel';
import DispositivoUtils from '@utils/dispositivoUtils';
import Erros from '@utils/erroClasses';

// * Chave secreta para o JWT
const SECRET_KEY = process.env.JWT_SECRET!;

// * Autenticação JWT
export async function VSAuth(req: RequestCustomVS, res: Response, next: NextFunction) {

    const { acessToken, refreshToken, sessionId } = req.cookies;

    // * Valida os três pois todos são criados simultaneamente ao fazer login, ou seja se não tiver um tem algo errado
    if(!refreshToken || !sessionId || !acessToken)
        return next(new Erros.ErroDeCredenciaisInvalidas('Você não está logado.', 'VS_AUTH_REQUIRED'));

    // * Inicializa user como null para depois atribuir os valores
    let user: AcessTokenPayload | null = null;

    // * Booleano para decidir se vai atualizar a sessão (acess token expirado)
    let tryRefresh = false;

    try {
        // * Valida o acess token
        user = jwt.verify(acessToken, SECRET_KEY) as AcessTokenPayload;
        // * Se está tudo certo valida a token version para garantir que não foi revogado
        const tokenVersion = await UsuarioModel.buscarTokenVersionPorId(user.id);
        if(user.tokenVersion !== tokenVersion) {
            // ? Aqui não deleta o refresh token no banco, pois se a token version atualizou é pq todos os refresh tokens foram apagados
            limparTodosCookiesDeAutenticacao(res);
            return next(new Erros.ErroDeCredenciaisInvalidas('Sessão inválida.', 'VS_AUTH_INVALID'));
        }
    } catch (erro) {
        if(erro instanceof TokenExpiredError){
            // * Se foi erro de expired pede refresh
            tryRefresh = true;
        } else {
            // * Se não, já invalida
            limparTodosCookiesDeAutenticacao(res);
            return next(new Erros.ErroDeCredenciaisInvalidas('Sessão inválida.', 'VS_AUTH_INVALID'));
        }
    }

    if(tryRefresh){
        try {
            // * Usa o decoded pois aqui só pode ser um token expirado
            const acessPayload = jwt.decode(acessToken) as AcessTokenPayload;
            // * Faz o hash do Refresh Token e do user-agent
            const refreshHash = createHash("sha256").update(refreshToken).digest("hex");
            const userAgent = req.headers['user-agent'] ?? '';
            const dispositivoHash = DispositivoUtils.criarDispositivoHash(userAgent);

            // * Busca no banco baseado nos dois
            const tokenData = await SessaoModel.buscarRefreshTokenInfoPorUsuarioESessionId(sessionId as UUID, acessPayload.id, refreshHash, dispositivoHash);
            // * Se nao achou dá sessão inválida ou expirada
            if(!tokenData) {
                limparTodosCookiesDeAutenticacao(res);
                return next(new Erros.ErroDeCredenciaisInvalidas('Sessão inválida ou expirada.', 'VS_AUTH_EXPIRED'));
            };

            // * Extrai os dados do usuário
            const {id, nome, email, token_version} = tokenData.usuarios;
            const userId = id as UUID;
            const lembrar = tokenData.lembre_me;

            // * Gera a nova sessao
            const newAcessToken = gerarAcessToken(userId, nome, email, token_version);
            const newRefreshToken = gerarRefreshToken();
            const newSessionId = gerarSessionId();

            // * Salva a nova sessão no banco e apaga a antiga
            await SessaoService.criarNovaSessao(newRefreshToken, userId, lembrar, tokenData.dispositivo_nome, tokenData.dispositivo_hash, newSessionId, sessionId as UUID);

            // * Salva os cookies com a nova sessao
            salvarCookieAcessToken(res, newAcessToken, lembrar);
            salvarCookieRefreshToken(res, newRefreshToken, lembrar);
            salvarCookieSessionId(res, newSessionId, lembrar);

            // * Passa os dados para user
            user = {
                id: userId, nome: nome, email: email, tokenVersion: token_version
            };
        } catch {
            limparTodosCookiesDeAutenticacao(res);
            // * Se deu algum erro (provavelmente do banco) retorna 500
            return next(new Erros.ErroDoServidor('Erro ao verificar token.'));
        }
    }

    // * Se der algum problema com user tem uma validação de garantia
    if (!user) {
        limparTodosCookiesDeAutenticacao(res);
        return next(new Erros.ErroDeCredenciaisInvalidas('Não autenticado.', 'VS_AUTH_INVALID'));
    }
    // * Passa o user para a próxima função
    req.user = user;
    next();
}
