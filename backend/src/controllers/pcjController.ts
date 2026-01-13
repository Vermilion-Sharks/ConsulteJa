import { productCodeSchema, productDescricaoSchema, productMarcaSchema } from "@schemas/controllers/cjapiControllerSchema";
import { reqQueryPcjDTO } from "@schemas/controllers/pcjControllerSchema";
import { uuidSchema } from "@schemas/shared/basicsSchema";
import { RequestAuthCjApi } from "@schemas/shared/requestSchema";
import PcjService from "@services/pcjService";
import { ResponseVS } from "@utils/response";
import { Response, NextFunction } from "express";
import type { UUID } from "node:crypto";

class PcjController {

    static async getInfo(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjapiId = req.cjapiId;
            const apiInfo = await PcjService.getInfo(cjapiId);
            ResponseVS(res, {
                data: apiInfo,
                message: 'Para mais informações da sua API entre no site da ConsulteJa com a conta dona dessa API: http://localhost:2923.'
            });
        } catch (err) {
            next(err);
        }
    }

    static async getProducts(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjapiId = req.cjapiId;
            const queryParams = reqQueryPcjDTO.parse(req.query);
            const products = await PcjService.getProducts(cjapiId, queryParams);
            ResponseVS(res, {
                data: products,
                ...(products.length>0?{}:{message: 'Nenhum produto da sua API atendeu aos parâmetros fornecidos.'})
            });
        } catch (err) {
            next(err);
        }
    }

    static async getProductsByMarca(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjapiId = req.cjapiId;
            const marca = productMarcaSchema.parse(req.params.marca);
            const queryParams = reqQueryPcjDTO.parse(req.query);
            const products = await PcjService.getProductsByMarca(cjapiId, marca, queryParams);
            ResponseVS(res, {
                data: products,
                ...(products.length>0?{}:{message: 'Nenhum produto da sua API atendeu aos parâmetros fornecidos.'})
            });
        } catch (err) {
            next(err);
        }
    }

    static async getProductsByNome(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjapiId = req.cjapiId;
            const nome = productMarcaSchema.parse(req.params.nome);
            const queryParams = reqQueryPcjDTO.parse(req.query);
            const products = await PcjService.getProductsByNome(cjapiId, nome, queryParams);
            ResponseVS(res, {
                data: products,
                ...(products.length>0?{}:{message: 'Nenhum produto da sua API atendeu aos parâmetros fornecidos.'})
            });
        } catch (err) {
            next(err);
        }
    }

    static async getProductsByDescricao(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjapiId = req.cjapiId;
            const descricao = productDescricaoSchema.parse(req.params.descricao);
            const queryParams = reqQueryPcjDTO.parse(req.query);
            const products = await PcjService.getProductsByDescricao(cjapiId, descricao, queryParams);
            ResponseVS(res, {
                data: products,
                ...(products.length>0?{}:{message: 'Nenhum produto da sua API atendeu aos parâmetros fornecidos.'})
            });
        } catch (err) {
            next(err);
        }
    }

    static async getProductByCodigo(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjapiId = req.cjapiId;
            const codigo = productCodeSchema.parse(req.params.codigo);
            const product = await PcjService.getProductByCodigo(cjapiId, codigo);
            ResponseVS(res, {data: product});
        } catch (err) {
            next(err);
        }
    }

    static async getProductById(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjapiId = req.cjapiId;
            const productId = uuidSchema.parse(req.params.productId) as UUID;
            const product = await PcjService.getProductById(cjapiId, productId);
            ResponseVS(res, {data: product});
        } catch (err) {
            next(err);
        }
    }

}

export default PcjController;