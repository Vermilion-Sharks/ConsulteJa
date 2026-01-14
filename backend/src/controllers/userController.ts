import type { ErrorCustomVS } from '@schemas/shared/errorSchema';
import { RequestCustomVS } from '@schemas/shared/requestSchema';
import type { NextFunction, Response } from 'express';
import { createUserSchema } from '@schemas/controllers/userControllerSchema';
import UserService from '@services/userService';
import { ResponseVS } from '@utils/response';

class UserController {

    static async create(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const data = createUserSchema.parse(req.body);
            const { name, email, password } = data;

            await UserService.createUser(name, email, password);

            ResponseVS(res, { message: "Cadastro concluído com sucesso." }, 201);
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2002') erro.custom_message = "Email já cadastrado.";
            next(erro);
        }
    }

}

export default UserController;