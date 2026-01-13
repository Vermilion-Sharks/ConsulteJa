import CjapiModel from "@models/cjapiModel";
import { ClientOrTransaction, type DbTransaction } from "@schemas/shared/prismaSchema";
import { type UUID } from "node:crypto";
import Errors from '@utils/errorClasses';
import prisma from "@configs/db";

class CjapiValidator {

    static async canActivate(userId: UUID, db: ClientOrTransaction = prisma){

        const userCjapisCount = await CjapiModel.countActivesByUserId(userId, db);

        if(userCjapisCount>0)
            throw new Errors.UnauthorizedError('Você só pode ter 1 API ativa.');

    }

    static async canEdit(cjapiId: UUID, userId: UUID, db: ClientOrTransaction = prisma){

        const cjapi = await CjapiModel.findByIdAndUserId(cjapiId, userId, db);
        if(!cjapi)
            throw new Errors.NotFoundError('API não encontrada ou ela não é sua.');
        if(!cjapi.ativa)
            throw new Errors.UnauthorizedError('Você não pode editar uma API desativada.');

    }

    static async canManageProducts(cjapiId: UUID, userId: UUID, db: ClientOrTransaction = prisma){

        const cjapi = await CjapiModel.findByIdAndUserId(cjapiId, userId, db);
        if(!cjapi)
            throw new Errors.NotFoundError('API não encontrada ou ela não é sua.');

    }

}

export default CjapiValidator;