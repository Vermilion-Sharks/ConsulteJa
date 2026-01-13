import CjapiModel from "@models/cjapiModel";
import type { UUID } from "node:crypto";
import Errors from '@utils/errorClasses';
import { ReqQueryPcjDTOOutput } from "@schemas/controllers/pcjControllerSchema";
import ProdutoModel from "@models/produtoModel";
import { Produto, ProdutoF } from "@schemas/models/produtoModelSchema";

class PcjService {

    static async getInfo(cjapiId: UUID){

        const cjApi = await CjapiModel.findActiveById(cjapiId);
        if(!cjApi)
            throw new Errors.NotFoundError('API fornecida não foi encontrada ou está desativada.');

        const {_count, ...rest} = cjApi;
        return {...rest, quantidadeProdutos: _count.produtos};

    }

    private static productsFormat(products: Produto[]): ProdutoF[];
    private static productsFormat(products: Produto): ProdutoF;
    private static productsFormat(products: Produto | Produto[]){

        if(Array.isArray(products)) {
            const productsF = products.map(prod=>({
                ...prod,
                precoF: `R$${prod.preco.toFixed(2).replace('.',',')}`
            }))

            return productsF;
        }
        else {
            const productF = {
                ...products,
                precoF: `R$${products.preco.toFixed(2).replace('.',',')}`
            }

            return productF;
        }

    }

    static async getProducts(cjapiId: UUID, queryDTO: ReqQueryPcjDTOOutput){

        const products = await ProdutoModel.findManyByCjapiIdAndCustomQuery(cjapiId, queryDTO);

        return this.productsFormat(products);

    }

    static async getProductsByMarca(cjapiId: UUID, marca: string, queryDTO: ReqQueryPcjDTOOutput){

        const products = await ProdutoModel.findManyByCjapiIdMarcaAndQuery(cjapiId, marca, queryDTO);

        return this.productsFormat(products);

    }

    static async getProductsByNome(cjapiId: UUID, nome: string, queryDTO: ReqQueryPcjDTOOutput){

        const products = await ProdutoModel.findManyByCjapiIdNomeAndQuery(cjapiId, nome, queryDTO);

        return this.productsFormat(products);

    }

    static async getProductsByDescricao(cjapiId: UUID, descricao: string, queryDTO: ReqQueryPcjDTOOutput){

        const products = await ProdutoModel.findManyByCjapiIdDescricaoAndQuery(cjapiId, descricao, queryDTO);

        return this.productsFormat(products);

    }

    static async getProductByCodigo(cjapiId: UUID, codigo: string){

        const product = await ProdutoModel.findByCjapiIdAndCodigo(cjapiId, codigo);
        if(!product)
            throw new Errors.NotFoundError('Não foi encontrado um produto com o código fornecido na sua API.');

        return this.productsFormat(product);

    }

    static async getProductById(cjapiId: UUID, productId: UUID){

        const product = await ProdutoModel.findByIdAndCjapiId(productId, cjapiId);
        if(!product)
            throw new Errors.NotFoundError('Não foi encontrado um produto com o ID fornecido na sua API.');

        return this.productsFormat(product);

    }

}

export default PcjService;