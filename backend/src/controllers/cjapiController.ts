import { addProductSchema, editProductSchema, findProductsQuerySchema, updateApiStatusSchema } from '@schemas/controllers/cjapiControllerSchema';
import { uuidSchema } from '@schemas/shared/basicsSchema';
import { ErrorCustomVS } from '@schemas/shared/errorSchema';
import { RequestAuthVS } from '@schemas/shared/requestSchema';
import CjapiService from '@services/cjapiService';
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
            const usersCjapis = await CjapiService.getUserApisInfo(id);
            ResponseVS(res, { data: { apis: usersCjapis } });
        } catch (err) {
            next(err);
        }
    }

    static async getInfo(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const cjapi = await CjapiService.getApiInfo(cjapiId, userId);
            ResponseVS(res, {data: {api: cjapi}});
        } catch (err) {
            next(err);
        }
    }

    static async delete(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            await CjapiService.deleteCjapi(cjapiId, userId);
            ResponseVS(res, {message: 'API removida com sucesso.'})
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'API não existe ou não é sua.';
            next(erro);
        }
    }

    static async genApiKey(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const newApiKey = await CjapiService.generateNewApiKey(cjapiId, userId);
            ResponseVS(res, {data:{newApiKey}});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async updateStatus(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const data = updateApiStatusSchema.parse(req.body);
            await CjapiService.updateStatus(cjapiId, userId, data.active);
            ResponseVS(res, {message: 'Status atualizado com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'API não existe ou não é sua.';
            next(erro);
        }
    }

    static async addProduct(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const data = addProductSchema.parse(req.body);
            await CjapiService.addProduct(cjapiId, userId, data);
            ResponseVS(res, {message: 'Produto cadastrado com sucesso.'}, 201);
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2002') erro.custom_message = 'Já existe um produto com o código fornecido.';
            next(erro);
        }
    }

    static async findProducts(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const query = findProductsQuerySchema.parse(req.query);
            const products = await CjapiService.getProducts(cjapiId, userId, query.page);
            ResponseVS(res, {data: {products}});
        } catch (err) {
            next(err);
        }
    }

    static async findSingleProduct(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const productId = uuidSchema.parse(req.params.productId) as UUID;
            const product = await CjapiService.findSingleProduct(productId, cjapiId, userId);
            ResponseVS(res, {data: product});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            next(erro);
        }
    }

    static async editProduct(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const productId = uuidSchema.parse(req.params.productId) as UUID;
            const fields = editProductSchema.parse(req.body);
            await CjapiService.editProduct(productId, cjapiId, userId, fields);
            ResponseVS(res, {message: 'Produto editado com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'Produto não encontrado na API fornecida.';
            next(erro);
        }
    }

    static async deleteSingleProduct(req: RequestAuthVS, res: Response, next: NextFunction){
        try {
            const { id: userId } = req.user;
            const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;
            const productId = uuidSchema.parse(req.params.productId) as UUID;
            await CjapiService.deleteSingleProduct(productId, cjapiId, userId);
            ResponseVS(res, {message: 'Produto removido com sucesso.'});
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2025') erro.custom_message = 'Produto não encontrado na API fornecida.';
            next(erro);
        }
    }

};

export default CjapiController;