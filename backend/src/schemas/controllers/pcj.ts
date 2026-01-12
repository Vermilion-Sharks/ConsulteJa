import { stringSchema } from "@schemas/shared/basics";
import z from "zod";

const ordemProdutosSchema = z
    .enum(['>', '<', 'desc', 'asc'], 'A ordem deve ser ">", "<", "desc" ou "asc".')
    .transform(ord=>ord==='>'||ord==='desc'?'desc':'asc');
const paginaProdutosSchema = z.coerce.number('Deve ser um número inteiro.').int('Deve ser um número inteiro.');
const qtdporpgnProdutosSchema = z.coerce.number('Deve ser um número inteiro.').int('Deve ser um número inteiro.');
const precoProdutosSchema = z
    .coerce.number('Deve ser um número válido.')
    .positive('O preço do produto deve ser positivo.');

export const getInfoDTO = z.object({
    todos: stringSchema.transform(t=>t==='true').optional(),
    qtdporpgn: qtdporpgnProdutosSchema.optional(),
    pagina: paginaProdutosSchema.optional(),
    ordcodigo: ordemProdutosSchema.optional(),
    ordnome: ordemProdutosSchema.optional(),
    ordmarca: ordemProdutosSchema.optional(),
    ordpreco: ordemProdutosSchema.optional(),
    marca: stringSchema.max(70, 'A marca só pode ter no máximo 70 caracteres.').optional(),
    precomax: precoProdutosSchema.optional(),
    precomin: precoProdutosSchema.optional(),
    preco: precoProdutosSchema.optional()
}).transform(info=>{
    const {
        ordcodigo, ordmarca, ordnome, ordpreco, pagina, qtdporpgn , todos, marca, preco, precomax, precomin
    } = info;
    return {
        skip: todos?undefined:((pagina??1)-1)*(qtdporpgn??9),
        take: todos?undefined:(qtdporpgn??9),
        orderBy: {
            codigo: ordcodigo,
            nome: ordnome,
            marca: ordmarca,
            preco: ordpreco
        },
        where: {
            marca,
            preco,
            ...(precomax || precomin ? {
                AND: [
                    ...(precomax?[{
                        preco: {
                            lte: precomax
                        }
                    }]:[]),
                    ...(precomin?[{
                        preco: {
                            gte: precomin
                        }
                    }]:[])
                ]
            }:{})
        }
    }
});

export type GetInfoDTOOutput = z.output<typeof getInfoDTO>;