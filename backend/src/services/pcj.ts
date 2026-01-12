import CjapiModel from "@models/cjapi";
import type { UUID } from "node:crypto";
import Errors from '@utils/errorClasses';
import { ReqQueryPcjDTOOutput } from "@schemas/controllers/pcj";
import ProdutoModel from "@models/produto";

class PcjService {

    static async getInfo(cjApiId: UUID){

        const cjApi = await CjapiModel.findActiveById(cjApiId);
        if(!cjApi)
            throw new Errors.NotFoundError('API fornecida não foi encontrada ou está desativada.');

        const {_count, ...rest} = cjApi;
        return {...rest, quantidadeProdutos: _count.produtos};

    }

    static async getProducts(cjapiId: UUID, queryDTO: ReqQueryPcjDTOOutput){

        const products = await ProdutoModel.findManyByCjapiIdAndCustomQuery(cjapiId, queryDTO);

        const productsF = products.map(prod=>({
            ...prod,
            precoF: `R$${prod.preco.toFixed(2).replace('.',',')}`
        }))

        return productsF;

    }

    static async getProductsByMarca(cjapiId: UUID, marca: string, queryDTO: ReqQueryPcjDTOOutput){

        const products = await ProdutoModel.findManyByCjapiIdMarcaAndQuery(cjapiId, marca, queryDTO);

        const productsF = products.map(prod=>({
            ...prod,
            precoF: `R$${prod.preco.toFixed(2).replace('.',',')}`
        }))

        return productsF;

    }

}

export default PcjService;