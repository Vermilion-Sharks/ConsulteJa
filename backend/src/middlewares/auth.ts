// * Imports
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { limparTodosCookiesDeAutenticacao, salvarCookieAcessToken, salvarCookieRefreshToken, salvarCookieSessionId } from '@utils/cookieUtils';
import type { Response, NextFunction } from 'express';
import type { AcessTokenPayload } from '@interfaces/cookiesInterfaces';
import type { RequestCustomVS } from '@interfaces/globalInterfaces';
import type { ErrorResponseVS } from '@interfaces/errorInterfaces';
import RefreshTokenModel from '@models/refreshTokenModel';
import { UUID, createHash } from 'node:crypto';
import RefreshTokenService from 'services/refreshTokenService';
import UsuarioModel from '@models/usuarioModel';
import DispositivoUtils from '@utils/dispositivoUtils';

// * Chave secreta para o JWT
const SECRET_KEY = process.env.JWT_SECRET!;

// * Autenticação JWT
export async function authenticateToken(req: RequestCustomVS, res: Response, next: NextFunction) {

    const { acessToken, refreshToken, sessionId } = req.cookies;

    // * Valida os três pois todos são criados simultaneamente ao fazer login, ou seja se não tiver um tem algo errado
    if(!refreshToken || !sessionId || !acessToken)
        return res.status(401).json({ error: 'Você não está logado.', type: 'Unauthorized' } satisfies ErrorResponseVS);

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
            return res.status(403).json({ error: 'Sessão inválida.', type: 'Forbidden' } satisfies ErrorResponseVS);
        }
    } catch (erro) {
        if(erro instanceof TokenExpiredError){
            // * Se foi erro de expired pede refresh
            tryRefresh = true;
        } else {
            // * Se não, já invalida
            limparTodosCookiesDeAutenticacao(res);
            return res.status(403).json({ error: 'Sessão inválida.', type: 'Forbidden' } satisfies ErrorResponseVS);
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
            const tokenData = await RefreshTokenModel.buscarRefreshTokenInfoPorUsuarioESessionId(sessionId as UUID, acessPayload.id, refreshHash, dispositivoHash);
            // * Se nao achou dá sessão inválida
            if(!tokenData) {
                limparTodosCookiesDeAutenticacao(res);
                return res.status(403).json({ error: 'Sessão inválida.', type: 'Forbidden' } satisfies ErrorResponseVS);
            };

            // * Extrai os dados do usuário
            const {id, nome, email, token_version} = tokenData.usuarios;
            const userId = id as UUID;

            // * Salva os novos cookies
            salvarCookieAcessToken(res, userId, nome, email, tokenData.lembre_me, token_version);
            const newSessionId = salvarCookieSessionId(res, tokenData.lembre_me);
            const newRefreshToken = salvarCookieRefreshToken(res, tokenData.lembre_me);

            // * Salva a nova sessão no banco e apaga a antiga
            await RefreshTokenService.criarNovaSessao(newRefreshToken, userId, tokenData.lembre_me, tokenData.dispositivo_nome, tokenData.dispositivo_hash, newSessionId, sessionId as UUID);

            // * Passa os dados para user
            user = {
                id: userId, nome: nome, email: email, tokenVersion: token_version
            };
        } catch {
            limparTodosCookiesDeAutenticacao(res);
            // * Se deu algum erro (provavelmente do banco) retorna 403
            return res.status(403).json({ error: `Erro ao verificar token.`, type: 'Forbidden' } satisfies ErrorResponseVS);
        }
    }

    // * Se der algum problema com user tem uma validação de garantia
    if (!user) {
        limparTodosCookiesDeAutenticacao(res);
        return res.status(401).json({
            error: 'Não autenticado.',
            type: 'Unauthorized'
        });
    }
    // * Passa o user para a próxima função
    req.user = user;
    next();
}
