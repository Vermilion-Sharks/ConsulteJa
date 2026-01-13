import { emailSchema, stringSchema } from '@schemas/shared/basicsSchema';
import z from 'zod';

export const createUserSchema = z.strictObject({
    name: stringSchema
        .min(2,'O nome deve ter pelo menos 2 caracteres.')
        .max(100, 'O nome deve ter no máximo 100 caracteres.'),
    email: emailSchema,
    password: stringSchema.min(8, 'Senha deve ter no mínimo 8 caracteres.')
});
