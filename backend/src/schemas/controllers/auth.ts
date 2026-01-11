import { booleanSchema, stringSchema } from '@schemas/shared/basics';
import { emailSchema } from '@schemas/shared/basics';
import z from 'zod';

export const loginSchema = z.strictObject({
    email: emailSchema,
    password: stringSchema.min(8, 'Senha deve ter no mínimo 8 caracteres.'),
    rememberMe: booleanSchema.optional(),
    visitorId: stringSchema
});

export const googleLoginSchema = z.strictObject({
    idToken: stringSchema,
    visitorId: stringSchema
});