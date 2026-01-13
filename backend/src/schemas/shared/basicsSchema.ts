import z from 'zod';

export const stringSchema = z.string('Campo deve ser uma string.').trim();
export const numberSchema = z.number('Campo deve ser um number.');
export const booleanSchema = z.boolean('Campo deve ser um boolean.');
export const uuidSchema = z.uuid('ID inválido.');
export const emailSchema = z.email('Email inválido.');
export const urlSchema = z.url('URL inválida');
