import CjapiModel from "@models/cjapi";
import type { UUID } from "node:crypto";
import Errors from '@utils/errorClasses';

class PcjService {

    static async getInfo(cjApiId: UUID){

        const cjApi = await CjapiModel.findActiveById(cjApiId);
        if(!cjApi)
            throw new Errors.NotFoundError('API fornecida não foi encontrada ou está desativada.');

        const {_count, ...rest} = cjApi;
        return {...rest, quantidadeProdutos: _count.produtos};

    }

}

export default PcjService;