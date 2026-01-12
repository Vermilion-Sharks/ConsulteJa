import { getInfoDTO } from "@schemas/controllers/pcj";
import { RequestAuthCjApi } from "@schemas/shared/request";
import PcjService from "@services/pcj";
import { ResponseVS } from "@utils/response";
import { Response, NextFunction } from "express";

class PcjController {

    static async getInfo(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjApiId = req.cjApiId;
            const apiInfo = await PcjService.getInfo(cjApiId);
            ResponseVS(res, { data: apiInfo });
        } catch (err) {
            next(err);
        }
    }

    static async getProducts(req: RequestAuthCjApi, res: Response, next: NextFunction){
        try {
            const cjApiId = req.cjApiId;
            const queryParams = getInfoDTO.parse(req.query);
        } catch (err) {
            next(err);
        }
    }

}

export default PcjController;