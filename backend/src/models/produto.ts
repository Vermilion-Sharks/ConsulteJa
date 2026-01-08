import prisma from "@configs/db";
import { ProdutoModelCreateData } from "@schemas/models/produto";
import { ClientOrTransaction } from "@schemas/shared/prisma";
import { type UUID } from "node:crypto";

class ProdutoModel {

    static async create(cjapiId: UUID, data: ProdutoModelCreateData, db: ClientOrTransaction = prisma){
        await db.produtos.create({
            data: {
                cj_api_id: cjapiId,
                ...data
            }
        })
    }

}

export default ProdutoModel;