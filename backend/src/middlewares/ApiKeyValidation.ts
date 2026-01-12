import type { Response, NextFunction } from "express";
import Errors from '@utils/errorClasses';
import CjapiModel from "@models/cjapi";
import type { UUID } from "node:crypto";
import { uuidSchema } from "@schemas/shared/basics";
import ApiKeyUtils from "@utils/apiKey";
import { RequestCjApi } from "@schemas/shared/request";

export async function ApiKeyValidation(req: RequestCjApi, res: Response, next: NextFunction){
    const providedApiKeyHash = req.headers.authorization?.split(' ')[1];
    if(!providedApiKeyHash)
        return next(new Errors.ValidationError('A API key precisa ser fornecida no header de Authorization para acessar a rota.'));

    try {
        const cjApiId = uuidSchema.parse(req.params.cjApiId) as UUID;

        const realApiKeyHash = await CjapiModel.findApiKeyById(cjApiId);
        if(!realApiKeyHash)
            return next(new Errors.NotFoundError('API fornecida não foi encontrada ou está desativada.'));

        const isApiKeyValid = ApiKeyUtils.compararApiKeyComHash(providedApiKeyHash, realApiKeyHash);
        if(!isApiKeyValid)
            return next(new Errors.InvalidCredentialsError('API key fornecida inválida.'));

        req.cjApiId = cjApiId;
        next();
    } catch (err) {
        next(err);
    }
}