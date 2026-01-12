import { booleanSchema, numberSchema, stringSchema, urlSchema } from '@schemas/shared/basics';
import z from 'zod';

const productCodeSchema = 
    stringSchema
    .length(13, 'O código do produto deve ter exatamente 13 números.')
    .regex(/^\d+$/, 'O código do produto só pode conter números.')
    .refine(code=>{
        const first12 = code.substring(0, 12);
        const sum12 = [...first12].reduce((acc, c, idx)=>{
            const num = Number(c);
            if(idx%2!==0) return acc + (num*3)
            else return acc + num;
        }, 0);
        const rest12 = sum12%10;
        return (10-rest12)%10 === Number(code.at(-1));
    },'Código do produto inválido (dígito verificador incorreto).');

const productNomeSchema = stringSchema
    .min(1, 'O nome do produto deve ter pelo menos 1 carctere.')
    .max(100, 'O nome do produto deve no ter máximo 100 caracteres.');

const productMarcaSchema = stringSchema
    .max(70, 'A marca do produto deve no ter máximo 70 caracteres.');

const productDescricaoSchema = stringSchema
    .max(300, 'A descrição do produto deve no ter máximo 300 caracteres.');

const productPrecoSchema = numberSchema
    .positive('O preço do produto deve ser positivo.')

export const addProductSchema = z.strictObject({
    codigo: productCodeSchema,
    nome: productNomeSchema,
    marca: productMarcaSchema,
    descricao: productDescricaoSchema,
    preco: productPrecoSchema,
    imagem: urlSchema.optional(),
    importado: booleanSchema.optional()
});

export const updateApiStatusSchema = z.strictObject({
    active: booleanSchema
});

export const findProductsQuerySchema = z.object({
    page: stringSchema.transform(Number).optional()
});