import prisma from "@configs/db";
import { ReqQueryPcjDTOOutput } from "@schemas/controllers/pcjControllerSchema";
import { ProdutoModelCreateData, ProdutoModelUpdateFields, ProdutoSelectPattern } from "@schemas/models/produtoModelSchema";
import { ClientOrTransaction } from "@schemas/shared/prismaSchema";
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

    static async updateFieldsById(id: UUID, cjapiId: UUID, fields: ProdutoModelUpdateFields, db: ClientOrTransaction = prisma){
        await db.produtos.update({
            data: fields,
            where: { id, cj_api_id: cjapiId }
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
            select: ProdutoSelectPattern,
            where: { cj_api_id: cjapiId },
            orderBy: { data_atualizacao: 'desc' },
            skip, take
        });
        return result;
    }

    static async findByIdAndCjapiId(id: UUID, cjapiId: UUID, db: ClientOrTransaction = prisma){
        const result = await db.produtos.findUnique({
            select: ProdutoSelectPattern,
            where: { id, cj_api_id: cjapiId },
        });
        return result;
    }

    static async findManyByCjapiIdAndCustomQuery(cjapiId: UUID, query: ReqQueryPcjDTOOutput, db: ClientOrTransaction = prisma){
        const result = await db.produtos.findMany({
            ...query,
            orderBy: [
                ...query.orderBy,
                {data_criacao: 'desc'}
            ],
            select: ProdutoSelectPattern,
            where: {
                ...query.where,
                cj_api_id: cjapiId
            }
        });
        return result;
    }

    private static async findManyByIdsArrayCjapiIdAndQuery(ids: UUID[], cjapiId: UUID, query: ReqQueryPcjDTOOutput, db: ClientOrTransaction = prisma){
        const result = await db.produtos.findMany({
            ...query,
            orderBy: [
                ...query.orderBy,
                {data_criacao: 'desc'}
            ],
            select: ProdutoSelectPattern,
            where: {
                ...query.where,
                id: { in: ids },
                cj_api_id: cjapiId
            }
        });

        return result;
    }

    static async findManyByCjapiIdMarcaAndQuery(cjapiId: UUID, marca: string, query: ReqQueryPcjDTOOutput, db: ClientOrTransaction = prisma){
        const productsWithMarca: {id: UUID}[] = await db.$queryRaw`
            select id from produtos where cj_api_id = ${cjapiId}
            and unaccent(lower(marca)) LIKE unaccent(lower(${`%${marca}%`}))
        `;
        const productsIds = productsWithMarca.map(p=>p.id);

        const result = await this.findManyByIdsArrayCjapiIdAndQuery(productsIds, cjapiId, query, db);

        return result;
    }

    static async findManyByCjapiIdNomeAndQuery(cjapiId: UUID, nome: string, query: ReqQueryPcjDTOOutput, db: ClientOrTransaction = prisma){
        const productsWithNome: {id: UUID}[] =  await db.$queryRaw`
            select id from produtos where cj_api_id = ${cjapiId}
            and unaccent(lower(nome)) LIKE unaccent(lower(${`%${nome}%`}))
        `;
        const productsIds = productsWithNome.map(p=>p.id);

        const result = await this.findManyByIdsArrayCjapiIdAndQuery(productsIds, cjapiId, query, db);

        return result;
    }

    static async findManyByCjapiIdDescricaoAndQuery(cjapiId: UUID, descricao: string, query: ReqQueryPcjDTOOutput, db: ClientOrTransaction = prisma){
        const productsWithDescricao: {id: UUID}[] =  await db.$queryRaw`
            select id from produtos where cj_api_id = ${cjapiId}
            and unaccent(lower(descricao)) LIKE unaccent(lower(${`%${descricao}%`}))
        `;
        const productsIds = productsWithDescricao.map(p=>p.id);

        const result = await this.findManyByIdsArrayCjapiIdAndQuery(productsIds, cjapiId, query, db);

        return result;
    }

    static async findByCjapiIdAndCodigo(cjapiId: UUID, codigo: string, db: ClientOrTransaction = prisma){
        const result = await db.produtos.findUnique({
            select: ProdutoSelectPattern,
            where: {
                cj_api_id_codigo: {
                    cj_api_id: cjapiId,
                    codigo
                }
            }
        });
        return result;
    }


}

export default ProdutoModel;