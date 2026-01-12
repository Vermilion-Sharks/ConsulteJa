import prisma from "@configs/db";
import { GetInfoDTOOutput } from "@schemas/controllers/pcj";
import { ProdutoModelCreateData } from "@schemas/models/produto";
import { ClientOrTransaction } from "@schemas/shared/prisma";
import { produtosFindManyArgs } from "generated/prisma/models";
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

    static async deleteByIdAndCjapiId(id: UUID, cjapiId: UUID, db: ClientOrTransaction = prisma){
        await db.produtos.delete({
            where: { id, cj_api_id: cjapiId }
        })
    }

    static async findManyByCjapiId(cjapiId: UUID, db: ClientOrTransaction = prisma, page: number = 1){
        const skip = (page-1)*9;
        const take = 9;
        const result = await db.produtos.findMany({
            select: {
                id: true,
                codigo: true,
                nome: true,
                marca: true,
                descricao: true,
                preco: true,
                imagem: true,
                importado: true,
                data_criacao: true,
                data_atualizacao: true
            },
            where: { cj_api_id: cjapiId },
            orderBy: { data_atualizacao: 'desc' },
            skip, take
        });
        return result;
    }

    static async findByIdAndCjapiId(id: UUID, cjapiId: UUID, db: ClientOrTransaction = prisma){
        const result = await db.produtos.findUnique({
            select: {
                codigo: true,
                nome: true,
                marca: true,
                descricao: true,
                preco: true,
                imagem: true,
                importado: true,
                data_criacao: true,
                data_atualizacao: true
            },
            where: { id, cj_api_id: cjapiId },
        });
        return result;
    }

    static async findManyByCjapiIdAndCustomQery(cjapiId: UUID, query: GetInfoDTOOutput, db: ClientOrTransaction = prisma){
        const result = await db.produtos.findMany({
            ...query,
            select: {
                id: true,
                codigo: true,
                data_atualizacao: true,
                data_criacao: true,
                descricao: true,
                imagem: true,
                importado: true,
                marca: true,
                nome: true,
                preco: true
            },
            where: {
                ...query.where,
                cj_api_id: cjapiId
            }
        })
    }

}

export default ProdutoModel;