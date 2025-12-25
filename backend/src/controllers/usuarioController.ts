import type { ErrorCustomVS } from '@interfaces/errorInterfaces';
import { RequestCustomVS } from '@interfaces/globalInterfaces';
import type { NextFunction, Response } from 'express';
import UsuarioService from '@services/usuarioService';

class UsuarioController {

    static async cadastrar(req: RequestCustomVS, res: Response, next: NextFunction){
        try {
            const { nome, email, senha } = req.body;
            await UsuarioService.cadastrarUsuario(nome, email, senha);
            res.status(201).json({ message: "Cadastro concluído com sucesso." });
        } catch (err) {
            const erro = err as ErrorCustomVS;
            if(erro.code==='P2002') erro.custom_message = "Email já cadastrado.";
            next(erro);
        }
    }

}

export default UsuarioController;