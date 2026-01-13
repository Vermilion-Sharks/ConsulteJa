import type { Response, NextFunction } from "express";
import Errors from '@utils/errorClasses';
import CjapiModel from "@models/cjapiModel";
import type { UUID } from "node:crypto";
import { uuidSchema } from "@schemas/shared/basicsSchema";
import ApiKeyUtils from "@utils/apiKey";
import { RequestCjApi } from "@schemas/shared/requestSchema";

export async function ApiKeyValidation(req: RequestCjApi, res: Response, next: NextFunction){
    const providedApiKeyHash = req.headers.authorization?.split(' ')[1];
    if(!providedApiKeyHash)
        return next(new Errors.ValidationError('A API key precisa ser fornecida no header de Authorization para acessar a rota.'));

    try {
        const cjapiId = uuidSchema.parse(req.params.cjapiId) as UUID;

        const realApiKeyHash = await CjapiModel.findApiKeyById(cjapiId);
        if(!realApiKeyHash)
            return next(new Errors.NotFoundError('API fornecida não foi encontrada ou está desativada.'));

        const isApiKeyValid = ApiKeyUtils.compararApiKeyComHash(providedApiKeyHash, realApiKeyHash);
        if(!isApiKeyValid)
            return next(new Errors.InvalidCredentialsError('API key fornecida inválida.'));

        await CjapiModel.updateUltimoUsoById(cjapiId);

        req.cjapiId = cjapiId;
        next();
    } catch (err) {
        next(err);
    }
}