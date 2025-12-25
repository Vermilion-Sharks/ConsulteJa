import SessaoModel from "@models/sessaoModel";
import { UUID, createHash } from "node:crypto";
import UsuarioService from "./usuarioService";
import { gerarAcessToken, gerarRefreshToken, gerarSessionId } from "@utils/cookieUtils";
import DispositivoUtils from "@utils/dispositivoUtils";

class SessaoService {

    static async iniciarSessao(email: string, senha: string, lembreMe: boolean, userAgent: string, oldSessionId?: UUID){

        const usuario = await UsuarioService.validarLogin(email, senha);
        const { id, nome, tokenVersion } = usuario;

        const acessToken = gerarAcessToken(id, nome, email, tokenVersion);
        const refreshToken = gerarRefreshToken();
        const newSessionId = gerarSessionId();
        const dispositivoNome = DispositivoUtils.pegarDispositivoNome(userAgent);
        const dispositivoHash = DispositivoUtils.criarDispositivoHash(userAgent);

        await SessaoService.criarNovaSessao(refreshToken, id, lembreMe, dispositivoNome, dispositivoHash, newSessionId, oldSessionId);

        return {acessToken, refreshToken, newSessionId};

    }

    static async criarNovaSessao(newRefreshToken: string, usuarioId: UUID, lembreMe: boolean, dispositivoNome: string, dispositivoHash: string, newSessionId: UUID, oldSessionId?: UUID){

        const expiraEm = lembreMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 2 * 60 * 60 * 1000);
        const refreshHash = createHash('sha256').update(newRefreshToken).digest('hex');

        await SessaoModel.criarEDeletarAnterior(
            refreshHash, usuarioId, lembreMe, dispositivoNome, dispositivoHash, expiraEm, newSessionId, oldSessionId
        );

    }

    static async encerrarSessao(sessionId: UUID, usuarioId: UUID){

        await SessaoModel.deletarPorUsuarioESessionId(sessionId, usuarioId);

    }

    static async encerrarTodasSessoes(usuarioId: UUID){

        await SessaoModel.deletarVariasERevogarPorUsuarioId(usuarioId);

    }

}

export default SessaoService;