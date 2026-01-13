import { productMarcaSchema } from "@schemas/controllers/cjapiControllerSchema";
import { reqQueryPcjDTO } from "@schemas/controllers/pcjControllerSchema";
import { stringSchema } from "@schemas/shared/basicsSchema";
import { RequestAuthCjApi } from "@schemas/shared/requestSchema";
import PcjService from "@services/pcjService";
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



    static async getProductByCodigo(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjApiId = req.cjApiId;
            const codigo = productMarcaSchema.parse(req.params.codigo);
        } catch (err) {
            next(err);
        }
    }

}

export default PcjController;