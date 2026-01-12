import { stringSchema } from "@schemas/shared/basics";
import z from "zod";

const ordemProdutosSchema = z
    .enum(['>', '<', 'desc', 'asc'], "A ordem deve ser '>', '<', 'desc' ou 'asc'.")
    .transform(
        (ord): 'asc' | 'desc' =>
        ord === '>' || ord === 'desc' ? 'desc' : 'asc'
    );
const paginaProdutosSchema = z.coerce.number('Deve ser um número inteiro.').int('Deve ser um número inteiro.');
const quantidadeProdutosSchema = z.coerce.number('Deve ser um número inteiro.').int('Deve ser um número inteiro.');
const precoProdutosSchema = stringSchema
    .regex(
        /^\d+(\.\d{1,2})?$/,
        "Preço deve estar no formato '0.00'."
    );

export const reqQueryPcjDTO = z.strictObject({
    todos: stringSchema.transform(t=>t==='true').optional(),
    quantidade: quantidadeProdutosSchema.optional(),
    pagina: paginaProdutosSchema.optional(),
    ordnome: ordemProdutosSchema.optional(),
    ordmarca: ordemProdutosSchema.optional(),
    ordpreco: ordemProdutosSchema.optional(),
    precomax: precoProdutosSchema.optional(),
    precomin: precoProdutosSchema.optional(),
    preco: precoProdutosSchema.optional()
}).transform(info=>{
    const {
        ordmarca, ordnome, ordpreco, pagina, quantidade , todos, preco, precomax, precomin
    } = info;
    return {
        skip: todos?undefined:((pagina??1)-1)*(quantidade??9),
        take: todos?undefined:(quantidade??9),
        orderBy: [
            ...(ordnome?[{nome: ordnome}]:[]),
            ...(ordmarca?[{marca: ordmarca}]:[]),
            ...(ordpreco?[{preco: ordpreco}]:[])
        ],
        where: {
            AND: [
                ...(preco?[{preco}]:[]),
                ...(precomax?[{preco: { lte: precomax }}]:[]),
                ...(precomin?[{preco: { gte: precomin }}]:[])
            ]
        }
    }
});

export type ReqQueryPcjDTOOutput = z.output<typeof reqQueryPcjDTO>;