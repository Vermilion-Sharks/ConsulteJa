import CjapiModel from "@models/cjapiModel";
import type { UUID } from "node:crypto";
import Errors from '@utils/errorClasses';
import ApiKeyUtils from "@utils/apiKey";
import prisma from "@configs/db";
import ProdutoModel from "@models/produtoModel";
import { ProdutoModelCreateData, ProdutoModelUpdateFields } from "@schemas/models/produtoModelSchema";
import CjapiValidator from "@validators/cjapiValidator";

class CjapiService {

    static async createCjapi(userId: UUID){

        const apiKey = ApiKeyUtils.gerarApiKey();
        const apiKeyHash = ApiKeyUtils.gerarHashApiKey(apiKey);

        const cjapiId = await prisma.$transaction( async(tx)=>{
            await CjapiValidator.canActivate(userId, tx);
            const newCjapi = await CjapiModel.create(userId, apiKeyHash, tx);
            return newCjapi.id;
        });

        return {
            id: cjapiId, apiKey
        };

    }

    static async deleteCjapi(cjapiId: UUID, userId: UUID){

        await CjapiModel.deleteByIdAndUserId(cjapiId, userId);

    }

    static async generateNewApiKey(cjapiId: UUID, userId: UUID){
        const apiKey = ApiKeyUtils.gerarApiKey();
        const apiKeyHash = ApiKeyUtils.gerarHashApiKey(apiKey);

        await prisma.$transaction(async(tx)=>{
            await CjapiValidator.canEdit(cjapiId, userId, tx);
            await CjapiModel.updateApiKeyById(cjapiId, apiKeyHash, tx);
        });

        return apiKey;
    }

    static async updateStatus(cjapiId: UUID, userId: UUID, active: boolean){

        await prisma.$transaction(async(tx)=>{
            if(active) await CjapiValidator.canActivate(userId, tx);
            await CjapiModel.updateStatusById(cjapiId, active, tx);
        })

    }

    static async addProduct(cjapiId: UUID, userId: UUID, data: ProdutoModelCreateData){

        await prisma.$transaction(async (tx)=>{
            await CjapiValidator.canEdit(cjapiId, userId, tx);
            await ProdutoModel.create(cjapiId, data, tx);
        });        

    }

    static async getUserApisInfo(userId: UUID){

        const userCjapis = await CjapiModel.findManyByUserId(userId);

        const userCjapisF = userCjapis.map(({_count, ...rest})=>({
            ...rest, quantidadeProdutos: _count.produtos
        }));

        return userCjapisF;
    }

    static async getApiInfo(cjapiId: UUID, userId: UUID){

        const cjapi = await CjapiModel.findByIdAndUserId(cjapiId, userId);
        if(!cjapi)
            throw new Errors.NotFoundError('API não encontrada ou ela não é sua.');

        const {_count, ...rest} = cjapi;
        return {...rest, quantidadeProdutos: _count.produtos};

    }

    static async getProducts(cjapiId: UUID, userId: UUID, page?: number){
        
        await CjapiValidator.canManageProducts(cjapiId, userId);
        const products = await ProdutoModel.findManyByCjapiId(cjapiId, undefined, page);
        return products;

    }

    static async findSingleProduct(productId: UUID, cjapiId: UUID, userId: UUID){

        await CjapiValidator.canManageProducts(cjapiId, userId);
        const product = await ProdutoModel.findByIdAndCjapiId(productId, cjapiId);
        if(!product)
            throw new Errors.NotFoundError('Produto não encontrado na API fornecida.');
        return product;

    }

    static async editProduct(productId: UUID, cjapiId: UUID, userId: UUID, fields: ProdutoModelUpdateFields){

        await prisma.$transaction(async(tx)=>{
            await CjapiValidator.canManageProducts(cjapiId, userId, tx);
            await ProdutoModel.updateFieldsById(productId, cjapiId, fields, tx);
        });

    }

    static async deleteSingleProduct(productId: UUID, cjapiId: UUID, userId: UUID){

        await prisma.$transaction(async(tx)=>{
            await CjapiValidator.canManageProducts(cjapiId, userId, tx);
            await ProdutoModel.deleteByIdAndCjapiId(productId, cjapiId, tx);
        })

    }

}

export default CjapiService;