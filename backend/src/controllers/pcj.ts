import { productMarcaSchema } from "@schemas/controllers/cjapi";
import { reqQueryPcjDTO } from "@schemas/controllers/pcj";
import { stringSchema } from "@schemas/shared/basics";
import { RequestAuthCjApi } from "@schemas/shared/request";
import PcjService from "@services/pcj";
import { ResponseVS } from "@utils/response";
import { Response, NextFunction } from "express";

class PcjController {

    static async getInfo(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjApiId = req.cjApiId;
            const apiInfo = await PcjService.getInfo(cjApiId);
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
            const cjApiId = req.cjApiId;
            const queryParams = reqQueryPcjDTO.parse(req.query);
            const products = await PcjService.getProducts(cjApiId, queryParams);
            ResponseVS(res, { data: products });
        } catch (err) {
            next(err);
        }
    }

    static async getProductsByMarca(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjApiId = req.cjApiId;
            const marca = productMarcaSchema.parse(req.params.marca);
            const queryParams = reqQueryPcjDTO.parse(req.query);
            const produtos = await PcjService.getProductsByMarca(cjApiId, marca, queryParams);
            ResponseVS(res, {data: produtos});
        } catch (err) {
            next(err);
        }
    }

}

export default PcjController;