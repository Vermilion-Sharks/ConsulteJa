import { ErrorCustomVS } from '@interfaces/errorInterfaces';
import { RequestAuthVS } from '@interfaces/globalInterfaces';
import ApisModel from '@models/apisModel';
import ApisService from '@services/apisService';
import { Request, Response, NextFunction } from 'express';
import { UUID } from 'node:crypto';

class ApisController {

    static async criar(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const novaApi = await ApisService.criarApi(id);
            res.status(201).json(novaApi);
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async listar(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const apis = await ApisModel.buscarApisPorUsuarioId(id);
            res.status(200).json(apis);
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async gerarKey(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const { api_id } = req.params;
            const newApiKey = await ApisService.trocarApiKey(id, api_id as UUID);
            res.status(200).json({newApiKey});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'API não encontrada ou ela não é sua.';
            next(erro);
        }
    }

    static async adicionarProduto(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const { api_id } = req.params;
            const { codigo, nome, marca, descricao, preco, imagem, importado } = req.body;
        } catch (err) {
            
        }
    }

}

export default ApisController;