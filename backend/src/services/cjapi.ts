import CjapiModel from "@models/cjapi";
import type { UUID } from "node:crypto";
import Errors from '@utils/errorClasses';
import ApiKeyUtils from "@utils/apiKey";
import prisma from "@configs/db";
import ProdutoModel from "@models/produto";


class CjapiService {

    static async createCjapi(userId: UUID){

        return await prisma.$transaction( async(tx)=>{
            const usersCjapis = await CjapiModel.findManyByUserId(userId, tx);

            if(usersCjapis.length>0){
                const activeCjapis = usersCjapis.filter(api=>api.ativa);
                if(activeCjapis.length>0) throw new Errors.UnauthorizedError('Você só pode ter 1 API.');
            }

            const apiKey = ApiKeyUtils.gerarApiKey();
            const apiKeyHash = ApiKeyUtils.gerarHashApiKey(apiKey);

            const newCjapi = await CjapiModel.create(userId, apiKeyHash, tx);

            return {
                id: newCjapi.id,
                apiKey
            }
        })

    }

    static async generateNewApiKey(cjapiId: UUID, userId: UUID){
        const apiKey = ApiKeyUtils.gerarApiKey();
        const apiKeyHash = ApiKeyUtils.gerarHashApiKey(apiKey);

        await CjapiModel.updateApiKeyByIdAndUserId(cjapiId, userId, apiKeyHash);

        return apiKey;
    }

    static async addProduct(cjapiId: UUID, userId: UUID, codigo: string, descricao: string, marca: string, nome: string, preco: string, imagem?: string, importado?: boolean){

        const product = {
            codigo, descricao, marca, nome, preco, imagem, importado
        }

        await ProdutoModel.create(cjapiId, product);

    }

}

export default CjapiService;