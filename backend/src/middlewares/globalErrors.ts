import type { ErrorCustomVS, ErrorResponseVS } from '@interfaces/errorInterfaces';
import type { Response, NextFunction, ErrorRequestHandler } from 'express';
import type { RequestCustomVS } from '@interfaces/globalInterfaces';
import Erros from '@utils/erroClasses';

const errorHandler: ErrorRequestHandler = (err: ErrorCustomVS, req: RequestCustomVS, res: Response, next: NextFunction) => {
    let status = err.custom_status || 500;
    let error = err.custom_message || 'Erro interno no servidor.';

    const types = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        413: 'Payload Too Large',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        503: 'Service Unavailable',
    };

    const prismaCodes = [
        'P1001',
        'P2002',
        'P2025',
        '22P02'
    ];
    
    if (prismaCodes.includes(err.code||err.cause?.code||'')) {
        const code = err.code || err.cause?.code;
        switch (code) {
            case 'P1001':
                status = 503;
                error = 'Erro ao tentar acessar o banco de dados.';
                break;
            case 'P2002':
                status = 409;
                error = err.custom_message || 'Violação de chave única.';
                break;
            case 'P2025':
                status = 404;
                error = err.custom_message || 'Não encontrado.';
                break;
            case '22P02':
                status = 400;
                error = err.custom_message || 'Campo com formato inválido.';
                break;
            default:
                error = 'Erro no banco de dados.';
                break;
        }
    } else {
        if(err instanceof Erros.ErroDeValidacao) {
            status = 400;
            error = err.message;
        }
        if(err instanceof Erros.ErroDeCredenciaisInvalidas) {
            status = 401;
            error = err.message;
        }
        if(err instanceof Erros.ErroDeAutorizacao) {
            status = 403;
            error = err.message;
        }
        if(err instanceof Erros.ErroDeNaoEncontrado) {
            status = 404;
            error = err.message;
        }
        if(err instanceof Erros.ErroDeConflito) {
            status = 409;
            error = err.message;
        }
        if(err instanceof Erros.ErroDeMuitasTentativas) {
            status = 429;
            error = err.message;
        }
    }

    res.status(status).json({ error, type: types[status as keyof typeof types] || 'Internal Server Error' } satisfies ErrorResponseVS);
}

export default errorHandler;