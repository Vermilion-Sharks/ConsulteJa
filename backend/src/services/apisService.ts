import prisma from "@config/db";
import ApisModel from "@models/apisModel";
import ApisUtils from "@utils/apisUtils";
import type { UUID } from "node:crypto";
import Erros from '@utils/erroClasses';
import ValidarCampos from "@utils/validarCampos";

class ApisService {

    static async criarApi(usuario_id: UUID){
        const apis = await ApisModel.buscarApisAtivasPorUsuarioId(usuario_id);
        if(apis.length>=1) throw new Erros.ErroDeAutorizacao('Você só pode ter até 1 API(s).');
        
        const apiKey = ApisUtils.gerarApiKey();
        const apiKeyHash = ApisUtils.gerarHashApiKey(apiKey);
        const api = await ApisModel.criar(apiKeyHash, usuario_id);

        return {apiKey, apiId: api.id};
    }

    static async trocarApiKey(usuario_id: UUID, api_id: UUID){
        const apiKey = ApisUtils.gerarApiKey();
        const apiKeyHash = ApisUtils.gerarHashApiKey(apiKey);

        await ApisModel.atualizarApiKeyPorIdEUsuario(apiKeyHash, api_id, usuario_id)

        return apiKey;
    }

    static async cadastrarProduto(apiId: UUID, usuarioId: UUID, codigo: string, nome: string, marca: string, descricao: string, preco: number, imagem: string, importado: boolean){
        if(!codigo || !nome || !marca || !descricao || !preco || !imagem || !importado)
            throw new Erros.ErroDeValidacao('Campos faltando para cadastro do produto.');
        
        codigo = ValidarCampos.validarTamanhoMax(codigo, 13, 'Código');
        nome = ValidarCampos.validarTamanhoMax(nome, 100, 'Nome');
        marca = ValidarCampos.validarTamanhoMax(marca, 70, 'Marca');
        descricao = ValidarCampos.validarTamanhoMax(descricao, 300, 'Descrição');

        
    }

}

export default ApisService;