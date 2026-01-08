import CjapiModel from '@models/cjapi';
import { addProductSchema } from '@schemas/controllers/cjapi';
import { uuidSchema } from '@schemas/shared/basics';
import { ErrorCustomVS } from '@schemas/shared/error';
import { RequestAuthVS } from '@schemas/shared/request';
import CjapiService from '@services/cjapi';
import { ResponseVS } from '@utils/response';
import type { Response, NextFunction } from 'express';
import type { UUID } from 'node:crypto';

class CjapiController {

    static async create(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const newCjapi = await CjapiService.createCjapi(id);
            ResponseVS(res, {
                message: 'Sua API foi criada com sucesso.',
                data: {
                    apiKey: newCjapi.apiKey,
                    id: newCjapi.id
                }
            }, 201);
        } catch (err) {
            next(err);
        }
    }

    static async list(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id } = req.user;
            const usersCjapis = await CjapiModel.findManyByUserId(id);
            ResponseVS(res, {
                data: {
                    apis: usersCjapis
                }
            });
        } catch (err) {
            next(err);
        }
    }

    static async genApiKey(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId);
            const newApiKey = await CjapiService.generateNewApiKey(cjapiId as UUID, userId);
            ResponseVS(res, {data:{newApiKey}});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'API não existe ou não é sua.';
            next(erro);
        }
    }

    static async addProduct(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId);
            const data = addProductSchema.parse(req.body);
            const { codigo, descricao, imagem, marca, nome, preco, importado } = data;
            ResponseVS(res, {message: 'Produto cadastrado com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

};

export default CjapiController;